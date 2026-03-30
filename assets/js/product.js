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
    if (!slug) return;

    try {
        const res = await fetch("data/1new_products.json");
        if (!res.ok) return;

        let products = await res.json();
        products = products.filter(p => p && Object.keys(p).length > 0 && p.slug);
        const product = products.find(p => p.slug === slug);
        if (!product) return;

        injectProductData(product);
        updateBreadcrumbForProduct(product);

    } catch (error) {
        console.error("Error loading product:", error);
    }
}


/* --------------------------------------------------
   Field Labels
-------------------------------------------------- */

const FIELD_LABELS = {
    brand:               "Brand",
    flavor:              "Flavor",
    teaVariety:          "Tea Variety",
    spiceType:           "Spice Type",
    coffeeType:          "Coffee Type",
    productType:         "Product Type",
    beverageType:        "Beverage Type",
    type:                "Type",
    unitCount:           "Unit Count",
    variety:             "Variety",
    format:              "Format",
    grade:               "Grade",
    region:              "Region",
    origin:              "Origin",
    processing:          "Processing",
    extraction:          "Extraction",
    certification:       "Certification",
    grind:               "Grind",
    fatContent:          "Fat Content",
    form:                "Form",
    liquorStrength:      "Liquor Strength",
    brewingInstructions: "Brewing Instructions",
    additives:           "Additives",
    notes:               "Tasting Notes",
    moment:              "Best For",
    serving:             "Serving",
    base:                "Base",
    electrolytes:        "Electrolytes",
    vitamins:            "Vitamins",
    proteinSource:       "Protein Source",
    heatLevel:           "Heat Level",
    colorValue:          "Color Value",
    curcuminContent:     "Curcumin Content",
    moistureContent:     "Moisture Content",
    vanillinContent:     "Vanillin Content",
    liquor:              "Liquor",
    aroma:               "Aroma",
    flavourProfile:      "Flavour Profile",
    flavorProfile:       "Flavour Profile",
    finish:              "Finish",
    ingredients:         "Ingredients",
    cupProfile:          "Cup Profile",
    tastingNotes:        "Tasting Notes",
    applications:        "Applications",
    uses:                "Uses",
};

/* Fields excluded from metadata display */
const EXCLUDED_FIELDS = new Set([
    "id", "slug", "mainCategory", "subCategory",
    "name", "shortDescription", "tags", "packInfo",
    "thumbnailImage", "seoTitle", "seoDescription",
    "longDescription", "features", "galleryImages",
    "price", "currency", "stock", "rating", "reviewCount",
    "regions", "featured",
]);

/*
  Fields that are always shown collapsed by default.
  Short arrays (≤2 items) are always shown expanded regardless.
*/
const COLLAPSIBLE_FIELDS = new Set([
    "ingredients", "cupProfile", "tastingNotes", "applications",
    "uses", "aroma", "flavourProfile", "flavorProfile", "finish", "liquor",
]);


/* --------------------------------------------------
   Inject product data into the page
-------------------------------------------------- */

function injectProductData(product) {

    /* SEO */
    if (product.seoTitle) document.title = product.seoTitle;
    const metaDesc = document.getElementById("meta-description");
    if (metaDesc && product.seoDescription) {
        metaDesc.setAttribute("content", product.seoDescription);
    }

    /* Main text content */
    setTextById("product-title",            product.seoTitle || product.name);
    setTextById("product-long-description", product.longDescription || "");
    setTextById("product-pack",             product.packInfo || "");

    /* Metadata fields */
    renderDynamicMetadata(product);

    /* Features section — inserted between .product-detail and .product-discription */
    if (product.features && product.features.length > 0) {
        injectFeaturesSection(product.features);
    }

    /* Gallery */
    const mainImage = document.getElementById("product-main-image");
    const thumbs    = document.querySelector(".product-thumbnails");

    if (product.galleryImages && product.galleryImages.length > 0 && mainImage) {
        mainImage.src = product.galleryImages[0];
        mainImage.alt = product.name;

        if (thumbs) {
            thumbs.innerHTML = "";
            product.galleryImages.forEach(img => {
                const t = document.createElement("img");
                t.src   = img;
                t.alt   = product.name;
                thumbs.appendChild(t);
            });
        }

        enableGalleryInteraction();
    }
}


/* --------------------------------------------------
   Helper – safe text setter
-------------------------------------------------- */

function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


/* --------------------------------------------------
   Render metadata fields dynamically
   Short string fields  → inline  "Label: value"
   Array fields         → collapsible accordion
   Long string fields   → inline (no collapse needed)
-------------------------------------------------- */

