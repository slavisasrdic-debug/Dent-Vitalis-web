
(function dvParentDropdownLinks() {
  var destinations = {
    "Prestazioni": "/prestazioni-dentali",
    "Su di noi": "/chi-siamo",
    "Informazioni": "/informazioni-per-pazienti"
  };
  var desktopQuery = window.matchMedia("(min-width: 992px)");

  function stopDesktopArrowToggle(event) {
    if (!desktopQuery.matches) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function bindParentLinks() {
    document.querySelectorAll(".nav-dropdown-toggle").forEach(function(toggle) {
      var title = toggle.querySelector(".nav-item-title");
      var arrows = toggle.querySelectorAll(".nav-dropdown-icon, .nav-arrow-wrap");
      var label = title && title.textContent.trim();
      var destination = destinations[label];

      if (!destination || !title) return;

      if (title.dataset.dvParentLink !== "true") {
        title.dataset.dvParentLink = "true";
        title.setAttribute("role", "link");
        title.setAttribute("tabindex", "0");
        title.setAttribute("aria-label", label + " - apri la pagina");

        ["pointerdown", "mousedown", "touchstart"].forEach(function(eventName) {
          title.addEventListener(eventName, function(event) {
            event.stopPropagation();
          });
        });

        title.addEventListener("click", function(event) {
          event.preventDefault();
          event.stopPropagation();
          window.location.assign(destination);
        });

        title.addEventListener("keydown", function(event) {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          window.location.assign(destination);
        });
      }

      arrows.forEach(function(arrow) {
        if (arrow.dataset.dvArrowReady === "true") return;
        arrow.dataset.dvArrowReady = "true";
        ["pointerdown", "mousedown", "touchstart", "click"].forEach(function(eventName) {
          arrow.addEventListener(eventName, stopDesktopArrowToggle);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindParentLinks);
  } else {
    bindParentLinks();
  }
})();
