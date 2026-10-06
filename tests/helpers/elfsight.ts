import type { Page } from '@playwright/test';

// Integration/unit regressions must not depend on editable vendor settings.
// Real SDK rendering and interaction are checked separately without mocks.
export async function blockElfsight(page: Page) {
  await page.route('https://elfsightcdn.com/platform.js', (route) =>
    route.abort(),
  );
}
