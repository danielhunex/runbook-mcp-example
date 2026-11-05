# Local Runbook MCP Server

A tiny, read-only MCP server for searching two fictional troubleshooting notes. It's the companion code for the article [*Building Your First Tiny MCP Server*](https://devdigest.net/building-a-small-mcp-server/).

The server has one tool, `search_runbooks`. It looks for all query words across a runbook's title, tags and checks, then returns matching notes as JSON. It doesn't read your disk, run commands or contact a service.

## Run locally

The server requires Node.js 20 or newer. The optional MCP Inspector (version 2.14) requires Node.js 22.23.4+, 24.22.1+, or 26.12.1+.

```powershell
npm ci
npm start
```

The terminal prints `local-runbooks: ready on stdio` and waits. This is expected: an MCP client has to connect before anything else happens. Press Ctrl+C to stop this manual run.

## Test the tool without VS Code

```powershell
npm test
```

The tests launch the server over stdio, discover its tool, call it with a matching query, check a no-match result and verify that blank input is rejected.

For an interactive test, run:

```powershell
npx @modelcontextprotocol/inspector node server.mjs
```

Connect in the Inspector, open **Tools**, select `search_runbooks`, and try `{"query":"package restore"}`.

## Connect from VS Code

1. Open the Command Palette and choose **MCP: Add Server**.
2. Choose **Command (stdio)**.
3. Supply `node "C:\absolute\path\to\runbook-mcp-example\server.mjs"`, using your actual path.
4. Use the server ID `local-runbooks`. For personal use, choose **Global → Copilot Global** if offered.
5. Review the trust prompt and enable the tool for your agent.

Then ask in agent chat:

> Call search_runbooks with query "package restore". Show the runbook ID and summarize the checks. Do not execute any steps.

Expand the tool call to confirm that VS Code invoked `search_runbooks`. A plausible answer alone doesn't prove it did.

## Notes

- The runbooks are sample data, not production troubleshooting guidance.
- The tool description and read-only annotation are useful hints, not an enforcement mechanism. The implementation is read-only because it only searches a static array.
- Never log with `console.log` in a stdio server. Use `console.error` so protocol messages on stdout remain intact.
- Licensed under the [MIT License](LICENSE).
