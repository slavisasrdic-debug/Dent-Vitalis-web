let latestOpening = 0;

/** Keep a newly opened FAQ start visible after sibling collapse settles. */
export async function revealFAQStart(
  summary: HTMLElement,
  isOpen: () => boolean,
) {
  const opening = ++latestOpening;
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  const events = ['wheel', 'touchmove', 'pointerdown', 'keydown'] as const;
  events.forEach((event) =>
    window.addEventListener(event, cancel, { passive: true }),
  );
  try {
    // Outside-click handlers close other FAQ roots later in the same event.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    const transitions = [...document.querySelectorAll('.faq-item')]
      .flatMap((item) => item.getAnimations())
      .filter((animation) => animation.id === 'faq-height');
    await Promise.all(
      transitions.map((animation) => animation.finished.catch(() => undefined)),
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    if (
      cancelled ||
      opening !== latestOpening ||
      !isOpen() ||
      !summary.isConnected
    )
      return;
    const offset =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
      0;
    const rect = summary.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop || 0;
    let bottom = viewportTop + (viewport?.height || window.innerHeight);
    const sticky = document.querySelector<HTMLElement>('.mobile-contact');
    if (sticky && getComputedStyle(sticky).position === 'fixed')
      bottom = Math.min(bottom, sticky.getBoundingClientRect().top);
    const answer = summary.parentElement?.querySelector('.answer');
    const startOfAnswer = Math.min(
      48,
      answer?.getBoundingClientRect().height || 0,
    );
    if (
      rect.top < viewportTop + offset - 1 ||
      rect.bottom + startOfAnswer > bottom
    ) {
      window.scrollTo({
        top: Math.max(0, window.scrollY + rect.top - viewportTop - offset),
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    }
  } finally {
    events.forEach((event) => window.removeEventListener(event, cancel));
  }
}
