// js/products.js

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category");
}

async function loadProducts() {
    const categorySlug = getCategoryFromURL();
    const emptyState = document.getElementById("products-empty");
    const grid = document.getElementById("products-grid");

    if (!categorySlug) {
        emptyState.textContent = "Please select a product category.";
        emptyState.classList.remove("hidden");
        return;
    }

    updateCategoryTitle(categorySlug);
    updateBreadcrumbForProducts(categorySlug);
    document.title = `${categorySlug.replace("-", " ")} | Samley Teas`;

    const res = await fetch("data/products.json");
    const products = await res.json();

    const filtered = products.filter(
        p => p.subCategory === categorySlug
    );

    if (filtered.length === 0) {
        emptyState.textContent = "No products found in this category.";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    renderProducts(filtered);
}


async function updateCategoryTitle(categorySlug) {
    const res = await fetch("data/categories.json");
    const categories = await res.json();

    categories.forEach(main => {
        main.subCategories.forEach(sub => {
            if (sub.slug === categorySlug) {

                // Page title & description
                document.getElementById("category-title").textContent = sub.pagetitle;
                document.getElementById("category-description").textContent = sub.description;
            }
        });
    });
}

function updateBreadcrumbForProducts(categorySlug) {
    fetch("data/categories.json")
        .then(res => res.json())
        .then(categories => {
            categories.forEach(main => {
                main.subCategories.forEach(sub => {
                    if (sub.slug === categorySlug) {
                        document.getElementById("breadcrumb-main-category").innerHTML =
                            `<a href="products.html">${main.title}</a>`;

                        document.getElementById("breadcrumb-sub-category").textContent =
                            sub.title;
                    }
                });
            });
        });
}


function renderProducts(products) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <a href="product.html?product=${product.slug}" class="product-image"
            style="background-image:url('${product.thumbnailImage}')">

                <img src="${product.thumbnailImage}" alt="${product.name}" loading="lazy" />

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
                <a class="btn-03 product-btn" href="product.html?product=${product.slug}">
                    View Product
                </a>
            </div>
        `;


        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadProducts);
