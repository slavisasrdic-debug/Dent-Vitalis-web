"""Offline source comparison; no supplied HTML or JavaScript is executed.

Requires Python beautifulsoup4 and tinycss2 (versions recorded in the output),
plus the existing Node install (Acorn). Sources remain byte-for-byte immutable.
Prints JSON to stdout; the caller can save the generated audit artifact.
"""

from collections import Counter, defaultdict
import csv
from difflib import SequenceMatcher
import hashlib
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlparse

import bs4
from bs4 import BeautifulSoup
import tinycss2

ROOT = Path(__file__).resolve().parents[1]
HANDOFF = ROOT / 'reference/webflow-handoff/2026-09-07/extracted'
EXPORT = ROOT / 'source-assets/webflow-export/2026-09-07/extracted'


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def normalized_text(value):
    return re.sub(r'\s+', ' ', value).strip()


def asset_name(value):
    name = unquote(urlparse(value).path).rsplit('/', 1)[-1]
    name = re.sub(r'^[0-9a-f]{24}_', '', name)
    return name.replace(' ', '-').replace('(', '').replace(')', '')


def text_nodes(soup):
    return [str(node) for node in soup.body.find_all(string=True)
            if not isinstance(node, bs4.Comment)
            and node.parent.name not in ('script', 'style') and str(node).strip()]


def blocks(soup, tag):
    return [node.get_text().replace('\r\n', '\n').strip()
            for node in soup.find_all(tag)
            if not node.get('src') and node.get_text().strip()]


def diff_items(left, right, limit=8):
    result = []
    for operation, a, b, c, d in SequenceMatcher(None, left, right, autojunk=False).get_opcodes():
        if operation != 'equal':
            result.append({'operation': operation, 'handoff': left[a:b], 'export': right[c:d]})
    return {'changedGroups': len(result), 'examples': result[:limit]}


def css_rules(css):
    result = []

    def canonical(tokens):
        text = tinycss2.serialize(tokens)
        text = re.sub(r'url\(([^)]*)\)', lambda m: m[0] if m[1].strip('"\'').startswith('data:') else 'url(' + asset_name(m[1].strip('"\'')) + ')', text)
        return normalized_text(text)

    def visit(nodes, conditions=()):
        for node in nodes:
            if node.type == 'qualified-rule':
                declarations = tinycss2.parse_declaration_list(node.content, skip_comments=True, skip_whitespace=True)
                result.append((conditions, canonical(node.prelude), tuple(
                    (d.lower_name, canonical(d.value), d.important)
                    for d in declarations if d.type == 'declaration')))
            elif node.type == 'at-rule' and node.content:
                condition = '@' + node.lower_at_keyword + ' ' + canonical(node.prelude)
                if node.lower_at_keyword in ('media', 'supports', 'layer', 'keyframes', '-webkit-keyframes'):
                    visit(tinycss2.parse_rule_list(node.content, skip_comments=True, skip_whitespace=True), conditions + (condition,))
                else:
                    result.append((conditions, condition, canonical(node.content)))

    visit(tinycss2.parse_stylesheet(css, skip_comments=True, skip_whitespace=True))
    return result


