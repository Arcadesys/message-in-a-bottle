# Message in a Bottle 🎲

**A free, eight-session Savage Worlds Adventure Edition (SWADE) fan campaign set in a Chicago that has been quietly treated as somebody else's property.**

Ten quiet years. A friend's return. Cartoon physics, municipal corruption, dimensional bureaucracy, and a voyage between realities. The players get to decide how Chicago finds its freedom.

**By Austen Tucker-Crowder · Free Fan Edition 0.1 · Unplaytested · Full spoilers for GMs**

## Choose how to play

### 🖨️ Paper and dice (no computer at the table)
- **[Complete GM module (PDF)](pdf/message-in-a-bottle-module.pdf)**: all eight gatherings, scene prompts, encounters, clocks, NPCs, and alternate outcomes.
- **[Printable player handouts (PDF)](pdf/message-in-a-bottle-player-handouts.pdf)**: reunion sheet and staged clues. **GMs should reveal them at the indicated sessions.**
- [Illustrated campaign walkthrough (PDF, on the author's site)](https://work.thearcades.me/downloads/message-in-a-bottle-campaign-walkthrough.pdf): development background and full spoilers; optional reading, not needed to run the adventure.

The repository PDFs are complete, **text-first, printer-friendly** resources. The more richly illustrated PDF editions are also available on the [author's site](https://work.thearcades.me/campaigns/message-in-a-bottle-module/). You need only your **SWADE core rules**, dice, Action Cards, Bennies, and characters.

### 💻 Screen-assisted GMing
- **[Interactive GM runner (on the author's website)](https://work.thearcades.me/campaigns/message-in-a-bottle-module/)**: scene cards, essential-clue checkboxes, manual pressure clocks, session timer, notes, optional sounds, and progress saved locally in your browser.
- [Full module in HTML](https://work.thearcades.me/campaigns/message-in-a-bottle-module/module.html)
- [Player handouts in HTML](https://work.thearcades.me/campaigns/message-in-a-bottle-module/handouts.html)
- [Standalone HTML app in this repository](app/): identical campaign data, with relative links suitable for static hosting. To serve locally, see below.

**Privacy:** The app stores notes and progress in the browser's local storage. It does not require accounts or send play records to a service. Illustrations are requested from the author's website while online. Exported backups may contain your own notes, so share them deliberately.

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
| `pdf/` | Printable GM book, player handouts, and illustrated walkthrough |
| `app/` | Accessible static HTML GM runner, campaign JSON, complete module, handouts, and campaign artwork |
| `source/` | Markdown authoring sources and structured session data |
| `scripts/` | Zero-dependency generator for the two printer-friendly PDFs |

## Credits and provenance

Campaign conception and direction: **Austen Tucker-Crowder**.

This is a tabletop adaptation of the original *Message in a Bottle* campaign bible and eight **unplayed** session plans. The free fan edition adds runnable encounters, supporting NPCs, player handouts, scene clocks, alternate outcomes, and balancing assumptions. It does not portray events that were actually played.

Human-directed AI tools assisted development, writing, assembly, and illustrations. Existing illustrations interpret the campaign; they are not archival records. Original player correspondence, character questionnaires, and other private materials are **not** included.

The campaign uses a distinct tabletop remix of imagery from *The Witch Who Sold the World* and does not imply continuity with *Ink and Paint*. All cartoon characters in this release are original.

### Fan use and rights

This is a **free, unofficial fan product**, not an official Pinnacle Entertainment Group release. The SWADE core rules are **not included**. No payment or signup is required. Publication must remain consistent with [Pinnacle's Savage Worlds Fan License](https://shop.peginc.com/pages/licensing).

> This game references the Savage Worlds game system, available from Pinnacle Entertainment Group at www.peginc.com. Savage Worlds and all associated logos and trademarks are copyrights of Pinnacle Entertainment Group. Used with permission. Pinnacle makes no representation or warranty as to the quality, viability, or suitability for purpose of this product.

The project is publicly readable and free to download. **No blanket open-source or content-reuse license is asserted** until the creator selects terms compatible with the fan license and third-party assets. Please preserve attribution and this notice when sharing the free fan module.

[Companion essay: The Work Didn't Disappear](https://work.thearcades.me/blog/the-work-didnt-disappear)
