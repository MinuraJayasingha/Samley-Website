// assets/js/smooth-scroll.js

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => revealObserver.observe(el));

/* =====================================
   SMOOTH SCROLL ENHANCER
   (Lightweight & Safe)
===================================== 

let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
let isScrolling = false;

const ease = 0.05; // 🔥 lower = slower (0.05–0.12 ideal)

function smoothScrollLoop() {
  currentScroll += (targetScroll - currentScroll) * ease;

  if (Math.abs(targetScroll - currentScroll) < 0.5) {
    currentScroll = targetScroll;
    isScrolling = false;
    return;
  }

  window.scrollTo(0, currentScroll);
  requestAnimationFrame(smoothScrollLoop);
}

window.addEventListener("wheel", (e) => {
  e.preventDefault();

  targetScroll += e.deltaY;
  targetScroll = Math.max(
    0,
    Math.min(
      targetScroll,
      document.body.scrollHeight - window.innerHeight
    )
  );

  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(smoothScrollLoop);
  }
}, { passive: false });*/

