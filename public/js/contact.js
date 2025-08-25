// public/js/contact.js
(function () {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Sending...';
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json.status !== 'ok') {
        const msg =
          json?.errors?.map?.(e => `${e.field}: ${e.msg}`).join(', ') ||
          json?.error || 'Failed to send';
        statusEl.textContent = msg;
        statusEl.style.color = 'crimson';
        return;
      }
      statusEl.textContent = 'Thanks! We’ll be in touch shortly.';
      statusEl.style.color = 'green';
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again.';
      statusEl.style.color = 'crimson';
    }
  });
})();

// Pack prefill with pretty pill (CSP-safe, no inline)
(() => {
  const params   = new URLSearchParams(location.search);
  const pack     = params.get('pack'); // e.g., 'websites'
  const hidden   = document.getElementById('selectedPack');
  const wrap     = document.getElementById('packPillWrap');
  const labelEl  = document.getElementById('selectedPackLabel');
  const clearBtn = document.getElementById('clearPack');

  if (pack && hidden && wrap && labelEl) {
    hidden.value = pack;
    wrap.classList.remove('d-none');
    labelEl.textContent = prettyPackName(pack);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (hidden) hidden.value = '';
      if (wrap) wrap.classList.add('d-none');
      // remove ?pack= from the URL without reloading
      params.delete('pack');
      const q = params.toString();
      history.replaceState({}, '', location.pathname + (q ? ('?' + q) : ''));
    });
  }

  function prettyPackName(slug) {
    const map = {
      'social-media': 'Social Media',
      'websites':     'Websites',
      'google-ads':   'Google Ads',
      'designs':      'Designs Packages',
      'reels':        'Reels',
      'seo':          'SEO'
    };
    return map[slug] || slug;
  }
})();


