/** Only HTML whitespace may be inserted; markup, copy and executable bytes stay intact. */
const blocks = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'dt',
  'dd',
  'ul',
  'ol',
  'dl',
  'blockquote',
  'figure',
  'figcaption',
  'address',
  'article',
  'section',
  'main',
  'nav',
  'aside',
  'header',
  'footer',
  'details',
  'summary',
  'table',
  'tr',
  'td',
  'th',
  'caption',
]);
const protectedTags = new Set([
  'head',
  'form',
  'pre',
  'code',
  'textarea',
  'svg',
  'math',
  'template',
]);
const rawTags = new Set(['script', 'style', 'textarea', 'title']);
const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
interface ElementState {
  name: string;
  classes: string[];
  boundary: boolean;
}

/** Quote-aware tokenization of our generated HTML, not a regexp over script/JSON bodies. */
export function separateHtmlText(html: string): string {
  const stack: ElementState[] = [];
  const output: string[] = [];
  const separate = () => {
    if (!/[\t\n\f\r ]$/.test(output.at(-1) ?? '')) output.push(' ');
  };
  let offset = 0;
  while (offset < html.length) {
    const start = html.indexOf('<', offset);
    if (start < 0) {
      output.push(html.slice(offset));
      break;
    }
    if (start > offset) output.push(html.slice(offset, start));
    if (html.startsWith('<!--', start)) {
      const end = html.indexOf('-->', start + 4);
      if (end < 0) throw new Error('Unclosed generated HTML comment');
      output.push(html.slice(start, end + 3));
      offset = end + 3;
      continue;
    }
    let quote = '',
      end = start + 1;
    for (; end < html.length; end++) {
      const char = html[end];
      if (quote) {
        if (char === quote) quote = '';
      } else if (char === '"' || char === "'") quote = char;
      else if (char === '>') break;
    }
    if (end === html.length) throw new Error('Unclosed generated HTML tag');
    const token = html.slice(start, end + 1);
    const match = /^<(\/?)\s*([a-z][a-z0-9:-]*)\b/i.exec(token);
    offset = end + 1;
    if (!match) {
      output.push(token);
      continue;
    }
    const name = match[2]!.toLowerCase(),
      closing = Boolean(match[1]);
    // JS/CSS and RCDATA are copied in one piece, including strings that resemble tags.
    if (!closing && rawTags.has(name)) {
      const terminator = new RegExp(`</${name}\\s*>`, 'gi');
      terminator.lastIndex = offset;
      const close = terminator.exec(html);
      if (!close) throw new Error(`Unclosed generated ${name}`);
      output.push(html.slice(start, terminator.lastIndex));
      offset = terminator.lastIndex;
      continue;
    }
    const protectedContext = stack.some((el) => protectedTags.has(el.name));
    const inBody = stack.some((el) => el.name === 'body');
    if (closing) {
      const index = stack.findLastIndex((el) => el.name === name);
      const element = index >= 0 ? stack[index] : undefined;
      output.push(token);
      if (
        inBody &&
        !protectedContext &&
        element?.boundary &&
        !/[\t\n\f\r ]/.test(html[offset] ?? '')
      )
        separate();
      if (index >= 0) stack.length = index;
      continue;
    }
    const classes = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(token);
    const classNames = (classes?.[1] ?? classes?.[2] ?? '').split(/\s+/);
    const footerLink = name === 'a' && stack.some((el) => el.name === 'footer');
    const sidebarItem =
      classNames.includes('item') &&
      stack.some((el) => el.classes.includes('page-sidebar'));
    const contactCell =
      name === 'div' && stack.at(-1)?.classes.includes('contact-row');
    const contentRow =
      name === 'div' &&
      classNames.some((c) => ['content-bullet', 'contact-row'].includes(c));
    const boundary =
      blocks.has(name) ||
      footerLink ||
      sidebarItem ||
      contactCell ||
      contentRow;
    const safe = inBody && !protectedContext && !protectedTags.has(name);
    if (safe && boundary) separate();
    output.push(token);
    if (safe && name === 'br' && !/[\t\n\f\r ]/.test(html[offset] ?? ''))
      separate();
    if (!voidTags.has(name) && !/\/\s*>$/.test(token))
      stack.push({ name, classes: classNames, boundary });
  }
  const result = output.join('');
  // Repeated processing must not grow whitespace (middleware may run again on a rewrite).
  return result;
}
