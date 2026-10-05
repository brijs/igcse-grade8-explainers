# Grade 8 IGCSE Explainers

Interactive, animated, narrated explainers for Grade 8 (Cambridge Lower Secondary / IGCSE, Inventure Academy). Static site: no build step is needed to host it, so it works on GitHub Pages as-is.

**Live site: https://brijs.github.io/igcse-grade8-explainers/**

## Run it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000     # then browse to http://localhost:8000/
```

## Explainers

| Subject | Explainer (live) | Scenes | Topics | Source |
|---|---|---|---|---|
| Physics | [Physics with Mummy](https://brijs.github.io/igcse-grade8-explainers/explainers/physics-with-mummy/) | 17 | Physical quantities, motion graphs, density, thermal energy transfer | [folder](explainers/physics-with-mummy/) |
| Chemistry | [Chemistry with Mummy](https://brijs.github.io/igcse-grade8-explainers/explainers/chemistry-with-mummy/) | 17 | Structure of the atom and the periodic table; chemical bonding and structure of materials; displacement reactions | [folder](explainers/chemistry-with-mummy/) |
| Chemistry | [Metal Reactivity Lab](https://brijs.github.io/igcse-grade8-explainers/explainers/metal-reactivity-lab/) | 1 lab | Reactivity series and displacement reactions | [folder](explainers/metal-reactivity-lab/) |
| Biology | [Biology with Mummy](https://brijs.github.io/igcse-grade8-explainers/explainers/biology-with-mummy/) | 17 | Photosynthesis and transport in plants; variation and inheritance | [folder](explainers/biology-with-mummy/) |
| Computer Science | [Computer Science with Mummy](https://brijs.github.io/igcse-grade8-explainers/explainers/computer-science-with-mummy/) | 21 | Digital citizenship and network security; spreadsheets; logic gates and circuits; design thinking and CAD | [folder](explainers/computer-science-with-mummy/) |

Each explainer has narrated, animated scenes (watch, guess, try it, remember), a short quiz per scene, a mixed final round and a cheat sheet. Progress is saved in the browser only.

```
index.html            Home page, grouped by subject > term > topic
explainers.js         Registry the home page reads (add each new explainer here)
explainers/
  physics-with-mummy/         Original explainer (its own engine and build.py)
  chemistry-with-mummy/       Built with the shared engine
  biology-with-mummy/         Built with the shared engine
  computer-science-with-mummy/  Built with the shared engine
  _shared/            Shared engine (core.js, helpers.js, finale.js, head.html), build.py, gen_audio.py and test tools
  <slug>/index.html   The built, self-contained explainer (audio embedded)
  <slug>/source/      config.js, theme.css, script.py (narration), scenes/*.js, audio/*.mp3, STORYBOARD.md
```

## Add a new explainer

1. Copy one of the shared-engine folders (for example `explainers/biology-with-mummy/`) to `explainers/<slug>/` and edit `source/config.js` (title, acts, cheat sheet), `source/theme.css`, `source/scenes/*.js` and `source/script.py` (one narration line per scene step).
2. Make the narration clips and build the page (below).
3. Add an entry under the right subject and term in `explainers.js`, and a row in the table above.
4. Commit and push.

## Rebuild an explainer (shared engine)

```
python3 explainers/_shared/build.py chemistry-with-mummy      # writes explainers/chemistry-with-mummy/index.html
```

Regenerating voice clips (only needed when narration in `script.py` changes; unchanged lines are skipped):

```
python3.11 -m venv ~/.cache/kokoro/venv
~/.cache/kokoro/venv/bin/pip install kokoro-onnx soundfile imageio-ffmpeg
# put kokoro-v1.0.onnx and voices-v1.0.bin in ~/.cache/kokoro
#   (from https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
~/.cache/kokoro/venv/bin/python explainers/_shared/gen_audio.py chemistry-with-mummy
```

Voice: Kokoro `af_heart`, speed 0.95, mono 32 kbps MP3. ffmpeg comes from the `imageio-ffmpeg` package, so nothing else needs installing.

## Test tools (optional, need `playwright` and Google Chrome)

```
~/.cache/kokoro/venv/bin/pip install playwright
~/.cache/kokoro/venv/bin/python explainers/_shared/walk.py <slug> [--mobile]   # opens every scene, steps through it, reports JS errors
~/.cache/kokoro/venv/bin/python explainers/_shared/solve.py <slug>             # plays every hands-on task to prove it can be completed
~/.cache/kokoro/venv/bin/python explainers/_shared/peek.py <slug> <out_dir> 1.1:0:2000   # screenshot a scene step
```

### Physics with Mummy

The original explainer keeps its own engine: `cd explainers/physics-with-mummy/source && python3 build.py` (see its README).
