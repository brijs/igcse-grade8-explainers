# Grade 8 IGCSE Explainers

Interactive, animated, narrated explainers for Grade 8 (Cambridge Lower Secondary / IGCSE, Inventure Academy). Static site: no build step is needed to host it, so it works on GitHub Pages as-is.

```
index.html            Home page, grouped by subject > term > topic
explainers.js         Registry the home page reads (add each new explainer here)
explainers/<slug>/
  index.html          The built, self-contained explainer (audio embedded)
  source/             Source, narration script, audio clips and build script
```

## Explainers

| Subject | Explainer | Topics |
|---|---|---|
| Physics | [Physics with Mummy](explainers/physics-with-mummy/) | Quantities, motion graphs, density, thermal energy transfer |

## Add a new explainer

1. Create `explainers/<slug>/` with an `index.html` (single self-contained file; inline CSS/JS, audio as base64 MP3).
2. Add an entry under the right subject and term in `explainers.js`.
3. Commit and push.

## Rebuild the physics explainer

```
cd explainers/physics-with-mummy/source
python3 build.py          # writes ../index.html from src/, script.py, audio/*.mp3
```

Regenerating voice clips (only if narration in `script.py` changes; existing clips are skipped):

```
pip install kokoro-onnx soundfile   # plus ffmpeg
mkdir models   # download kokoro-v1.0.onnx and voices-v1.0.bin from the kokoro-onnx GitHub releases into it
python3 gen_audio.py
```

Voice: Kokoro `af_heart`, speed 0.95, mono 32 kbps MP3.
