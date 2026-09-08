
(function () {
  var externalPrivacyLink = /^(?:https?:)?\/\/(?:www\.)?dentvitalis\.com\/informativa-sulla-privacy\/?$/i;

  function updatePrivacyLink(link) {
    if (
      link &&
      link.closest(".dv-native-form") &&
      externalPrivacyLink.test(link.getAttribute("href") || "")
    ) {
      link.setAttribute("href", "/informativa-sulla-privacy");
    }
  }

  function updatePrivacyLinks(root) {
    if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;

    if (root.matches && root.matches("a")) {
      updatePrivacyLink(root);
    }

    root.querySelectorAll("a[href*='dentvitalis.com/informativa-sulla-privacy']").forEach(updatePrivacyLink);
  }

  function start() {
    updatePrivacyLinks(document);

    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(updatePrivacyLinks);
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}());
