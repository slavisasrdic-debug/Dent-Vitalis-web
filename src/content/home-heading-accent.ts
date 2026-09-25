export function withAccentedPhrase(title: string, accent: string) {
  const index = title.indexOf(accent);
  if (index === -1 || title.indexOf(accent, index + accent.length) !== -1)
    throw new Error(`Expected one accent phrase in home heading: ${title}`);
  const before = title.slice(0, index).trim();
  const after = title.slice(index + accent.length).trim();
  return {
    title: before,
    accent,
    accentPosition: (before ? 'suffix' : 'prefix') as 'prefix' | 'suffix',
    ...(after ? { titleAfter: after } : {}),
  };
}
