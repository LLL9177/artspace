const slides = [...document.querySelectorAll("section")];
const indicators = [...document.querySelectorAll(".indicator")];

const prevButton = document.querySelector("#prev-slide");
const nextButton = document.querySelector("#next-slide");

let currentSlideIndex = 0;
let isSwitching = false;

// Generate indicators dynamically
const indicatorContainer = document.querySelector(".slide-indicators");
indicatorContainer.innerHTML = "";

slides.forEach((slide, i) => {
    const indicator = document.createElement("button");

    indicator.classList.add("indicator");
    indicator.dataset.slide = i;

    indicator.addEventListener("click", () => {
        goToSlide(i);
    });

    indicatorContainer.appendChild(indicator);
});

const slideIndicators = [...indicatorContainer.children];

function updateControls() {
    slideIndicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === currentSlideIndex);
    });

    prevButton.disabled = currentSlideIndex === 0;
    nextButton.disabled = currentSlideIndex === slides.length - 1;
}

// Initial slide

slides[0].style.display = "flex";

setTimeout(() => {
    slides[0].classList.add("current-slide");
    slides[0].style.transform = "translateY(0)";

    document.body.style.backgroundColor = "white";

    updateControls();
}, 100);


// Slide navigation

async function goToSlide(targetIndex) {
    if (
        isSwitching ||
        targetIndex < 0 ||
        targetIndex >= slides.length ||
        targetIndex === currentSlideIndex
    ) return;

    isSwitching = true;

    const previousSlide = slides[currentSlideIndex];
    const nextSlide = slides[targetIndex];

    // Close any open overlays

    document.querySelectorAll(".more-info").forEach(el => {
        el.style.display = "none";
        el.style.opacity = 0;
    });

    previousSlide.classList.remove("current-slide");

    await new Promise(resolve => setTimeout(resolve, 400));

    previousSlide.style.display = "none";

    currentSlideIndex = targetIndex;

    nextSlide.style.display = "flex";
    nextSlide.style.transform = "translateY(30px)";

    updateControls();

    await new Promise(resolve => setTimeout(resolve, 20));

    nextSlide.classList.add("current-slide");
    nextSlide.style.transform = "translateY(0)";

    await new Promise(resolve => setTimeout(resolve, 400));

    isSwitching = false;
}

function switchSlide(next = true) {
    goToSlide(currentSlideIndex + (next ? 1 : -1));
}


// Arrow controls

prevButton.addEventListener("click", () => switchSlide(false));
nextButton.addEventListener("click", () => switchSlide(true));


// Keyboard controls

document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") switchSlide();
    if (e.key === "ArrowLeft") switchSlide(false);
});


// Read More

document.querySelectorAll(".painting-info_read-more").forEach(button => {
    button.addEventListener("click", () => {
        const moreInfo = button.closest("section").querySelector(".more-info");
        const paragraph = moreInfo.querySelector("p");

        moreInfo.style.display = "flex";
        paragraph.style.transform = "translateY(30px)";

        setTimeout(() => {
            moreInfo.style.opacity = 1;
            paragraph.style.transform = "translateY(0)";
        }, 10);
    });
});


// Close Read More

document.querySelectorAll(".more-info_close-button").forEach(button => {
    button.addEventListener("click", () => {
        const moreInfo = button.closest(".more-info");

        moreInfo.style.opacity = 0;
        moreInfo.querySelector("p").style.transform = "translateY(150vh)";

        setTimeout(() => {
            moreInfo.style.display = "none";
        }, 200);
    });
});

document.querySelectorAll(".more-info").forEach(overlay => {
    overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            overlay.querySelector(".more-info_close-button").click();
        }
    });
});
