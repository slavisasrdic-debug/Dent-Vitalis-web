/** Native fragments share one offset; no click interception or history changes. */
export function initializeScrollOffsets() {
  const breadcrumb = document.querySelector<HTMLElement>('.breadcrumbs');
  if (
    !breadcrumb ||
    breadcrumb.dataset.scrollOffsetReady ||
    !('ResizeObserver' in window)
  )
    return;
  breadcrumb.dataset.scrollOffsetReady = 'true';
  let previousHeight = -1;
  const update = () => {
    // WebKit can run the inline module before production styles finish loading.
    // Keep the conservative CSS fallback until the sticky layout is available.
    if (getComputedStyle(breadcrumb).position !== 'sticky') return;
    const height = breadcrumb.getBoundingClientRect().height;
    if (height === previousHeight) return;
    previousHeight = height;
    document.documentElement.style.setProperty(
      '--breadcrumb-height',
      `${height}px`,
    );
  };
  update();
  new ResizeObserver(update).observe(breadcrumb);
  window.addEventListener('load', update, { once: true });
}
