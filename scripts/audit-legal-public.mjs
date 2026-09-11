import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

// Read-only public-source intake. Existing snapshots are never overwritten.
const directory = 'reference/legal-public/2026-09-11';
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const result = [];
try {
  for (const route of [
    '/informativa-sulla-privacy',
    '/hr/polica-privatnosti',
    '/condizioni-di-utilizzo',
    '/hr/uvjeti-koristenja',
  ]) {
    const file = `${directory}/${route.slice(1).replaceAll('/', '-')}.html`;
    const url = `https://www.dentvitalis.com${route}`;
    if (!existsSync(file)) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      writeFileSync(file, Buffer.from(await response.arrayBuffer()));
    }
    const html = readFileSync(file, 'utf8');
    const data = await page.evaluate(
      ({ html, route }) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const heading = [...doc.querySelectorAll('h1,h2')].find((e) =>
          e.closest('.dent_mdl'),
        );
        if (!heading) throw new Error('Missing legal article');
        const root = heading.closest('.dent_mdl');
        function inline(nodes) {
          return [...nodes].flatMap((n) => {
            if (n.nodeType === 3)
              return [{ kind: 'text', text: n.textContent }];
            if (
              n.nodeType !== 1 ||
              ['SCRIPT', 'STYLE', 'IFRAME', 'FORM'].includes(n.tagName)
            )
              return [];
            if (n.tagName === 'BR') return [{ kind: 'break' }];
            const children = inline(n.childNodes);
            if (n.tagName === 'A') {
              const href = n.getAttribute('href');
              if (!href) return children;
              return [{ kind: 'link', href, children }];
            }
            if (['B', 'STRONG', 'I', 'EM'].includes(n.tagName))
              return [
                {
                  kind: ['B', 'STRONG'].includes(n.tagName) ? 'strong' : 'em',
                  children,
                },
              ];
            return children;
          });
        }
        function blocksFrom(parent) {
          const blocks = [];
          let pending = [];
          const flush = () => {
            if (pending.some((n) => n.textContent.trim()))
              blocks.push({
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
              blocks.push({
                type: 'list',
                ordered: node.tagName === 'OL',
                ...(node.getAttribute('type') === 'a'
                  ? { listStyle: 'lower-alpha' }
                  : {}),
                items: [...node.children]
                  .filter((n) => n.tagName === 'LI')
                  .map((item) => {
                    const blocks = blocksFrom(item);
                    const first = blocks[0];
                    if (
                      first?.type === 'paragraph' &&
                      first.content.some((n) => n.kind === 'strong') &&
                      first.content.every(
                        (n) =>
                          n.kind === 'strong' ||
                          (n.kind === 'text' && !n.text.trim()),
                      )
                    )
                      blocks[0] = {
                        ...first,
                        type: 'heading',
                        rank: 4,
                        variant: 'subsection',
                        flush: false,
                      };
                    return blocks;
                  }),
              });
            } else if (
              node.matches(
                '.question,.policy-title,.policy-section-title,h2,h3,h4,h5,h6',
              )
            ) {
              flush();
              blocks.push({
                type: 'heading',
                rank: node.matches('.policy-section-title') ? 3 : 2,
                variant: node.matches('.policy-section-title')
                  ? 'subsection'
                  : 'section',
                flush: false,
                content: inline(node.childNodes),
              });
            } else if (['P', 'DIV', 'SECTION'].includes(node.tagName)) {
              flush();
              // Public rights labels are bold paragraphs within list items.
              if (
                parent.tagName === 'LI' &&
                node.querySelector('strong,b') &&
                node.textContent.trim() ===
                  node.querySelector('strong,b').textContent.trim()
              )
                blocks.push({
                  type: 'heading',
                  rank: 4,
                  variant: 'subsection',
                  flush: false,
                  content: inline(node.childNodes),
                });
              else blocks.push(...blocksFrom(node));
            } else pending.push(node);
          }
          flush();
          return blocks;
        }
        return {
          route,
          title: heading.textContent.trim(),
          blocks: blocksFrom(root),
        };
      },
      { html, route },
    );
    result.push({
      ...data,
      source: {
        file,
        url,
        sha256: createHash('sha256').update(html).digest('hex'),
        retrievedAt: '2026-09-11',
      },
    });
    console.log(
      `${route}: ${data.blocks.length} blocks; ${result.at(-1).source.sha256}`,
    );
  }
} finally {
  await browser.close();
}
writeFileSync(
  'src/content/legal-public.json',
  JSON.stringify(result, null, 2) + '\n',
);
