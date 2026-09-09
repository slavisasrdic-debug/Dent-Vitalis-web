export type RevealVariant = 'slide' | 'fade' | 'grow' | 'card' | 'sidebar';
export type RevealMedia = 'all' | 'mobile' | 'desktop';

function milliseconds(value: string) {
  const time = value.trim();
  const number = parseFloat(time);
  // Production CSS can minify 1000ms to 1s (and 200ms to .2s).
  return time.endsWith('s') && !time.endsWith('ms') ? number * 1000 : number;
}

let awaitingStyles = false;

/** Reveal controls live in CSS tokens; explicit data props override profile defaults. */
export function initializeReveals() {
  // Progressive enhancement: unsupported browsers get the complete, visible page.
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const root = document.documentElement;
  const hasTokens = () =>
    getComputedStyle(root).getPropertyValue('--reveal-duration').trim() !== '';
  // WebKit may execute an inline module before the external production CSS loads.
  // Do not freeze missing token values into observer margins or animation timings.
  if (!hasTokens()) {
    if (awaitingStyles) return;
    awaitingStyles = true;
    const resume = () => {
      document.removeEventListener('load', onStylesheetLoad, true);
      window.removeEventListener('load', resume);
      awaitingStyles = false;
      if (hasTokens()) initializeReveals();
    };
    const onStylesheetLoad = (event: Event) => {
      if (event.target instanceof HTMLLinkElement && hasTokens()) resume();
    };
    document.addEventListener('load', onStylesheetLoad, true);
    window.addEventListener('load', resume, { once: true });
    return;
  }
  const preparedBeforePaint = root.dataset.revealBoot === 'pending';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const outQuart = CSS.supports('animation-timing-function', 'linear(0, 1)')
    ? `linear(${Array.from({ length: 101 }, (_, i) => 1 - (1 - i / 100) ** 4).join(',')})`
    : 'cubic-bezier(.165, .84, .44, 1)';
  // Read geometry before the loop mutates waiting/ready attributes. Reading
  // innerHeight after every element's style changes forces repeated layouts.
  const initialViewportHeight =
    preparedBeforePaint && !reduced.matches ? innerHeight : 0;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.dataset.revealReady) return;
    element.dataset.revealReady = 'true';
    // Missing/expired bootstrap (or late-added DOM) means it has already painted.
    // Keep it visible; never restart a reveal by hiding an already shown element.
    if (reduced.matches || !preparedBeforePaint) return;
    const variant = element.dataset.reveal || 'slide';
    const style = getComputedStyle(element);
    const profile =
      variant === 'card' || variant === 'sidebar' ? `${variant}-` : '';
    const setting = (name: string) =>
      style.getPropertyValue(`--reveal-${profile}${name}`).trim();
    const media =
      element.dataset.revealMedia === 'mobile'
        ? matchMedia('screen and (max-width: 991px)')
        : element.dataset.revealMedia === 'desktop'
          ? matchMedia('screen and (min-width: 992px)')
          : undefined;
    let revealed = false;
    let observer: IntersectionObserver | undefined;
    let animation: Animation | undefined;

    const cleanup = () => {
      observer?.disconnect();
      reduced.removeEventListener('change', reconcile);
      media?.removeEventListener('change', reconcile);
      element.removeEventListener('focusin', onFocus);
    };
    const reveal = (animate: boolean) => {
      if (revealed) return;
      revealed = true;
      observer?.disconnect();
      element.removeAttribute('data-waiting');
      if (animate && !reduced.matches && (!media || media.matches)) {
        const from =
          variant === 'grow'
            ? `scale(${style.getPropertyValue('--reveal-grow-scale').trim()})`
            : variant === 'fade'
              ? 'none'
              : `translateY(${setting('distance')})`;
        const easing = setting('easing');
        try {
          animation = element.animate(
            [
              { opacity: 0, transform: from },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: milliseconds(
                style.getPropertyValue('--reveal-duration'),
              ),
              delay: Number(
                element.dataset.delay ?? milliseconds(setting('delay')),
              ),
              easing: easing === 'out-quart' ? outQuart : easing,
              fill: 'backwards',
            },
          );
          // No persistent transform/will-change layer after the one-shot entrance.
          void animation.finished.then(cleanup, cleanup);
          return;
        } catch {
          // Invalid/unsupported animation options must never hide the content.
        }
      }
      cleanup();
    };
    const onFocus = () => {
      animation?.cancel();
      reveal(false);
    };
    const reconcile = (event?: MediaQueryListEvent) => {
      observer?.disconnect();
      element.removeAttribute('data-waiting');
      if (revealed || reduced.matches) {
        revealed = true;
        animation?.cancel();
        cleanup();
        return;
      }
      if (media && !media.matches) return;
      const viewportHeight = event ? innerHeight : initialViewportHeight;
      if (event) {
        const rect = element.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          reveal(false);
          return;
        }
      }
      const offset = Number(
        element.dataset.offset ?? (parseFloat(setting('offset')) || 0),
      );
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal(true);
        },
        { rootMargin: `0px 0px -${(viewportHeight * offset) / 100}px 0px` },
      );
      element.setAttribute('data-waiting', '');
      observer.observe(element);
    };
    reduced.addEventListener('change', reconcile);
    media?.addEventListener('change', reconcile);
    element.addEventListener('focusin', onFocus);
    reconcile();
  });
  if (preparedBeforePaint) root.dataset.revealBoot = 'ready';
}
