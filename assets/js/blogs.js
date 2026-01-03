// assets/js/blogs.js

const BLOGS_PER_PAGE = 3;
let currentPage = 1;
let allBlogs = [];

async function loadBlogs() {
  try {
    const res = await fetch("data/blogs.json");
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

  const start = (currentPage - 1) * BLOGS_PER_PAGE;
  const end = start + BLOGS_PER_PAGE;
  const pageBlogs = allBlogs.slice(start, end);

  pageBlogs.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blog-card";

    card.innerHTML = `
      <img src="${blog.thumbnailImage}" alt="${blog.title}" class="blog-card-image">

      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span class="blog-posted-date">
            Posted On ${formatDate(blog.publishedDate)}
          </span>
        </div>

        <h2 class="blog-card-title">${blog.title}</h2>

        <p class="blog-card-description">
          ${blog.shortDescription}
        </p>

        <div class="blog-card-footer">
          <a href="blog.html?slug=${blog.slug}" class="blog-read-more-btn btn-06">
            Read More
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  updatePagination();
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
