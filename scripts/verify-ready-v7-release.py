"""Independent verification of the actual ZIP, not its extraction or generator."""
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent.parent
receipt = json.loads((ROOT / 'data/seo/cpanel-ready-v7-release-20261004.json').read_text())
archive_path = ROOT / '.astro/releases' / receipt['archiveName']
base_path = ROOT / '.astro/releases' / receipt['immutableBaseArchive']['archiveName']
sha = lambda data: hashlib.sha256(data).hexdigest()
assert sha(archive_path.read_bytes()) == receipt['sha256']
assert sha(base_path.read_bytes()) == receipt['immutableBaseArchive']['sha256']
with zipfile.ZipFile(base_path) as base, zipfile.ZipFile(archive_path) as archive:
    assert base.testzip() is None and archive.testzip() is None
    assert sorted(base.namelist()) == sorted(archive.namelist())
    assert len(archive.namelist()) == len(set(archive.namelist()))
    files = [info for info in archive.infolist() if not info.is_dir()]
    dirs = [info for info in archive.infolist() if info.is_dir()]
    assert len(files) == 692 and len(dirs) == 13
    for info in archive.infolist():
        assert (info.external_attr >> 16) & 0o777 == (0o755 if info.is_dir() else 0o644), info.filename
    manifest = json.loads(archive.read('release-manifest.json'))
    assert manifest['revision'] == '20261004-ready-v7'
    assert manifest['approval']['seoMaster'] == 'pending'
    assert manifest['publicActivationApproved'] is False
    assert manifest['fileCount'] == len(manifest['files']) == 691
    assert {entry['path'] for entry in manifest['files']} | {'release-manifest.json'} == {info.filename for info in files}
    assert sum(entry['bytes'] for entry in manifest['files']) == manifest['totalBytes']
    for entry in manifest['files']:
        data = archive.read(entry['path'])
        assert len(data) == entry['bytes'] and sha(data) == entry['sha256'], entry['path']
    changed = [info.filename for info in files if archive.read(info.filename) != base.read(info.filename)]
    assert sorted(changed) == ['.htaccess', 'release-manifest.json']
    assert archive.read('.htaccess') == (ROOT / 'docs/seo/handoff-readable-20261004/.htaccess').read_bytes()
    xml = archive.read('sitemap.xml')
    assert xml == archive.read('sitemap-0.xml') == (ROOT / 'docs/seo/handoff-simple-20261004/sitemap-novi.xml').read_bytes()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'h': 'http://www.w3.org/1999/xhtml'}
    tree = ET.fromstring(xml)
    links = tree.findall('s:url/h:link', ns)
    assert len(tree.findall('s:url', ns)) == 136 and len(links) == 676
    assert {link.attrib['hreflang'] for link in links} == {'it', 'hr', 'de', 'en', 'sl'}
    html_files = [info.filename for info in files if info.filename.endswith('.html')]
    assert len(html_files) == 141
    assert all(archive.read(name) == base.read(name) for name in html_files)
    assert sum(info.file_size for info in files) == receipt['logicalUnpackedBytesIncludingManifest']
print(json.dumps({'crc': 'ok', 'manifestHashesVerified': 691, 'files': 692, 'directories': 13, 'modes': '0644/0755', 'unchangedHtml': 141, 'changedFiles': changed, 'unchangedPayloadFiles': 690, 'sitemapUrls': 136, 'hreflang': 676, 'seoApproval': 'pending'}, indent=2))
