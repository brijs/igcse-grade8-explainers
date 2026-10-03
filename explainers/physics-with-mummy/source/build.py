"""Builds ../index.html (single self-contained page) from src/, script.py and audio/*.mp3.
Run:  python3 build.py
"""
import json, glob, base64, os, sys
d = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, d)
from script import SCRIPT
A = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode() for f in glob.glob(d + '/audio/*.mp3')}
# Optional cranky Mummy: opt in via ../source/cranky.json; engine and shared phrases live in explainers/_shared/cranky
sh_dir = os.path.join(d, '..', '..', '_shared', 'cranky')
cr_css = cr_js = ''
if os.path.exists(d + '/cranky.json'):
    sh = json.load(open(sh_dir + '/phrases.json', encoding='utf-8')); ex = json.load(open(d + '/cranky.json', encoding='utf-8'))
    for base, ph in ((sh_dir + '/audio/', sh['phrases']), (d + '/cranky_audio/', ex['phrases'])):
        for p in ph: A['ta.' + p['id']] = base64.b64encode(open(base + p['id'] + '.mp3', 'rb').read()).decode()
    cr_css = '<style>\n' + open(sh_dir + '/cranky.css', encoding='utf-8').read() + '\n</style>\n'
    cr_js = 'const CRANKY=' + json.dumps({'phrases': sh['phrases'] + ex['phrases'], 'byScene': ex.get('byScene', {})}, ensure_ascii=False) + ';\n' + open(sh_dir + '/cranky.js', encoding='utf-8').read() + '\n'
r = lambda n: open(d + '/src/' + n).read()
js = ''.join(r(n) + '\n' for n in ['p2_core.js', 'p3_scenes_a.js', 'p4a_scenes_density.js', 'p4b_scenes_heat1.js', 'p4c_scenes_heat2.js', 'p5_boss_cheat_init.js'])
body = r('p1_head.html') + r('p1b_style.html') + cr_css + '\n<script>\nconst SCRIPT=' + json.dumps(SCRIPT) + ';\nconst AUDIO=' + json.dumps(A) + ';\n' + cr_js + js + '\n</script>\n'
html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + body + '</body></html>\n'
open(d + '/../index.html', 'w').write(html)
print('wrote index.html', round(len(html) / 1e6, 2), 'MB,', len(A), 'clips')
