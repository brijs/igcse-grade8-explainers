import json, os, subprocess, base64, time
import soundfile as sf
from kokoro_onnx import Kokoro
from script import SCRIPT
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
out = {}
os.makedirs("audio", exist_ok=True)
t0 = time.time()
for sid, lines in SCRIPT.items():
    for i, text in enumerate(lines):
        key = "%s.%d" % (sid, i)
        mp3 = "audio/%s.mp3" % key
        if not os.path.exists(mp3):
            samples, sr = k.create(text, voice="af_heart", speed=0.95, lang="en-us")
            sf.write("audio/tmp.wav", samples, sr)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "audio/tmp.wav", "-ac", "1", "-b:a", "32k", mp3], check=True)
        print(key, round(time.time() - t0), flush=True)
print("DONE", flush=True)
