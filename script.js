// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
  mirror: false,
});

// Preloader
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  preloader.style.opacity = "0";
  preloader.style.visibility = "hidden";
  setTimeout(() => {
    preloader.style.display = "none";
  }, 500);
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeMenu = document.getElementById("themeMenu");
const themeIcon = document.getElementById("themeIcon");
const lightMode = document.getElementById("lightMode");
const darkMode = document.getElementById("darkMode");
const systemMode = document.getElementById("systemMode");

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", currentTheme === "dark");
updateThemeIcon(currentTheme);

themeToggle.addEventListener("click", () => {
  themeMenu.classList.toggle("hidden");
});

// Set theme functions
function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    updateThemeIcon("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    updateThemeIcon("light");
  } else if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.toggle("dark", prefersDark);
    localStorage.setItem("theme", "system");
    updateThemeIcon(prefersDark ? "dark" : "light");
  }
  themeMenu.classList.add("hidden");
}

function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.className = "fas fa-sun";
  } else {
    themeIcon.className = "fas fa-moon";
  }
}

lightMode.addEventListener("click", () => setTheme("light"));
darkMode.addEventListener("click", () => setTheme("dark"));
systemMode.addEventListener("click", () => setTheme("system"));

// Close theme menu when clicking outside
document.addEventListener("click", (e) => {
  if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
    themeMenu.classList.add("hidden");
  }
});

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const menuIcon = document.getElementById("menuIcon");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

function openMobileMenu() {
  mobileMenu.classList.remove("translate-x-full");
  mobileMenuOverlay.classList.add("active");
  menuIcon.classList.replace("fa-bars", "fa-times");
  mobileMenuBtn.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  mobileMenu.classList.add("translate-x-full");
  mobileMenuOverlay.classList.remove("active");
  menuIcon.classList.replace("fa-times", "fa-bars");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
}

mobileMenuBtn.addEventListener("click", openMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);
mobileMenuOverlay.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking on a link
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Testimonial Carousel
document.addEventListener("DOMContentLoaded", function () {
  // Testimonial Carousel Functionality
  const testimonialContainer = document.getElementById("testimonialContainer");
  const testimonials =
    testimonialContainer.querySelectorAll(".testimonial-item");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const dots = document.querySelectorAll("#testimonialDots .dot");
  const progressBar = document.getElementById("testimonialProgress");
  const playPauseBtn = document.getElementById("autoplayToggle");
  const playPauseIcon = document.getElementById("playPauseIcon");
  const playPauseText = document.getElementById("playPauseText");

  let currentIndex = 0;
  let autoplayInterval;
  let progressInterval;
  let isPlaying = true;
  let slideWidth;

  // Calculate slide width based on viewport
  function calculateSlideWidth() {
    return window.innerWidth < 768 ? 100 : 33.333; // Mobile: 100%, Desktop: 33.333%
  }

  // Update slide positions
  function updateSlidePosition() {
    slideWidth = calculateSlideWidth();
    testimonialContainer.style.transform = `translateX(-${
      currentIndex * slideWidth
    }%)`;

    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("bg-brand-orange");
        dot.classList.remove("bg-gray-300");
        dot.setAttribute("aria-selected", "true");
      } else {
        dot.classList.remove("bg-brand-orange");
        dot.classList.add("bg-gray-300");
        dot.setAttribute("aria-selected", "false");
      }
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    const maxIndex =
      window.innerWidth < 768
        ? testimonials.length - 1
        : Math.floor(testimonials.length / 3) - 1;
    currentIndex = (index + maxIndex + 1) % (maxIndex + 1);
    updateSlidePosition();
    resetAutoplay();
  }

  // Next slide
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  // Previous slide
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Start autoplay
  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    if (progressInterval) clearInterval(progressInterval);

    isPlaying = true;
    playPauseIcon.className = "fas fa-pause mr-2";
    playPauseText.textContent = "Pause";

    // Reset progress bar
    progressBar.style.width = "0%";

    // Progress bar animation
    let progress = 0;
    progressInterval = setInterval(() => {
      progress += 2;
      progressBar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    // Autoplay slides
    autoplayInterval = setInterval(() => {
      nextSlide();
      // Reset progress bar
      progress = 0;
      progressBar.style.width = "0%";
      progressInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    }, 5000);
  }

  // Stop autoplay
  function stopAutoplay() {
    clearInterval(autoplayInterval);
    clearInterval(progressInterval);
    isPlaying = false;
    playPauseIcon.className = "fas fa-play mr-2";
    playPauseText.textContent = "Play";
    progressBar.style.width = "0%";
  }

  // Reset autoplay
  function resetAutoplay() {
    if (isPlaying) {
      stopAutoplay();
      startAutoplay();
    }
  }

  // Event listeners
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Pause on hover
  testimonialContainer.addEventListener("mouseenter", () => {
    if (isPlaying) stopAutoplay();
  });

  testimonialContainer.addEventListener("mouseleave", () => {
    if (isPlaying) startAutoplay();
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    updateSlidePosition();
    resetAutoplay();
  });

  // Initialize
  updateSlidePosition();
  startAutoplay();

  // Service Tabs (আপনার বিদ্যমান কোড)
  const serviceTabs = document.querySelectorAll(".service-tab");
  const serviceCardItems = document.querySelectorAll(".service-card-item");

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      serviceTabs.forEach((t) => {
        t.classList.remove("active", "bg-brand-orange", "text-white");
        t.classList.add("hover:bg-brand-orange", "hover:text-white");
      });

      // Add active class to clicked tab
      tab.classList.add("active", "bg-brand-orange", "text-white");
      tab.classList.remove("hover:bg-brand-orange", "hover:text-white");

      // Filter service cards
      const service = tab.getAttribute("data-service");
      serviceCardItems.forEach((card) => {
        if (
          service === "all" ||
          card.getAttribute("data-category") === service
        ) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
});
// FAQ Accordion
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  const faqAnswer = faqItem.querySelector(".faq-answer");
  const faqIcon = element.querySelector(".faq-icon");

  // Close all other FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== faqItem) {
      item.querySelector(".faq-answer").classList.add("hidden");
      item.querySelector(".faq-icon").classList.remove("active");
    }
  });

  // Toggle current FAQ item
  faqAnswer.classList.toggle("hidden");
  faqIcon.classList.toggle("active");
}

