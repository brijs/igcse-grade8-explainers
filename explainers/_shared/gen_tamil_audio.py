"""Generates Tamil Mummy clips (Microsoft neural voice via edge-tts) for the cranky-Mummy feature.
Run:  ~/.cache/edge-tts-venv/bin/python explainers/_shared/gen_tamil_audio.py [<slug> ...] [--force]
No slug: shared phrases only (_shared/cranky/phrases.json -> _shared/cranky/audio/).
With slug: that explainer's source/cranky.json -> source/cranky_audio/.
Setup: python3 -m venv ~/.cache/edge-tts-venv && ~/.cache/edge-tts-venv/bin/pip install edge-tts
"""
import os, sys, json, hashlib, asyncio
import edge_tts
shared = os.path.dirname(os.path.abspath(__file__))
force = '--force' in sys.argv
slugs = [a for a in sys.argv[1:] if not a.startswith('--')]
jobs = [(os.path.join(shared, 'cranky', 'phrases.json'), os.path.join(shared, 'cranky', 'audio'))]
for s in slugs:
    src = os.path.join(shared, '..', s, 'source')
    jobs.append((os.path.join(src, 'cranky.json'), os.path.join(src, 'cranky_audio')))
async def main():
    n = 0
    for jf, ad in jobs:
        cfg = json.load(open(jf, encoding='utf-8')); os.makedirs(ad, exist_ok=True)
        hp = os.path.join(ad, 'hashes.json'); H = json.load(open(hp)) if os.path.exists(hp) else {}
        for p in cfg['phrases']:
            mp3 = os.path.join(ad, p['id'] + '.mp3')
            h = hashlib.md5(json.dumps([p['ta'], p.get('rate'), p.get('pitch'), cfg['voice']], ensure_ascii=False).encode()).hexdigest()[:10]
            if force or not os.path.exists(mp3) or H.get(p['id']) != h:
                await edge_tts.Communicate(p['ta'], cfg['voice'], rate=p.get('rate', '+0%'), pitch=p.get('pitch', '+0Hz')).save(mp3)
                H[p['id']] = h; n += 1; print(p['id'], flush=True)
        json.dump(H, open(hp, 'w'), indent=0)
    print('DONE', n, 'new clips')
asyncio.run(main())
