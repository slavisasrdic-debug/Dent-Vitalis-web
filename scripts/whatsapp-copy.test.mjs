import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { widgetText } from './extract-whatsapp-copy.mjs';

test('new owner widget IDs, languages, contact and exact translations are complete', async () => {
  const { locales } = JSON.parse(
    await readFile('data/whatsapp-copy-20261004.json', 'utf8'),
  );
  const ids = {
    it: '97dc04b8-23e7-4eef-8c47-449554cf098f',
    hr: 'dbe233ee-6fca-45db-81da-30ab0413a3b6',
    de: '72199004-e373-4537-9de3-0fa41d4e27ea',
    en: '47c668f9-630d-4579-9ff0-0ae419db8879',
    sl: 'c0e50881-1c15-433d-a012-18c1b3d36fcb',
  };
  const messages = {
    it: "Buongiorno!\nSono Jelena,\nposso esserti d'aiuto?",
    hr: 'Dobar dan, kako vam mogu pomoći?\n\nJelena',
    de: 'Hallo, wie kann ich Ihnen helfen?\n\nJelena',
    en: 'Hello, how can I help you?\n\nJelena',
    sl: 'Pozdravljeni, kako vam lahko pomagam?\n\nJelena',
  };
  assert.deepEqual(Object.keys(locales).sort(), Object.keys(ids).sort());
  for (const [lang, widgetId] of Object.entries(ids)) {
    assert.equal(locales[lang].widgetId, widgetId);
    assert.equal(locales[lang].widgetLanguage.split('-')[0], lang);
    assert.equal(locales[lang].phone, '385911100523');
    assert.match(locales[lang].responseSha256, /^[a-f0-9]{64}$/);
    assert.equal(locales[lang].message, messages[lang]);
    assert.ok(!/<[^>]+>/.test(locales[lang].message));
  }
});

test('public markup extraction preserves paragraphs and rejects active content', () => {
  assert.equal(widgetText('<div>Hello<br><br>Jelena</div>'), 'Hello\n\nJelena');
  assert.equal(widgetText('<div>A &amp; B</div>'), 'A & B');
  assert.throws(() => widgetText('<script>alert(1)</script>'));
  assert.throws(() => widgetText('<img src=x onerror=alert(1)>'));
});
