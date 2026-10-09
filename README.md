# Message in a Bottle 🎲

**A free, eight-session Savage Worlds Adventure Edition (SWADE) fan campaign set in a Chicago that has been quietly treated as somebody else's property.**

Ten quiet years. A friend's return. Cartoon physics, municipal corruption, dimensional bureaucracy, and a voyage between realities. The players get to decide how Chicago finds its freedom.

**By Austen Tucker-Crowder · Free Fan Edition 0.1 · Unplaytested · Full spoilers for GMs**

## Choose how to play

### 🖨️ Paper and dice (no computer at the table)
- **[Complete GM module (PDF)](pdf/message-in-a-bottle-module.pdf)**: all eight gatherings, scene prompts, encounters, clocks, NPCs, and alternate outcomes.
- **[Printable player handouts (PDF)](pdf/message-in-a-bottle-player-handouts.pdf)**: reunion sheet and staged clues. **GMs should reveal them at the indicated sessions.**
- [Illustrated campaign walkthrough (PDF)](pdf/message-in-a-bottle-campaign-walkthrough.pdf): development background and full spoilers; optional reading, not needed to run the adventure.

The repository PDFs are the **complete illustrated originals**, suitable for printing and running the whole campaign offline. They include the unaltered Savage Worlds Fan logo on their covers. You need only your **SWADE core rules**, dice, Action Cards, Bennies, and characters.

