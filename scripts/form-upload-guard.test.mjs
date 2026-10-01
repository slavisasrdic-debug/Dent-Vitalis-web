import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

test('private PHP patch validates uploads before any legacy delivery is called', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dentvitalis-php-guard-'));
  const template = new URL(
    '../server/application/view/template/form-request-guard.php',
    import.meta.url,
  ).pathname;
  const fixture = join(directory, 'router.php');
  await writeFile(
    fixture,
    `<?php $fixture = new class {
 public function setTerminal($value) {} public function run($template) {require $template;}
 }; $fixture->run(${JSON.stringify(template)}); header('Content-Type: application/json'); echo json_encode(['delegated'=>true]);`,
  );
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const php = spawn(
    'php',
    [
      '-d',
      'upload_max_filesize=16M',
      '-d',
      'post_max_size=20M',
      '-S',
      `127.0.0.1:${port}`,
      fixture,
    ],
    {
      stdio: 'ignore',
    },
  );
  t.after(async () => {
    php.kill();
    await new Promise((resolve) =>
      php.exitCode !== null ? resolve() : php.once('exit', resolve),
    );
    await rm(directory, { recursive: true, force: true });
  });
  const origin = `http://127.0.0.1:${port}`;
  for (let i = 0; ; i++) {
    try {
      await fetch(origin);
      break;
    } catch (e) {
      if (i === 30) throw e;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  async function send(file, overrides = {}) {
    const body = new FormData();
    for (const [name, value] of Object.entries({
      name: 'QA Fixture',
      email: 'qa@example.invalid',
      phone: '0000',
      lang: 'sl',
      url: 'https://www.dentvitalis.com/si',
      ...overrides,
    }))
      body.set(name, value);
    if (file)
      body.set('file', new Blob([file.body], { type: file.type }), file.name);
    const response = await fetch(origin + '/send', { method: 'POST', body });
    return { status: response.status, body: await response.json() };
  }
  assert.deepEqual(await send(), { status: 200, body: { delegated: true } });
  assert.deepEqual(
    await send({
      name: 'test.pdf',
      type: 'application/pdf',
      body: '%PDF-1.4\n%%EOF',
    }),
    { status: 200, body: { delegated: true } },
  );
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3ioAAAAASUVORK5CYII=',
    'base64',
  );
  assert.equal(
    (await send({ name: 'test.png', type: 'image/png', body: png })).status,
    200,
  );
  for (const file of [
    { name: 'fake.jpg', type: 'image/jpeg', body: 'not an image' },
    { name: 'test.php', type: 'application/pdf', body: '%PDF-1.4\n%%EOF' },
  ])
    assert.deepEqual((await send(file)).body, {
      status: 'error',
      code: 'invalid_file',
    });
  assert.deepEqual(
    (
      await send({
        name: 'oversized.pdf',
        type: 'application/pdf',
        body: Buffer.alloc(8388609),
      })
    ).body,
    { status: 'error', code: 'file_too_large' },
  );
  for (const overrides of [
    { email: '' },
    { lang: 'si' },
    { url: 'https://evil.example' },
    { 'email[]': 'bad' },
  ])
    assert.equal((await send(null, overrides)).status, 400);
});
