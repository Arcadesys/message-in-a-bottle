# Editorial sources

This folder contains the human-directed authoring material for the free tabletop edition.

- `introduction.md`: premise, spoiler brief, table setup, clue policy, and calibration.
- `sessions.mjs`: eight sessions and twenty-four scene cards, procedures, clues, outcomes, and clocks.
- `gm-field-guide.md`: a run sheet for every scene, including opening cues, step-by-step adjudication, branch handling, and transitions. It is appended to the GM book and rendered to `app/scene-director.html` by `scripts/build-print-edition.py`.
- `appendix.md`: original NPC profiles, maps, clocks, scaling notes, credits, and the full fan notice.
- `handouts.md`: player-facing handout masters and reveal timing.

The checked-in interactive HTML app in `../app/` and illustrated, print-ready original PDFs in `../pdf/` are ready without a build step. The original website also has the illustrated campaign walkthrough. `../downloads/` contains a bundled offline package.

### Provenance and asset integrity

The original campaign bible and eight unplayed session outlines establish the arc. The free edition adds runnable mechanics, names, statistics, handouts, alternate outcomes, and failure routes. No private questionnaires, messages, real-person biography, or play notes are included.

The [asset-sync action](../.github/workflows/sync-release-assets.yml) copies the original PDFs and the unaltered Savage Worlds Fan logo from `Arcadesys/work-thearcades-me`. The PDF cover includes that logo in accordance with the [Pinnacle Fan License](https://shop.peginc.com/pages/licensing). It deliberately imports only the four named images, three named PDFs, and the specific offline ZIP. It does not import unrelated site files.

**Rights:** Austen Tucker-Crowder's original campaign contributions here are licensed under [CC BY 4.0](../LICENSE-CC-BY-4.0), with attribution and change notices required by that license. Third-party material is excluded, and the assembled Savage Worlds fan edition must remain free under Pinnacle's terms. See [LICENSE](../LICENSE) and the [root README](../README.md) for the exact scope.
