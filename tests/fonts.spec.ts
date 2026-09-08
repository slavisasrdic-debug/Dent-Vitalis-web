import { test, expect } from '@playwright/test';

test('all used Montserrat styles render Croatian and Latin glyphs with real custom fonts', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const samples = await page.evaluate(async () => {
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-body')
      .trim();
    const variants = [300, 400, 500, 600, 700, 800].map((weight) => ({
      weight,
      style: 'normal',
    }));
    variants.push({ weight: 400, style: 'italic' });
    const ids: string[] = [];
    for (const [index, variant] of variants.entries()) {
      for (const [subset, text] of Object.entries({
        latin: 'DentVitalis Rijeka',
        extended: 'ČĆŽŠĐčćžšđ',
      })) {
        const element = document.createElement('span');
        element.id = `font-proof-${index}-${subset}`;
        element.textContent = text;
        element.style.cssText = `position:fixed;left:0;top:0;font: ${variant.style} ${variant.weight} 24px ${family};white-space:nowrap`;
        document.body.append(element);
        await document.fonts.load(
          `${variant.style} ${variant.weight} 24px ${family}`,
          text,
        );
        ids.push(element.id);
      }
    }
    await document.fonts.ready;
    return ids;
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  for (const id of samples) {
    const { nodeId } = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: `#${id}`,
    });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    expect(fonts.length, id).toBeGreaterThan(0);
    expect(
      fonts.every(
        (font) => font.isCustomFont && /Montserrat/.test(font.familyName),
      ),
      id,
    ).toBe(true);
  }
});
