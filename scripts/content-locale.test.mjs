import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const locales = ['de', 'en', 'sl'];
const expectedTables = Array.from({ length: 29 }, (_, index) => `t${index + 1}`);

function source(locale) {
  return JSON.parse(
    fs.readFileSync(`data/translations/${locale}-source.json`, 'utf8'),
  );
}

test('supplied locale catalogues retain the complete page structure', () => {
  for (const locale of locales) {
    const document = source(locale);
    assert.equal(document.locale, locale);
    assert.match(document.sha256, /^[a-f0-9]{64}$/);
    const tables = new Map(
      document.blocks
        .filter((block) => block.type === 'table')
        .map((block) => [block.id, block]),
    );
    assert.deepEqual([...tables.keys()], expectedTables, locale);
    for (const id of expectedTables) {
      const table = tables.get(id);
      assert.ok(table.rows.length > 0, `${locale}/${id} has no rows`);
      assert.ok(
        table.rows.some((row) => row.some((cell) => cell.some((p) => p.text.trim()))),
        `${locale}/${id} has no translated text`,
      );
    }
  }
});

test('locale page markers are present and non-empty', () => {
  const markers = {
    de: ['p1', 'p4', 'p16', 'p64', 'p92', 'p98', 'p197', 'p212', 'p231'],
    en: ['p1', 'p3', 'p16', 'p67', 'p97', 'p103', 'p222', 'p240', 'p259'],
    sl: ['p1', 'p3', 'p17', 'p66', 'p96', 'p102', 'p222', 'p242', 'p262'],
  };
  for (const [locale, ids] of Object.entries(markers)) {
    const paragraphs = new Map(
      source(locale).blocks
        .filter((block) => block.type === 'paragraph')
        .map((block) => [block.id, block.text.trim()]),
    );
    for (const id of ids) assert.ok(paragraphs.get(id), `${locale}/${id} is empty`);
  }
});
