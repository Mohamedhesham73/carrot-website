// public/js/theme-color.js
(function () {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const set = () => meta.setAttribute('content', mql.matches ? '#111111' : '#FF7F27');
  set();
  if (mql.addEventListener) mql.addEventListener('change', set);
  else if (mql.addListener) mql.addListener(set); // older Safari/Chrome
})();
