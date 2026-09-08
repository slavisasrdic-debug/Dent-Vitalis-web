
(function () {
  var imageAltMap = [
    ["GR-DV", "Valutazione Google di DentVitalis"],
    ["Sedazione-cosciente", "Paziente durante un trattamento odontoiatrico presso DentVitalis"],
    ["ponte-fisso-su-impianti", "Ponte fisso su impianti dentali"],
    ["Sbiancamento-dei-denti", "Trattamento di sbiancamento dentale"],
    ["Recenzija", "Paziente DentVitalis durante una testimonianza"],
    ["Dv-4", "Corone, faccette, ponti e protesi dentali"],
    ["DV-44", "Interni della clinica DentVitalis a Rijeka"],
    ["Dv-3", "Trattamento di sbiancamento dentale"],
    ["Dr-Sime", "Dr. Šime Živković, dentista DentVitalis"],
    ["I-nostri-specialisti", "Specialisti dentali della clinica DentVitalis"],
    ["Come-raggiungerci", "Clinica DentVitalis a Rijeka"],
    ["Laboratorio-odontotecnico", "Laboratorio odontotecnico DentVitalis"],
    ["Materiali-e-apparecchiature", "Materiali e apparecchiature dentali DentVitalis"],
    ["Tutto-in-un-unico-luogo", "Interni della clinica DentVitalis a Rijeka"],
    ["Prima-visita-gratuita", "Prima visita dentistica presso DentVitalis"],
    ["Tempi-del-trattamento", "Pianificazione del trattamento dentale"],
    ["Pagamento-flessibile", "Opzioni di pagamento per trattamenti dentali"],
    ["Garanzie", "Garanzie per trattamenti dentali DentVitalis"],
    ["Dentvitalis-Dedo", "Accoglienza presso la clinica DentVitalis"],
    ["DV-cjenik", "Listino prezzi delle prestazioni DentVitalis"],
    ["Contatti", "Reception della clinica DentVitalis a Rijeka"],
    ["6a96aa744c5444ffc6cfb3de_image.webp", "Trattamenti dentali presso DentVitalis a Rijeka"],
    ["Google%20logo", "Google"]
  ];

  function updateImageAlt(image) {
    if (!image || image.getAttribute("alt")) return;

    var source = image.currentSrc || image.src || "";
    var match = imageAltMap.find(function (entry) {
      return source.indexOf(entry[0]) !== -1;
    });

    if (match) image.setAttribute("alt", match[1]);
  }

  function updateImageAlts(root) {
    if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;

    if (root.matches && root.matches("img")) {
      updateImageAlt(root);
    }

    root.querySelectorAll("img").forEach(updateImageAlt);
  }

  function start() {
    updateImageAlts(document);

    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(updateImageAlts);
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}());
