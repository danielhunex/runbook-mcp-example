# Screen recording: VS Code + MCP in 40 seconds

Record a real session, not a slide animation. ScreenToGif works well on Windows if the goal is a compact looping GIF; OBS Studio is better if you also want a narrated MP4.

Before recording, run `npm ci` and `npm test`. Open the project in VS Code, zoom the UI to a readable size, hide unrelated tabs, disable notifications and ensure your terminal doesn't show personal paths or credentials you don't want public.

| Time | Screen action | What the viewer learns |
| --- | --- | --- |
| 0–5 s | In VS Code terminal, run `npm start`. Show `ready on stdio` and the waiting process. | A local MCP server is a process, not necessarily a web service. |
| 5–8 s | Press Ctrl+C. | VS Code will launch its own instance; don't leave this manual copy running. |
| 8–18 s | Command Palette → `MCP: Add Server` → `Command (stdio)`; paste the local `node ...server.mjs` command and select configuration scope. | How the client launches the server. |
| 18–25 s | Show the registered `local-runbooks` server/tool, then enable it if needed. | Tool discovery. |
| 25–36 s | Ask: `Call search_runbooks with query "package restore". Show the runbook ID. Don't run commands.` | Real invocation. |
| 36–42 s | Expand the tool-call details and highlight `package-restore`. | Evidence from the tool, not just a model-generated answer. |

If the setup prompts take too long, make two short recordings and join them. Don't accelerate the tool result so much that the audience can't read the returned runbook ID.

Suggested caption: *VS Code starts the local MCP server, discovers `search_runbooks`, and calls it from agent chat.*

Export a GIF at about 10–12 fps with a cropped region around the relevant VS Code pane; use MP4 for the full-resolution version. Verify the final export is legible on a phone before putting it in the article.
