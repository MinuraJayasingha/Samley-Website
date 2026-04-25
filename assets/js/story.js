const storyData = {
    Purpose: {
        tag: "Purpose",
        heading: "Elevating Lives, Nurturing Communities",
        content: "At Samley, we are driven by a singular purpose: Elevating Lives, Nurturing Communities. We inspire individuals through innovative products and meaningful experiences, foster deep engagement among our stakeholders, and cultivate thriving, sustainable communities where people lead healthier, more connected lives — one sip at a time.",
        slogan: "Infusing Inspiration, Nourishing Connection — Sip, Savour, Thrive.",
        image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1400&q=90"
    },
    People: {
        tag: "People",
        heading: "People Are at Our Centre",
        content: "From plantation partners to global distributors, from factory floor teams to end consumers — our ecosystem is built on mutual respect and shared growth. We take pride in fostering gender inclusivity and empowering women within manufacturing, administration, and quality control functions. 60% of our workforce comprises women, including at key managerial positions.",
        slogan: "People First. Always Growing.",
        image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1400&q=90"
    },
    "Corporate Governance": {
        tag: "Corporate Governance",
        heading: "Structured Oversight & Accountability",
        content: "Samley is committed to responsible corporate stewardship. We are in the process of establishing structured oversight committees inclusive of Independent Non-Executive Directors. We prioritize full legal compliance, food safety protocols, occupational health & safety, anti-bribery practices, and transparent commercial conduct. We uphold fairness, traceability, and documentation integrity in every transaction.",
        slogan: "Governance with Purpose. Integrity is Non-Negotiable.",
        image: "assets/images/samples/LS_session-114673-scaled.jpg"
    },
    "Ethics & Compliance": {
        tag: "Ethics & Compliance",
        heading: "Doing the Right Thing",
        content: "Our operations are governed by internationally recognized certifications: FSSC 22000, FDA, GMP, Fairtrade International, SEDEX, USDA Organic, EU Organic, and Carbon Verified. These validate our structured approach to food safety management, responsible sourcing, labour ethics, environmental protection, and supply chain traceability.",
        slogan: "Integrity in Every Action. Compliance in Every Transaction.",
        image: "assets/images/samples/LS_session-114719-scaled.jpg"
    },
    Environment: {
        tag: "Environment",
        heading: "Carbon Verified. Net Zero by 2040.",
        content: "Samley is carbon verified, with documented assessment of our operational emissions profile. We have implemented on-site solar panel installations and continuous energy efficiency improvements. We continuously enhance waste minimisation, packaging efficiency, and responsible material sourcing. Samley has formally committed to achieving Net Zero Carbon by 2040, supported by measurable milestones and progressive reduction strategies.",
        slogan: "Preserving the Highlands That Make Ceylon Tea Possible.",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1400&q=90"
    }
};

function initStory() {
    renderNavigation();
    loadStory("Purpose");
}

function renderNavigation() {
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
}

function loadStory(storyName) {
    const story = storyData[storyName];
    if (!story) return;

    document.querySelectorAll(".story_story_navlink").forEach(link => {
        link.classList.remove("active88");
        if (link.dataset.story === storyName) {
            link.classList.add("active88");
        }
    });

    const imageEl  = document.getElementById("storyImage");
    const tagEl    = document.getElementById("storyTag");
    const headEl   = document.getElementById("storyHead");
    const paraEl   = document.getElementById("storyPara");
    const sloganEl = document.getElementById("storySlogan");
    const card     = imageEl ? imageEl.closest(".sts-pillars-card") : null;

    if (card) card.style.opacity = "0";

    setTimeout(() => {
        if (imageEl)  imageEl.style.backgroundImage = `url(${story.image})`;
        if (tagEl)    tagEl.textContent    = story.tag;
        if (headEl)   headEl.textContent   = story.heading;
        if (paraEl)   paraEl.textContent   = story.content;
        if (sloganEl) sloganEl.textContent = story.slogan;
        if (card)     card.style.opacity   = "1";
    }, 180);

    if (card) card.style.transition = "opacity 0.35s ease";
}

initStory();
