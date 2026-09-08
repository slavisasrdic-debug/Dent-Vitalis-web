/** Native range interaction: no document-level pointer handlers or scroll loop. */
export function initializeComparisons() {
  document
    .querySelectorAll<HTMLElement>('[data-comparison]')
    .forEach((root) => {
      if (root.dataset.comparisonReady) return;
      const input = root.querySelector<HTMLInputElement>('.comparison-range');
      if (!input) return;
      const buttons = root.querySelectorAll<HTMLButtonElement>(
        '[data-comparison-value]',
      );
      const render = (animate: boolean) => {
        root.toggleAttribute('data-comparison-animate', animate);
        const value = Math.max(0, Math.min(100, input.valueAsNumber));
        root.style.setProperty('--comparison-position', `${value}%`);
        input.setAttribute(
          'aria-valuetext',
          `${value}% ${root.dataset.beforeLabel}, ${100 - value}% ${root.dataset.afterLabel}`,
        );
        buttons.forEach((button) =>
          button.setAttribute(
            'aria-pressed',
            String(Number(button.dataset.comparisonValue) === value),
          ),
        );
      };
      input.addEventListener('input', () => render(false));
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          input.value = button.dataset.comparisonValue || '50';
          render(true);
        });
        button.disabled = false;
      });
      render(false);
      input.disabled = false;
      root.dataset.comparisonReady = 'true';
    });
}
