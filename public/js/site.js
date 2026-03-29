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
});