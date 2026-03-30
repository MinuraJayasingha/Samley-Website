// assets/js/product.js

/* --------------------------------------------------
   Helpers - Extract slug from URL pathname
-------------------------------------------------- */

function getProductSlug() {
    const params = new URLSearchParams(window.location.search);
    let slug = params.get("slug") || params.get("product");
    if (slug) return decodeURIComponent(slug);

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
   Field Labels - Human-readable names for JSON keys
   Add new fields here as needed
-------------------------------------------------- */

const FIELD_LABELS = {
    // Product Identity
    brand:              "Brand",
    flavor:             "Flavor",
    teaVariety:         "Tea Variety",
    spiceType:          "Spice Type",
    coffeeType:         "Coffee Type",
    productType:        "Product Type",
    beverageType:       "Beverage Type",
    type:               "Type",
    unitCount:          "Unit Count",
    variety:            "Variety",

    // Physical
    format:             "Format",
    grade:              "Grade",
    region:             "Region",
    origin:             "Origin",
    processing:         "Processing",
    extraction:         "Extraction",
    certification:      "Certification",
    grind:              "Grind",
    fatContent:         "Fat Content",
    form:               "Form",

    // Tea Tasting (simple string fields)
    liquorStrength:     "Liquor Strength",
    brewingInstructions:"Brewing Instructions",
    additives:          "Additives",
    additives:          "Additives",
    notes:              "Tasting Notes",
    moment:             "Best Moment",
    serving:            "Serving",
    base:               "Base",
    electrolytes:       "Electrolytes",
    vitamins:           "Vitamins",
    proteinSource:      "Protein Source",
    heatLevel:          "Heat Level",
    colorValue:         "Color Value",
    curcuminContent:    "Curcumin Content",
    flavorProfile:      "Flavour Profile",
    moistureContent:    "Moisture Content",
    vanillinContent:    "Vanillin Content",

    // Tea Tasting (array fields — newer product format)
    liquor:             "Liquor",
    aroma:              "Aroma",
    flavourProfile:     "Flavour Profile",
    finish:             "Finish",

    // Ingredients & uses
    ingredients:        "Ingredients",
    cupProfile:         "Cup Profile",
    tastingNotes:       "Tasting Notes",
    applications:       "Applications",
    uses:               "Uses",
};


/* --------------------------------------------------
   Fields to EXCLUDE from metadata display
   (shown elsewhere in HTML or not needed on page)
-------------------------------------------------- */

const EXCLUDED_FIELDS = new Set([
    "id", "slug", "mainCategory", "subCategory",
    "name", "shortDescription", "tags", "packInfo",
    "thumbnailImage", "seoTitle", "seoDescription",
    "longDescription", "features", "galleryImages",
    "reviewCount", "price", "currency", "stock", "rating",
    "regions",          // handled separately below if present
    "featured",
]);


/* --------------------------------------------------
   Inject product data into the page
-------------------------------------------------- */

function injectProductData(product) {

    /* --- SEO --- */
    if (product.seoTitle) document.title = product.seoTitle;

    const metaDesc = document.getElementById("meta-description");
    if (metaDesc && product.seoDescription) {
        metaDesc.setAttribute("content", product.seoDescription);
    }

    /* --- Main Content --- */
    setTextById("product-title",            product.seoTitle || product.name);
    setTextById("product-long-description", product.longDescription || "");
    setTextById("product-pack",             product.packInfo || "");

    /* --- Dynamic Metadata --- */
    renderDynamicMetadata(product);

    /* --- Gallery --- */
    const mainImage = document.getElementById("product-main-image");
    const thumbs    = document.querySelector(".product-thumbnails");

    if (product.galleryImages && product.galleryImages.length > 0 && mainImage) {
        mainImage.src = product.galleryImages[0];
        mainImage.alt = product.name;

        if (thumbs) {
            thumbs.innerHTML = "";
            product.galleryImages.forEach(img => {
                const t   = document.createElement("img");
                t.src     = img;
                t.alt     = product.name;
                thumbs.appendChild(t);
            });
        }

        enableGalleryInteraction();
    }
}


/* --------------------------------------------------
   Helper – set text content safely
-------------------------------------------------- */

function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


/* --------------------------------------------------
   Render all metadata fields dynamically
   Handles: strings, numbers, string arrays, object arrays
-------------------------------------------------- */

function renderDynamicMetadata(product) {
    const metaContainer = document.getElementById("product-meta");
    if (!metaContainer) {
        console.error("ERROR: #product-meta element not found in HTML!");
        return;
    }

    metaContainer.innerHTML = "";

    for (const [key, value] of Object.entries(product)) {

        // Skip excluded fields
        if (EXCLUDED_FIELDS.has(key)) continue;

        // Skip null / undefined / empty strings
        if (value === null || value === undefined || value === "") continue;

        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) continue;

        // Skip objects that are not arrays (e.g. nested region objects)
        if (typeof value === "object" && !Array.isArray(value)) continue;

        // Get the human-readable label
        const label = FIELD_LABELS[key] || formatFieldName(key);

        // Build the <li> content
        const li = document.createElement("li");
        const labelSpan = `<span class="product-meta-b">${label}:</span> `;

        if (Array.isArray(value)) {
            // Check if it's an array of objects (e.g. regions, applications)
            if (typeof value[0] === "object") {
                // Render as a sub-list — skip for now, or display as JSON summary
                // Most product pages won't need this; skip complex objects
                continue;
            }

            // Array of strings — join with separator
            const displayValue = value.join(" • ");
            li.innerHTML = labelSpan + `<span>${displayValue}</span>`;

        } else {
            // Plain string or number
            li.innerHTML = labelSpan + `<span>${value}</span>`;
        }

        metaContainer.appendChild(li);
    }

    /* ----- Special: Regions block (gift set) ----- */
    if (product.regions && Array.isArray(product.regions) && product.regions.length > 0) {
        renderRegionsBlock(product.regions, metaContainer);
    }
}


