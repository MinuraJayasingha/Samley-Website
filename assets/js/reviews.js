// assets/js/reviews.js

async function initReviews() {
  const rowLeft = document.querySelector(".row-left");
  const rowRight = document.querySelector(".row-right");

  // Safety check
  if (!rowLeft || !rowRight) {
    console.warn("[Reviews] Review rows not found");
    return;
  }

  try {
    const res = await fetch("data/reviews.json");
    if (!res.ok) throw new Error("Failed to load reviews.json");

    const data = await res.json();

    rowLeft.innerHTML = "";
    rowRight.innerHTML = "";

    data.forEach((review, index) => {
      const card = createReviewCard(review);
      (index % 2 === 0 ? rowLeft : rowRight).appendChild(card);
    });

    // Desktop auto scroll
// Desktop auto scroll
autoScroll(rowLeft, 1);

// Force second row to start from right
rowRight.scrollLeft = rowRight.scrollWidth - rowRight.clientWidth;
autoScroll(rowRight, -1);


    // Mobile auto slide
    autoSlideMobile(rowLeft);

    console.log("[Reviews] Initialized successfully");
  } catch (err) {
    console.error("[Reviews] Error:", err);
  }
}

function createReviewCard({ comment, name, company, rating }) {
  const div = document.createElement("div");
  div.className = "review-card";

  div.innerHTML = `
    <div class="quote">“</div>
    <p>"${comment}"</p>
    <div class="review-footer">
      <div>
        <strong>${name}</strong><br>
        <small>${company}</small>
      </div>
      <div class="stars">${renderStars(rating)}</div>
    </div>
  `;

  return div;
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars += "★";
    else if (rating >= i - 0.5) stars += "☆"; // later we can replace with half-star SVG
    else stars += "☆";
  }
  return stars;
}

function autoScroll(container, initialSpeed) {
  let direction = initialSpeed; // +1 or -1

  setInterval(() => {
    container.scrollLeft += direction;

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    // Reach right end
    if (container.scrollLeft >= maxScroll) {
      direction = -Math.abs(initialSpeed);
    }

    // Reach left start
    if (container.scrollLeft <= 0) {
      direction = Math.abs(initialSpeed);
    }
  }, 30);
}

function autoSlideMobile(container) {
  if (window.innerWidth > 768) return;

  let index = 0;
  const cardWidth = 340;

  setInterval(() => {
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });

    index = (index + 1) % container.children.length;
  }, 4000);
}
