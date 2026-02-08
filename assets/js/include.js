// assets/js/include.js

const DEBUG_INCLUDE = true; // set false for production

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

    const res = await fetch(filePath, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    container.innerHTML = await res.text();

    INCLUDE_LOG(`Component loaded: ${filePath}`, "success");

    if (typeof onLoaded === "function") {
      onLoaded();
      INCLUDE_LOG(`Callback executed for ${filePath}`, "success");
    }

  } catch (err) {
    INCLUDE_LOG(`Failed to load ${filePath} → ${err.message}`, "error");
  }
}

function loadScript(src, onLoad) {
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.onload = () => {
    INCLUDE_LOG(`Script loaded: ${src}`, "success");
    if (typeof onLoad === "function") onLoad();
  };
  script.onerror = () =>
    INCLUDE_LOG(`Script failed to load: ${src}`, "error");

  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", async () => {
  INCLUDE_LOG("DOMContentLoaded fired", "info");

  // 🔹 NAVBAR
  await loadComponent("#navbar", "/components/navbar.html", () => {
    loadScript("/assets/js/navbar.js");
  });

  // 🔹 FOOTER
  await loadComponent("#footer", "/components/footer.html");

  // 🔹 INSTAGRAM SECTION
  await loadComponent(
    "#instagram-section",
    "/components/instagram.html"
  );

  // 🔹 COLLECTIONS HIGHLIGHT
  await loadComponent(
    "#collections-section",
    "/components/collections-highlight.html"
  );

  // 🔹 FEATURED CATEGORIES
  await loadComponent(
    "#featured-categories-section",
    "/components/featured-categories.html",
    () => loadScript("/assets/js/featured-categories.js")
  );

  // 🔹 FEATURED PRODUCTS
  await loadComponent(
    "#featured-products-section",
    "/components/featured-products.html",
    () => loadScript("/assets/js/featured-products.js")
  );

  // 🔹 REVIEWS
  await loadComponent(
    "#reviews-section",
    "/components/reviews.html",
    () => loadScript("/assets/js/reviews.js", () => {
      if (typeof initReviews === "function") {
        initReviews();
      }
    })
  );

  // 🔹 DATA-INCLUDE SUPPORT (optional legacy)
  document.querySelectorAll("[data-include]").forEach(async el => {
    const file = el.getAttribute("data-include");

    try {
      const res = await fetch(file, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();
      INCLUDE_LOG(`Loaded data-include: ${file}`, "success");
    } catch (err) {
      INCLUDE_LOG(`Failed data-include: ${file}`, "error");
    }
  });

  INCLUDE_LOG("All components processed", "success");
});
