
(function () {
  function setFileUploadHintCopy() {
    document.querySelectorAll(".dv-file-upload-hint").forEach(function (hint) {
      if (/^max\s*8\s*mb$/i.test(hint.textContent.trim())) {
        hint.textContent = "PDF, JPG o PNG · max 8 MB";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setFileUploadHintCopy);
  } else {
    setFileUploadHintCopy();
  }

  window.setTimeout(setFileUploadHintCopy, 250);
}());
