// assets/js/include.js

const DEBUG_INCLUDE = true;

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
    INCLUDE_LOG(`Component loaded: ${filePath}`, "success");

    if (typeof onLoaded === "function") onLoaded();

  } catch (err) {
    INCLUDE_LOG(`Failed to load ${filePath} → ${err.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  // ✅ Navbar
  await loadComponent("#navbar", "/components/navbar.html", () => {
    const script = document.createElement("script");
    script.src = "/assets/js/navbar.js";
    document.head.appendChild(script);
  });

  // ✅ Footer
  await loadComponent("#footer", "/components/footer.html");

  // ✅ Instagram
  await loadComponent("#instagram-section", "/components/instagram.html");

  // ✅ Collections highlight
  await loadComponent(
    "#collections-section",
    "/components/collections-highlight.html"
  );

  // ✅ Featured categories
  await loadComponent(
    "#featured-categories-section",
    "/components/featured-categories.html"
  );
  const featuredScript = document.createElement("script");
  featuredScript.src = "/assets/js/featured-categories.js";
  document.body.appendChild(featuredScript);

  // ✅ Featured products
  await loadComponent(
    "#featured-products-section",
    "/components/featured-products.html",
    () => {
      const script = document.createElement("script");
      script.src = "/assets/js/featured-products.js";
      document.body.appendChild(script);
    }
  );

  // ✅ data-include support
  document.querySelectorAll("[data-include]").forEach(async el => {
    const file = el.getAttribute("data-include");

    try {
      const res = await fetch(file.startsWith("/") ? file : `/${file}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(`[Include] Failed: ${file}`, err);
    }
  });

  // ✅ Reviews
  await loadComponent(
    "#reviews-section",
    "/components/reviews.html",
    () => {
      const script = document.createElement("script");
      script.src = "/assets/js/reviews.js";
      script.onload = () => initReviews();
      document.body.appendChild(script);
    }
  );

  INCLUDE_LOG("All components loaded successfully", "success");
});