// Theme Selector for FAQ
const themeButtons = document.querySelectorAll(".theme-btn");
const root = document.documentElement;

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    themeButtons.forEach((b) => b.classList.remove("active"));

    // Add active class to clicked button
    btn.classList.add("active");

    // Apply theme
    if (btn.classList.contains("theme-orange")) {
      root.style.setProperty("--theme-accent", "#f97316");
      root.style.setProperty("--theme-secondary", "#3b82f6");
    } else if (btn.classList.contains("theme-green")) {
      root.style.setProperty("--theme-accent", "#10b981");
      root.style.setProperty("--theme-secondary", "#14b8a6");
    } else if (btn.classList.contains("theme-purple")) {
      root.style.setProperty("--theme-accent", "#8b5cf6");
      root.style.setProperty("--theme-secondary", "#ec4899");
    }
  });
});

// Contact Form
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnIcon = document.getElementById("btnIcon");
const successMessage = document.getElementById("successMessage");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show loading state
  submitBtn.disabled = true;
  btnText.textContent = "Sending...";
  btnIcon.className = "fas fa-spinner fa-spin ml-2";

  // Simulate form submission
  setTimeout(() => {
    // Reset form
    contactForm.reset();

    // Show success message
    successMessage.classList.remove("hidden");

    // Reset button
    submitBtn.disabled = false;
    btnText.textContent = "Send";
    btnIcon.className = "fas fa-paper-plane ml-2";

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 5000);
  }, 2000);
});

// Signup Modal
const signupModal = document.getElementById("signupModal");
const signupForm = document.getElementById("signupForm");

function showSignupModal() {
  signupModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeSignupModal() {
  signupModal.classList.add("hidden");
  document.body.style.overflow = "auto";
  signupForm.reset();
}

// Close modal when clicking outside
signupModal.addEventListener("click", function (e) {
  if (e.target === signupModal) {
    closeSignupModal();
  }
});

// Handle signup form submission
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show loading state
  const submitBtn = signupForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Creating Account...";
  submitBtn.disabled = true;

  // Simulate account creation
  setTimeout(() => {
    // Reset form
    signupForm.reset();

    // Show success message (you can customize this)
    alert(
      "Account created successfully! Please check your email for verification."
    );

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    // Close modal
    closeSignupModal();
  }, 2000);
});

// Newsletter Subscription
function subscribeNewsletter() {
  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value.trim();

  if (email && isValidEmail(email)) {
    // Show loading state
    const originalPlaceholder = emailInput.placeholder;
    emailInput.placeholder = "Subscribing...";
    emailInput.disabled = true;

    // Simulate subscription
    setTimeout(() => {
      // Reset input
      emailInput.value = "";
      emailInput.placeholder = originalPlaceholder;
      emailInput.disabled = false;

      // Show success message
      alert("Thank you for subscribing! You will receive our latest updates.");
    }, 1500);
  } else {
    alert("Please enter a valid email address.");
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.remove("opacity-0", "invisible");
    backToTopBtn.classList.add("opacity-100", "visible");
  } else {
    backToTopBtn.classList.add("opacity-0", "invisible");
    backToTopBtn.classList.remove("opacity-100", "visible");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Process Progress Bar Animation
const processSteps = document.querySelectorAll(".process-step");
const progressBar = document.getElementById("progressBar");

function updateProgressBar() {
  const scrollPosition = window.scrollY;
  const processSection = document.getElementById("process");

  if (processSection) {
    const sectionTop = processSection.offsetTop;
    const sectionHeight = processSection.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;

    if (scrollPosition >= sectionTop - 200 && scrollPosition <= sectionBottom) {
      const progress =
        ((scrollPosition - sectionTop + 200) / sectionHeight) * 100;
      progressBar.style.height = `${Math.min(progress, 100)}%`;
    }
  }
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("load", updateProgressBar);

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("text-brand-cyberTeal");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("text-brand-cyberTeal");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

// Add animation to service cards when they come into view
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all service cards
document.querySelectorAll(".service-card-item").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroSection = document.getElementById("home");
  const heroShapes = heroSection.querySelectorAll(".absolute > div");

  heroShapes.forEach((shape, index) => {
    const speed = 0.5 + index * 0.1;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Add hover effect to CTA button
const ctaButton = document.getElementById("ctaButton");
if (ctaButton) {
  ctaButton.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
  });

  ctaButton.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
}

// Initialize tooltips if needed (using a simple custom implementation)
document.querySelectorAll("[title]").forEach((element) => {
  element.addEventListener("mouseenter", function () {
    const title = this.getAttribute("title");
    const tooltip = document.createElement("div");
    tooltip.className =
      "absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50";
    tooltip.textContent = title;
    tooltip.style.bottom = "100%";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.style.marginBottom = "5px";

    this.style.position = "relative";
    this.appendChild(tooltip);
    this.removeAttribute("title");
    this.setAttribute("data-title", title);
  });

  element.addEventListener("mouseleave", function () {
    const tooltip = this.querySelector("div");
    if (tooltip) {
      this.setAttribute("title", this.getAttribute("data-title"));
      this.removeChild(tooltip);
    }
  });
});
