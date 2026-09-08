
(function () {
  function syncLogoSubtitle() {
    var subtitle = document.querySelector(".navbar .brand .text-block-18");
    var logo = document.querySelector(".navbar .brand img");
    if (!subtitle || !logo || !subtitle.textContent.trim()) return;

    var styles = getComputedStyle(subtitle);
    var probe = document.createElement("span");
    probe.textContent = subtitle.textContent.trim();
    probe.style.cssText =
      "position:absolute;visibility:hidden;display:inline-block;white-space:nowrap;width:max-content;font:" +
      styles.font +
      ";text-transform:" +
      styles.textTransform +
      ";letter-spacing:0px;";
    document.body.appendChild(probe);

    var naturalWidth = probe.getBoundingClientRect().width;
    probe.remove();

    var characterCount = Array.from(subtitle.textContent.trim()).length;
    var targetWidth = logo.getBoundingClientRect().width;
    var letterSpacing = Math.max(0, (targetWidth - naturalWidth) / characterCount);

    subtitle.style.setProperty("letter-spacing", letterSpacing.toFixed(3) + "px", "important");
  }

  function scheduleLogoSubtitleSync() {
    requestAnimationFrame(syncLogoSubtitle);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleLogoSubtitleSync);
  } else {
    scheduleLogoSubtitleSync();
  }

  window.addEventListener("load", scheduleLogoSubtitleSync);
  window.addEventListener("resize", scheduleLogoSubtitleSync, { passive: true });

  [250, 1000].forEach(function (delay) {
    window.setTimeout(scheduleLogoSubtitleSync, delay);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleLogoSubtitleSync);
  }
}());
