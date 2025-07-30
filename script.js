// Мобильное меню
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  nav.classList.toggle("active");
  burger.classList.toggle("toggle");
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      burger.classList.remove("toggle");
    }

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Анимация появления секций
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach((section) => {
  observer.observe(section);
});

// Improved Section Snapping with better detection
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  let isAnimating = false;
  let scrollTimeout;

  // Add CSS for scroll snapping
  const style = document.createElement("style");
  style.textContent = `
    html {
      scroll-behavior: smooth;
    }
    section {
      height: 100vh;
      scroll-snap-align: start;
    }
    @media (min-width: 768px) {
      html {
        scroll-snap-type: y mandatory;
      }
    }
  `;
  document.head.appendChild(style);

  // Handle scroll events
  window.addEventListener("scroll", function () {
    if (isAnimating) return;

    // Clear any pending timeout
    clearTimeout(scrollTimeout);

    // Set new timeout to detect scroll end
    scrollTimeout = setTimeout(() => {
      snapToNearestSection();
    }, 100);
  });

  function snapToNearestSection() {
    if (isAnimating) return;
    isAnimating = true;

    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let closestSection = null;
    let smallestDistance = Infinity;

    // Find closest section to center of viewport
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionMid = sectionTop + section.offsetHeight / 2;
      const distance = Math.abs(scrollPosition - sectionMid);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestSection = section;
      }
    });

    if (closestSection) {
      window.scrollTo({
        top: closestSection.offsetTop,
        behavior: "smooth",
      });
    }

    // Reset animation lock after scroll completes
    setTimeout(() => {
      isAnimating = false;
    }, 1000);
  }

  // Keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentScroll = window.scrollY;
      let targetSection = null;

      if (e.key === "ArrowDown") {
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop > currentScroll + 10) {
            targetSection = sections[i];
            break;
          }
        }
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].offsetTop < currentScroll - 10) {
            targetSection = sections[i];
            break;
          }
        }
      }

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});
