// assets/js/blogs.js

let allBlogs = [];

async function loadBlogs() {
  try {
    const res = await fetch("/data/blogs.json");
    if (!res.ok) throw new Error("Failed to load blogs.json");

    allBlogs = (await res.json()).filter(b => b.status === "published");
    renderBlogs();
  } catch (err) {
    console.error("Blog load error:", err);
  }
}

function renderBlogs() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  grid.innerHTML = "";

  allBlogs.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blg-card";

    card.innerHTML = `
      <a href="${blog.url}" class="blg-card-img-wrap">
        <img src="${blog.thumbnailImage}" alt="${blog.title}" class="blg-card-img" loading="lazy" />
      </a>
      <div class="blg-card-body">
        <div class="blg-card-meta">
          <span class="blg-card-tag">${blog.tag || blog.category}</span>
          <span class="blg-card-time">${blog.readTime}</span>
        </div>
        <h3 class="blg-card-title">
          <a href="${blog.url}">${blog.title}</a>
        </h3>
        <p class="blg-card-desc">${blog.description || ""}</p>
        <a href="${blog.url}" class="blg-card-link">Read Article <i class="bi bi-arrow-right"></i></a>
      </div>
    `;

    grid.appendChild(card);
  });
}

function updatePagination() {
  document.querySelectorAll(".pagination-item[data-page]").forEach(btn => {
    btn.classList.toggle(
      "active",
      Number(btn.dataset.page) === currentPage
    );
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/* Pagination controls */
document.addEventListener("click", e => {
  if (e.target.matches(".pagination-item[data-page]")) {
    currentPage = Number(e.target.dataset.page);
    renderBlogs();
  }

  if (e.target.id === "prevBtn" && currentPage > 1) {
    currentPage--;
    renderBlogs();
  }

  if (
    e.target.id === "nextBtn" &&
    currentPage < Math.ceil(allBlogs.length / BLOGS_PER_PAGE)
  ) {
    currentPage++;
    renderBlogs();
  }
});

document.addEventListener("DOMContentLoaded", loadBlogs);

/*<div class="blog-card-meta">
  <span class="blog-posted-date">
    Posted On ${formatDate(blog.publishedDate)}
  </span>
</div>*/
