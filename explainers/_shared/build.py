"""Builds explainers/<slug>/index.html from the shared engine plus the explainer's own source.
Run from anywhere:  python3 explainers/_shared/build.py <slug>
Source layout (explainers/<slug>/source/): config.js, theme.css (optional), script.py, scenes/*.js (sorted by name), audio/*.mp3
"""
import json, glob, base64, os, sys, re
shared = os.path.dirname(os.path.abspath(__file__))
slug = sys.argv[1]
d = os.path.join(shared, '..', slug, 'source')
sys.path.insert(0, d)
from script import SCRIPT
A = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode() for f in glob.glob(d + '/audio/*.mp3')}
rd = lambda p: open(p, encoding='utf-8').read()
cfg = rd(d + '/config.js')
title = re.search(r"title:\s*'([^']+)'", cfg).group(1)
theme = rd(d + '/theme.css') if os.path.exists(d + '/theme.css') else ''
scenes = ''.join(rd(f) + '\n' for f in sorted(glob.glob(d + '/scenes/*.js')))
js = '\n'.join([cfg, rd(shared + '/core.js'), rd(shared + '/helpers.js'), scenes, rd(shared + '/finale.js')])
head = rd(shared + '/head.html').replace('{{TITLE}}', title)
body = head + rd(shared + '/mood.html') + ('<style>\n' + theme + '\n</style>\n' if theme else '') + '\n<script>\nconst SCRIPT=' + json.dumps(SCRIPT) + ';\nconst AUDIO=' + json.dumps(A) + ';\n' + js + '\n</script>\n'
html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + body + '</body></html>\n'
out = os.path.join(d, '..', 'index.html')
open(out, 'w', encoding='utf-8').write(html)
print('wrote', os.path.normpath(out), round(len(html) / 1e6, 2), 'MB,', len(A), 'clips')
