// assets/js/products.js

/* --------------------------------------------------
   URL helpers
-------------------------------------------------- */

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category");
}

function getMainFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("main");
}

/* --------------------------------------------------
   Main loader
-------------------------------------------------- */

async function loadProducts() {
  const categorySlug = getCategorySlug();

  const res = await fetch("/data/products.json");
  const products = await res.json();

  const filtered = categorySlug
    ? products.filter(p => p.category === categorySlug)
    : products;

  renderProducts(filtered);
}


/* --------------------------------------------------
   Titles & descriptions
-------------------------------------------------- */

async function updateCategoryTitle(categorySlug, mainSlug) {
    const res = await fetch("/data/categories.json");
    const categories = await res.json();

    // Sub category
    if (categorySlug) {
        categories.forEach(main => {
            main.subCategories.forEach(sub => {
                if (sub.slug === categorySlug) {
                    document.getElementById("category-title").textContent =
                        sub.pagetitle;

                    document.getElementById("category-description").textContent =
                        sub.description;
                }
            });
        });
        return;
    }

    // Main category
    if (mainSlug) {
        const main = categories.find(m => m.slug === mainSlug);
        if (main) {
            document.getElementById("category-title").textContent =
                main.Pagetitle || main.title;

            document.getElementById("category-description").textContent =
                main.description || "";
        }
    }
}

/* --------------------------------------------------
   Breadcrumbs
-------------------------------------------------- */

function updateBreadcrumbForAll() {
    document.getElementById("breadcrumb-main-category").textContent = "";
    document.getElementById("breadcrumb-sub-category").textContent = "";
}

function updateBreadcrumbForProducts(categorySlug) {
    fetch("/data/categories.json")
        .then(res => res.json())
        .then(categories => {
            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === categorySlug) {
                        document.getElementById("breadcrumb-main-category").innerHTML =
                            `<a href="products.html?main=${main.slug}">
                                ${main.title}
                             </a>`;

                        document.getElementById("breadcrumb-sub-category").textContent =
                            sub.title;
                    }
                });
            });
        });
}

function updateBreadcrumbForMain(mainSlug) {
    fetch("/data/categories.json")
        .then(res => res.json())
        .then(categories => {
            const main = categories.find(m => m.slug === mainSlug);
            if (main) {
                document.getElementById("breadcrumb-main-category").innerHTML =
                    `<a href="products.html?main=${main.slug}">
                        ${main.title}
                     </a>`;

                document.getElementById("breadcrumb-sub-category").textContent = "";
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

        card.innerHTML = `
            <a href="product.html?product=${product.slug}"
               class="product-image"
               style="background-image:url('${product.thumbnailImage}')">

                <img src="${product.thumbnailImage}"
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
                <a class="btn-03 product-btn"
                   href="product.html?product=${product.slug}">
                    View Product
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
