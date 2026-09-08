import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

// Inert DOM parsing only: never navigate to or execute the old site's forms/scripts.
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pages = [];
try {
  for (const slug of ['polica-privatnosti', 'uvjeti-koristenja']) {
    const file = `reference/legal-hr/2026-09-08/${slug}.html`;
    const html = readFileSync(file, 'utf8');
    const data = await page.evaluate(
      ({ html, slug }) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const heading = [...doc.querySelectorAll('h1,h2')].find((e) =>
          e.closest('.dent_mdl'),
        );
        const root = heading?.closest('.dent_mdl');
        if (!root || !heading) throw new Error('Legal source missing');
        function inline(nodes) {
          return [...nodes].flatMap((n) => {
            if (n.nodeType === 3)
              return [{ kind: 'text', text: n.textContent }];
            if (n.nodeType !== 1) return [];
            if (n.tagName === 'BR') return [{ kind: 'break' }];
            if (['SCRIPT', 'STYLE', 'IFRAME', 'FORM'].includes(n.tagName))
              return [];
            const children = inline(n.childNodes);
            if (['B', 'STRONG', 'EM', 'I'].includes(n.tagName))
              return [
                {
                  kind: ['B', 'STRONG'].includes(n.tagName) ? 'strong' : 'em',
                  children,
                },
              ];
            if (n.tagName === 'A' && n.getAttribute('href'))
              return [
                {
                  kind: 'link',
                  href: new URL(
                    n.getAttribute('href'),
                    `https://www.dentvitalis.com/hr/${slug}`,
                  ).href,
                  children,
                },
              ];
            return children;
          });
        }
        function blocksFrom(parent) {
          const result = [];
          let pending = [];
          const flush = () => {
            if (pending.some((n) => n.textContent.trim()))
              result.push({
                type: 'paragraph',
                variant: 'body',
                content: inline(pending),
              });
            pending = [];
          };
          for (const node of parent.childNodes) {
            if (node === heading) continue;
            if (node.nodeType !== 1) {
              pending.push(node);
              continue;
            }
            if (['SCRIPT', 'STYLE', 'IFRAME', 'FORM'].includes(node.tagName))
              continue;
            if (['UL', 'OL'].includes(node.tagName)) {
              flush();
              result.push({
                type: 'list',
                ordered: node.tagName === 'OL',
                items: [...node.children]
                  .filter((n) => n.tagName === 'LI')
                  .map(blocksFrom),
              });
            } else if (/^H[2-6]$/.test(node.tagName)) {
              flush();
              result.push({
                type: 'heading',
                rank: 2,
                variant: 'subsection',
                flush: false,
                content: inline(node.childNodes),
              });
            } else if (['P', 'DIV', 'SECTION'].includes(node.tagName)) {
              flush();
              result.push(...blocksFrom(node));
            } else pending.push(node);
          }
          flush();
          return result;
        }
        const blocks = blocksFrom(root);
        return {
          route: `/hr/${slug}`,
          title: heading.textContent.trim(),
          blocks,
          sourceText: root.textContent.trim(),
        };
      },
      { html, slug },
    );
    pages.push({
      ...data,
      source: {
        file,
        sha256: createHash('sha256').update(html).digest('hex'),
        url: `https://www.dentvitalis.com/hr/${slug}`,
        retrievedAt: '2026-09-08',
        approval: 'review',
      },
    });
  }
} finally {
  await browser.close();
}
writeFileSync(
  'src/content/hr/legal.json',
  JSON.stringify(pages, null, 2) + '\n',
);
console.log(
  `Extracted ${pages.length} approved HR legal pages (${pages.map((p) => p.blocks.length).join('/')} blocks).`,
);
