"""Lossless DOCX text/run catalogue. Never translate, align by guess, or edit input."""
import hashlib
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('reference/Dentvitalis web tekstovi - it + hr (1).docx')
OUTPUT = ROOT / 'data/translations/hr-source.json'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W = '{' + NS['w'] + '}'


def paragraph(node, key):
    runs = []
    for run in node.findall('.//w:r', NS):
        text = ''.join(
            item.text or '' if item.tag == W + 't' else
            '\t' if item.tag == W + 'tab' else '\n'
            for item in run if item.tag in (W + 't', W + 'tab', W + 'br')
        )
        if not text:
            continue
        props = run.find('w:rPr', NS)
        value = {'text': text}
        if props is not None:
            for name in ('b', 'i', 'highlight', 'color', 'sz', 'strike'):
                prop = props.find('w:' + name, NS)
                if prop is not None:
                    value[name] = prop.get(W + 'val', 'true')
        runs.append(value)
    style = node.find('w:pPr/w:pStyle', NS)
    return {'id': key, 'text': ''.join(r['text'] for r in runs),
            'style': style.get(W + 'val') if style is not None else None,
            'runs': runs}


with zipfile.ZipFile(ROOT / SOURCE) as archive:
    body = ET.fromstring(archive.read('word/document.xml')).find('w:body', NS)
blocks = []
table_number = 0
for index, node in enumerate(body):
    if node.tag == W + 'p':
        blocks.append({'type': 'paragraph', **paragraph(node, f'p{index}')})
    elif node.tag == W + 'tbl':
        table_number += 1
        rows = []
        for r, row in enumerate(node.findall('w:tr', NS)):
            rows.append([
                [paragraph(p, f't{table_number}.r{r}.c{c}.p{i}')
                 for i, p in enumerate(cell.findall('w:p', NS))]
                for c, cell in enumerate(row.findall('w:tc', NS))
            ])
        blocks.append({'type': 'table', 'id': f't{table_number}', 'rows': rows})
result = {
    'source': SOURCE.as_posix(),
    'sha256': hashlib.sha256((ROOT / SOURCE).read_bytes()).hexdigest(),
    'authority': 'HR column approved by user 2026-09-08; retain Italian-only exclusions.',
    'blocks': blocks,
}
serialized = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
if sys.argv[1:] == ['--check']:
    if not OUTPUT.is_file() or OUTPUT.read_text(encoding='utf-8') != serialized:
        raise SystemExit('DOCX catalogue differs: review the source, then regenerate explicitly.')
elif not sys.argv[1:]:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(serialized, encoding='utf-8')
else:
    raise SystemExit('Usage: extract-translation-source.py [--check]')
print(json.dumps({'output': str(OUTPUT.relative_to(ROOT)), 'tables': table_number,
                  'sha256': result['sha256']}))
