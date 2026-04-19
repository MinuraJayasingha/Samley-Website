// Unified scroll-reveal system for Samley Website

(function () {

  const EASING_OFFSET = 80; // px from bottom of viewport to trigger

  // ── 1. Standard reveal classes ──────────────────────────────────────────
  const revealSel = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade';

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      if (delay) {
        setTimeout(() => el.classList.add('active'), delay);
      } else {
        el.classList.add('active');
      }
      revealObserver.unobserve(el);
    });
  }, {
    rootMargin: `0px 0px -${EASING_OFFSET}px 0px`,
    threshold: 0.08
  });

  document.querySelectorAll(revealSel).forEach(el => revealObserver.observe(el));

  // ── 2. Wholesale wv2-animate (uses data-delay in ms) ────────────────────
  const wv2Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in-view'), delay);
      wv2Observer.unobserve(el);
    });
  }, {
    rootMargin: `0px 0px -${EASING_OFFSET}px 0px`,
    threshold: 0.08
  });

  document.querySelectorAll('.wv2-animate').forEach(el => wv2Observer.observe(el));

  // ── 3. Auto-stagger: siblings that share the same reveal parent ──────────
  // Any container with data-stagger gets its direct .reveal-scale/.reveal children
  // assigned progressive data-delay values automatically.
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const base = parseInt(container.dataset.stagger || 80, 10);
    const children = container.querySelectorAll(':scope > .reveal, :scope > .reveal-scale');
    children.forEach((child, i) => {
      if (!child.dataset.delay) child.dataset.delay = i * base;
    });
  });

})();
