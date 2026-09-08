"""Resolve the 32 exact external images; preserve accepted source trees untouched."""
import csv
import hashlib
import json
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote, urlparse, quote
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
HANDOFF = ROOT / 'reference/webflow-handoff/2026-09-07/extracted'
EXPORT = ROOT / 'source-assets/webflow-export/2026-09-07/extracted'
DEST = ROOT / 'source-assets/external-images/2026-09-07'
DEST.mkdir(parents=True, exist_ok=True)
rows = list(csv.DictReader((HANDOFF / 'external-assets.csv').open()))
missing = defaultdict(list)
for row in rows:
    if row['kind'] == 'img' and not row['local_file']:
        missing[row['url']].append(row['page'])
existing = defaultdict(list)
for tree in [HANDOFF / 'assets', EXPORT / 'images']:
    for file in tree.rglob('*'):
        if file.is_file():
            existing[hashlib.sha256(file.read_bytes()).hexdigest()].append(str(file.relative_to(ROOT)))

def resolve(item):
    url, pages = item
    name = unquote(urlparse(url).path.rsplit('/', 1)[1])
    dest = DEST / name
    result = dict(url=url, original_name=name, pages=sorted(set(pages)),
                  category='shared-social-icon' if name.endswith('.svg') else 'gallery-before-after',
                  required_for_home='/' in pages)
    try:
        if dest.exists():
            data = dest.read_bytes()
        else:
            with urlopen(quote(url, safe=':/%?=&'), timeout=30) as response:
                data = response.read()
            digest = hashlib.sha256(data).hexdigest()
            if digest not in existing:
                with dest.open('xb') as file:
                    file.write(data)
        digest = hashlib.sha256(data).hexdigest()
        matches = existing[digest]
        result.update(status='resolved', bytes=len(data), sha256=digest,
                      exact_existing_matches=matches,
                      source_file=matches[0] if matches else str(dest.relative_to(ROOT)))
    except Exception as error:
        result.update(status='unresolved', error=str(error))
    return result

with ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(resolve, missing.items()))
report = ROOT / 'reference/webflow-handoff/2026-09-07/external-assets-resolution.json'
report.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(dict(total=len(results), resolved=sum(r['status']=='resolved' for r in results),
                     existing_exact=sum(bool(r.get('exact_existing_matches')) for r in results),
                     home=sum(r['required_for_home'] for r in results))))