function renderDynamicMetadata(product) {
    const container = document.getElementById("product-meta");
    if (!container) return;

    container.innerHTML = "";

    for (const [key, value] of Object.entries(product)) {

        if (EXCLUDED_FIELDS.has(key)) continue;
        if (value === null || value === undefined || value === "") continue;
        if (Array.isArray(value) && value.length === 0) continue;
        if (typeof value === "object" && !Array.isArray(value)) continue;

        const label = FIELD_LABELS[key] || formatFieldName(key);
        const li    = document.createElement("li");

        if (Array.isArray(value)) {
            if (typeof value[0] === "object") continue; // skip object arrays

            const isLong       = value.length > 2;
            const shouldCollapse = isLong && COLLAPSIBLE_FIELDS.has(key);
            const uid          = `meta-${key}`;

            const listItems = value.map(item => `<li>${item}</li>`).join("");

            if (shouldCollapse) {
                /* Collapsible accordion */
                li.classList.add("product-meta-accordion");
                li.innerHTML = `
                    <button class="meta-accordion-trigger" aria-expanded="false" aria-controls="${uid}">
                        <span class="product-meta-b">${label}</span>
                        <span class="meta-accordion-count">${value.length} items</span>
                        <span class="meta-accordion-arrow" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <div class="meta-accordion-body" id="${uid}" hidden>
                        <ul class="product-meta-list">${listItems}</ul>
                    </div>
                `;

                /* Toggle behaviour */
                const trigger = li.querySelector(".meta-accordion-trigger");
                const body    = li.querySelector(".meta-accordion-body");
                trigger.addEventListener("click", () => {
                    const isOpen = trigger.getAttribute("aria-expanded") === "true";
                    trigger.setAttribute("aria-expanded", String(!isOpen));
                    body.hidden = isOpen;
                    li.classList.toggle("is-open", !isOpen);
                });

            } else {
                /* Short array — always visible */
                li.classList.add("product-meta-has-list");
                li.innerHTML = `
                    <span class="product-meta-b">${label}</span>
                    <ul class="product-meta-list">${listItems}</ul>
                `;
            }

        } else {
            /* Plain string / number */
            li.innerHTML = `<span class="product-meta-b">${label}:</span> <span>${value}</span>`;
        }

        container.appendChild(li);
    }

    /* Regional tea block */
    if (product.regions && Array.isArray(product.regions) && product.regions.length > 0) {
        renderRegionsBlock(product.regions, container);
    }
}


/* --------------------------------------------------
   Regional tea block renderer
-------------------------------------------------- */

function renderRegionsBlock(regions, container) {
    const header = document.createElement("li");
    header.classList.add("product-meta-has-list");
    header.innerHTML = `<span class="product-meta-b">Tea Regions</span>`;
    container.appendChild(header);

    regions.forEach(region => {
        const li = document.createElement("li");
        li.classList.add("product-meta-region");

        let html = `<strong>${region.name}</strong>`;
        if (region.description)    html += `<p>${region.description}</p>`;
        if (region.liquor)         html += `<span><em>Liquor:</em> ${region.liquor}</span>`;
        if (region.aroma)          html += `<span><em>Aroma:</em> ${region.aroma}</span>`;
        if (region.flavourProfile) html += `<span><em>Flavour:</em> ${region.flavourProfile}</span>`;
        if (region.finish)         html += `<span><em>Finish:</em> ${region.finish}</span>`;

        li.innerHTML = html;
        container.appendChild(li);
    });
}


/* --------------------------------------------------
   Inject Features Section

   TARGET POSITION:
   Between .product-detail and .product-discription
   (both are inside .products-container)

   We do NOT use the 'reveal' class because the
   IntersectionObserver in smooth-scroll.js only observes
   elements present at page-load time.
-------------------------------------------------- */

function injectFeaturesSection(features) {
    if (document.getElementById("product-features-section")) return;

    const section     = document.createElement("section");
    section.id        = "product-features-section";
    section.className = "product-features-section";

    const itemsHTML = features.map(f => `
        <li class="feature-item">
            <span class="feature-icon">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" stroke="currentColor"/>
                    <path d="M4.5 8L7 10.5L11.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span>${f}</span>
        </li>
    `).join("");

    section.innerHTML = `
        <div class="product-features-inner">
            <div class="product-features-divider">
                <span class="features-divider-line"></span>
                <span class="features-divider-label">Product Features</span>
                <span class="features-divider-line"></span>
            </div>
            <ul class="product-features-list">
                ${itemsHTML}
            </ul>
        </div>
    `;

    /*
     * Insert AFTER .product-detail and BEFORE .product-discription.
     * Both live inside .products-container.
     */
    const productDescription = document.querySelector(".product-discription");
    if (productDescription) {
        productDescription.insertAdjacentElement("beforebegin", section);
    } else {
        /* Fallback: after .product-detail */
        const productDetail = document.querySelector(".product-detail");
        if (productDetail) productDetail.insertAdjacentElement("afterend", section);
    }
}


/* --------------------------------------------------
   camelCase → "Title Case"
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
        .then(res => res.ok ? res.json() : null)
        .then(categories => {
            if (!categories) return;
            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === product.subCategory) {
                        const mainEl = document.getElementById("breadcrumb-main-category");
                        if (mainEl) mainEl.innerHTML = `<a href="/products/${main.slug}/">${main.title}</a>`;

                        const subEl = document.getElementById("breadcrumb-sub-category");
                        if (subEl) subEl.innerHTML = `<a href="/products/${sub.slug}/">${sub.title}</a>`;
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
    const mainImage  = document.getElementById("product-main-image");
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