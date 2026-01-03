
// Story data object
const storyData = {
    Purpose: {
        tag: "Purpose",
        heading: "Elevating Lives, Nurturing Communities",
        content: "Inspiring individuals through innovative products and meaningful experiences, while fostering deep engagement among our valued stakeholders. Our purpose is to help build thriving, sustainable communities where people enjoy healthier, more connected lives — one sip at a time.",
        slogan: "Infusing Inspiration, Nourishing Connection",
        image: "assets/images/instagram/post01.jpg"
    },
    People: {
        tag: "People",
        heading: "Empowering Our Team",
        content: "Our people are at the heart of everything we do. We believe in creating an inclusive workplace where diverse talents thrive. We invest in continuous learning, wellness programs, and career development to ensure our team members feel valued and inspired.",
        slogan: "People First, Always Growing",
        image: "assets/images/instagram/post02.jpg"
    },
    "Corporate Governance": {
        tag: "Corporate Governance",
        heading: "Building Trust Through Transparency",
        content: "We maintain the highest standards of corporate governance to ensure accountability and transparency. Our board is committed to ethical decision-making, fair business practices, and protecting the interests of all stakeholders.",
        slogan: "Governance with Purpose",
        image: "assets/images/instagram/post03.jpg"
    },
    "Ethics & Compliance": {
        tag: "Ethics & Compliance",
        heading: "Doing the Right Thing",
        content: "Ethics is not just a policy—it's our culture. We are committed to conducting business with integrity, following all applicable laws and regulations, and maintaining the highest moral standards in everything we do.",
        slogan: "Integrity in Every Action",
        image: "assets/images/instagram/post04.jpg"
    },
    Environment: {
        tag: "Environment",
        heading: "Protecting Our Planet",
        content: "Sustainability is central to our mission. We are dedicated to reducing our environmental footprint, promoting renewable resources, and creating sustainable practices across our operations to protect the planet for future generations.",
        slogan: "Green Tomorrow, Today",
        image: "assets/images/instagram/post05.jpg"
    }
};

// Initialize the component
function initStory() {
    console.log("Story component initializing...");

    renderNavigation();
    loadStory("Purpose");
}

// Render navigation buttons
function renderNavigation() {
    console.log("Rendering navigation buttons...");
    const navContainer = document.getElementById("storyNav");
    navContainer.innerHTML = "";

    Object.keys(storyData).forEach(story => {
        const navLink = document.createElement("div");
        navLink.className = "story_story_navlink";
        navLink.textContent = story;
        navLink.dataset.story = story;

        if (story === "Purpose") {
            navLink.classList.add("active88");
        }

        navLink.addEventListener("click", () => {
            loadStory(story);
        });

        navContainer.appendChild(navLink);
    });

    console.log("Navigation buttons rendered");
}

// Load story content
function loadStory(storyName) {

    const story = storyData[storyName];

    if (!story) {
        console.error(`❌ Story "${storyName}" not found!`);
        return;
    }

    // Update active button
    document.querySelectorAll(".story_story_navlink").forEach(link => {
        link.classList.remove("active88");
        if (link.dataset.story === storyName) {
            link.classList.add("active88");
        }
    });

    // Update content with fade effect
    const imageEl = document.getElementById("storyImage");
    const tagEl = document.getElementById("storyTag");
    const headEl = document.getElementById("storyHead");
    const paraEl = document.getElementById("storyPara");
    const sloganEl = document.getElementById("storySlogan");

    // Fade out effect
    imageEl.style.opacity = "0.7";
    tagEl.parentElement.style.opacity = "0.7";

    setTimeout(() => {
        imageEl.style.backgroundImage = `url(${story.image})`;
        tagEl.textContent = story.tag;
        headEl.textContent = story.heading;
        paraEl.textContent = story.content;
        sloganEl.textContent = story.slogan;

        // Fade in effect
        imageEl.style.opacity = "1";
        tagEl.parentElement.style.opacity = "1";

        console.log(`Story "${storyName}" loaded successfully`);
    }, 150);

    imageEl.style.transition = "opacity 0.3s ease";
    tagEl.parentElement.style.transition = "opacity 0.3s ease";
}

initStory();