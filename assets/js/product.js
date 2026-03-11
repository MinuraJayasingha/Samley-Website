// assets/js/product.js

/* --------------------------------------------------
   Helpers - Extract slug from URL pathname
-------------------------------------------------- */

// Get product slug from URL
function getProductSlug() {
    // First try query string (set by .htaccess rewrite)
    const params = new URLSearchParams(window.location.search);
    let slug = params.get("slug") || params.get("product");
    if (slug) return decodeURIComponent(slug);
    
    // Fallback: extract from pathname
    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/\/product\/([a-z0-9-]+)\/?$/i);
    if (pathMatch) return pathMatch[1];
    
    return null;
}


/* --------------------------------------------------
   Main loader
-------------------------------------------------- */

async function loadProduct() {
    const slug = getProductSlug();

    if (!slug) {
        console.warn("No product slug found in URL - pathname:", window.location.pathname);
        return;
    }

    console.log("Loading product:", slug);

    try {
        const res = await fetch("data/1new_products.json");
        if (!res.ok) {
            console.error("Failed to fetch 1new_products.json", res.status);
            return;
        }

        let products = await res.json();
        // Filter out empty objects (which exist in 1new_products.json)
        products = products.filter(p => p && Object.keys(p).length > 0 && p.slug);
        const product = products.find(p => p.slug === slug);

        if (!product) {
            console.warn("Product not found for slug:", slug);
            return;
        }

        console.log("Product found:", product.name);
        injectProductData(product);
        updateBreadcrumbForProduct(product);

    } catch (error) {
        console.error("Error loading product:", error);
    }
}


/* --------------------------------------------------
   Field mapping - converts JSON keys to display labels
   Add new fields here as needed without touching HTML
-------------------------------------------------- */

const FIELD_LABELS = {
    brand: "Brand",
    itemForm: "Item Form",
    teaVariety: "Tea Variety",
    spiceType: "Spice Type",
    beverageType: "Beverage Type",
    type: "Product Type",
    unitCount: "Unit Count",
    flavor: "Flavor",
    format: "Format",
    grade: "Grade",
    region: "Region",
    liquorStrength: "Liquor Strength",
    brewingInstructions: "Brewing Instructions",
    additives: "Additives",
    liquor: "Liquor",
    aroma: "Aroma",
    flavourProfile: "Flavour Profile",
    finish: "Finish",
    price: "Price",
    currency: "Currency",
    stock: "Stock",
    rating: "Rating"
};

/* Fields to EXCLUDE from metadata display (shown separately or not needed) */
const EXCLUDED_FIELDS = new Set([
    "id", "slug", "mainCategory", "subCategory", "name", "shortDescription",
    "tags", "packInfo", "thumbnailImage", "seoTitle", "seoDescription",
    "longDescription", "features", "galleryImages", "reviewCount",
    "price", "currency", "stock", "rating"  // Hidden per client request
]);

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

    /* ---------- Dynamic Meta Fields (auto-renders any fields in JSON) ---------- */
    console.log("[Product] Calling renderDynamicMetadata...");
    renderDynamicMetadata(product);
    console.log("[Product] renderDynamicMetadata completed");

    /* ---------- Rating ---------- */
    // Hidden per client request
    // Uncomment below to show rating again
    /*
    document.getElementById("product-review-count").textContent =
        product.reviewCount ? `(${product.reviewCount})` : "";

    document.getElementById("product-stars").textContent =
        product.rating ? "⭐".repeat(Math.round(product.rating)) : "";
    */

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
   Dynamically render product metadata
   Automatically displays all fields from JSON (except excluded ones)
   Also handles array values (liquor, aroma, etc.)
-------------------------------------------------- */

function renderDynamicMetadata(product) {
    const metaContainer = document.getElementById("product-meta");
    
    console.log("[Product] Rendering metadata...");
    console.log("[Product] Meta container found:", !!metaContainer);
    
    if (!metaContainer) {
        console.error("[Product] ERROR: #product-meta element not found in HTML!");
        return;
    }

    metaContainer.innerHTML = ""; // Clear existing
    let fieldCount = 0;

    // Iterate through all product fields
    for (const [key, value] of Object.entries(product)) {
        
        // Skip excluded fields
        if (EXCLUDED_FIELDS.has(key)) continue;
        
        // Skip empty/null values
        if (!value || (Array.isArray(value) && value.length === 0)) continue;
        
        // Get display label
        const label = FIELD_LABELS[key] || formatFieldName(key);
        
        // Create list item
        const li = document.createElement("li");
        
        // Format value (handle arrays)
        if (Array.isArray(value)) {
            const displayValue = value.join(", ");
            li.innerHTML = `<span class="product-meta-b">${label}:</span> <span>${displayValue}</span>`;
        } else {
            li.innerHTML = `<span class="product-meta-b">${label}:</span> <span>${value}</span>`;
        }
        
        metaContainer.appendChild(li);
        fieldCount++;
    }
    
    console.log("[Product] Metadata fields rendered:", fieldCount);
}

/* --------------------------------------------------
   Convert camelCase field names to "Title Case"
   e.g., "liquorStrength" → "Liquor Strength"
-------------------------------------------------- */

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, " $1") // Add space before capitals
        .toLowerCase()
        .trim()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/* --------------------------------------------------
   Breadcrumb
-------------------------------------------------- */

function updateBreadcrumbForProduct(product) {
    fetch("data/new_categories.json")
        .then(res => {
            if (!res.ok) {
                console.error("Failed to fetch new_products.json:", res.status);
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