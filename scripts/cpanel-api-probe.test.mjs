import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { probeCpanelReadOnly } from './cpanel-api-probe.mjs';

const run = promisify(execFile);
const origin = 'https://dentvitalis.com:2083';
const token = 'fixture-only-secret-not-a-real-token';
const valid = () => ({
  cpanelresult: {
    module: 'Fileman',
    func: 'statfiles',
    event: { result: 1 },
    data: [
      { file: 'index.php', type: 'file', exists: 1, size: '512' },
      { file: '.htaccess', type: 'file', exists: 1, size: '5129' },
    ],
  },
});
const response = (payload = valid()) =>
  new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
const probe = (fetchImpl, overrides = {}) =>
  probeCpanelReadOnly({
    approved: true,
    origin,
    token,
    tlsSetting: undefined,
    fetchImpl,
    ...overrides,
  });

test('one fixed metadata-only GET; no file contents, private paths, write calls or credential output', async () => {
  let count = 0;
  const result = await probe(async (url, options) => {
    count++;
    assert.equal(url.origin, origin);
    assert.equal(url.pathname, '/json-api/cpanel');
    assert.equal(url.searchParams.get('cpanel_jsonapi_func'), 'statfiles');
    assert.equal(url.searchParams.get('cpanel_jsonapi_module'), 'Fileman');
    assert.equal(url.searchParams.get('cpanel_jsonapi_user'), 'dentvita');
    assert.equal(url.searchParams.get('dir'), 'public_html');
    assert.equal(url.searchParams.get('files'), 'index.php|.htaccess');
    assert.equal(options.method, 'GET');
    assert.equal(options.body, undefined);
    assert.equal(options.redirect, 'manual');
    assert.equal(options.headers.Authorization, `cpanel dentvita:${token}`);
    return response();
  });
  assert.equal(count, 1);
  assert.equal(result.authenticatedMetadataReadConfirmed, true);
  assert.equal(result.serverMutationRequested, false);
  assert.equal(result.fileContentsRead, false);
  assert.equal(JSON.stringify(result).includes(token), false);
  assert.ok(result.stillUnverified.includes('activation'));
});

test('no request without approval, valid TLS, token and exact approved origin', async () => {
  let count = 0;
  const fetchImpl = async () => {
    count++;
    return response();
  };
  for (const overrides of [
    { approved: false },
    { token: undefined },
    { token: 'bad\nheader' },
    { tlsSetting: '0' },
    { origin: 'http://dentvitalis.com:2083' },
    { origin: 'https://dentvitalis.com.evil.example:2083' },
    { origin: 'https://user:password@dentvitalis.com:2083' },
    { origin: origin + '/cpsesssecret' },
    { origin: 'https://dentvitalis.com' },
  ])
    await assert.rejects(probe(fetchImpl, overrides));
  assert.equal(count, 0);
});

test('redirect and login HTML fail without following redirects or disclosing bodies', async () => {
  for (const reply of [
    new Response(token, {
      status: 302,
      headers: { Location: 'https://evil.example/' },
    }),
    new Response(token, { headers: { 'Content-Type': 'text/html' } }),
    new Response(token, { status: 403 }),
  ]) {
    let count = 0;
    await assert.rejects(
      probe(async () => {
        count++;
        return reply;
      }),
      (error) => !error.message.includes(token),
    );
    assert.equal(count, 1);
  }
});

test('network errors and API error payloads cannot leak credentials', async () => {
  await assert.rejects(
    probe(async () => {
      throw new Error(token);
    }),
    (error) => !error.message.includes(token),
  );
  for (const payload of [
    { cpanelresult: { error: token, event: { result: 0 } } },
    { cpanelresult: { ...valid().cpanelresult, error: token } },
    { cpanelresult: { ...valid().cpanelresult, event: { result: 0 } } },
  ])
    await assert.rejects(
      probe(async () => response(payload)),
      (error) => !error.message.includes(token),
    );
});

test('oversized, malformed and incomplete responses fail closed', async () => {
  for (const body of ['{', token.repeat(10000)])
    await assert.rejects(
      probe(
        async () =>
          new Response(body, {
            headers: { 'Content-Type': 'application/json' },
          }),
      ),
      (error) => !error.message.includes(token),
    );
  for (const data of [
    [],
    [valid().cpanelresult.data[0]],
    [...valid().cpanelresult.data, valid().cpanelresult.data[0]],
    valid().cpanelresult.data.map((row) => ({ ...row, type: 'link' })),
    valid().cpanelresult.data.map((row) => ({ ...row, size: null })),
    valid().cpanelresult.data.map((row) => ({ ...row, exists: 0 })),
    valid().cpanelresult.data.map((row) => ({ ...row, result: false })),
    valid().cpanelresult.data.map((row) => ({ ...row, reason: token })),
  ])
    await assert.rejects(
      probe(async () =>
        response({
          cpanelresult: { ...valid().cpanelresult, data },
        }),
      ),
    );
});

test('CLI refuses execution without explicit approval before any network request', async () => {
  await assert.rejects(
    run(process.execPath, ['scripts/cpanel-api-probe.mjs'], {
      cwd: resolve(import.meta.dirname, '..'),
      env: {
        ...process.env,
        CPANEL_API_ORIGIN: origin,
        CPANEL_API_TOKEN: token,
      },
    }),
    (error) => {
      assert.match(error.stderr, /Usage after separate approval/);
      assert.equal(error.stdout, '');
      assert.equal(error.stderr.includes(token), false);
      return true;
    },
  );
});
