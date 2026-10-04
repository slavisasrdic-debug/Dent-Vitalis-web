import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const ids = {
  it: '97dc04b8-23e7-4eef-8c47-449554cf098f',
  hr: 'dbe233ee-6fca-45db-81da-30ab0413a3b6',
  de: '72199004-e373-4537-9de3-0fa41d4e27ea',
  en: '47c668f9-630d-4579-9ff0-0ae419db8879',
  sl: 'c0e50881-1c15-433d-a012-18c1b3d36fcb',
};

// Extract text, never execute widget markup, custom JS or its external SDK.
export function widgetText(html) {
  assert.equal(typeof html, 'string');
  assert.ok(
    !/<(?!\/?div\b|br\b)[^>]+>/i.test(html),
    'Unexpected source markup',
  );
  return html
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/div\s*>/gi, '\n')
    .replace(/<div\s*>/gi, '')
    .replace(
      /&(amp|quot|apos|lt|gt|nbsp);/g,
      (_, entity) =>
        ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' })[
          entity
        ],
    )
    .trim();
}

async function extract() {
  const folder = resolve(root, '.astro/audits/whatsapp-20261004');
  await mkdir(folder, { recursive: true });
  const locales = {};
  for (const [lang, id] of Object.entries(ids)) {
    const url = `https://core.service.elfsight.com/p/boot/?page=${encodeURIComponent('https://www.dentvitalis.com/')}&w=${id}`;
    const cache = resolve(folder, `${lang}.json`);
    let bytes;
    try {
      bytes = await readFile(cache);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      assert.equal(response.status, 200, `${lang}: source HTTP status`);
      bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(cache, bytes, { flag: 'wx' });
    }
    const widget = JSON.parse(bytes).data.widgets[id];
    assert.equal(widget.status, 1);
    assert.equal(widget.data.app, 'whatsapp-chat');
    const settings =
      typeof widget.data.settings === 'string'
        ? JSON.parse(widget.data.settings)
        : widget.data.settings;
    assert.equal(settings.nameCaptionType, 'custom');
    assert.equal(settings.chatMethod, 'sendMessage');
    assert.equal(
      settings.phone,
      '385911100523',
      'Existing approved contact must not silently change',
    );
    assert.equal(settings.language.language.split('-')[0], lang);
    const message = widgetText(settings.welcomeMessage);
    assert.ok(message.includes('Jelena'));
    locales[lang] = {
      widgetId: id,
      sourceUrl: url,
      responseSha256: createHash('sha256').update(bytes).digest('hex'),
      widgetLanguage: settings.language.language,
      phone: settings.phone,
      team: widgetText(settings.name),
      responseTime: widgetText(settings.nameCaptionCustom),
      message,
      sourceButtonText: settings.buttonText,
      sourcePortraitUrl: settings.customPicture?.url ?? null,
    };
  }
  const record = {
    sourceProvidedByOwnerOn: '2026-10-04',
    extractedAt: new Date().toISOString(),
    scope:
      'Exact public name, custom caption and welcome copy; approved native panel, localized CTA and real Jelena portrait retained. No SDK, automatic opening, trackers or inactive reply-time claims imported.',
    locales,
  };
  await writeFile(
    resolve(root, 'data/whatsapp-copy-20261004.json'),
    JSON.stringify(record, null, 2) + '\n',
  );
  console.log(
    'Extracted five owner-supplied public widget configurations; cached raw responses outside Git/build. Approved phone unchanged.',
  );
}

if (process.argv[1] === import.meta.filename) await extract();
