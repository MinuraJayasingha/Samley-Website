// assets/js/include.js

const DEBUG_INCLUDE = true; // set false in production

function INCLUDE_LOG(message, type = "info") {
  if (!DEBUG_INCLUDE) return;

  const styles = {
    info: "color:#2563eb; font-weight:500",
    success: "color:#16a34a; font-weight:500",
    warn: "color:#ca8a04; font-weight:500",
    error: "color:#dc2626; font-weight:600"
  };

  console.log(`%c[Include] ${message}`, styles[type]);
}

async function loadComponent(selector, filePath, onLoaded) {
  const container = document.querySelector(selector);

  if (!container) {
    INCLUDE_LOG(`Container not found: ${selector}`, "warn");
    return;
  }

  try {
    INCLUDE_LOG(`Loading component: ${filePath}`, "info");

    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    container.innerHTML = await res.text();
    INCLUDE_LOG(`Loaded: ${filePath}`, "success");

    if (typeof onLoaded === "function") onLoaded();
  } catch (err) {
    INCLUDE_LOG(`Failed: ${filePath} → ${err.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  INCLUDE_LOG("DOMContentLoaded fired", "info");

  // Navbar
  await loadComponent("#navbar", "/components/navbar.html", () => {
    const script = document.createElement("script");
    script.src = "/assets/js/navbar.js";
    document.head.appendChild(script);
  });

  // Footer
  await loadComponent("#footer", "/components/footer.html");

  // Instagram
  await loadComponent("#instagram-section", "/components/instagram.html");

  // Collections
  await loadComponent(
    "#collections-section",
    "/components/collections-highlight.html"
  );

  // Featured Categories
  await loadComponent(
    "#featured-categories-section",
    "/components/featured-categories.html",
    () => {
      const s = document.createElement("script");
      s.src = "/assets/js/featured-categories.js";
      document.body.appendChild(s);
    }
  );

  // Featured Products
  await loadComponent(
    "#featured-products-section",
    "/components/featured-products.html",
    () => {
      const s = document.createElement("script");
      s.src = "/assets/js/featured-products.js";
      document.body.appendChild(s);
    }
  );

  // Reviews
  await loadComponent(
    "#reviews-section",
    "/components/reviews.html",
    () => {
      const s = document.createElement("script");
      s.src = "/assets/js/reviews.js";
      s.onload = () => window.initReviews && initReviews();
      document.body.appendChild(s);
    }
  );

  INCLUDE_LOG("All components processed", "success");
});
