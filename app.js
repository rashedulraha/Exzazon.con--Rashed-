document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // Preloader
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", function () {
    setTimeout(function () {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
    }, 500);
  });

  // Theme Switcher
  const themeToggle = document.getElementById("themeToggle");
  const themeMenu = document.getElementById("themeMenu");
  const themeIcon = document.getElementById("themeIcon");
  const lightMode = document.getElementById("lightMode");
  const darkMode = document.getElementById("darkMode");
  const systemMode = document.getElementById("systemMode");
  const html = document.documentElement;

  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem("theme") || "light";
  html.classList.toggle("dark", currentTheme === "dark");
  updateThemeIcon(currentTheme);

  // Toggle theme menu
  themeToggle.addEventListener("click", function () {
    themeMenu.classList.toggle("hidden");
  });

  // Close theme menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !themeToggle.contains(event.target) &&
      !themeMenu.contains(event.target)
    ) {
      themeMenu.classList.add("hidden");
    }
  });

  // Theme mode buttons
  lightMode.addEventListener("click", function () {
    setTheme("light");
    themeMenu.classList.add("hidden");
  });

  darkMode.addEventListener("click", function () {
    setTheme("dark");
    themeMenu.classList.add("hidden");
  });

  systemMode.addEventListener("click", function () {
    setTheme("system");
    themeMenu.classList.add("hidden");
  });

  function setTheme(theme) {
    if (theme === "system") {
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.toggle("dark", prefersDarkScheme);
      updateThemeIcon(prefersDarkScheme ? "dark" : "light");
    } else {
      html.classList.toggle("dark", theme === "dark");
      updateThemeIcon(theme);
    }
    localStorage.setItem("theme", theme);
  }

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fas fa-moon";
    } else {
      themeIcon.className = "fas fa-sun";
    }
  }

  // Language Translator
  const langToggle = document.getElementById("langToggle");
  const langText = document.getElementById("langText");
  let currentLang = localStorage.getItem("language") || "bn";

  // Set initial language
  langText.textContent = currentLang.toUpperCase();

  // Translation loading indicator
  const translationLoader = document.createElement("div");
  translationLoader.id = "translationLoader";
  translationLoader.className =
    "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden";
  translationLoader.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div class="w-16 h-16 border-t-4 border-brand-orange border-solid rounded-full animate-spin mb-4"></div>
            <p class="text-lg font-medium">অনুবাদ হচ্ছে...</p>
            <p class="text-sm text-gray-600 mt-2">অনুগ্রহপূর্বক অপেক্ষা করুন</p>
        </div>
    `;
  document.body.appendChild(translationLoader);

  // Language switcher
  langToggle.addEventListener("click", function () {
    if (currentLang === "bn") {
      translatePage("en");
    } else {
      translatePage("bn");
    }
  });

  // Function to translate the page
  function translatePage(targetLang) {
    // Show loading indicator
    translationLoader.classList.remove("hidden");

    // Get all translatable elements
    const translatableElements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th"
    );

    // Create an array of texts to translate
    const textsToTranslate = [];
    const elementMap = new Map();

    translatableElements.forEach((element) => {
      // Skip elements that should not be translated
      if (
        element.classList.contains("notranslate") ||
        element.closest(".notranslate") ||
        element.tagName === "SCRIPT" ||
        element.tagName === "STYLE"
      ) {
        return;
      }

      const text = element.textContent.trim();
      if (text && !textsToTranslate.includes(text)) {
        textsToTranslate.push(text);
        elementMap.set(text, element);
      }
    });

    // If no texts to translate, hide loader and return
    if (textsToTranslate.length === 0) {
      translationLoader.classList.add("hidden");
      return;
    }

    // Translate texts using Google Translate API
    const sourceLang = currentLang;
    const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // Replace with your actual API key

    // For demo purposes, we'll simulate translation
    // In a real implementation, you would use the Google Translate API
    simulateTranslation(textsToTranslate, sourceLang, targetLang)
      .then((translatedTexts) => {
        // Update page content with translated texts
        translatedTexts.forEach((translatedText, index) => {
          const originalText = textsToTranslate[index];
          const element = elementMap.get(originalText);
          if (element && translatedText) {
            element.textContent = translatedText;
          }
        });

        // Update current language
        currentLang = targetLang;
        langText.textContent = targetLang.toUpperCase();
        localStorage.setItem("language", targetLang);

        // Hide loading indicator
        translationLoader.classList.add("hidden");
      })
      .catch((error) => {
        console.error("Translation error:", error);
        alert("অনুবাদ করতে সমস্যা হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন।");
        translationLoader.classList.add("hidden");
      });
  }

  // Simulate translation (replace with actual API call)
  function simulateTranslation(texts, sourceLang, targetLang) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // In a real implementation, you would make an API call to Google Translate
        // For demo purposes, we'll just return the original texts
        // In a real app, you would use:
        /*
                fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: texts,
                        source: sourceLang,
                        target: targetLang,
                        format: 'text'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const translations = data.data.translations.map(t => t.translatedText);
                    resolve(translations);
                })
                .catch(error => {
                    reject(error);
                });
                */

        // For demo, we'll just return mock translations
        const mockTranslations = texts.map((text) => {
          if (targetLang === "en") {
            // Simple mock translation from Bangla to English
            return text
              .replace(/আমাদের/g, "Our")
              .replace(/সম্পর্কে/g, "About")
              .replace(/সেবাসমূহ/g, "Services")
              .replace(/প্রক্রিয়া/g, "Process")
              .replace(/যোগাযোগ/g, "Contact")
              .replace(/হোম/g, "Home")
              .replace(/কাজ শুরু করুন/g, "Get Started")
              .replace(/আরও জানুন/g, "Learn More")
              .replace(/ডিজিটাল মার্কেটিং/g, "Digital Marketing")
              .replace(/ব্যবসার প্রবৃদ্ধি/g, "Business Growth");
          } else {
            // Simple mock translation from English to Bangla
            return text
              .replace(/Our/g, "আমাদের")
              .replace(/About/g, "সম্পর্কে")
              .replace(/Services/g, "সেবাসমূহ")
              .replace(/Process/g, "প্রক্রিয়া")
              .replace(/Contact/g, "যোগাযোগ")
              .replace(/Home/g, "হোম")
              .replace(/Get Started/g, "কাজ শুরু করুন")
              .replace(/Learn More/g, "আরও জানুন")
              .replace(/Digital Marketing/g, "ডিজিটাল মার্কেটিং")
              .replace(/Business Growth/g, "ব্যবসার প্রবৃদ্ধি");
          }
        });

        resolve(mockTranslations);
      }, 1500); // Simulate 1.5 second delay
    });
  }

  // Mobile Menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");

  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");

    // Toggle menu icon animation
    if (mobileMenu.classList.contains("hidden")) {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    } else {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
    }
  });

  // Close mobile menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    });
  });

  // Service Tabs
  const serviceTabs = document.querySelectorAll(".service-tab");
  const serviceCardItems = document.querySelectorAll(".service-card-item");

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      serviceTabs.forEach((t) => {
        t.classList.remove("active", "bg-brand-orange", "text-white");
        t.classList.add("text-gray-700");
      });

      // Add active class to clicked tab
      this.classList.add("active", "bg-brand-orange", "text-white");
      this.classList.remove("text-gray-700");

      // Get the service category
      const service = this.getAttribute("data-service");

      // Filter service cards
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

  // Set the first tab as active by default
  if (serviceTabs.length > 0) {
    serviceTabs[0].classList.add("active", "bg-brand-orange", "text-white");
    serviceTabs[0].classList.remove("text-gray-700");
  }

  // Testimonial Carousel
  const testimonialContainer = document.getElementById("testimonialContainer");
  const prevTestimonial = document.getElementById("prevTestimonial");
  const nextTestimonial = document.getElementById("nextTestimonial");
  const testimonialDots = document.querySelectorAll(".dot");
  const testimonialProgress = document.getElementById("testimonialProgress");

  let currentTestimonial = 0;
  const totalTestimonials =
    document.querySelectorAll(".testimonial-item").length;
  const testimonialsToShow = window.innerWidth < 768 ? 1 : 3;
  const maxIndex = totalTestimonials - testimonialsToShow;

  // Update testimonial position
  function updateTestimonialPosition() {
    const movePercentage = -(100 / testimonialsToShow) * currentTestimonial;
    testimonialContainer.style.transform = `translateX(${movePercentage}%)`;

    // Update dots
    testimonialDots.forEach((dot, index) => {
      if (index === Math.floor(currentTestimonial / testimonialsToShow)) {
        dot.classList.add("bg-brand-orange");
        dot.classList.remove("bg-gray-300");
      } else {
        dot.classList.remove("bg-brand-orange");
        dot.classList.add("bg-gray-300");
      }
    });
  }

  // Next testimonial
  nextTestimonial.addEventListener("click", function () {
    if (currentTestimonial < maxIndex) {
      currentTestimonial++;
    } else {
      currentTestimonial = 0;
    }
    updateTestimonialPosition();
    resetProgressBar();
  });

  // Previous testimonial
  prevTestimonial.addEventListener("click", function () {
    if (currentTestimonial > 0) {
      currentTestimonial--;
    } else {
      currentTestimonial = maxIndex;
    }
    updateTestimonialPosition();
    resetProgressBar();
  });

  // Dot navigation
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      currentTestimonial = index * testimonialsToShow;
      if (currentTestimonial > maxIndex) {
        currentTestimonial = maxIndex;
      }
      updateTestimonialPosition();
      resetProgressBar();
    });
  });

  // Auto-play testimonials
  let testimonialInterval = setInterval(function () {
    if (currentTestimonial < maxIndex) {
      currentTestimonial++;
    } else {
      currentTestimonial = 0;
    }
    updateTestimonialPosition();
  }, 5000);

  // Progress bar animation
  testimonialProgress.style.width = "0%";
  let progressInterval = setInterval(function () {
    const currentWidth = parseFloat(testimonialProgress.style.width) || 0;
    if (currentWidth < 100) {
      testimonialProgress.style.width = currentWidth + 2 + "%";
    } else {
      testimonialProgress.style.width = "0%";
    }
  }, 100);

  function resetProgressBar() {
    testimonialProgress.style.width = "0%";
  }

  // Pause auto-play on hover
  testimonialContainer.addEventListener("mouseenter", function () {
    clearInterval(testimonialInterval);
    clearInterval(progressInterval);
  });

  testimonialContainer.addEventListener("mouseleave", function () {
    testimonialInterval = setInterval(function () {
      if (currentTestimonial < maxIndex) {
        currentTestimonial++;
      } else {
        currentTestimonial = 0;
      }
      updateTestimonialPosition();
    }, 5000);

    progressInterval = setInterval(function () {
      const currentWidth = parseFloat(testimonialProgress.style.width) || 0;
      if (currentWidth < 100) {
        testimonialProgress.style.width = currentWidth + 2 + "%";
      } else {
        testimonialProgress.style.width = "0%";
      }
    }, 100);
  });

  // Process Steps Animation
  const processSteps = document.querySelectorAll(".process-step");
  const progressBar = document.getElementById("progressBar");

  // Animate process steps on scroll
  function animateProcessSteps() {
    const scrollPosition = window.scrollY + window.innerHeight;

    processSteps.forEach((step, index) => {
      const stepPosition = step.offsetTop + step.offsetHeight / 2;

      if (scrollPosition > stepPosition) {
        // Update progress bar
        const progressPercentage = ((index + 1) / processSteps.length) * 100;
        progressBar.style.height = progressPercentage + "%";

        // Animate step number
        const stepNumber = step.querySelector(".step-number");
        stepNumber.classList.add("scale-125");
        setTimeout(() => {
          stepNumber.classList.remove("scale-125");
        }, 300);
      }
    });
  }

  window.addEventListener("scroll", animateProcessSteps);

  // Initial check
  animateProcessSteps();

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnIcon = document.getElementById("btnIcon");
  const successMessage = document.getElementById("successMessage");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // Simple validation
    if (!name || !email || !phone || !message) {
      alert(
        currentLang === "bn"
          ? "সকল ক্ষেত্র পূরণ করুন"
          : "Please fill all fields"
      );
      return;
    }

    // Show loading state
    btnText.textContent =
      currentLang === "bn" ? "পাঠানো হচ্ছে..." : "Sending...";
    btnIcon.className = "fas fa-spinner fa-spin ml-2";
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(function () {
      // Reset form
      contactForm.reset();

      // Show success message
      successMessage.classList.remove("hidden");

      // Reset button
      btnText.textContent = currentLang === "bn" ? "পাঠান" : "Send";
      btnIcon.className = "fas fa-paper-plane ml-2";
      submitBtn.disabled = false;

      // Hide success message after 5 seconds
      setTimeout(function () {
        successMessage.classList.add("hidden");
      }, 5000);
    }, 1500);
  });

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterBtn = document.getElementById("newsletterBtn");
  const newsletterSuccess = document.getElementById("newsletterSuccess");

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get email value
    const email = newsletterForm.querySelector('input[type="email"]').value;

    // Simple validation
    if (!email) {
      alert(
        currentLang === "bn"
          ? "ইমেইল ঠিকানা প্রবেশ করুন"
          : "Please enter your email"
      );
      return;
    }

    // Show loading state
    newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    newsletterBtn.disabled = true;

    // Simulate form submission
    setTimeout(function () {
      // Reset form
      newsletterForm.reset();

      // Show success message
      newsletterSuccess.classList.remove("hidden");

      // Reset button
      newsletterBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
      newsletterBtn.disabled = false;

      // Hide success message after 5 seconds
      setTimeout(function () {
        newsletterSuccess.classList.add("hidden");
      }, 5000);
    }, 1500);
  });

  // Back to Top Button
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTop.classList.remove("opacity-0", "invisible");
      backToTop.classList.add("opacity-100", "visible");
    } else {
      backToTop.classList.add("opacity-0", "invisible");
      backToTop.classList.remove("opacity-100", "visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // CTA Button
  const ctaButton = document.getElementById("ctaButton");
  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }

  // Open Map Function
  function openMap() {
    // In a real implementation, this would open a map modal or redirect to Google Maps
    alert(
      currentLang === "bn"
        ? "ম্যাপ খোলা হবে। এটি একটি ডেমো ফাংশন।"
        : "Map will open. This is a demo function."
    );
  }
});
