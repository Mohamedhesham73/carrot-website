// public/js/theme.js
(function () {
  const FALLBACK_META = document.querySelector('meta[name="theme-color"]'); // the one without media=
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const BRAND = '#FF7F27';
  const DARK  = '#111111';

  function systemPrefersDark() { return prefersDark.matches; }

  function apply(mode) {
    // mode: 'light' | 'dark' | 'auto'
    let dark = mode === 'dark' || (mode === 'auto' && systemPrefersDark());
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    if (FALLBACK_META) FALLBACK_META.setAttribute('content', dark ? DARK : BRAND);

    // toggle icon
    const btn = document.getElementById('themeToggle');
    if (btn) btn.querySelector('.theme-icon').textContent = dark ? '☀️' : '🌙';
  }

  // Load saved pref (default auto)
  const saved = localStorage.getItem('theme') || 'auto';
  apply(saved);

  // Respond to OS changes when in 'auto'
  function onSystemChange() {
    const current = localStorage.getItem('theme') || 'auto';
    if (current === 'auto') apply('auto');
  }
  if (prefersDark.addEventListener) prefersDark.addEventListener('change', onSystemChange);
  else if (prefersDark.addListener) prefersDark.addListener(onSystemChange);

  // Toggle button cycles: auto → dark → light → auto
  const order = ['auto', 'dark', 'light'];
  document.addEventListener('click', (e) => {
    if (e.target.closest('#themeToggle')) {
      let cur = localStorage.getItem('theme') || 'auto';
      let next = order[(order.indexOf(cur) + 1) % order.length];
      localStorage.setItem('theme', next);
      apply(next);
    }
  });
})();
