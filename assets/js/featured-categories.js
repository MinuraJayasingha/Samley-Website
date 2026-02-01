const data = {
    teas: {
        title: "Organic",
        title2: "Teas",
        eyebrow: "Premium Products",
        description:
            "Savor the rich aroma and authentic taste of our handcrafted tea blends — crafted to calm, energize, and delight every moment.",
        image: "assets/images/feat_categories/Organic Teas Cover.png",
        link: "products.html?category=green-tea"
    },

    beverages: {
        title: "Organic",
        title2: "Beverages",
        eyebrow: "Premium Products",
        description:
            "From fruit-infused coolers to revitalizing brews, our beverages are designed to refresh your body and spirit.",
        image: "assets/images/feat_categories/Organic Beverages.png",
        link: "products.html?category=iced-coffee"
    },

    spices: {
        title: "Organic",
        title2: "Spices",
        eyebrow: "Premium Products",
        description:
            "Add natural depth and bold flavor to your meals with our sustainably sourced organic spices.",
        image: "assets/images/feat_categories/Organic Spices.png",
        link: "products.html?category=ceylon-organic-spices"
    },

    coconut: {
        title: "Organic",
        title2: "Coconut Products",
        eyebrow: "Premium Products",
        description:
            "Pure, tropical coconut creations crafted to nourish, refresh, and elevate everyday living.",
        image: "assets/images/feat_categories/Organic Coconut Based.png",
        link: "products.html?category=coconut-water"
    }
};

const tabs = document.querySelectorAll(".featured-tabs .tab");

const image = document.getElementById("featuredImage");
const title = document.getElementById("featuredTitle");
const title2 = document.getElementById("featuredTitle2");
const eyebrow = document.getElementById("featuredEyebrow");
const description = document.getElementById("featuredDescription");
const link = document.getElementById("featuredLink");

function updateSlide(key) {
    const item = data[key];
    if (!item) return;

    image.src = item.image;
    image.alt = key;

    title.innerHTML = item.title;
    title2.innerHTML = item.title2;
    eyebrow.textContent = item.eyebrow;
    description.textContent = item.description;
    link.href = item.link;
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active-99"));
        tab.classList.add("active-99");

        const key = tab.dataset.key;
        updateSlide(key);
    });
});

// Load first tab by default
updateSlide("teas");
