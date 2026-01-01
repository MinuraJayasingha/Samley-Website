document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".discover-tea-carosal");
  const prevBtn = document.querySelector(".btn-prev");
  const nextBtn = document.querySelector(".btn-next");

  if (!carousel || !prevBtn || !nextBtn) return;

  const card = carousel.querySelector(".discover-p-card");
  const cardWidth = card.offsetWidth + 20; // card + gap

  function updateButtons() {
    const maxScrollLeft =
      carousel.scrollWidth - carousel.clientWidth;

    prevBtn.classList.toggle(
      "active",
      carousel.scrollLeft > 5
    );

    nextBtn.classList.toggle(
      "active",
      carousel.scrollLeft < maxScrollLeft - 5
    );
  }

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });
  });

  carousel.addEventListener("scroll", updateButtons);

  // Init state
  updateButtons();
});
