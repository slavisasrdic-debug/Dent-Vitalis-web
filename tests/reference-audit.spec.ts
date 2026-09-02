import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const auditText = readFileSync('reference/webflow-audit.json', 'utf8');
const audit = JSON.parse(auditText) as {
  pages: Array<{ path: string; status: number }>;
};

test('keeps the reference audit free of captured API credentials', () => {
  expect(auditText).not.toMatch(/AIza[\w-]+/);

  for (const match of auditText.matchAll(/https?:[^"\\]+/g)) {
    const value = match[0].replaceAll('\\u0026', '&');
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      continue;
    }

    for (const parameter of [
      'access_token',
      'api_key',
      'key',
      'signature',
      'token',
    ]) {
      const capturedValue = url.searchParams.get(parameter);
      if (capturedValue !== null) expect(capturedValue).toBe('[redacted]');
    }
  }
});

test('records the known Webflow route set without treating the 404 as a page', () => {
  expect(audit.pages.filter((page) => page.status === 200)).toHaveLength(26);
  expect(audit.pages).toContainEqual(
    expect.objectContaining({
      path: '/su-di-noi/sedazione-cosciente',
      status: 404,
    }),
  );
});
