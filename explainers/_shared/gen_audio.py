"""Generates narration clips (Kokoro af_heart, speed 0.95, mono 32 kbps MP3) for one explainer.
Run:  ~/.cache/kokoro/venv/bin/python explainers/_shared/gen_audio.py <slug>
Existing clips are skipped; if a line in script.py changes, delete its mp3 (or run with --force).
Models live in ~/.cache/kokoro (kokoro-v1.0.onnx, voices-v1.0.bin; see the README for download links).
"""
import os, sys, subprocess, time, hashlib, json
import soundfile as sf
import imageio_ffmpeg
from kokoro_onnx import Kokoro
shared = os.path.dirname(os.path.abspath(__file__))
slug = sys.argv[1]; force = '--force' in sys.argv
d = os.path.join(shared, '..', slug, 'source'); sys.path.insert(0, d)
from script import SCRIPT
K = os.environ.get('KOKORO_DIR', os.path.expanduser('~/.cache/kokoro'))
k = Kokoro(K + '/kokoro-v1.0.onnx', K + '/voices-v1.0.bin')
ff = imageio_ffmpeg.get_ffmpeg_exe()
ad = os.path.join(d, 'audio'); os.makedirs(ad, exist_ok=True)
hp = os.path.join(ad, 'hashes.json'); H = json.load(open(hp)) if os.path.exists(hp) else {}
t0 = time.time(); n = 0
for sid, lines in SCRIPT.items():
    for i, text in enumerate(lines):
        key = '%s.%d' % (sid, i); mp3 = os.path.join(ad, key + '.mp3')
        h = hashlib.md5(text.encode()).hexdigest()[:10]
        if force or not os.path.exists(mp3) or H.get(key) != h:
            samples, sr = k.create(text, voice='af_heart', speed=0.95, lang='en-us')
            tmp = os.path.join(ad, 'tmp.wav'); sf.write(tmp, samples, sr)
            subprocess.run([ff, '-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-b:a', '32k', mp3], check=True)
            H[key] = h; n += 1
            print(key, round(time.time() - t0), flush=True)
if os.path.exists(os.path.join(ad, 'tmp.wav')): os.remove(os.path.join(ad, 'tmp.wav'))
json.dump(H, open(hp, 'w'), indent=0)
print('DONE', n, 'new clips', flush=True)
