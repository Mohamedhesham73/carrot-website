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
      once: false,   // animate every time you scroll back
      mirror: true,  // animate out on scroll past
      duration: 700,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }
});