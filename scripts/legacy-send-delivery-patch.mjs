import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const marker = 'DentVitalis migration delivery patch v1';
const replacements = [
  [
    'if ($this->isPost()) {\n\n',
    `if ($this->isPost()) {

    // ${marker}; never install a redacted replacement handler.
    require __DIR__ . '/form-request-guard.php';
    header('Cache-Control: private, no-store, max-age=0');
    $mailAccepted = false;
    $crmAccepted = false;
    $crmRequired = false;
    $deliveryUnconfirmed = false;

`,
  ],
  [
    '            $result = $mail->send();',
    `            $crmRequired = ($spamMode === false && $testMode === false);
            try {
                $result = $mail->send();
                $mailAccepted = ($result === true);
            } catch (\\Throwable $e) {
                $result = false;
                $mailAccepted = false;
            }`,
  ],
  [
    '                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);',
    `                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);`,
  ],
  [
    `                        if (!$result = curl_exec($ch)) {
                            $result = 'Curl error: ' . curl_error($ch);
                        }`,
    `                        $result = curl_exec($ch);
                        $crmError = curl_errno($ch);
                        $crmHttpStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        // Transport acceptance only; CRM business response still needs verification.
                        $crmAccepted = ($result !== false && $crmError === 0 &&
                            $crmHttpStatus >= 200 && $crmHttpStatus < 300);
                        if ($result === false) {
                            $result = 'CRM transport not confirmed';
                        }`,
  ],
  [
    "    $status = (isset($errors) && !empty($errors)) ? 'error' : 'ok';",
    `    if (empty($errors) && (!$mailAccepted || ($crmRequired && !$crmAccepted))) {
        $deliveryUnconfirmed = true;
        $errors['validation'] = $this->translate('Error sending message');
    }

    $status = (isset($errors) && !empty($errors)) ? 'error' : 'ok';`,
  ],
  [
    "    $response = ['status' => $status];",
    `    $response = ['status' => $status];
    if ($deliveryUnconfirmed) {
        http_response_code(503);
        $response['code'] = 'delivery_unconfirmed';
    }`,
  ],
];

export function patchLegacySend(source) {
  if (source.includes(marker))
    throw new Error('Delivery patch is already present.');
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  for (const [before, after] of replacements) {
    const anchor = before.replaceAll('\n', newline);
    const index = source.indexOf(anchor);
    if (index < 0 || source.indexOf(anchor, index + anchor.length) >= 0)
      throw new Error(
        'Legacy source differs from reviewed code; stop for a new review.',
      );
    source =
      source.slice(0, index) +
      after.replaceAll('\n', newline) +
      source.slice(index + anchor.length);
  }
  return source;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [flag, output, ...extra] = process.argv.slice(2);
  if (
    flag !== '--output' ||
    !isAbsolute(output || '') ||
    !output.endsWith('.patch') ||
    extra.length
  )
    throw new Error(
      'Usage: node scripts/legacy-send-delivery-patch.mjs --output /absolute/new.patch',
    );
  const original = await readFile(
    new URL(
      '../reference/cpanel-redacted/2026-10-01/send.phtml',
      import.meta.url,
    ),
    'utf8',
  );
  const updated = patchLegacySend(original);
  const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-delivery-diff-'));
  try {
    const before = join(temporary, 'before.phtml');
    const after = join(temporary, 'after.phtml');
    await writeFile(before, original);
    await writeFile(after, updated);
    await run('php', ['-l', after]);
    let diff;
    try {
      await run('diff', [
        '--unified=0',
        '--label=a/send.phtml',
        '--label=b/send.phtml',
        before,
        after,
      ]);
      throw new Error('Expected a changed handler.');
    } catch (error) {
      if (error.code !== 1 || !error.stdout) throw error;
      diff = error.stdout;
    }
    if (diff.includes('[REDACTED_'))
      throw new Error(
        'Patch contains redacted credential lines; refusing publication.',
      );
    await writeFile(output, diff, { flag: 'wx', mode: 0o644 });
    console.log(
      JSON.stringify({
        output,
        sha256: createHash('sha256').update(diff).digest('hex'),
        phpSyntaxCheckedLocally: true,
        serverModified: false,
      }),
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
