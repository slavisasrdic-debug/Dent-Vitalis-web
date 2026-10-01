import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
const run = promisify(execFile);
const template = new URL(
  '../server/application/view/template/form-tokens.phtml',
  import.meta.url,
).pathname;

async function response(server, csrf = 'session-csrf', gct = 'session-gct') {
  const code = `$_SERVER=json_decode($argv[1],true); $fixture=new class {
 public function setTerminal($value){} public function getCsrf(){return $GLOBALS['csrf'];}
 public function getGct(){return $GLOBALS['gct'];} public function run($file){include $file;}
 }; $GLOBALS['csrf']=$argv[3];$GLOBALS['gct']=$argv[4];ob_start();$fixture->run($argv[2]);$body=ob_get_clean();echo json_encode(['status'=>http_response_code()?:200,'body'=>json_decode($body,true)]);`;
  const { stdout } = await run('php', [
    '-r',
    code,
    JSON.stringify(server),
    template,
    csrf,
    gct,
  ]);
  return JSON.parse(stdout);
}
test('tokens endpoint returns the existing session tokens and refuses unsafe requests', async () => {
  const valid = await response({
    REQUEST_METHOD: 'GET',
    HTTP_SEC_FETCH_SITE: 'same-origin',
    HTTP_ORIGIN: 'https://www.dentvitalis.com',
  });
  assert.deepEqual(valid, {
    status: 200,
    body: { csrf: 'session-csrf', gct: 'session-gct' },
  });
  for (const method of ['POST', 'PUT', 'DELETE'])
    assert.equal((await response({ REQUEST_METHOD: method })).status, 405);
  assert.equal(
    (
      await response({
        REQUEST_METHOD: 'GET',
        HTTP_SEC_FETCH_SITE: 'cross-site',
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await response({
        REQUEST_METHOD: 'GET',
        HTTP_ORIGIN: 'https://evil.example',
      })
    ).status,
    403,
  );
  assert.equal(
    (await response({ REQUEST_METHOD: 'GET' }, '', 'gct')).status,
    503,
  );
});
