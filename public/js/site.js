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
    if (!popup) return;
    popup.classList.add('show');
    function closePopup() {
      popup.classList.remove('show');
      sessionStorage.setItem('welcomeSeen', '1');
    }
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