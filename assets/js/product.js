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

/* Fields excluded from the standard metadata list */
const EXCLUDED_FIELDS = new Set([
    "id", "slug", "mainCategory", "subCategory",
    "name", "shortDescription", "tags", "packInfo",
    "thumbnailImage", "seoTitle", "seoDescription",
    "longDescription", "features", "galleryImages",
    "price", "currency", "stock", "rating", "reviewCount",
    "featured",
    /* These each have dedicated section renderers */
    "teas", "ranges", "regions",
]);

/* Array fields that collapse when they have more than 2 items */
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

    /* Standard metadata fields */
    renderDynamicMetadata(product);

    /*
     * ── Section renderers (order matters — they all use insertBeforeDescription)
     *    so they appear in reverse order of injection:
     *    features injects first → teas/regions injects after → ranges injects last
     *    Final page order: metadata → regions/teas/ranges → features → image strip
     */

    /* Features */
    if (product.features && product.features.length > 0) {
        injectFeaturesSection(product.features);
    }

    /* Flat teas array (Love of My Life, Tea Makers Assortment) */
    if (product.teas && product.teas.length > 0) {
        injectTeasSection(product.teas, "What's Inside");
    }

    /* Regions array (Regional Tea Sensation) — rendered as tea cards */
    if (product.regions && product.regions.length > 0) {
        injectRegionsAsCards(product.regions);
    }

    /* Ranges array (Holiday Fantasy, Advent Calendar) */
    if (product.ranges && product.ranges.length > 0) {
        injectRangesSection(product.ranges);
    }

    /* Gallery */
    const mainImage = document.getElementById("product-main-image");
    const thumbs    = document.getElementById("pd-gallery-thumbs") || document.querySelector(".product-thumbnails");

    if (product.galleryImages && product.galleryImages.length > 0 && mainImage) {
        mainImage.src = product.galleryImages[0];
        mainImage.alt = product.name;

        if (thumbs) {
            thumbs.innerHTML = "";
            product.galleryImages.forEach((img, i) => {
                const t = document.createElement("img");
                t.src   = img;
                t.alt   = product.name;
                if (i === 0) t.classList.add("active");
                t.addEventListener("click", () => {
                    mainImage.src = img;
                    thumbs.querySelectorAll("img").forEach(el => el.classList.remove("active"));
                    t.classList.add("active");
                });
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
   Render standard metadata fields
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
            if (typeof value[0] === "object") continue;

            const isLong         = value.length > 2;
            const shouldCollapse = isLong && COLLAPSIBLE_FIELDS.has(key);
            const uid            = `meta-${key}`;
            const listItems      = value.map(item => `<li>${item}</li>`).join("");

            if (shouldCollapse) {
                li.classList.add("product-meta-accordion");
                li.innerHTML = `
                    <button class="meta-accordion-trigger" aria-expanded="false" aria-controls="${uid}">
                        <span class="product-meta-b">${label}</span>
                        <span class="meta-accordion-count">${value.length} items</span>
                        <span class="meta-accordion-arrow" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <div class="meta-accordion-body" id="${uid}" hidden>
                        <ul class="product-meta-list">${listItems}</ul>
                    </div>
                `;

                const trigger = li.querySelector(".meta-accordion-trigger");
                const body    = li.querySelector(".meta-accordion-body");
                trigger.addEventListener("click", () => {
                    const isOpen = trigger.getAttribute("aria-expanded") === "true";
                    trigger.setAttribute("aria-expanded", String(!isOpen));
                    body.hidden = isOpen;
                    li.classList.toggle("is-open", !isOpen);
                });

            } else {
                li.classList.add("product-meta-has-list");
                li.innerHTML = `
                    <span class="product-meta-b">${label}</span>
                    <ul class="product-meta-list">${listItems}</ul>
                `;
            }

        } else {
            li.innerHTML = `<span class="product-meta-b">${label}:</span> <span>${value}</span>`;
        }

        container.appendChild(li);
    }
}


/* --------------------------------------------------
   Convert a region object → tea-card-compatible object
   so regions render identically to tea cards
-------------------------------------------------- */

function regionToTeaCard(region) {
    return {
        name:        region.name,
        teaType:     region.region || "Ceylon Black Tea",
        description: region.description || "",
        liquor:      region.liquor   ? (Array.isArray(region.liquor)   ? region.liquor   : [region.liquor])   : [],
        aroma:       region.aroma    ? (Array.isArray(region.aroma)    ? region.aroma    : [region.aroma])    : [],
        flavourProfile: region.flavourProfile
            ? (Array.isArray(region.flavourProfile) ? region.flavourProfile : [region.flavourProfile])
            : [],
        finish:      region.finish   ? (Array.isArray(region.finish)   ? region.finish   : [region.finish])   : [],
    };
}


/* --------------------------------------------------
   Inject regions as tea cards
   (Regional Tea Sensation product)
-------------------------------------------------- */

function injectRegionsAsCards(regions) {
    if (document.getElementById("product-regions-section")) return;

    const section     = document.createElement("section");
    section.id        = "product-regions-section";
    section.className = "product-teas-section";

    const cardsHTML = regions
        .map(r => buildTeaCard(regionToTeaCard(r)))
        .join("");

    section.innerHTML = `
        <div class="product-teas-inner">
            <div class="product-features-divider">
                <span class="features-divider-line"></span>
                <span class="features-divider-label">Tea Regions</span>
                <span class="features-divider-line"></span>
            </div>
            <div class="tea-cards-grid">
                ${cardsHTML}
            </div>
        </div>
    `;

    insertBeforeDescription(section);
    attachTeaCardAccordions(section);
}


/* --------------------------------------------------
   Build a single tea card HTML string
   Used by teas, regions, and ranges sections
-------------------------------------------------- */

function buildTeaCard(tea) {
    const uid = `tea-${tea.name.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`;

    function arrayField(label, arr) {
        if (!arr || arr.length === 0) return "";
        const items = arr.map(i => `<li>${i}</li>`).join("");
        if (arr.length <= 2) {
            return `
                <div class="tea-card-field">
                    <span class="tea-card-label">${label}:</span>
                    <ul class="tea-card-list">${items}</ul>
                </div>`;
        }
        const fieldUid = `${uid}-${label.toLowerCase().replace(/\s+/g, "")}`;
        return `
            <div class="tea-card-field tea-card-field--accordion">
                <button class="tea-card-accordion-trigger" aria-expanded="false" aria-controls="${fieldUid}">
                    <span class="tea-card-label">${label}</span>
                    <span class="tea-card-count">${arr.length} items</span>
                    <span class="tea-card-arrow">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </button>
                <div id="${fieldUid}" class="tea-card-accordion-body" hidden>
                    <ul class="tea-card-list">${items}</ul>
                </div>
            </div>`;
    }

    function stringField(label, val) {
        if (!val) return "";
        return `<div class="tea-card-field"><span class="tea-card-label">${label}:</span> <span>${val}</span></div>`;
    }

    const brew         = tea.brewingInstructions || tea.brewing || "";
    const grade        = tea.grade || "";
    const teaTypeBadge = tea.teaType
        ? `<span class="tea-type-badge">${tea.teaType}</span>`
        : "";

    return `
        <div class="tea-card" id="${uid}">
            <div class="tea-card-header">
                <div class="tea-card-title-row">
                    <h4 class="tea-card-name">${tea.name}</h4>
                    ${teaTypeBadge}
                </div>
                ${tea.description ? `<p class="tea-card-description">${tea.description}</p>` : ""}
            </div>
            <div class="tea-card-body">
                ${stringField("Brewing", brew)}
                ${stringField("Grade", grade)}
                ${arrayField("Ingredients", tea.ingredients)}
                ${arrayField("Liquor", tea.liquor)}
                ${arrayField("Aroma", tea.aroma)}
                ${arrayField("Flavour Profile", tea.flavourProfile)}
                ${arrayField("Finish", tea.finish)}
            </div>
        </div>
    `;
}


/* --------------------------------------------------
   Inject flat teas section
   (Love of My Life, Tea Makers Assortment)
-------------------------------------------------- */

function injectTeasSection(teas, headingLabel) {
    if (document.getElementById("product-teas-section")) return;

    const section     = document.createElement("section");
    section.id        = "product-teas-section";
    section.className = "product-teas-section";

    const cardsHTML = teas.map(buildTeaCard).join("");

    section.innerHTML = `
        <div class="product-teas-inner">
            <div class="product-features-divider">
                <span class="features-divider-line"></span>
                <span class="features-divider-label">${headingLabel || "What's Inside"}</span>
                <span class="features-divider-line"></span>
            </div>
            <div class="tea-cards-grid">
                ${cardsHTML}
            </div>
        </div>
    `;

    insertBeforeDescription(section);
    attachTeaCardAccordions(section);
}


/* --------------------------------------------------
   Inject ranges section
   (Holiday Fantasy, Advent Calendar)
   Each range has: range name, optional teas array
-------------------------------------------------- */

function injectRangesSection(ranges) {
    if (document.getElementById("product-ranges-section")) return;

    const section     = document.createElement("section");
    section.id        = "product-ranges-section";
    section.className = "product-teas-section";

    let innerHTML = `
        <div class="product-teas-inner">
            <div class="product-features-divider">
                <span class="features-divider-line"></span>
                <span class="features-divider-label">What's Inside</span>
                <span class="features-divider-line"></span>
            </div>
    `;

    ranges.forEach(range => {
        innerHTML += `<div class="range-group">`;
        innerHTML += `<h3 class="range-group-title">${range.range}</h3>`;

        if (range.teas && range.teas.length > 0) {
            innerHTML += `<div class="tea-cards-grid">`;
            range.teas.forEach(tea => { innerHTML += buildTeaCard(tea); });
            innerHTML += `</div>`;
        }

        /* Regions within a range (e.g. Advent Calendar Regional range) */
        if (range.regions && range.regions.length > 0) {
            innerHTML += `<div class="tea-cards-grid">`;
            range.regions.forEach(r => { innerHTML += buildTeaCard(regionToTeaCard(r)); });
            innerHTML += `</div>`;
        }

        innerHTML += `</div>`;
    });

    innerHTML += `</div>`;
    section.innerHTML = innerHTML;

    insertBeforeDescription(section);
    attachTeaCardAccordions(section);
}


/* --------------------------------------------------
   Shared insertion helper
-------------------------------------------------- */

function insertBeforeDescription(section) {
    const desc   = document.querySelector(".product-discription");
    const detail = document.querySelector(".product-detail");
    if (desc)   desc.insertAdjacentElement("beforebegin", section);
    else if (detail) detail.insertAdjacentElement("afterend", section);
}


/* --------------------------------------------------
   Attach accordion toggle listeners inside tea cards
-------------------------------------------------- */

function attachTeaCardAccordions(container) {
    container.querySelectorAll(".tea-card-accordion-trigger").forEach(trigger => {
        const bodyId = trigger.getAttribute("aria-controls");
        const body   = document.getElementById(bodyId);
        if (!body) return;

        trigger.addEventListener("click", () => {
            const isOpen = trigger.getAttribute("aria-expanded") === "true";
            trigger.setAttribute("aria-expanded", String(!isOpen));
            body.hidden = isOpen;
            trigger.closest(".tea-card-field--accordion")
                   .classList.toggle("is-open", !isOpen);
        });
    });
}


/* --------------------------------------------------
   Features Section
-------------------------------------------------- */

function injectFeaturesSection(features) {
    if (document.getElementById("product-features-section")) return;

    const section     = document.createElement("section");
    section.id        = "product-features-section";
    section.className = "product-features-section";

    const itemsHTML = features.map(f => `
        <li class="feature-item">
            <span class="feature-icon">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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

    insertBeforeDescription(section);
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