import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const serverPath = fileURLToPath(new URL('../server.mjs', import.meta.url));

async function withClient(callback) {
  const client = new Client({ name: 'runbook-test', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath]
  });

  try {
    await client.connect(transport);
    await callback(client);
  } finally {
    await client.close();
  }
}

test('advertises and calls search_runbooks', async () => {
  await withClient(async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.some(({ name }) => name === 'search_runbooks'), true);

    const response = await client.callTool({
      name: 'search_runbooks',
      arguments: { query: 'package restore' }
    });

    assert.notEqual(response.isError, true);
    const result = JSON.parse(response.content[0].text);
    assert.equal(result.totalMatches, 1);
    assert.equal(result.runbooks[0].id, 'package-restore');
  });
});

test('returns an empty result for a legitimate miss', async () => {
  await withClient(async (client) => {
    const response = await client.callTool({
      name: 'search_runbooks',
      arguments: { query: 'database deadlock' }
    });

    assert.notEqual(response.isError, true);
    const result = JSON.parse(response.content[0].text);
    assert.equal(result.totalMatches, 0);
    assert.deepEqual(result.runbooks, []);
  });
});

test('rejects blank input', async () => {
  await withClient(async (client) => {
    const response = await client.callTool({
      name: 'search_runbooks',
      arguments: { query: '   ' }
    });

    assert.equal(response.isError, true);
  });
});
