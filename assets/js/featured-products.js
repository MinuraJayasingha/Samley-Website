async function loadFeaturedProducts() {
  const container = document.querySelector(".featured-products-grid");
  if (!container) return;

  const res = await fetch("data/products.json");
  const products = await res.json();

  // 👇 CHANGE THIS LOGIC WHENEVER YOU WANT
  const featured = products.filter(p => p.featured === true);

  container.innerHTML = "";

  featured.forEach(product => {
    const card = document.createElement("article");
    card.className = "featured-product-card";

    card.innerHTML = `
      <div class="image" style="background-image:url('${product.thumbnailImage}')"></div>
      <h5>${product.mainCategory}</h5>
      <h4>${product.name}</h4>
      <p>${product.shortDescription}</p>
      <a class="btn-03" href="product.html?product=${product.slug}">View More</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadFeaturedProducts);
