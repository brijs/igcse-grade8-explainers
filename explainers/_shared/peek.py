"""Screenshot specific moments.  peek.py <slug> <out_dir> <scene>:<step>:<waitMs>[:js] ...
js (optional) is evaluated in the page after waiting, e.g. to click panel buttons."""
import sys, os
from playwright.sync_api import sync_playwright
slug, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__)); url = 'file://' + os.path.normpath(os.path.join(here, '..', slug, 'index.html'))
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True); pg = b.new_page(viewport={'width': 1280, 'height': 700}, color_scheme='dark' if os.environ.get('DARK') else 'light')
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(300)
    for spec in sys.argv[3:]:
        parts = spec.split(':', 3); sid, step, wait = parts[0], int(parts[1]), int(parts[2]); js = parts[3] if len(parts) > 3 else None
        pg.evaluate('openScene("%s")' % sid); pg.wait_for_timeout(200)
        for _ in range(step):
            pg.evaluate("(()=>{const b=document.querySelectorAll('.nav .btn');b[b.length-1].click()})()"); pg.wait_for_timeout(120)
        pg.wait_for_timeout(wait)
        if js: pg.evaluate(js); pg.wait_for_timeout(600)
        pg.screenshot(path='%s/%s_%d.png' % (out, sid, step))
    print('errors:', errs or 'none'); b.close()
