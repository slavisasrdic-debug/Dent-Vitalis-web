import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });
for (const lang of ['it', 'hr']) {
  test(`upload alignment, long filenames and errors in inline and dialog forms: ${lang}`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const posts: string[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(request.url());
    });
    await page.goto(lang === 'hr' ? '/hr/' : '/');
    await page.evaluate(() => document.fonts.ready);
    const form = page.locator('[data-contact-form]');
    const input = form.locator('input[type=file]');
    const button = form.locator('.upload-button');
    const name = form.locator('.file-name');
    const error = form.locator('.file-error');
    const originalId = await input.getAttribute('id');
    const label = lang === 'hr' ? 'Pitaj stomatologa' : 'Consulta il dentista';
    await expect(page.locator('.header-consultation .label')).toHaveText(label);
    await expect(page.locator('.mobile-contact .label')).toHaveText(label);

    for (const placement of ['home_inline', 'home_popup']) {
      if (placement === 'home_popup') {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.locator('.header-consultation .button').click();
        await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
      }
      await expect(form).toHaveAttribute('data-placement', placement);
      for (const width of [
        320, 358, 359, 360, 390, 479, 480, 766, 767, 768, 991, 992, 1440,
      ]) {
        await page.setViewportSize({ width, height: 900 });
        await button.scrollIntoViewIfNeeded();
        const geometry = await button.evaluate((button) => {
          const bounds = button.getBoundingClientRect();
          const icon = button.querySelector('svg')!.getBoundingClientRect();
          const label = button
            .querySelector('.upload-label')!
            .getBoundingClientRect();
          const input = button.querySelector('input')!.getBoundingClientRect();
          return {
            bounds: bounds.toJSON(),
            icon: icon.toJSON(),
            label: label.toJSON(),
            input: input.toJSON(),
            overflow: button.scrollWidth - button.clientWidth,
          };
        });
        expect(geometry.bounds.height).toBeGreaterThanOrEqual(48);
        expect(geometry.overflow).toBeLessThanOrEqual(1);
        expect(geometry.icon.width).toBeGreaterThanOrEqual(16);
        expect(
          Math.abs(
            geometry.icon.y +
              geometry.icon.height / 2 -
              geometry.bounds.y -
              geometry.bounds.height / 2,
          ),
        ).toBeLessThan(1);
        expect(
          Math.abs(
            geometry.label.y +
              geometry.label.height / 2 -
              geometry.bounds.y -
              geometry.bounds.height / 2,
          ),
        ).toBeLessThan(1);
        expect(geometry.input.height).toBeGreaterThanOrEqual(
          geometry.bounds.height - 2,
        );
        expect(geometry.bounds.right).toBeLessThanOrEqual(width);
      }
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const filename = 'Čeljust_Željko_dugačak_naziv_'.repeat(8) + '.pdf';
        const chooser = page.waitForEvent('filechooser');
        await button.click();
        await (
          await chooser
        ).setFiles({
          name: filename,
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4\n%%EOF'),
        });
        await expect(name).toHaveText(filename);
        await expect(error).toBeHidden();
        expect(
          await name.evaluate((name) => name.scrollWidth - name.clientWidth),
        ).toBeLessThanOrEqual(1);
        await input.focus();
        await expect(button).toHaveCSS('outline-width', '3px');
        await input.setInputFiles({
          name: 'invalid.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Local QA only'),
        });
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          (await form.getAttribute('data-invalid-file'))!,
        );
        await input.setInputFiles({
          name: 'oversize.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
        });
        await expect(error).toHaveText(
          (await form.getAttribute('data-file-too-large'))!,
        );
        await input.setInputFiles([]);
        await expect(input).toHaveAttribute('aria-invalid', 'false');
        await expect(error).toBeHidden();
        await expect(name).toHaveText(
          (await form.getAttribute('data-file-limit'))!,
        );
      }
      if (placement === 'home_popup') {
        await page.keyboard.press('Escape');
        await expect(form).toHaveAttribute('data-placement', 'home_inline');
        await expect(input).toHaveAttribute('id', originalId!);
      }
    }
    await expect(form).toHaveCount(1);
    expect(posts).toEqual([]);
  });
}
