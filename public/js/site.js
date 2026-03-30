// public/js/site.js

// Scroll to top on page refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Welcome popup — shows once per session after 2 seconds
if (!sessionStorage.getItem('welcomeSeen')) {
  setTimeout(() => {
    const popup = document.getElementById('welcomePopup');
    const closeBtn = document.getElementById('welcomeClose');
    const actionBtn = document.getElementById('welcomeBtn');
    const msgEl = document.getElementById('welcomeMsg');
    if (!popup) return;

    // Show popup
    popup.classList.add('show');

    // Typewriter effect
    const fullText = msgEl.getAttribute('data-text');
    msgEl.textContent = '';
    let i = 0;
    const typer = setInterval(() => {
      msgEl.textContent += fullText[i];
      i++;
      if (i >= fullText.length) clearInterval(typer);
    }, 30);

    // Auto close after 3 seconds
    function closePopup() {
      popup.classList.remove('show');
      sessionStorage.setItem('welcomeSeen', '1');
      clearInterval(typer);
    }
    setTimeout(closePopup, 6000);
    closeBtn.addEventListener('click', closePopup);
    actionBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }, 2000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      once: true,
      mirror: false,
      duration: 600,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // Carrot scroll to top
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});