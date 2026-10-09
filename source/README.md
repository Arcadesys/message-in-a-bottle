# Editorial sources

This folder contains the human-directed authoring material for the free tabletop edition.

- `introduction.md`: premise, spoiler brief, table setup, clue policy, and calibration.
- `sessions.mjs`: eight sessions and twenty-four scene cards, procedures, clues, outcomes, and clocks.
- `appendix.md`: original NPC profiles, maps, clocks, scaling notes, credits, and the full fan notice.
- `handouts.md`: player-facing handout masters and reveal timing.

The checked-in interactive HTML app in `../app/` and illustrated, print-ready original PDFs in `../pdf/` are ready without a build step. The original website also has the illustrated campaign walkthrough. `../downloads/` contains a bundled offline package.

### Provenance and asset integrity

The original campaign bible and eight unplayed session outlines establish the arc. The free edition adds runnable mechanics, names, statistics, handouts, alternate outcomes, and failure routes. No private questionnaires, messages, real-person biography, or play notes are included.

The [asset-sync action](../.github/workflows/sync-release-assets.yml) copies the original PDFs and the unaltered Savage Worlds Fan logo from `Arcadesys/work-thearcades-me`. The PDF cover includes that logo in accordance with the [Pinnacle Fan License](https://shop.peginc.com/pages/licensing). It deliberately imports only the four named images, three named PDFs, and the specific offline ZIP. It does not import unrelated site files.

**Rights:** public availability does not grant unrestricted reproduction or commercial use; see the root README.
