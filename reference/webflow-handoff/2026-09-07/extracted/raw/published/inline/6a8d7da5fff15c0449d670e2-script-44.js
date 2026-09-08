
(function () {
  var desktop = window.matchMedia("(min-width: 992px)");
  var sections = Array.prototype.slice.call(document.querySelectorAll(".teaser-section")).map(function (section) {
    var images = Array.prototype.slice.call(section.querySelectorAll(".p-teaser-img-wrap img"));
    return {
      cards: Array.prototype.slice.call(section.querySelectorAll(".teaser-copy-wrap")),
      images: images,
      originalSizes: images.map(function (image) { return image.getAttribute("sizes"); }),
      active: null,
      sizedForDesktop: null
    };
  });

  function visible(elements) {
    return elements.filter(function (element) {
      return element.getClientRects().length > 0;
    });
  }

  function updateSizing(item) {
    var desktopNow = desktop.matches;
    if (item.sizedForDesktop === desktopNow) return;
    item.images.forEach(function (image, index) {
      if (desktopNow) image.setAttribute("sizes", "2000px");
      else if (item.originalSizes[index]) image.setAttribute("sizes", item.originalSizes[index]);
      else image.removeAttribute("sizes");
    });
    item.sizedForDesktop = desktopNow;
  }

  function clearImages(item) {
    item.images.forEach(function (image) {
      image.style.opacity = "";
      image.style.transform = "";
      image.style.transition = "";
      image.style.willChange = "";
    });
    item.active = null;
  }

  function update() {
    sections.forEach(function (item) {
      updateSizing(item);
      if (!desktop.matches) {
        if (item.active !== null) clearImages(item);
        return;
      }

      var cards = visible(item.cards);
      var images = visible(item.images);
      if (!cards.length || cards.length !== images.length) return;

      var active = 0;
      cards.forEach(function (card, index) {
        if (window.scrollY + 24 >= card.getBoundingClientRect().top + window.scrollY) active = index;
      });

      if (item.active === active) return;
      images.forEach(function (image, index) {
        var hasPassed = index < active;
        image.style.willChange = "transform, opacity";
        image.style.transition = "opacity 600ms cubic-bezier(0.45, 0, 0.55, 1), transform 900ms cubic-bezier(0.45, 0, 0.55, 1)";
        image.style.opacity = hasPassed ? "0" : "1";
        image.style.transform = hasPassed ? "scale(1.2)" : "scale(1)";
      });
      item.active = active;
    });
  }

  var scheduled = false;
  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      update();
    });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  if (desktop.addEventListener) desktop.addEventListener("change", requestUpdate);
  else desktop.addListener(requestUpdate);
  requestUpdate();
}());
