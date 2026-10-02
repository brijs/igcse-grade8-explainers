"""Auto-play the interactive step of each scene to prove it can be completed.
Run: ~/.cache/kokoro/venv/bin/python explainers/_shared/solve.py <slug> [scene ids...]
Generic solvers cover matchGame / orderGame / ask; scene-specific actions live in <slug>/source/solve_actions.json-like dict inside this file (CUSTOM).
"""
import sys, os, json, re, time
from playwright.sync_api import sync_playwright
slug = sys.argv[1]; only = sys.argv[2:]
here = os.path.dirname(os.path.abspath(__file__)); url = 'file://' + os.path.normpath(os.path.join(here, '..', slug, 'index.html'))
custom_path = os.path.join(here, 'tests', slug + '.py')
CUSTOM = {}
if os.path.exists(custom_path):
    exec(open(custom_path).read(), {'CUSTOM': CUSTOM})
HOOK = """
window.__ask=[];window.__mg=null;window.__og=null;window.__st=null;window.__sheets=[];
(()=>{const _a=ask;ask=function(q,h,d){window.__ask.push(q);return _a(q,h,d)};
const _m=matchGame;matchGame=function(h,o){window.__mg=o;return _m(h,o)};
const _o=orderGame;orderGame=function(h,o){window.__og=o;return _o(h,o)};
if(typeof Sheet!=='undefined'){const _S=Sheet;Sheet=function(o){const x=_S(o);window.__sheets.push(x);return x}}
if(typeof sheetTasks!=='undefined'){const _s=sheetTasks;sheetTasks=function(c,s,t,d){window.__st={sh:s,tasks:t};return _s(c,s,t,d)}}})();
"""
errs = []
def done_state(pg):
    return pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');return b[b.length-1].textContent})()")
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True); pg = b.new_page(viewport={'width': 1280, 'height': 900})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.goto(url); pg.wait_for_timeout(400); pg.evaluate(HOOK)
    ids = pg.evaluate('SCENES.map(s=>s.id)'); res = {}
    for sid in ids:
        if only and sid not in only: continue
        idx = pg.evaluate('SCENES.find(s=>s.id==="%s").steps.findIndex(s=>s.k==="try")' % sid)
        pg.evaluate('window.__ask=[];window.__mg=null;window.__og=null;window.__st=null;openScene("%s")' % sid); pg.wait_for_timeout(300)
        for _ in range(idx):
            pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');b[b.length-1].click()})()"); pg.wait_for_timeout(150)
        pg.wait_for_timeout(500)
        before = done_state(pg); note = ''
        try:
            if sid in CUSTOM:
                CUSTOM[sid](pg)
            elif pg.evaluate('!!window.__mg'):
                o = pg.evaluate('({items:window.__mg.items.map(i=>[i.label,i.to]),buckets:window.__mg.buckets.map(x=>[x.id,x.label])})')
                bidx = {bid: k for k, (bid, _) in enumerate(o['buckets'])}
                for label, to in o['items']:
                    pg.locator('.panel .chip', has_text=label).first.click(); pg.wait_for_timeout(60)
                    pg.locator('.panel .slot').nth(bidx[to]).click(); pg.wait_for_timeout(80)
            elif pg.evaluate('!!window.__og'):
                items = pg.evaluate('window.__og.items')
                for t in items:
                    pg.locator('.panel .chip', has_text=t).first.click(); pg.wait_for_timeout(80)
            elif pg.evaluate('window.__ask.length>0') or True:
                # ask chain: answer each question as it appears
                n = 0; guard = 0
                while guard < 40:
                    guard += 1; pg.wait_for_timeout(150)
                    q = pg.evaluate('window.__ask[window.__ask.length-1]||null')
                    if not q: break
                    key = json.dumps(q.get('q'))
                    if q.get('_done_key') == key: pass
                    pending = pg.evaluate("(()=>{const o=document.querySelector('.panel .opts, .panel input[type=text]');return !!document.querySelector('.panel .opt:not(:disabled), .panel input[type=text]:not(:disabled)')})()")
                    if pending:
                        if q.get('t') == 'num':
                            inp = pg.locator('.panel input[type=text]').last; inp.fill(str(q['a'])); pg.locator('.panel button', has_text='Check').last.click()
                        else:
                            pg.locator('.panel .opt').nth(q['a']).click()
                        pg.wait_for_timeout(200)
                    nxt = pg.locator('.panel button.btn.small', has_text=re.compile('^(Next|Finish|See score)'))
                    if nxt.count() and nxt.last.is_visible():
                        nxt.last.click(); pg.wait_for_timeout(250)
                    else:
                        if not pending: break
        except Exception as e:
            note = 'EXC ' + str(e).splitlines()[0][:120]
        pg.wait_for_timeout(1500)
        after = done_state(pg)
        ok = after != before and after != 'Skip'
        res[sid] = (ok, before, after, note)
        print(('OK   ' if ok else 'FAIL ') + sid, before, '->', after, note, flush=True)
    b.close()
bad = [k for k, v in res.items() if not v[0]]
print('\nFAILED:', bad or 'none'); print('\n'.join(errs) if errs else 'NO PAGE ERRORS')
