"""Smoke-test an explainer in headless Chrome: opens every scene, steps through it, records JS errors, screenshots.
Run:  ~/.cache/kokoro/venv/bin/python explainers/_shared/walk.py <slug> [scene ids...] [--shots DIR] [--mobile]
"""
import sys, os, asyncio
from playwright.sync_api import sync_playwright
args = [a for a in sys.argv[1:]]
slug = args.pop(0)
shots = None
if '--shots' in args:
    i = args.index('--shots'); shots = args[i + 1]; del args[i:i + 2]
mobile = '--mobile' in args
if mobile: args.remove('--mobile')
only = args
here = os.path.dirname(os.path.abspath(__file__))
url = 'file://' + os.path.normpath(os.path.join(here, '..', slug, 'index.html'))
errs = []
if shots: os.makedirs(shots, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True)
    pg = b.new_page(viewport={'width': 390 if mobile else 1280, 'height': 800 if mobile else 800})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    pg.goto(url); pg.wait_for_timeout(500)
    ids = pg.evaluate('SCENES.map(s=>s.id)')
    print('scenes:', len(ids))
    for sid in ids:
        if only and sid not in only: continue
        print('scene', sid, flush=True)
        n = pg.evaluate('SCENES.find(s=>s.id==="%s").steps.length' % sid)
        pg.evaluate('openScene("%s")' % sid); pg.wait_for_timeout(300)
        nlines = pg.evaluate('(SCRIPT["%s"]||[]).length' % sid)
        if nlines != n: errs.append('SCRIPT mismatch %s: %d steps, %d lines' % (sid, n, nlines))
        for i in range(n):
            pg.wait_for_timeout(450 if i < 3 else 300)
            if shots and (i in (0, 3, n - 1) or '--all' in sys.argv): pg.screenshot(path='%s/%s_%d%s.png' % (shots, sid, i, '_m' if mobile else ''))
            if mobile:
                sw = pg.evaluate('document.documentElement.scrollWidth - innerWidth')
                if sw > 0: errs.append('HSCROLL %s step %d: %dpx' % (sid, i, sw))
            r1 = pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');const r=b[b.length-1].getBoundingClientRect();return [r.x,r.y]})()"); pg.wait_for_timeout(250)
            r2 = pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');const r=b[b.length-1].getBoundingClientRect();return [r.x,r.y]})()")
            if r1 != r2: errs.append('JITTER %s step %d: %s -> %s' % (sid, i, r1, r2))
            pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');b[b.length-1].click()})()"); pg.wait_for_timeout(150)
        pg.wait_for_timeout(250)
        if shots: pg.screenshot(path='%s/%s_quiz%s.png' % (shots, sid, '_m' if mobile else ''))
    # boss + cheat
    pg.evaluate('showBoss()'); pg.wait_for_timeout(300)
    pg.evaluate('showCheat()'); pg.wait_for_timeout(300)
    if shots: pg.screenshot(path='%s/cheat.png' % shots, full_page=True)
    pg.evaluate('showHome()'); pg.wait_for_timeout(300)
    if shots: pg.screenshot(path='%s/home.png' % shots, full_page=True)
    b.close()
print('\n'.join(errs) if errs else 'NO ERRORS')
