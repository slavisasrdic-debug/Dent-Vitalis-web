import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const allowedOrigins = new Set([
  'https://dentvitalis.com:2083',
  'https://www.dentvitalis.com:2083',
]);
const requestedFiles = ['index.php', '.htaccess'];
const maximumResponseBytes = 256 * 1024;

// Deliberately not a general API client: there is one fixed metadata-only GET.
// API 2 is used here because its statfiles contract is documented; no write
// capability or UAPI acceptance is inferred from this probe.
export async function probeCpanelReadOnly({
  approved = false,
  origin,
  token,
  tlsSetting = process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (approved !== true)
    throw new Error('Explicit approval for the read-only probe is required.');
  if (tlsSetting === '0')
    throw new Error('TLS verification must not be disabled.');
  if (!allowedOrigins.has(origin))
    throw new Error(
      'Set CPANEL_API_ORIGIN to an approved DentVitalis HTTPS cPanel origin on port 2083.',
    );
  if (typeof token !== 'string' || !/^[!-~]{16,1024}$/.test(token))
    throw new Error(
      'A dedicated protected CPANEL_API_TOKEN is required. Do not paste it into chat.',
    );

  const url = new URL('/json-api/cpanel', origin);
  url.search = new URLSearchParams({
    cpanel_jsonapi_user: 'dentvita',
    cpanel_jsonapi_apiversion: '2',
    cpanel_jsonapi_module: 'Fileman',
    cpanel_jsonapi_func: 'statfiles',
    dir: 'public_html',
    files: requestedFiles.join('|'),
  }).toString();

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        Authorization: `cpanel dentvita:${token}`,
        Accept: 'application/json',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    // Network diagnostics may echo credentials: never propagate raw errors.
    throw new Error(
      'Read-only cPanel request failed: network, timeout or TLS.',
    );
  }
  if (!Number.isInteger(response.status) || response.status !== 200)
    throw new Error(
      'cPanel did not return HTTP 200. Redirects are not followed.',
    );
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      response.headers.get('content-type') ?? '',
    )
  )
    throw new Error(
      'cPanel returned a non-JSON response; no response body is logged.',
    );

  const reader = response.body?.getReader();
  if (!reader) throw new Error('cPanel returned no response body.');
  let payload;
  try {
    const chunks = [];
    let size = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumResponseBytes) {
        await reader.cancel();
        throw new Error('Response too large.');
      }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error(
      'cPanel response is incomplete, oversized or invalid JSON; body is not logged.',
    );
  } finally {
    reader.releaseLock();
  }

  const result = payload?.cpanelresult;
  if (
    result?.module !== 'Fileman' ||
    result?.func !== 'statfiles' ||
    ![1, '1'].includes(result?.event?.result) ||
    result?.error ||
    !Array.isArray(result?.data)
  )
    throw new Error(
      'The metadata API operation was not confirmed; raw API errors are not logged.',
    );

  const files = requestedFiles.map((name) => {
    const matches = result.data.filter((entry) => entry?.file === name);
    const row = matches[0];
    const bytes =
      typeof row?.size === 'string' && /^\d+$/.test(row.size)
        ? Number(row.size)
        : row?.size;
    if (
      matches.length !== 1 ||
      row?.type !== 'file' ||
      ![1, '1'].includes(row?.exists) ||
      [0, '0', false].includes(row?.result) ||
      row?.reason ||
      !Number.isSafeInteger(bytes) ||
      bytes <= 0
    )
      throw new Error(
        'Expected public bootstrap/routing metadata was not confirmed.',
      );
    return { name, type: 'file', bytes };
  });

  return {
    checkedAt: new Date().toISOString(),
    origin,
    account: 'dentvita',
    directory: 'public_html',
    operation: 'cPanel API 2 Fileman::statfiles',
    authenticatedMetadataReadConfirmed: true,
    fileContentsRead: false,
    serverMutationRequested: false,
    files,
    stillUnverified: [
      'UAPI',
      'upload',
      'extraction',
      'backup',
      'activation',
      'rollback',
      'SMTP',
      'CRM',
    ],
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const flags = process.argv.slice(2);
    if (flags.length !== 1 || flags[0] !== '--approved-read-only')
      throw new Error(
        'Usage after separate approval: npm run cpanel:probe:read-only -- --approved-read-only',
      );
    const report = await probeCpanelReadOnly({
      approved: true,
      origin: process.env.CPANEL_API_ORIGIN,
      token: process.env.CPANEL_API_TOKEN,
    });
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
