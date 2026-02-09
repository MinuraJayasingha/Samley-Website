// assets/js/product.js

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

// Get product slug from URL
function getProductSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug") || params.get("product"); // Support both for backward compatibility
}

// Set meta value and auto-hide if empty
function setMetaValue(id, value) {
    const span = document.getElementById(id);
    if (!span) return;

    const li = span.closest("li");

    if (!value || value.trim() === "") {
        li.classList.add("hidden");
    } else {
        span.textContent = value;
        li.classList.remove("hidden");
    }
}


/* --------------------------------------------------
   Main loader
-------------------------------------------------- */

async function loadProduct() {
    const slug = getProductSlug();

    if (!slug) {
        console.warn("No product slug found in URL");
        return;
    }

    try {
        const res = await fetch("data/products.json");
        if (!res.ok) {
            console.error("Failed to fetch products.json:", res.status);
            return;
        }

        const products = await res.json();
        const product = products.find(p => p.slug === slug);

        if (!product) {
            console.warn("Product not found for slug:", slug);
            return;
        }

        injectProductData(product);
        updateBreadcrumbForProduct(product);

    } catch (error) {
        console.error("Error loading product:", error);
    }
}


/* --------------------------------------------------
   Inject product data
-------------------------------------------------- */

function injectProductData(product) {

    /* ---------- SEO ---------- */

    if (product.seoTitle) {
        document.title = product.seoTitle;
    }

    if (product.seoDescription) {
        const metaDesc = document.getElementById("meta-description");
        if (metaDesc) {
            metaDesc.setAttribute("content", product.seoDescription);
        }
    }

    /* ---------- Content ---------- */

    document.getElementById("product-title").textContent =
        product.seoTitle || product.name;

    document.getElementById("product-long-description").textContent =
        product.longDescription || "";

    document.getElementById("product-pack").textContent =
        product.packInfo || "";

    /* ---------- Meta (auto hide empty) ---------- */

    setMetaValue("product-brand", product.brand);
    setMetaValue("product-item-form", product.itemForm);
    setMetaValue("product-variety", product.teaVariety);
    setMetaValue("product-spice-type", product.spiceType);
    setMetaValue("product-beverage-type", product.beverageType);
    setMetaValue("product-type", product.type);
    setMetaValue("product-unit-count", product.unitCount);

    /* ---------- Rating ---------- */

    document.getElementById("product-review-count").textContent =
        product.reviewCount ? `(${product.reviewCount})` : "";

    document.getElementById("product-stars").textContent =
        product.rating ? "".repeat(Math.round(product.rating)) : "";

    /* ---------- Gallery ---------- */

    const mainImage = document.getElementById("product-main-image");
    const thumbs = document.querySelector(".product-thumbnails");

    if (product.galleryImages && product.galleryImages.length > 0) {
        mainImage.src = product.galleryImages[0];
        mainImage.alt = product.name;

        thumbs.innerHTML = "";

        product.galleryImages.forEach(img => {
            const t = document.createElement("img");
            t.src = img;
            t.alt = product.name;
            thumbs.appendChild(t);
        });

        enableGalleryInteraction();
    }
}


/* --------------------------------------------------
   Breadcrumb
-------------------------------------------------- */

function updateBreadcrumbForProduct(product) {
    fetch("data/categories.json")
        .then(res => {
            if (!res.ok) {
                console.error("Failed to fetch categories.json:", res.status);
                return;
            }
            return res.json();
        })
        .then(categories => {
            if (!categories) return;

            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === product.subCategory) {

                        document.getElementById("breadcrumb-main-category").innerHTML =
                            `<a href="/products/${main.slug}/">${main.title}</a>`;

                        document.getElementById("breadcrumb-sub-category").innerHTML =
                            `<a href="/products/${sub.slug}/">
                                ${sub.title}
                             </a>`;
                    }
                });
            });
        })
        .catch(error => console.error("Error loading categories:", error));

    const productEl = document.getElementById("breadcrumb-product");
    if (productEl) {
        productEl.textContent = product.name;
        productEl.classList.remove("hidden");
    }
}


/* --------------------------------------------------
   Gallery interaction
-------------------------------------------------- */

function enableGalleryInteraction() {
    const mainImage = document.getElementById("product-main-image");
    const thumbnails = document.querySelectorAll(".product-thumbnails img");

    thumbnails.forEach(thumb => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;
        });
    });
}


/* --------------------------------------------------
   Init
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", loadProduct);
