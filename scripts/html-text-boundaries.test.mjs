import assert from 'node:assert/strict';
import test from 'node:test';
import { separateHtmlText } from '../src/lib/html-text-boundaries.ts';
const body = (html) =>
  `<html><head><title>Title</title></head><body>${html}</body></html>`;
test('paragraphs, headings, list items and explicit line breaks have text boundaries', () => {
  const result = separateHtmlText(
    body(
      '<h1>Heading</h1><p>First<br>Second</p><ul><li>One</li><li>Two</li></ul>',
    ),
  );
  assert.match(result, /Heading<\/h1>\s+<p/);
  assert.match(result, /First<br>\s+Second/);
  assert.match(result, /One<\/li>\s+<li/);
  assert.equal(separateHtmlText(result), result);
});
test('footer block links, sidebar items and contact cells are separated', () => {
  const result = separateHtmlText(
    body(
      '<footer><a href="tel:1">380</a><a href="mailto:x">it@example.com</a></footer><div class="contact-row"><div>Name</div><div>Value</div></div><aside class="page-sidebar"><a class="item">One</a><a class="item">Two</a></aside>',
    ),
  );
  assert.match(result, /380<\/a>\s+<a/);
  assert.match(result, /Name<\/div>\s+<div/);
  assert.match(result, /One<\/a>\s+<a/);
});
test('inline words, punctuation, qualifications and superscript are not split', () => {
  const html = body(
    '<p>im<strong>plan</strong>ti, <a>link</a>.<sup>2</sup></p>',
  );
  assert.ok(
    separateHtmlText(html).includes(
      'im<strong>plan</strong>ti, <a>link</a>.<sup>2</sup>',
    ),
  );
});
test('all attributes, comments, code, styles, JSON-LD, forms and foreign markup stay byte-identical', () => {
  const protectedChunks = [
    '<script>const s="<p>x</p>";</script>',
    '<script type="application/ld+json">{"description":"<p>Literal</p>"}</script>',
    '<style>p::after{content:"<p>"}</style>',
    '<form><p>Label<br>Text</p><textarea>One\nTwo</textarea></form>',
    '<pre><code>A\nB<br> C</code></pre>',
    '<svg><text>A</text><text>B</text></svg>',
    '<!-- <p>comment</p> -->',
  ];
  const html = body('<p title="a > b">Copy</p>' + protectedChunks.join(''));
  const result = separateHtmlText(html);
  for (const chunk of protectedChunks) assert.ok(result.includes(chunk), chunk);
  assert.ok(result.includes('<p title="a > b">Copy</p>'));
  assert.equal(result.replace(/\s/g, ''), html.replace(/\s/g, ''));
});
