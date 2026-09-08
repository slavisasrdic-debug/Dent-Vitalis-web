"""Extract content-only records; no Webflow markup, classes or runtime in production."""
import json
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString

root = Path(__file__).resolve().parents[1]
source = root / 'source-assets/webflow-export/2026-09-07/extracted/index.html'
soup = BeautifulSoup(source.read_text(), 'html.parser')

def parts(node, strong=False):
    result = []
    for child in node.children:
        if isinstance(child, NavigableString):
            result.append({'text': str(child), 'strong': strong})
        elif child.name == 'br':
            result.append({'break': True})
        else:
            result.extend(parts(child, strong or child.name == 'strong'))
    return result

faqs = [{'question': item.select_one('.accordion-title').get_text(),
         'answer': parts(item.select_one('.accordion-text'))}
        for item in soup.select('.section-faq .accordion-item')]
for faq in faqs:
    for part in faq['answer']:
        if part.get('text') == 'da 249 €': part['text'] = 'da {{singleImplantPrice}} €'
        if part.get('text') == '220 €.': part['text'] = '{{crownPrice}} €.'
(root / 'src/content/faq-it.json').write_text(json.dumps(faqs, ensure_ascii=False, indent=2) + '\n')

def link(anchor):
    href = anchor.get('href', '')
    if href.endswith('.html'):
        href = '/' if href == 'index.html' else '/' + href[:-5]
    return dict(label=anchor.get_text(strip=True), href=href)

groups = []
for item in soup.select('.footer-block')[:7]:
    title = item.select_one('.title-small')
    groups.append(dict(title=title.get_text(strip=True),
                       href=link(title.parent)['href'] if title.parent.name == 'a' else None,
                       legal=bool(item.select_one('nav')),
                       links=[link(anchor) for anchor in item.select('a.footer-link-2, a.dv-footer-legal-link')]))
(root / 'src/content/footer-it.json').write_text(json.dumps(groups, ensure_ascii=False, indent=2) + '\n')
print(f'Extracted {len(faqs)} FAQ answers and {len(groups)} footer groups verbatim.')
