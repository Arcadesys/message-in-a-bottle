# Run *Message in a Bottle* through MCP 🎲

This **local-first MCP server** turns the eight-session, 24-scene SWADE fan adventure into an interactive GM companion. It works alongside the printable [GM module](../pdf/message-in-a-bottle-module.pdf), browser [GM runner](../app/), and detailed [Scene Director's Handbook](../source/gm-field-guide.md).

**The GM remains in charge.** A model can explain a scene, suggest consequences grounded in its written content, and help track the campaign. It cannot force an outcome, grant an essential clue without your direction, or secretly advance clocks. The model is not the rules arbiter and the server does not automate SWADE combat.

## What you can do

Say things like:

- "We're starting Session 2. Give me the intro and talk me through the first scene."
- "The heroes talked the contractors into helping instead of fighting. What changes?"
- "Walk me through the bus rescue, including the Dramatic Task and the falling-sign hazard."
- "Record: Pip is safe, but the crew lost its tools. Mark the scene partial."
- "Tick the public-danger clock to 3 and mark clue 1 as revealed."
- "Summarize the scenes we've completed and the people we owe favors."

The server exposes ten MCP tools: `campaign_overview`, `gm_briefing`, `get_scene`, `start_scene`, `complete_scene`, `mark_essential_clue`, `set_pressure_clock`, `record_gm_note`, `session_recap`, and `state_location`.

## Setup

Install **Node.js 20 or newer**. Clone or download this repository, then:

```sh
cd message-in-a-bottle/mcp
npm install
npm test
```

In a desktop MCP client that supports **local stdio servers**, add a server entry like the following, replacing the absolute path:

```json
{
  "mcpServers": {
    "message-in-a-bottle": {
      "command": "node",
      "args": ["/absolute/path/to/message-in-a-bottle/mcp/server.mjs"]
    }
  }
}
```

The exact settings UI and JSON envelope vary by application. Use the client's documented local MCP settings; this example is not a universal configuration file. The server uses the official [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and the stdio transport. **It does not need an API key or internet access to serve campaign facts or keep state.** A connected AI client may still make online model calls under its own policies.

Try: "List the campaign's sessions, then open scene `0-plan`."

## Private saves

Each launch loads the same per-user save at:

- macOS/Linux: `~/.local/state/message-in-a-bottle/run.json` (or `$XDG_STATE_HOME/message-in-a-bottle/run.json`)
- Override: set `MIAB_STATE_FILE` to an absolute path before launching the server.

Scene completion, clues, pressure clocks, and GM notes are stored there on **your** computer, not in GitHub or an external service. Different tables should set different `MIAB_STATE_FILE` paths. Back up that file before changing computers. **Do not commit or share a live save that includes people's notes or private information.**

Do not expose this stdio server as an unauthenticated internet service. Multi-user remote hosting needs a separate authenticated backend, permissions per table, and consent for anything recorded. The web runner's browser localStorage and this MCP state are **separate** in this initial edition; they don't synchronize automatically.

## How to use it fairly

The server is **GM-only** and its output contains spoilers. Keep player handouts separate. It tracks the fiction as the table decides it. Ask it what the adventure says, then adjudicate rolls with the SWADE core rules. Before any state changes, explicitly tell the AI what really happened. If a player's improvisation is better than the printed route, use it. The written clues remain guaranteed and player decisions have consequences.

There is no automatic dice rolling, adversarial encounter balancing, audio recording, chat-logging, or AI narration built into the MCP server. Those could be separate opt-in features, but they are not prerequisites for running this campaign.

This remains an **unofficial, free, unplaytested Savage Worlds fan adventure**. The SWADE core rulebook is required and not included; consult the root README for license notices and attribution.