/* --------------------------------------------------
   Special renderer for regional tea sensation
   product.regions = [ { name, description, liquor, aroma, flavourProfile, finish } ]
-------------------------------------------------- */

function renderRegionsBlock(regions, container) {
    const header = document.createElement("li");
    header.innerHTML = `<span class="product-meta-b">Tea Regions:</span>`;
    container.appendChild(header);

    regions.forEach(region => {
        const li = document.createElement("li");
        li.classList.add("product-meta-region");

        let html = `<strong>${region.name}</strong>`;
        if (region.description)    html += ` — ${region.description}`;
        if (region.liquor)         html += `<br><em>Liquor:</em> ${region.liquor}`;
        if (region.aroma)          html += `<br><em>Aroma:</em> ${region.aroma}`;
        if (region.flavourProfile) html += `<br><em>Flavour:</em> ${region.flavourProfile}`;
        if (region.finish)         html += `<br><em>Finish:</em> ${region.finish}`;

        li.innerHTML = html;
        container.appendChild(li);
    });
}


/* --------------------------------------------------
   Convert camelCase to "Title Case"
   e.g. "liquorStrength" → "Liquor Strength"
-------------------------------------------------- */

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .trim()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}


/* --------------------------------------------------
   Breadcrumb
-------------------------------------------------- */

function updateBreadcrumbForProduct(product) {
    fetch("data/new_categories.json")
        .then(res => {
            if (!res.ok) {
                console.error("Failed to fetch new_categories.json:", res.status);
                return null;
            }
            return res.json();
        })
        .then(categories => {
            if (!categories) return;

            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === product.subCategory) {

                        const mainEl = document.getElementById("breadcrumb-main-category");
                        if (mainEl) {
                            mainEl.innerHTML = `<a href="/products/${main.slug}/">${main.title}</a>`;
                        }

                        const subEl = document.getElementById("breadcrumb-sub-category");
                        if (subEl) {
                            subEl.innerHTML = `<a href="/products/${sub.slug}/">${sub.title}</a>`;
                        }
                    }
                });
            });
        })
        .catch(err => console.error("Error loading categories:", err));

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
    const mainImage   = document.getElementById("product-main-image");
    const thumbnails  = document.querySelectorAll(".product-thumbnails img");

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