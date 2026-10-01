/** Owner-approved URL policy (2026-10-01): only the origin root keeps '/'. */
export function pagePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

/** Generated storage, not a public route. Avoid DirectorySlash redirects. */
export function pageDocument(path: string): string {
  const route = pagePath(path);
  if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route))
    throw new Error(`Unexpected static page path: ${path}`);
  return route === '/' ? '/index.html' : `/_pages${route}.html`;
}
