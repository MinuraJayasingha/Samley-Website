/* wholesale-anim.js — scroll reveals + counter animations for wholesale2.html */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal ─────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.wv2-animate');
    if (!els.length) return;

    els.forEach(el => {
      const delay = el.dataset.delay || 0;
      el.style.setProperty('--wv2-delay', delay + 'ms');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('wv2-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  /* ── Counter animation ─────────────────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.wv2-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── Timeline connector draw ───────────────────────────────── */
  function initConnectors() {
    const steps = document.querySelectorAll('.wv2-step');
    if (!steps.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(steps).indexOf(entry.target);
          entry.target.style.setProperty('--step-delay', (idx * 100) + 'ms');
          entry.target.classList.add('wv2-step-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    steps.forEach(el => observer.observe(el));
  }

  /* ── Init ──────────────────────────────────────────────────── */
  if (REDUCED) {
    document.querySelectorAll('.wv2-animate').forEach(el => el.classList.add('wv2-in'));
    document.querySelectorAll('.wv2-counter').forEach(el => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    document.querySelectorAll('.wv2-step').forEach(el => el.classList.add('wv2-step-in'));
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveal();
      initCounters();
      initConnectors();
    });
  } else {
    initReveal();
    initCounters();
    initConnectors();
  }
})();
