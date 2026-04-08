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

    // Auto close after 6 seconds
    function closePopup() {
      popup.classList.remove('show');
      sessionStorage.setItem('welcomeSeen', '1');
      clearInterval(typer);
    }
    setTimeout(closePopup, 6000);
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (actionBtn) actionBtn.addEventListener('click', closePopup);
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

  // Animated stats counter
  function animateStat(el) {
    const text = el.getAttribute('data-target');
    // Extract prefix, number, suffix
    const match = text.match(/^([+\-]?)(\d+\.?\d*)([x%s+]*)$/);
    if (!match) { el.textContent = text; return; }
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = prefix + (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
      } else {
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      }
    }, duration / steps);
  }

  // Observe all .stat elements
  const stats = document.querySelectorAll('.stat');
  if (stats.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateStat(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
      // Save original text as data-target
      stat.setAttribute('data-target', stat.textContent.trim());
      stat.textContent = '0';
      observer.observe(stat);
    });
  }
});