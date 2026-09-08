import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  copyFile,
  symlink,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { test } from 'node:test';

const run = promisify(execFile);
const startupScript = new URL('./ensure-preview.sh', import.meta.url);

// Isolated CLI fixtures: no real ports, network requests or GitHub mutations.
const mockCli = `#!/usr/bin/env node
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.env.DENTVITALIS_PREVIEW_TEST_ROOT;
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
const statePath = join(root, 'state.json');
const state = JSON.parse(readFileSync(statePath, 'utf8'));
appendFileSync(join(root, 'calls.jsonl'), JSON.stringify({ command, args }) + '\\n');
const save = () => writeFileSync(statePath, JSON.stringify(state));
switch (command) {
  case 'ss':
    if (args.at(-1).includes(':4321') && state.listening) {
      console.log('LISTEN 0 511 0.0.0.0:4321 0.0.0.0:*');
    }
    break;
  case 'curl': {
    const external = args.at(-1).startsWith('https:');
    const ready = state.listening && !state.wrongLocal && !(external && state.wrongExternal);
    writeFileSync(args[args.indexOf('--output') + 1], ready
      ? '<title>DentVitalis - migliori dentisti in Croazia</title><meta name="robots" content="noindex, nofollow">'
      : '<title>Another application</title>');
    process.stdout.write(ready ? '200' : '503');
    break;
  }
  case 'npm':
    state.listening = true;
    save();
    break;
  case 'timeout': {
    const result = spawnSync(args[1], args.slice(2), { stdio: 'inherit' });
    process.exit(result.status ?? 1);
    break;
  }
  case 'gh':
    if (state.authError) process.exit(1);
    if (args[2] === 'forward') {
      state.registered = true;
      save();
    } else if (args[2] === 'visibility') {
      state.public = true;
      save();
    } else {
      console.log(JSON.stringify(state.registered ? [{ sourcePort: 4321,
        visibility: state.public ? 'public' : 'private',
        browseUrl: 'https://preview-test-4321.app.github.dev' }] : []));
    }
    break;
  case 'sleep':
    break;
  default:
    process.exit(1);
}
`;

async function fixture(t, overrides = {}, codespaces = true) {
  const root = await mkdtemp(join(tmpdir(), 'dentvitalis-preview-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ['scripts', 'node_modules/astro', 'bin']) {
    await mkdir(join(root, directory), { recursive: true });
  }
  await copyFile(startupScript, join(root, 'scripts/ensure-preview.sh'));
  await writeFile(join(root, 'node_modules/astro/package.json'), '{}');
  await writeFile(
    join(root, 'state.json'),
    JSON.stringify({
      listening: true,
      registered: true,
      public: true,
      ...overrides,
    }),
  );
  await writeFile(join(root, 'bin/mock.mjs'), mockCli, { mode: 0o755 });
  for (const command of ['ss', 'curl', 'npm', 'timeout', 'gh', 'sleep']) {
    await symlink('mock.mjs', join(root, 'bin', command));
  }
  return {
    run: () =>
      run('bash', [join(root, 'scripts/ensure-preview.sh')], {
        env: {
          ...process.env,
          PATH: join(root, 'bin') + ':' + process.env.PATH,
          CODESPACES: String(codespaces),
          CODESPACE_NAME: 'preview-test',
          GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: 'app.github.dev',
          DENTVITALIS_PREVIEW_TEST_ROOT: root,
        },
        timeout: 15000,
      }),
    calls: async () =>
      (await readFile(join(root, 'calls.jsonl'), 'utf8'))
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line)),
  };
}

test('healthy preview is idempotent even with overlapping start/attach hooks', async (t) => {
  const f = await fixture(t);
  const results = await Promise.all([f.run(), f.run()]);
  for (const result of results)
    assert.match(result.stdout, /Public DentVitalis HTTP 200/);
  const calls = await f.calls();
  assert.equal(calls.filter((c) => c.command === 'npm').length, 0);
  assert.equal(
    calls.filter(
      (c) =>
        c.command === 'gh' && ['forward', 'visibility'].includes(c.args[2]),
    ).length,
    0,
  );
});

test('cold startup starts one server and publishes only approved port 4321', async (t) => {
  const f = await fixture(t, {
    listening: false,
    registered: false,
    public: false,
  });
  assert.match((await f.run()).stdout, /Public DentVitalis HTTP 200/);
  assert.match((await f.run()).stdout, /Public DentVitalis HTTP 200/);
  const calls = await f.calls();
  assert.deepEqual(
    calls.filter((c) => c.command === 'npm').map((c) => c.args),
    [['run', 'dev', '--', '--host', '0.0.0.0', '--port', '4321']],
  );
  assert.deepEqual(
    calls
      .filter((c) => c.command === 'gh' && c.args[2] === 'visibility')
      .map((c) => c.args[3]),
    ['4321:public'],
  );
  assert.deepEqual(
    calls
      .filter((c) => c.command === 'gh' && c.args[2] === 'forward')
      .map((c) => c.args[3]),
    ['4321:14321'],
  );
});

test('outside Codespaces, startup never contacts GitHub', async (t) => {
  const f = await fixture(t, {}, false);
  assert.match((await f.run()).stdout, /public forwarding skipped/);
  assert.equal((await f.calls()).filter((c) => c.command === 'gh').length, 0);
});

test('an unrelated listener is not replaced or exposed publicly', async (t) => {
  const f = await fixture(t, { wrongLocal: true });
  await assert.rejects(f.run(), (error) => {
    assert.match(
      error.stderr,
      /No process was killed and no alternate port was started/,
    );
    return true;
  });
  assert.equal(
    (await f.calls()).filter((c) => ['npm', 'gh'].includes(c.command)).length,
    0,
  );
});

test('missing GitHub access does not report a successful public preview', async (t) => {
  const f = await fixture(t, { authError: true });
  await assert.rejects(f.run(), (error) => {
    assert.match(error.stderr, /Cannot list Codespaces ports/);
    assert.doesNotMatch(error.stdout, /Public DentVitalis HTTP 200/);
    return true;
  });
});

test('public visibility is not sufficient without the actual homepage', async (t) => {
  const f = await fixture(t, { wrongExternal: true });
  await assert.rejects(f.run(), (error) => {
    assert.match(error.stderr, /external URL is not serving the DentVitalis/);
    assert.doesNotMatch(error.stdout, /Public DentVitalis HTTP 200/);
    return true;
  });
});

test('start/attach share one script and only 4321 is forwarded by the IDE', async () => {
  const config = JSON.parse(
    await readFile(
      new URL('../.devcontainer/devcontainer.json', import.meta.url),
      'utf8',
    ),
  );
  assert.deepEqual(config.forwardPorts, [4321]);
  assert.match(config.postStartCommand, /bash scripts\/ensure-preview\.sh/);
  assert.equal(config.postAttachCommand, 'bash scripts/ensure-preview.sh');
  assert.equal(config.portsAttributes['14321'].onAutoForward, 'ignore');
});
