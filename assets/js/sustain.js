
const slides = document.querySelectorAll(".sustain-slide");
let currentIndex = 0;

function setBackgrounds() {
    const isMobile = window.innerWidth < 992;

    slides.forEach(slide => {
        const img = isMobile
            ? slide.dataset.mobile
            : slide.dataset.desktop;

        slide.style.backgroundImage = `url(${img})`;
    });
}

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

/* Init */
setBackgrounds();
showSlide(currentIndex);

/* Auto change */
setInterval(nextSlide, 5000);

/* Update on resize */
window.addEventListener("resize", setBackgrounds);

