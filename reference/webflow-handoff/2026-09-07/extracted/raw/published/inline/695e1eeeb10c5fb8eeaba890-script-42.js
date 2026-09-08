
  // Zajedničke postavke (typeSpeed: 80, backSpeed: 20 → brisanje dvostruko brže)
  var commonOptions = {
    typeSpeed: 30,
    backSpeed: 10,
    backDelay: 3000,
    startDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: "|"
  };

  // (3a) Mobilna verzija
  var mobileEl = document.querySelector('.tipkajuca-rijec');
  if (mobileEl) {
    mobileEl.innerHTML = '';
    new Typed('.tipkajuca-rijec', Object.assign({}, commonOptions, {
      strings: [
				"A prescindere dal numero di impiantI E…",
				"in sole 24 ore.",
				"Alloggio esclusivo in clinica."
      ]
    }));
  }

  // (3b) Desktop verzija
  var desktopEl = document.querySelector('.tipkajuca-rijec-desktop');
  if (desktopEl) {
    desktopEl.innerHTML = '';
    new Typed('.tipkajuca-rijec-desktop', Object.assign({}, commonOptions, {
      strings: [
				"qualunque numero di impianti...",
				"in sole 24 ore...",
				"senza costi nascosti..."        
      ]
    }));
  }
