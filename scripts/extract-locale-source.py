"""Lossless DOCX catalogue for the supplied DE/EN/SL translation sources."""
import hashlib
import json
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'de': Path('reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_DE.docx'),
    'en': Path('reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_EN.docx'),
    'sl': Path('reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_SL.docx'),
}
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


def extract(locale, source):
    with zipfile.ZipFile(ROOT / source) as archive:
        body = ET.fromstring(archive.read('word/document.xml')).find('w:body', NS)
    blocks = []
    table_number = 0
    for index, node in enumerate(body):
        if node.tag == W + 'p':
            blocks.append({'type': 'paragraph', **paragraph(node, f'p{index}')})
        elif node.tag == W + 'tbl':
            table_number += 1
            rows = []
            for row_number, row in enumerate(node.findall('w:tr', NS)):
                rows.append([
                    [paragraph(p, f't{table_number}.r{row_number}.c{column}.p{i}')
                     for i, p in enumerate(cell.findall('w:p', NS))]
                    for column, cell in enumerate(row.findall('w:tc', NS))
                ])
            blocks.append({'type': 'table', 'id': f't{table_number}', 'rows': rows})
    return {
        'source': source.as_posix(),
        'locale': locale,
        'sha256': hashlib.sha256((ROOT / source).read_bytes()).hexdigest(),
        'authority': 'Supplied translation source; preserve text and run formatting.',
        'blocks': blocks,
    }


for locale, source in SOURCES.items():
    output = ROOT / f'data/translations/{locale}-source.json'
    result = json.dumps(extract(locale, source), ensure_ascii=False, indent=2) + '\n'
    if sys.argv[1:] == ['--check']:
        if not output.is_file() or output.read_text(encoding='utf-8') != result:
            raise SystemExit(f'{locale}: catalogue differs; review source and regenerate explicitly.')
    elif not sys.argv[1:]:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(result, encoding='utf-8')
    else:
        raise SystemExit('Usage: python3 scripts/extract-locale-source.py [--check]')
    print(json.dumps({'locale': locale, 'output': str(output.relative_to(ROOT)),
                      'sha256': extract(locale, source)['sha256']}))
