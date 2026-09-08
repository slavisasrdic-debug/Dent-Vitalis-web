// QA-only control of endlessly changing decoration. Entrance animations are
// allowed to finish normally; this does not alter production CSS or timing.
export async function settleReferenceState(page) {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getTiming().iterations === Infinity) {
        animation.pause();
        animation.currentTime = 0;
      }
    }
    for (const video of document.querySelectorAll('video')) {
      video.pause();
      if (video.readyState >= 2) video.currentTime = 0;
    }
  });
}
