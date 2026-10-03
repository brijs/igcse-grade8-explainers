# Biology with Mummy

**Live: https://brijs.github.io/igcse-grade8-explainers/explainers/biology-with-mummy/**

Grade 8 biology in 17 scenes and two acts, plus a 16-question final round and a cheat sheet. Open `index.html`.

- **Act 1, photosynthesis and transport in plants (Unit 1):** the photosynthesis equation; chlorophyll and light; the starch test; what photosynthesis needs; leaf structure; stomata and gas exchange; minerals (nitrate and magnesium); the carbon cycle; roots and the xylem; transpiration and the phloem.
- **Act 2, variation and inheritance (Unit 3):** variation; cells, chromosomes and genes; DNA and base pairs; asexual and sexual reproduction; gametes; fertilisation; why siblings differ.

`source/` holds the scenes, narration (`script.py`), audio clips and a `STORYBOARD.md`. Rebuild with `python3 ../_shared/build.py biology-with-mummy` (see the main README).

## Cranky Mummy (Tamil)

Opt-in via `source/cranky.json` (scene-specific Tamil lines). Off by default; the header toggle turns it on (remembered per browser). When on, Mummy reacts to wrong answers only (correct answers get the normal cheer, no idle nagging) with Tamil phrases, a subtitle bubble, animations and sound effects, and escalates on repeated wrong answers. Engine and generic phrases are shared: `../_shared/cranky/`. To add it to another explainer, create its own `source/cranky.json`, run `gen_tamil_audio.py <slug>`, and rebuild. Tamil voice: Microsoft `ta-IN-PallaviNeural` through `edge-tts` (see the header of `_shared/gen_tamil_audio.py`).
