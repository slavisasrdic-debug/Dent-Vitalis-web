import assert from 'node:assert/strict';
import test from 'node:test';
import {
  inlineSmallStylesheets,
  stylesheetLimit,
} from './inline-small-stylesheets.mjs';

test('small CSS replaces only its own link, preserving neighboring style and script order', async () => {
  const html =
    '<style>.before{color:red}</style><link rel="stylesheet" href="/_astro/small.abcdefgh.css"><script>init()</script><link rel="stylesheet" href="/_astro/large.abcdefgh.css"><style>.after{color:blue}</style>';
  const result = await inlineSmallStylesheets(html, (path) =>
    Buffer.from(
      path.includes('small')
        ? '.own{color:green}'
        : 'x'.repeat(stylesheetLimit + 1),
    ),
  );
  assert.equal(result.replaced, 1);
  assert.equal(
    result.html,
    html.replace(
      '<link rel="stylesheet" href="/_astro/small.abcdefgh.css">',
      '<style data-inline-css="/_astro/small.abcdefgh.css">.own{color:green}</style>',
    ),
  );
  assert.deepEqual(
    await inlineSmallStylesheets(result.html, () =>
      Buffer.from('x'.repeat(stylesheetLimit + 1)),
    ),
    { html: result.html, replaced: 0 },
  );
});

test('fonts, external CSS, media attributes and unsafe styles are not rewritten', async () => {
  const untouched =
    '<link rel="stylesheet" href="/assets/fonts/montserrat.css"><link rel="stylesheet" href="https://external.test/a.css"><link rel="stylesheet" href="/_astro/print.abcdefgh.css" media="print">';
  assert.deepEqual(
    await inlineSmallStylesheets(untouched, () => {
      throw new Error('Must not read');
    }),
    { html: untouched, replaced: 0 },
  );
  await assert.rejects(
    inlineSmallStylesheets(
      '<link rel="stylesheet" href="/_astro/unsafe.abcdefgh.css">',
      () => Buffer.from('</style><script>bad()</script>'),
    ),
    /Unsafe style terminator/,
  );
});
