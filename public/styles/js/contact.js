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
