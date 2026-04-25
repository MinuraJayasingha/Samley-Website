// assets/js/products.js

/* --------------------------------------------------
   URL helpers - Extract from pathname
-------------------------------------------------- */

function getCategoryFromURL() {
    // First try query string (set by .htaccess rewrite)
    const params = new URLSearchParams(window.location.search);
    let cat = params.get("category");
    if (cat) return decodeURIComponent(cat);
    
    // Fallback: extract from pathname
    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/\/products\/([a-z0-9-]+)\/?$/i);
    if (pathMatch) return pathMatch[1];
    
    return null;
}

function getMainFromURL() {
    const params = new URLSearchParams(window.location.search);
    let main = params.get("main");
    return main ? decodeURIComponent(main) : null;
}

/* --------------------------------------------------
   Main loader
-------------------------------------------------- */

async function loadProducts() {
    const categorySlug = getCategoryFromURL();
    const mainSlug = getMainFromURL();

    const emptyState = document.getElementById("products-empty");
    const grid = document.getElementById("products-grid");

    if (!grid) return;

    const res = await fetch("data/1new_products.json");
    const products = await res.json();
    
    const catRes = await fetch("data/new_categories.json");
    const categories = await catRes.json();

    let filtered = [];
    let isMainCategory = false;

    // Check if categorySlug is actually a main category
    if (categorySlug) {
        isMainCategory = categories.some(m => m.slug === categorySlug);
    }

    /* ---------------- OUR PRODUCTS (ALL) ---------------- */

    if (!categorySlug && !mainSlug) {
        document.getElementById("category-title").textContent = "Our Products";
        document.getElementById("category-description").textContent =
            "Explore our complete collection of premium Ceylon teas, beverages, and spices.";

        document.title = "Our Products | Samley Teas";

        updateBreadcrumbForAll();

        filtered = products;
    }

    /* ---------------- SUB CATEGORY OR MAIN CATEGORY (from category param) ---------------- */

    else if (categorySlug) {
        // If it'"'"'s actually a main category, treat it as such
        if (isMainCategory) {
            await updateCategoryTitle(null, categorySlug);
            updateBreadcrumbForMain(categorySlug);
            document.title = `${categorySlug.replace(/-/g, " ")} | Samley Teas`;
            filtered = products.filter(p => p.mainCategory === categorySlug);
        } 
        // Otherwise treat as sub-category
        else {
            await updateCategoryTitle(categorySlug, null);
            updateBreadcrumbForProducts(categorySlug);
            document.title = `${categorySlug.replace(/-/g, " ")} | Samley Teas`;
            filtered = products.filter(p => p.subCategory === categorySlug);
        }
    }

    /* ---------------- MAIN CATEGORY (explicit main param) ---------------- */

    else if (mainSlug) {
        await updateCategoryTitle(null, mainSlug);
        updateBreadcrumbForMain(mainSlug);

        document.title = `${mainSlug.replace(/-/g, " ")} | Samley Teas`;

        filtered = products.filter(
            p => p.mainCategory === mainSlug
        );
    }

    /* ---------------- EMPTY STATE ---------------- */

    if (filtered.length === 0) {
        emptyState.textContent = "No products found.";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    renderProducts(filtered);
}

/* --------------------------------------------------
   Titles & descriptions
-------------------------------------------------- */

async function updateCategoryTitle(categorySlug, mainSlug) {
    const res = await fetch("data/new_categories.json");
    const categories = await res.json();

    // Sub category
    if (categorySlug) {
        categories.forEach(main => {
            main.subCategories.forEach(sub => {
                if (sub.slug === categorySlug) {
                    document.getElementById("category-title").innerHTML =
                        splitTitle(sub.pagetitle);
                    document.getElementById("category-description").textContent =
                        sub.description !== "space" ? sub.description : "";
                    const eyebrow = document.getElementById("col-eyebrow");
                    if (eyebrow) eyebrow.textContent = main.title;
                }
            });
        });
        return;
    }

    // Main category
    if (mainSlug) {
        const main = categories.find(m => m.slug === mainSlug);
        if (main) {
            document.getElementById("category-title").innerHTML =
                splitTitle(main.Pagetitle || main.title);
            document.getElementById("category-description").textContent =
                main.description || "";
            const eyebrow = document.getElementById("col-eyebrow");
            if (eyebrow) eyebrow.textContent = "Our Collections";
        }
    }
}

function splitTitle(title) {
    const words = title.trim().split(" ");
    if (words.length <= 1) return `<em>${title}.</em>`;
    const main = words.slice(0, -1).join(" ");
    const last = words[words.length - 1];
    return `${main} <em>${last}.</em>`;
}

/* --------------------------------------------------
   Breadcrumbs
-------------------------------------------------- */

function updateBreadcrumbForAll() {
    const ourProducts = document.querySelector('.breadcrumb-list li:nth-child(2)');
    const mainCat = document.getElementById("breadcrumb-main-category");
    const subCat = document.getElementById("breadcrumb-sub-category");
    
    // Mark "Our Products" as active (last item on this page)
    if (ourProducts) {
        ourProducts.classList.add("active");
    }
    
    // Hide main and sub category
    mainCat.innerHTML = "";
    mainCat.classList.add("hidden");
    
    subCat.innerHTML = "";
    subCat.classList.add("hidden");
}

function updateBreadcrumbForProducts(categorySlug) {
    fetch("data/new_categories.json")
        .then(res => res.json())
        .then(categories => {
            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === categorySlug) {
                        const mainCat = document.getElementById("breadcrumb-main-category");
                        const subCat = document.getElementById("breadcrumb-sub-category");
                        
                        // Show main category link
                        mainCat.innerHTML = `<a href="/products/${main.slug}/">${main.title}</a>`;
                        mainCat.classList.remove("hidden");
                        
                        // Show sub category as active (last item)
                        subCat.textContent = sub.title;
                        subCat.classList.remove("hidden");
                        subCat.classList.add("active");
                    }
                });
            });
        });
}

function updateBreadcrumbForMain(mainSlug) {
    fetch("data/new_categories.json")
        .then(res => res.json())
        .then(categories => {
            const main = categories.find(m => m.slug === mainSlug);
            if (main) {
                const mainCat = document.getElementById("breadcrumb-main-category");
                const subCat = document.getElementById("breadcrumb-sub-category");
                
                // Show main category as active (last item)
                mainCat.textContent = main.title;
                mainCat.classList.remove("hidden");
                mainCat.classList.add("active");
                
                // Hide sub category
                subCat.innerHTML = "";
                subCat.classList.add("hidden");
            }
        });
}

/* --------------------------------------------------
   Render products
-------------------------------------------------- */

function renderProducts(products) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        
        // Ensure image path is absolute
        const imageUrl = product.thumbnailImage.startsWith('/') 
            ? product.thumbnailImage 
            : '/' + product.thumbnailImage;

        card.innerHTML = `
            <a href="/product/${product.slug}/"
               class="product-image"
               style="background-image:url('${imageUrl}')">

                <img src="${imageUrl}"
                     alt="${product.name}"
                     loading="lazy" />
            </a>

            <div class="content">
                <div class="top">
                    <h5>${product.name}</h5>
                    <p>${product.shortDescription}</p>
                </div>

                <div class="bottom">
                    <p class="tags">${product.tags}</p>
                    <p>${product.packInfo}</p>
                </div>
            </div>

            <div class="product-btn-div">
                <a class="product-btn" href="/product/${product.slug}/">
                    View product <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        `;

        grid.appendChild(card);
    });
}

/* --------------------------------------------------
   Init
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", loadProducts);