### 💻 Screen-assisted GMing
- **[Interactive GM runner (on the author's website)](https://work.thearcades.me/campaigns/message-in-a-bottle-module/)**: scene cards, essential-clue checkboxes, manual pressure clocks, session timer, notes, optional sounds, and progress saved locally in your browser.
- [Full module in HTML](https://work.thearcades.me/campaigns/message-in-a-bottle-module/module.html)
- [Player handouts in HTML](https://work.thearcades.me/campaigns/message-in-a-bottle-module/handouts.html)
- [Offline ZIP package](downloads/message-in-a-bottle-free-module.zip) containing the complete module, handouts, PDFs, and interactive source.
- [Standalone HTML app in this repository](app/): identical campaign data, with relative links suitable for static hosting. To serve locally, see below.

**Privacy:** The app stores notes and progress in the browser's local storage. It does not require accounts or send play records to a service. All shipped campaign images are stored locally under `app/assets/`. Exported backups may contain your own notes, so share them deliberately.

## Run the HTML app locally

This is a static HTML/JavaScript application, with no account, API keys, database, or build required.

1. Clone or download this repository.
2. From the repository directory run `python3 -m http.server 8000` (or another static HTTP server).
3. Open `http://localhost:8000/app/`.

Opening the runner directly as a `file://` document will not work reliably because browsers restrict module imports and fetching local JSON. **The PDF and the complete `app/module.html` remain readable without the runner.**

To publish with GitHub Pages, enable **Settings → Pages → Deploy from branch → main → /(root)**. Then the app should be available at `https://arcadesys.github.io/message-in-a-bottle/app/`. The Pages address is conditional until publishing has been enabled.

## At the table

- **Players:** 3–5; baseline is four Seasoned Wild Cards.
- **Runtime:** Eight gatherings of approximately 3–4 hours each.
- **Rules:** Savage Worlds Adventure Edition core book (sold separately). No Companion needed.
- **Adventure:** Sessions 0 through 7, including twenty-four scene cards, explicit essential clues, statted original NPCs, failure routes, and player handouts.
- **Advancement:** One Advance following Sessions 1, 3, and 5.
- **Status:** Prepared and mechanically checked, **not playtested**. Adjust encounter pressure for your table.

## Contents

| Path | Purpose |
| --- | --- |
| `pdf/` | Canonical illustrated GM book, player handouts, and illustrated walkthrough |
| `app/` | Accessible static HTML GM runner, campaign JSON, full module, handouts, and original campaign illustrations plus the unaltered fan logo |
| `source/` | Markdown authoring sources and structured session data |
| `downloads/` | Self-contained release ZIP (the interactive runner needs a static server) |

## Credits and provenance

Campaign conception and direction: **Austen Tucker-Crowder**.

This is a tabletop adaptation of the original *Message in a Bottle* campaign bible and eight **unplayed** session plans. The free fan edition adds runnable encounters, supporting NPCs, player handouts, scene clocks, alternate outcomes, and balancing assumptions. It does not portray events that were actually played.

Human-directed AI tools assisted development, writing, assembly, and illustrations. Existing illustrations interpret the campaign; they are not archival records. Original player correspondence, character questionnaires, and other private materials are **not** included. The binaries are copied unchanged from the author's public website repository through a scoped [asset sync workflow](.github/workflows/sync-release-assets.yml).

The campaign uses a distinct tabletop remix of imagery from *The Witch Who Sold the World* and does not imply continuity with *Ink and Paint*. All cartoon characters in this release are original.

### Fan use and rights

This is a **free, unofficial fan product**, not an official Pinnacle Entertainment Group release. The SWADE core rules are **not included**. No payment or signup is required. Publication must remain consistent with [Pinnacle's Savage Worlds Fan License](https://shop.peginc.com/pages/licensing).

> This game references the Savage Worlds game system, available from Pinnacle Entertainment Group at www.peginc.com. Savage Worlds and all associated logos and trademarks are copyrights of Pinnacle Entertainment Group. Used with permission. Pinnacle makes no representation or warranty as to the quality, viability, or suitability for purpose of this product.

### Reuse of original contributions — proposed terms

**Draft proposal awaiting Austen Tucker-Crowder's approval. This section does not yet grant MIT or Creative Commons permissions.** The intended scope below makes the author's original contributions reusable, modifiable, and redistributable while preserving other rights holders' material and Pinnacle's separate terms.

| Original contribution | Proposed license and scope |
| --- | --- |
| Software and layout | [MIT License](https://opensource.org/license/mit) for the author's original code in `app/runner.mjs`, `app/run-state.mjs`, and `app/module.css`; original HTML interface and layout code in `index.html`, `app/index.html`, `app/module.html`, and `app/handouts.html`; and original workflow code in `.github/workflows/`. Campaign data, prose, images, and third-party material, including referenced GitHub Actions, are outside this software scope. |
| Campaign writing and data | [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) for the author's original campaign prose, handouts, characters, scene descriptions, and adventure procedures in `source/`, `app/campaign.json`, `app/module.md`, and `app/handouts.md`, and the same original content reproduced in HTML and PDFs. `source/sessions.mjs` holds campaign data and belongs to this content scope. |
| Campaign illustrations | CC BY 4.0 for the author's original, copyrightable contributions, to the extent the author holds those rights, in `app/assets/chicago-snowglobe.webp`, `app/assets/primordial-archipelago.webp`, and `app/assets/thompson-maze.webp`, including reproductions of those contributions in the PDFs. Human-directed AI assistance is disclosed above; this proposal does not claim exclusive copyright in every generated element. |

These would be standard licenses: MIT permits use, modification, redistribution, sublicensing, and sale of covered software, with its copyright and permission notice retained. CC BY 4.0 permits copying, adaptation, and redistribution of covered content, including commercial reuse, with attribution, a license link, and an indication of changes. CC BY permissions are irrevocable for recipients who comply with its terms; no extra noncommercial restriction would be added to the covered original content. See the [CC BY 4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode.en).

For covered campaign content, the proposed attribution is: **“Message in a Bottle by Austen Tucker-Crowder, https://github.com/Arcadesys/message-in-a-bottle, licensed under CC BY 4.0.”** Retain applicable notices and describe your changes. Both proposed licenses cover only rights the author holds in the original contributions in this campaign release, including separable original contributions within mixed files; they do not license the author's separate novels or private player materials. File formats and directory names do not expand the scope. Public-domain material and uses permitted by applicable copyright exceptions do not acquire new restrictions.

### Third-party material and the Savage Worlds fan edition

**Excluded from the proposed MIT and CC BY grants:** Pinnacle's Savage Worlds/SWADE rulebook text and other protected material, settings, logos, and trademarks; `app/assets/savage-worlds-fan.png`; and any other third-party text, artwork, fonts, or assets. Third-party material retains its own permissions and notices. A copy inside a PDF, HTML file, or the release ZIP does not become open-licensed. Public availability and the asset-sync workflow are not evidence of permission to relicense third-party material.

The assembled Savage Worlds fan edition is distributed under [Pinnacle's Fan License](https://shop.peginc.com/pages/licensing). That license allows references to the rules system, requires the unaltered Savage Worlds Fan logo on the front display and the conspicuous notice above, prohibits reproducing copyrighted rulebook material without express written permission, and prohibits charging or accepting compensation for the fan product. It excludes Pinnacle settings and other licensed properties. Its permission is non-assignable and may be changed or revoked by Pinnacle; a fork does not inherit the author's Pinnacle permission.

Anyone publishing a Savage Worlds version must independently comply with Pinnacle's applicable terms. Keep the fan edition free and preserve the required fan logo and notice. Commercial reuse of separable original material under the proposed licenses would not authorize selling this Savage Worlds package or using Pinnacle's protected material, branding, or settings. Remove excluded material and obtain any additional permissions your intended use requires. Other publication routes, including SWAG and the Ace program, have their own terms; this repository does not grant access to them or imply Pinnacle approval.

[Companion essay: The Work Didn't Disappear](https://work.thearcades.me/blog/the-work-didnt-disappear)
