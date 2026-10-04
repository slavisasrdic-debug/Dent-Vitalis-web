"""Independent inspection of the final archive, including every payload hash."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent.parent
receipt = json.loads((ROOT / 'data/seo/cpanel-galleria-v8-release-20261004.json').read_text())
sha = lambda data: hashlib.sha256(data).hexdigest()
archive_path = ROOT / '.astro/releases' / receipt['archiveName']
base_path = ROOT / '.astro/releases' / receipt['immutableBaseArchive']['archiveName']
assert sha(archive_path.read_bytes()) == receipt['sha256']
assert sha(base_path.read_bytes()) == receipt['immutableBaseArchive']['sha256']
origin = 'https://www.dentvitalis.com'

class Metadata(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = {}
        self.canonical = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a['href']
        if tag == 'link' and a.get('rel') == 'alternate' and 'hreflang' in a:
            assert a['hreflang'] not in self.links
            self.links[a['hreflang']] = a['href']

with zipfile.ZipFile(base_path) as base, zipfile.ZipFile(archive_path) as archive:
    assert base.testzip() is None and archive.testzip() is None
    assert len(archive.namelist()) == len(set(archive.namelist()))
    renamed = lambda path: path.replace('_pages/domande-e-risposte.html', '_pages/galleria.html')
    assert sorted(map(renamed, base.namelist())) == sorted(archive.namelist())
    files = [info for info in archive.infolist() if not info.is_dir()]
    dirs = [info for info in archive.infolist() if info.is_dir()]
    assert len(files) == 692 and len(dirs) == 13
    for info in archive.infolist():
        assert (info.external_attr >> 16) & 0o777 == (0o755 if info.is_dir() else 0o644), info.filename
    manifest = json.loads(archive.read('release-manifest.json'))
    assert manifest['revision'] == '20261004-galleria-v8'
    assert manifest['approval']['seoMaster'] == 'owner-confirms-approved-2026-10-04'
    assert manifest['backendPrerequisites'] == json.loads(base.read('release-manifest.json'))['backendPrerequisites']
    assert manifest['fileCount'] == len(manifest['files']) == 691
    assert {entry['path'] for entry in manifest['files']} | {'release-manifest.json'} == {info.filename for info in files}
    assert sum(entry['bytes'] for entry in manifest['files']) == manifest['totalBytes']
    unchanged = 0
    html_count = 0
    for entry in manifest['files']:
        name = entry['path']
        data = archive.read(name)
        assert len(data) == entry['bytes'] and sha(data) == entry['sha256'], name
        old_name = name.replace('_pages/galleria.html', '_pages/domande-e-risposte.html')
        old = base.read(old_name)
        unchanged += data == old and name == old_name
        if name.endswith('.html'):
            html_count += 1
            assert data == old.replace(b'/domande-e-risposte', b'/galleria'), name
            assert b'/domande-e-risposte' not in data, name
        elif name not in {'.htaccess', '_redirects', 'page-routes.json', 'sitemap.xml', 'sitemap-0.xml'}:
            assert data == old, name
    assert html_count == 142 and unchanged == receipt['unchangedPayloadFiles']
    handoff = ROOT / 'docs/seo/handoff-galleria-v8-20261004'
    assert archive.read('.htaccess') == (handoff / '.htaccess').read_bytes()
    rules = archive.read('.htaccess').decode()
    assert 'RewriteRule ^domande-e-risposte/?$ https://www.dentvitalis.com/galleria [R=301,L,NE]' in rules
    assert 'QSD' not in rules
    redirects = archive.read('_redirects').decode()
    assert '/domande-e-risposte /galleria 301\n' in redirects
    assert '/domande-e-risposte/ /galleria 301\n' in redirects
    routes = json.loads(archive.read('page-routes.json'))
    assert len(routes) == 140 and routes['/galleria'] == '/_pages/galleria.html'
    assert '/domande-e-risposte' not in routes
    xml = archive.read('sitemap.xml')
    assert xml == archive.read('sitemap-0.xml') == (handoff / 'sitemap.xml').read_bytes()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'h': 'http://www.w3.org/1999/xhtml'}
    tree = ET.fromstring(xml)
    nodes = tree.findall('s:url', ns)
    links = tree.findall('s:url/h:link', ns)
    assert len(nodes) == 136 and len(links) == 676
    assert {link.attrib['hreflang'] for link in links} == {'it', 'hr', 'de', 'en', 'sl'}
    pairs = {}
    for node in nodes:
        url = node.find('s:loc', ns).text
        assert url.startswith(origin + '/') and 'domande-e-risposte' not in url
        path = url[len(origin):]
        document = 'index.html' if path == '/' else routes[path].lstrip('/')
        html = Metadata(archive.read(document).decode())
        assert html.canonical == url
        pair = {link.attrib['hreflang']: link.attrib['href'] for link in node.findall('h:link', ns)}
        assert pair == {lang: target for lang, target in html.links.items() if lang != 'x-default'}, path
        pairs[url] = pair
    for pair in pairs.values():
        for target in pair.values():
            assert pairs[target] == pair, target
    expected_gallery = {'it': origin + '/galleria', 'hr': origin + '/hr/galerija', 'de': origin + '/de/galerie', 'en': origin + '/en/gallery', 'sl': origin + '/si/galerija'}
    for target in expected_gallery.values():
        assert pairs[target] == expected_gallery
    assert sum(info.file_size for info in files) == receipt['logicalUnpackedBytesIncludingManifest']
report = {'archive': receipt['archiveName'], 'sha256': receipt['sha256'], 'bytes': archive_path.stat().st_size, 'crc': 'ok', 'manifestHashesVerified': 691, 'files': 692, 'directories': 13, 'modes': '0644/0755', 'htmlUrlOnlyChangesVerified': 142, 'unchangedPayloadFiles': unchanged, 'sitemapUrls': 136, 'reciprocalHreflang': 676, 'galleryLanguages': 5, 'backendOrRealPostsChanged': False}
print(json.dumps(report, indent=2))