def compare():
    pages = read_json(HANDOFF / 'pages.json')['pages']
    native_content = read_json(HANDOFF / 'content/it.json')
    export_pages = {}
    for file in EXPORT.rglob('*.html'):
        soup = BeautifulSoup(file.read_text(), 'html.parser')
        export_pages[soup.html.get('data-wf-page')] = (file, soup)
    page_results = []
    script_pairs = []
    missing_local = set()
    external_assets = set()
    for page in pages:
        page_id = page['metadata']['id']
        source_file = HANDOFF / page['publishedHtmlRef']
        source = BeautifulSoup(source_file.read_text(), 'html.parser')
        if page_id not in export_pages:
            page_results.append({'pageId': page_id, 'missingFromExport': True})
            continue
        export_file, target = export_pages[page_id]
        texts = [text_nodes(soup) for soup in (source, target)]
        normalized = [[normalized_text(t) for t in items] for items in texts]
        headings = [[(h.name, normalized_text(h.get_text())) for h in soup.find_all(re.compile('^h[1-6]$'))]
                    for soup in (source, target)]
        scripts = [blocks(soup, 'script') for soup in (source, target)]
        script_pairs.append({'path':page['metadata']['publishedPath'], 'handoff':scripts[0], 'exported':scripts[1]})
        styles = [blocks(soup, 'style') for soup in (source, target)]
        parsed_styles = [[css_rules(style) for style in items] for items in styles]
        attrs = {}
        for tag, attribute in [('img', 'src'), ('img', 'alt'), ('source', 'src'), ('video', 'poster'), ('a', 'href')]:
            vals = [[n.get(attribute, '') for n in soup.find_all(tag)] for soup in (source, target)]
            if vals[0] != vals[1]:
                attrs[tag + '.' + attribute] = diff_items(*vals, limit=4)
        metadata = []
        for soup in (source, target):
            metadata.append({
                'title': soup.title.get_text() if soup.title else None,
                'meta': sorted((n.get('name', n.get('property','')), n.get('content','')) for n in soup.select('meta[name],meta[property]')),
                'canonical': [n.get('href') for n in soup.select('link[rel=canonical]')],
                'hreflang': [(n.get('hreflang'), n.get('href')) for n in soup.select('link[hreflang]')],
            })
        for node in target.find_all(['img', 'source', 'video', 'script', 'link']):
            values = [node.get(a, '') for a in ('src', 'poster')]
            if node.name == 'link': values.append(node.get('href',''))
            if node.get('srcset'): values.extend(x.strip().split(' ')[0] for x in node['srcset'].split(','))
            for value in values:
                if not value or value.startswith(('data:', '#')): continue
                parsed = urlparse(value)
                if parsed.netloc:
                    external_assets.add(value)
                elif parsed.path:
                    local = (export_file.parent / unquote(parsed.path)).resolve()
                    if not local.is_file(): missing_local.add(str(local.relative_to(EXPORT)) if local.is_relative_to(EXPORT) else value)
        page_results.append({
            'pageId': page_id, 'path': page['metadata']['publishedPath'],
            'handoffFile': page['publishedHtmlRef'], 'exportFile': export_file.relative_to(EXPORT).as_posix(),
            'handoffLang': source.html.get('lang'), 'exportLang': target.html.get('lang'),
            'sameSiteId': source.html.get('data-wf-site') == target.html.get('data-wf-site'),
            'sameExactTextNodes': texts[0] == texts[1], 'sameWhitespaceNormalizedText': normalized[0] == normalized[1],
            'nbspCounts': [sum(text.count('\u00a0') for text in items) for items in texts],
            'textDiff': diff_items(*normalized), 'sameHeadings': headings[0] == headings[1],
            'sameMetadata': metadata[0] == metadata[1], 'metadata': metadata if metadata[0] != metadata[1] else None,
            'inlineScripts': {'handoffCount': len(scripts[0]), 'exportCount': len(scripts[1]), 'sameOrderedBlocks': scripts[0] == scripts[1],
                              'sameWhitespaceNormalizedBlocks': [normalized_text(s) for s in scripts[0]] == [normalized_text(s) for s in scripts[1]],
                              'hashDiff': diff_items(*[[digest(s.encode()) for s in values] for values in scripts])},
            'inlineStyles': {'handoffCount': len(styles[0]), 'exportCount': len(styles[1]), 'sameOrderedBlocks': styles[0] == styles[1],
                             'sameParsedOrderedRules': parsed_styles[0] == parsed_styles[1]},
            'attributeDifferences': attrs,
        })

    resources = read_json(HANDOFF / 'raw/published/resources.json')
    published_css = '\n'.join((HANDOFF / r['file']).read_text() for r in resources if r['kind'] == 'styles')
    export_css = '\n'.join((EXPORT / 'css' / name).read_text() for name in ['normalize.css','components.css','dentvitalis33.css'])
    source_rules, target_rules = css_rules(published_css), css_rules(export_css)
    css_diff = diff_items(source_rules, target_rules, limit=30)
    css_diff.update({'handoffRules': len(source_rules), 'exportRules': len(target_rules), 'identicalNormalizedOrderedRules': source_rules == target_rules})
    project_rules = css_rules((EXPORT / 'css/dentvitalis33.css').read_text())
    project_start = next(i for i, rule in enumerate(source_rules) if rule == project_rules[0])
    css_diff['projectStyles'] = {
        'handoffStartRule':project_start, 'rules':len(project_rules),
        'identicalNormalizedOrderedRules':source_rules[project_start:] == project_rules,
        'diff':diff_items(source_rules[project_start:], project_rules),
        'sameExceptTrailingDuplicateFontFace':source_rules[project_start:] == project_rules[:-1] and project_rules[-1] == project_rules[0],
    }

    script_comparison = json.loads(subprocess.check_output(
        ['node', 'scripts/compare-inline-scripts.mjs'],
        input=json.dumps(script_pairs).encode(), cwd=ROOT))

    ix_source = read_json(HANDOFF / 'raw/published/ix2-configurations.json')[0]['configuration']
    ix_target = json.loads(subprocess.check_output(['node', 'scripts/inspect-export-ix2.mjs', str(EXPORT / 'js/dentvitalis33.js')], cwd=ROOT))
    ix_diff = {'identical': ix_source == ix_target, 'sections': {}}
    for key in ['events','actionLists','site']:
        left,right = ix_source[key], ix_target[key]
        ix_diff['sections'][key] = {'identical':left == right, 'handoffCount':len(left), 'exportCount':len(right),
                                    'onlyHandoff':sorted(set(left)-set(right)), 'onlyExport':sorted(set(right)-set(left)),
                                    'changedKeys':[k for k in left.keys() & right.keys() if left[k] != right[k]]}

    all_files = []
    by_hash = defaultdict(list)
    for label, root in [('handoff', HANDOFF), ('export', EXPORT)]:
        for file in sorted(root.rglob('*')):
            if file.is_file():
                row = {'package':label, 'path':file.relative_to(root).as_posix(), 'bytes':file.stat().st_size, 'sha256':digest(file.read_bytes())}
                all_files.append(row); by_hash[row['sha256']].append(row)
    with (HANDOFF / 'assets.csv').open() as stream: masters = list(csv.DictReader(stream))
    master_results = []
    for row in masters:
        matches = [f['path'] for f in by_hash[row['sha256']] if f['package']=='export']
        master_results.append({'assetId':row['asset_id'], 'path':row['local_file'], 'mime':row['mime'], 'bytes':int(row['downloaded_bytes']), 'exportExactMatches':matches,
                               'publishedUses':len(json.loads(row['uses'] or '[]'))})
    duplicates = [items for items in by_hash.values() if len(items)>1]
    external_css = []
    for match in re.finditer(r'url\(["\']?([^"\')]+)', export_css):
        value=match[1]
        if value.startswith(('data:', 'http:', 'https:')): continue
        local=(EXPORT/'css'/unquote(value)).resolve()
        if not local.is_file(): external_css.append(value)
    return {
        'method': 'Offline source comparison, HTML text/metadata/inline blocks, ordered parsed CSS with asset filename normalization, literal IX2 AST and binary SHA-256; no runtime or visual equivalence claim.',
        'tools': {'beautifulsoup4':bs4.__version__, 'tinycss2':tinycss2.__version__},
        'pages':page_results, 'nativeItalianPages':len(native_content['pages']),
        'exportOnlyPageIds':sorted(set(export_pages)-{p['metadata']['id'] for p in pages}),
        'missingLocalHtmlResources':sorted(missing_local), 'missingLocalCssResources':sorted(set(external_css)),
        'externalExportResources':sorted(external_assets), 'css':css_diff, 'ix2':ix_diff,
        'inlineScriptAstComparison':script_comparison,
        'masters':master_results, 'files':all_files,
        'duplicateGroups':duplicates,
        'storage':{'totalBytes':sum(f['bytes'] for f in all_files), 'uniqueBytes':sum(items[0]['bytes'] for items in by_hash.values()),
                   'duplicateBytes':sum(sum(i['bytes'] for i in items[1:]) for items in duplicates)},
    }


if __name__ == '__main__':
    print(json.dumps(compare(), ensure_ascii=False, indent=2))
