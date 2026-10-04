"""Package exactly the two reviewed files and the requested short comment."""
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'docs/seo/handoff-readable-20261004'
SITEMAP = ROOT / 'docs/seo/handoff-simple-20261004/sitemap-novi.xml'
OUTPUT = ROOT / '.astro/reports/DentVitalis-htaccess-sitemap-20261004.zip'
sha = lambda data: hashlib.sha256(data).hexdigest()
rules = (SOURCE / '.htaccess').read_bytes()
xml = SITEMAP.read_bytes()
review = json.loads((ROOT / 'data/seo/htaccess-attachment-review-20261004.json').read_text())
sitemap_review = json.loads((SITEMAP.parent / 'report.json').read_text())
assert sha(rules) == review['outputSha256']
assert sha(xml) == sitemap_review['newSitemap']['sha256']
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'h': 'http://www.w3.org/1999/xhtml'}
entries = ET.fromstring(xml).findall('s:url', ns)
links = [link for entry in entries for link in entry.findall('h:link', ns)]
assert len(entries) == 136
assert len(links) == 676
assert {link.attrib['hreflang'] for link in links} == {'it', 'hr', 'de', 'en', 'sl'}
assert all(entry.findtext('s:loc', namespaces=ns).startswith('https://www.dentvitalis.com/') for entry in entries)
payload = {
    '.htaccess': rules,
    'sitemap.xml': xml,
    'NAPOMENA-ZA-WEBMASTER-I-SEO.txt': (SOURCE / 'NAPOMENA-ZA-WEBMASTER-I-SEO.txt').read_bytes(),
}
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUTPUT, 'x', zipfile.ZIP_DEFLATED) as archive:
    for name, data in payload.items():
        info = zipfile.ZipInfo(name, (2026, 10, 4, 12, 0, 0))
        info.create_system = 3
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)
with zipfile.ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == set(payload)
    for name, data in payload.items():
        assert archive.read(name) == data
        assert (archive.getinfo(name).external_attr >> 16) & 0o777 == 0o644
print(json.dumps({'zip': str(OUTPUT), 'bytes': OUTPUT.stat().st_size, 'sha256': sha(OUTPUT.read_bytes()), 'files': list(payload), 'crc': 'ok', 'urls': 136, 'hreflang': 676}, ensure_ascii=False, indent=2))
