/** Directory-only switching. The homepage continuous timeline is intentionally separate. */
export function initializeDirectory(root: HTMLElement) {
  const desktop = matchMedia('(min-width:992px)');
  const cards = [...root.querySelectorAll<HTMLElement>('.teaser-card')];
  const photos = [...root.querySelectorAll<HTMLElement>('[data-image-index]')];
  let frame = 0;
  let active = -1;
  function update() {
    frame = 0;
    if (!desktop.matches) return;
    let next = 0;
    cards.forEach((card, index) => {
      if (Math.floor(card.getBoundingClientRect().top) <= innerHeight)
        next = index;
    });
    if (next === active) return;
    active = next;
    photos.forEach((photo, index) => {
      photo.style.opacity = index === active ? '1' : '0';
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  desktop.addEventListener('change', schedule);
  schedule();
}
