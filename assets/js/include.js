// assets/js/include.js

const DEBUG_INCLUDE = true; // 🔴 set false for production

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

    const html = await res.text();
    container.innerHTML = html;

    INCLUDE_LOG(`Component loaded successfully: ${filePath}`, "success");

    if (typeof onLoaded === "function") {
      onLoaded();
      INCLUDE_LOG(`Init callback executed for ${filePath}`, "success");
    }

  } catch (err) {
    INCLUDE_LOG(`Failed to load ${filePath} → ${err.message}`, "error");
  }
}



document.addEventListener("DOMContentLoaded", async () => {
  INCLUDE_LOG("DOMContentLoaded fired", "info");

  // Navbar
  await loadComponent("#navbar", "components/navbar.html", () => {
    INCLUDE_LOG("Injecting navbar.js", "info");

    const script = document.createElement("script");
    script.src = "assets/js/navbar.js";
    script.onload = () => INCLUDE_LOG("navbar.js loaded", "success");
    script.onerror = () => INCLUDE_LOG("navbar.js failed to load", "error");
    document.head.appendChild(script);
  });

  // Footer
  await loadComponent("#footer", "components/footer.html");

  // Instagram (HTML only)
  await loadComponent("#instagram-section", "components/instagram.html");

  // Collections highlight
  await loadComponent("#collections-section", "components/collections-highlight.html");

  // Featured Categories (HTML + JS)
  await loadComponent(
    "#featured-categories-section",
    "components/featured-categories.html"
  );
  // Load featured-categories.js AFTER HTML exists
  const featuredScript = document.createElement("script");
  featuredScript.src = "assets/js/featured-categories.js";
  document.body.appendChild(featuredScript);

  // Featured Products (HTML + JS)
  await loadComponent(
    "#featured-products-section",
    "components/featured-products.html",
    () => {
      INCLUDE_LOG("Injecting featured-products.js", "info");

      const script = document.createElement("script");
      script.src = "assets/js/featured-products.js";
      script.onload = () =>
        INCLUDE_LOG("featured-products.js loaded", "success");
      script.onerror = () =>
        INCLUDE_LOG("featured-products.js failed to load", "error");

      document.body.appendChild(script);
    }
  );
  document.querySelectorAll("[data-include]").forEach(async el => {
    const file = el.getAttribute("data-include");

    try {
      const res = await fetch(file);
      el.innerHTML = await res.text();
      console.log(`[Include] Loaded: ${file}`);
    } catch (err) {
      console.error(`[Include] Failed: ${file}`, err);
    }
  });

  // Reviews Section (HTML + JS)
  await loadComponent(
    "#reviews-section",
    "components/reviews.html",
    () => {
      INCLUDE_LOG("Injecting reviews.js", "info");

      const script = document.createElement("script");
      script.src = "assets/js/reviews.js";
      script.onload = () => {
        INCLUDE_LOG("reviews.js loaded", "success");
        initReviews(); // 🔥 IMPORTANT
      };
      script.onerror = () =>
        INCLUDE_LOG("reviews.js failed to load", "error");

      document.body.appendChild(script);
    }
  );


  INCLUDE_LOG("All components processed", "success");
});