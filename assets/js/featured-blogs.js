// assets/js/featured-blogs.js

const MAX_FEATURED_BLOGS = 3;

async function loadFeaturedBlogs() {
    try {
        const res = await fetch("/data/blogs.json");
        if (!res.ok) throw new Error("Failed to load blogs.json");

        const blogs = await res.json();

        const featuredBlogs = blogs
            .filter(blog => blog.featured && blog.status === "published")
            .slice(0, MAX_FEATURED_BLOGS);

        renderFeaturedBlogs(featuredBlogs);

    } catch (err) {
        console.error("[Featured Blogs]", err);
    }
}

function renderFeaturedBlogs(blogs) {
    const grid = document.getElementById("featuredBlogsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    blogs.forEach(blog => {
        const card = document.createElement("article");
        card.className = "blog-card featured-blog-card";

        card.innerHTML = `
      <img src="${blog.thumbnailImage}" alt="${blog.title}" class="blog-card-image">

      <div class="blog-card-content">


        <h3 class="blog-card-title">${blog.title}</h3>

        <p class="blog-card-description">
          ${blog.shortDescription}
        </p>

        <a href="blog.html?slug=${blog.slug}" class="btn-06">
          Read More
        </a>
      </div>
    `;

        grid.appendChild(card);
    });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

document.addEventListener("DOMContentLoaded", loadFeaturedBlogs);

/*         <span class="blog-posted-date">
          Posted On ${formatDate(blog.publishedDate)}
        </span>
        
        */
