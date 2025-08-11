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
const testimonialContainer = document.getElementById("testimonialContainer");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
const testimonialDots = document.querySelectorAll(".dot");
const testimonialProgress = document.getElementById("testimonialProgress");

let currentTestimonial = 0;
const totalTestimonials = testimonialDots.length;
let testimonialInterval;

function showTestimonial(index) {
  const translateX = -index * (100 / totalTestimonials);
  testimonialContainer.style.transform = `translateX(${translateX}%)`;

  // Update dots
  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
    dot.classList.toggle("bg-brand-orange", i === index);
    dot.classList.toggle("bg-gray-300", i !== index);
  });

  // Reset progress bar
  testimonialProgress.style.width = "0%";
  setTimeout(() => {
    testimonialProgress.style.width = "100%";
  }, 50);
}

function nextSlide() {
  currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
  showTestimonial(currentTestimonial);
}

function prevSlide() {
  currentTestimonial =
    (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
  showTestimonial(currentTestimonial);
}

function startTestimonialAutoplay() {
  testimonialInterval = setInterval(nextSlide, 5000);
}

function stopTestimonialAutoplay() {
  clearInterval(testimonialInterval);
}

prevTestimonial.addEventListener("click", () => {
  prevSlide();
  stopTestimonialAutoplay();
  startTestimonialAutoplay();
});

nextTestimonial.addEventListener("click", () => {
  nextSlide();
  stopTestimonialAutoplay();
  startTestimonialAutoplay();
});

// Dot navigation
testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentTestimonial = index;
    showTestimonial(currentTestimonial);
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
  });
});

// Start autoplay
startTestimonialAutoplay();

// Pause autoplay on hover
const testimonialSection = document.querySelector("#testimonials");
if (testimonialSection) {
  testimonialSection.addEventListener("mouseenter", stopTestimonialAutoplay);
  testimonialSection.addEventListener("mouseleave", startTestimonialAutoplay);
}

// Service Tabs
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
      if (service === "all" || card.getAttribute("data-category") === service) {
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
