// js/navbar.js
const DEBUG = true; // set false for production

const NAVBAR_LOG = (message, type = "info") => {
    if (!DEBUG) return;

    const styles = {
        info: "color:#2563eb; font-weight:300",
        success: "color:#16a34a; font-weight:300",
        action: "color:#9333ea; font-weight:300",
        warn: "color:#ca8a04; font-weight:300",
    };

    console.log(`%c[Navbar] ${message}`, styles[type]);
};


async function loadCategories() {
    const res = await fetch("data/categories.json");
    const categories = await res.json();

    categories.forEach(main => {
        const list = document.querySelector(
            `.dropdown-group[data-category="${main.id}"] .dropdown-list`
        );

        if (!list) return;

        main.subCategories.forEach(sub => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = `products.html?category=${sub.slug}`;
            a.textContent = sub.title;

            li.appendChild(a);
            list.appendChild(li);
            NAVBAR_LOG("Categories loaded successfully", "success");

        });
    });
}

// Load categories into the products dropdown
loadCategories();

//Nav Bar UI Componenet handling
// UI interactions 
const navItem = document.querySelector(".nav-has-dropdown");
const dropdown = document.getElementById("products-dropdown");
const dropdownToggle = navItem.querySelector(".dropdown-toggle");
const dropdownLink = navItem.querySelector(".nav-link");

const mobileToggle = document.querySelector(".navbar-toggle");
const menu = document.querySelector(".navbar-menu");

NAVBAR_LOG("Navbar UI initialized", "info");

// Set active nav item based on current page
const navLinks = document.querySelectorAll('.navbar-menu .nav-item a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPage = link.href.split('/').pop();
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// PRODUCTS DROPDOWN (DESKTOP + MOBILE)
function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    dropdown.classList.toggle("hidden");
    dropdown.classList.toggle("show");
    dropdownToggle.classList.toggle("open");
    navItem.classList.toggle("dropdown-open");
    NAVBAR_LOG(
    dropdown.classList.contains("show")
        ? "Mega menu opened"
        : "Mega menu closed",
    "action"
);

}

// Click on arrow
dropdownToggle.addEventListener("click", toggleDropdown);

// Click on "Our Products" text
dropdownLink.addEventListener("click", toggleDropdown);

// Close dropdown when clicking outside (desktop)
document.addEventListener("click", (e) => {
    if (!navItem.contains(e.target)) {
        dropdown.classList.add("hidden");
        dropdown.classList.remove("show");
        dropdownToggle.classList.remove("open");
        navItem.classList.remove("dropdown-open");
    }
});

//MOBILE NAV TOGGLE
mobileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    if (menu.classList.contains("open")) {
        mobileToggle.textContent = "✕";
    } else {
        mobileToggle.textContent = "☰";
    }
    NAVBAR_LOG(
    menu.classList.contains("open")
        ? "Mobile menu opened"
        : "Mobile menu closed",
    "action"
);

});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !mobileToggle.contains(e.target)) {
        menu.classList.remove("open");
        mobileToggle.textContent = "☰";
        // Also close dropdown when closing menu
        dropdown.classList.add("hidden");
        dropdown.classList.remove("show");
        dropdownToggle.classList.remove("open");
    }
});

// Close mobile menu when clicking on a regular nav link
document.querySelectorAll(".nav-item:not(.nav-has-dropdown) > a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("open");
        mobileToggle.textContent = "☰";
    });
});
