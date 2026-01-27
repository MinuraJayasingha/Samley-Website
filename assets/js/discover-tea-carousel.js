document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".discover-tea-carosal");
  const prevBtn = document.querySelector(".btn-prev");
  const nextBtn = document.querySelector(".btn-next");

  if (!carousel || !prevBtn || !nextBtn) return;

  const cards = carousel.querySelectorAll(".discover-p-card");
  const cardWidth = cards[0].offsetWidth + 20; // card + gap
  const originalWidth = cardWidth * 4; // Width of 4 original cards

  function updateButtons() {
    const scrollLeft = carousel.scrollLeft;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    // Adjust for infinite loop
    const adjustedScrollLeft = scrollLeft >= originalWidth ? scrollLeft - originalWidth : scrollLeft;

    prevBtn.classList.toggle("active", adjustedScrollLeft > 5);
    nextBtn.classList.toggle("active", adjustedScrollLeft < originalWidth - carousel.clientWidth - 5);
  }

  function scrollNext() {
    carousel.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });
  }

  function handleScroll() {
    const scrollLeft = carousel.scrollLeft;
    if (scrollLeft >= originalWidth) {
      // Jump back to start instantly for infinite loop
      carousel.scrollLeft = scrollLeft - originalWidth;
    }
    updateButtons();
  }

  prevBtn.addEventListener("click", () => {
    const scrollLeft = carousel.scrollLeft;
    if (scrollLeft <= 0) {
      // Jump to the duplicated part
      carousel.scrollLeft = originalWidth;
    }
    carousel.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", scrollNext);

  carousel.addEventListener("scroll", handleScroll);

  // Auto-scroll every 3 seconds
  setInterval(scrollNext, 3000);

  // Init state
  updateButtons();
});
