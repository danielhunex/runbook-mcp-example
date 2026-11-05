import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const runbooks = [
  {
    id: 'local-api-startup',
    title: 'Local API does not start',
    tags: ['api', 'startup', 'port'],
    checks: [
      'Read the first startup error, not just the last exit message.',
      'Check whether another process is using the configured port.',
      'Verify the required local configuration is present.'
    ]
  },
  {
    id: 'package-restore',
    title: 'Package restore fails',
    tags: ['package', 'restore', 'dependency', 'authentication'],
    checks: [
      'Identify which package source returned the error.',
      'Check whether authentication to that source has expired.',
      'Confirm the requested package version exists in that source.'
    ]
  }
];

function makeServer() {
  const server = new McpServer({ name: 'local-runbooks', version: '1.0.0' });

  server.registerTool(
    'search_runbooks',
    {
      description: 'Find matching troubleshooting notes. Read-only; never runs their steps.',
      inputSchema: z.object({ query: z.string().trim().min(1).max(200) }),
      annotations: { readOnlyHint: true, openWorldHint: false }
    },
    async ({ query }) => {
      const terms = query.toLowerCase().split(/\s+/);
      const matches = runbooks.filter((entry) => {
        const searchable = [entry.title, ...entry.tags, ...entry.checks]
          .join(' ')
          .toLowerCase();
        return terms.every((term) => searchable.includes(term));
      });

      const result = {
        query,
        totalMatches: matches.length,
        runbooks: matches.slice(0, 5)
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  return server;
}

void serveStdio(makeServer);
console.error('local-runbooks: ready on stdio');
