// public/js/site.js

// Scroll to top on page refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

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