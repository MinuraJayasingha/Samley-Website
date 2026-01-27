// Herbal Infusion Cards Carousel with Infinite Loop
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".content-bottom-cards");

  if (!carousel) return;

  const cards = carousel.querySelectorAll(".content-bottom-card");
  if (cards.length === 0) return;

  const cardWidth = cards[0].offsetWidth + 10; // card + gap
  const numOriginalCards = cards.length / 2; // We have duplicates for infinite loop
  const originalWidth = cardWidth * numOriginalCards;

  let scrollTimeout;

  function handleScroll() {
    // Clear previous timeout
    clearTimeout(scrollTimeout);

    // Check if we've scrolled past the original cards
    scrollTimeout = setTimeout(() => {
      const scrollLeft = carousel.scrollLeft;
      
      // If scrolled to the duplicated section, jump back to start
      if (scrollLeft >= originalWidth) {
        carousel.scrollLeft = scrollLeft - originalWidth;
      }
      // If scrolled too far left, jump to the duplicated section
      else if (scrollLeft <= 0) {
        carousel.scrollLeft = originalWidth;
      }
    }, 100);
  }

  // Auto-scroll function (scroll one card at a time)
  function autoScroll() {
    const currentScroll = carousel.scrollLeft;
    carousel.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });
  }

  // Set up event listeners
  carousel.addEventListener("scroll", handleScroll);

  // Auto-scroll every 4 seconds
  setInterval(autoScroll, 4000);
});
