import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'node:net';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { patchLegacySend } from './legacy-send-delivery-patch.mjs';

const original = await readFile(
  new URL(
    '../reference/cpanel-redacted/2026-10-01/send.phtml',
    import.meta.url,
  ),
  'utf8',
);

test('surgical patch preserves credentials, mapping, test/spam behavior and line endings', () => {
  for (const source of [original, original.replaceAll('\n', '\r\n')]) {
    const updated = patchLegacySend(source);
    for (const line of source
      .split(/\r?\n/)
      .filter((line) =>
        /REDACTED_|'name' =>|form_agreement' =>|setTo\(|\$config\['to'\]|CURLOPT_POSTFIELDS|setFrom\(|setReplyTo\(/.test(
          line,
        ),
      ))
      assert.ok(
        updated.includes(line),
        'Existing mapping/configuration must remain untouched.',
      );
    assert.equal(updated.includes('\r\n'), source.includes('\r\n'));
    assert.throws(() => patchLegacySend(updated), /already present/);
  }
  assert.throws(
    () =>
      patchLegacySend(
        original.replace('$result = $mail->send();', '$result = otherSend();'),
      ),
    /differs/,
  );
});

test('patched real handler detects transport failures using only local SMTP mocks and local CRM', async (t) => {
  const directory = await mkdtemp(
    join(tmpdir(), 'dentvitalis-delivery-fixture-'),
  );
  let crmStatus = 200;
  let crmBody = '{"fixture":"accepted"}';
  let crmDelay = 0;
  const leads = [];
  const crm = createHttpServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const parsed = await new Request('http://127.0.0.1/fixture', {
      method: 'POST',
      headers: request.headers,
      body: Buffer.concat(chunks),
    }).formData();
    leads.push(parsed);
    const status = crmStatus,
      body = crmBody,
      delay = crmDelay;
    setTimeout(() => {
      response.writeHead(status, { 'Content-Type': 'application/json' });
      response.end(body);
    }, delay);
  });
  await new Promise((resolve) => crm.listen(0, '127.0.0.1', resolve));
  const crmPort = crm.address().port;
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const phpPort = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const source = patchLegacySend(original)
    .replaceAll(
      /https?:\/\/(?:test\.)?crm\.dentvitalis\.com\/pub\/v1\/crm\/leads\?key=\[REDACTED_CRM_KEY\]/g,
      `http://127.0.0.1:${crmPort}/fixture`,
    )
    .replace('CURLOPT_TIMEOUT, 30', 'CURLOPT_TIMEOUT, 1');
  assert.doesNotMatch(source, /https?:\/\/[^'\s]*crm\.dentvitalis\.com/);
  await writeFile(join(directory, 'send.phtml'), source);
  await copyFile(
    new URL(
      '../server/application/view/template/form-request-guard.php',
      import.meta.url,
    ),
    join(directory, 'form-request-guard.php'),
  );
  await writeFile(
    join(directory, 'router.php'),
    `<?php
namespace Application\\Mail { class Mail {
  public function __construct($config) {} public function __call($name,$args) {}
  public function send() { header('X-Fixture-Mail-Attempt: 1'); $mode=$_SERVER['HTTP_X_FIXTURE_MAIL']??'true'; if($mode==='throw') throw new \\RuntimeException('fixture'); return $mode!=='false'; }
} }
namespace { $view=new class {
  public $form; public function isPost(){return $_SERVER['REQUEST_METHOD']==='POST';}
  public function setTerminal($v){} public function log($a,$b){} public function translate($s){return $s;}
  public function getCsrf(){return 'fixture-csrf';} public function getGct(){return 'fixture-gct';}
  public function getApplication(){return new class{public function setLocale($v){}};} public function setLang($v){}
  public function config($key){return $key==='mail'?['to'=>['it'=>'fixture@example.invalid'],'from'=>'fixture@example.invalid','test'=>'fixture@example.invalid']:'production';}
  public function resolve($v){return '';} public function renderFile($v){return '<p>fixture</p>';}
  public function run(){include __DIR__.'/send.phtml';}
}; $view->run(); }
`,
  );
  const php = spawn(
    'php',
    [
      '-d',
      'display_errors=0',
      '-d',
      'upload_max_filesize=16M',
      '-d',
      'post_max_size=20M',
      '-S',
      `127.0.0.1:${phpPort}`,
      join(directory, 'router.php'),
    ],
    { stdio: 'ignore', env: { ...process.env, XDEBUG_MODE: 'off' } },
  );
  t.after(async () => {
    php.kill();
    if (php.exitCode === null)
      await new Promise((resolve) => php.once('exit', resolve));
    crm.closeAllConnections();
    await new Promise((resolve) => crm.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  const origin = `http://127.0.0.1:${phpPort}`;
  for (let attempt = 0; ; attempt++) {
    try {
      await fetch(origin);
      break;
    } catch (error) {
      if (attempt === 30) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  async function send(mail = 'true', overrides = {}, attachment = false) {
    const body = new FormData();
    for (const [name, value] of Object.entries({
      name: 'QA Person',
      email: 'fixture@example.invalid',
      phone: '0000',
      message: 'fixture',
      lang: 'sl',
      url: 'https://www.dentvitalis.com/si',
      pos: 'home_popup',
      action: '',
      csrf: 'fixture-csrf',
      gct: 'fixture-gct',
      form_agreement: '1',
      ...overrides,
    }))
      body.set(name, value);
    if (attachment)
      body.set(
        'file',
        new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }),
        'fixture.pdf',
      );
    const response = await fetch(origin + '/send', {
      method: 'POST',
      headers: { 'X-Fixture-Mail': mail },
      body,
    });
    return {
      status: response.status,
      body: await response.json(),
      mailAttempt: response.headers.get('x-fixture-mail-attempt'),
    };
  }
  assert.equal((await send()).body.status, 'ok');
  assert.deepEqual([...leads.at(-1).keys()].sort(), [
    'action',
    'email',
    'form_agreement',
    'lang',
    'message',
    'name',
    'phone',
  ]);
  assert.equal(leads.at(-1).get('lang'), 'sl');
  for (const mail of ['false', 'throw']) {
    const before = leads.length;
    const response = await send(mail);
    assert.equal(response.status, 503);
    assert.equal(response.body.code, 'delivery_unconfirmed');
    assert.equal(
      leads.length,
      before + 1,
      'Still attempt CRM after email failure.',
    );
  }
  for (const status of [302, 400, 500]) {
    crmStatus = status;
    const response = await send();
    assert.equal(response.status, 503);
    assert.equal(response.body.status, 'error');
  }
  crmStatus = 200;
  crmDelay = 1500;
  assert.equal(
    (await send()).status,
    503,
    'A timeout is not confirmed delivery.',
  );
  crmDelay = 0;
  crmBody = '{"fixture":"accepted"}';
  assert.equal((await send('true', {}, true)).status, 200);
  assert.equal(leads.at(-1).get('file').name, 'fixture.pdf');
  for (const overrides of [
    { email: 'test@example.com' },
    { name: 'aBcDeFgH' },
  ]) {
    const before = leads.length;
    assert.equal((await send('true', overrides)).body.status, 'ok');
    assert.equal(
      leads.length,
      before,
      'Keep deliberate legacy test/spam CRM bypass.',
    );
  }
  const before = leads.length;
  const rejected = await send('true', { csrf: 'wrong' });
  assert.equal(rejected.body.status, 'error');
  assert.equal(rejected.mailAttempt, null);
  assert.equal(leads.length, before);
  // No claim is made about the real CRM's undocumented business response or inbox receipt.
});
