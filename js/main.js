/* =========================================================
   IRON PULSE GYM — main.js (shared interactivity)
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMenuToggle();
    initScrollReveal();
    initStats();
    initGalleryFilter();
    initLightbox();
    initPasswordToggles();
    initSignupWizard();
    initPasswordStrength();
    initAuthForms();
    initAutoYear();
    initToast();
    initMemberDashboard();
    initHomeGalleryCards();
  });

  /* -------------------------------------------------------
     HEADER — add scrolled state
  ------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------------
     MOBILE MENU TOGGLE
  ------------------------------------------------------- */
  function initMenuToggle() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav#primary-nav");
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* -------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------- */
  function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------------
     ANIMATED STAT COUNTERS
  ------------------------------------------------------- */
  function initStats() {
    const counters = document.querySelectorAll(".stat-number[data-target]");
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------------
     GALLERY FILTER (gallery page)
  ------------------------------------------------------- */
  function initGalleryFilter() {
    const buttons = document.querySelectorAll(".gallery-filter button");
    const items = document.querySelectorAll(".gallery-item");
    if (!buttons.length || !items.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach((item, i) => {
          const show = filter === "all" || item.classList.contains(filter);
          if (show) {
            item.classList.remove("hidden");
            item.style.animation = "none";
            // force reflow to re-trigger animation
            void item.offsetWidth;
            item.style.animation = `fadeInUp 0.55s ${i * 0.04}s ease both`;
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  /* -------------------------------------------------------
     LIGHTBOX (gallery page)
  ------------------------------------------------------- */
  function initLightbox() {
    const lightbox = document.querySelector(".lightbox");
    if (!lightbox) return;

    const img = lightbox.querySelector(".lightbox-img");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeBtn = lightbox.querySelector(".close");

    const open = (item) => {
      const src = item.querySelector("img")?.getAttribute("src") || "";
      const title = item.dataset.title || item.querySelector(".overlay h3")?.textContent || "Iron Pulse Gym";
      img.src = src;
      img.alt = title;
      caption.textContent = title;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      img.src = "";
    };

    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => open(item));
    });

    closeBtn.addEventListener("click", close);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) close();
    });
  }

  /* -------------------------------------------------------
     PASSWORD TOGGLE
  ------------------------------------------------------- */
  function initPasswordToggles() {
    document.querySelectorAll(".toggle-password").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.parentElement.querySelector("input");
        const icon = btn.querySelector("i");
        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        icon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
      });
    });
  }

  /* -------------------------------------------------------
     SIGNUP MULTI-STEP WIZARD
  ------------------------------------------------------- */
  function initSignupWizard() {
    const steps = document.querySelectorAll(".form-step");
    if (!steps.length) return;

    window.nextStep = function () {
      const current = document.querySelector(".form-step.active");
      if (!current) return;
      const stepNum = parseInt(current.dataset.step, 10);
      if (!validateStep(stepNum)) return;

      const next = document.querySelector(`.form-step[data-step="${stepNum + 1}"]`);
      if (next) {
        current.classList.remove("active");
        next.classList.add("active");
        updateStepProgress(stepNum + 1);
        updateReviewCard();
      }
    };

    window.prevStep = function () {
      const current = document.querySelector(".form-step.active");
      if (!current) return;
      const stepNum = parseInt(current.dataset.step, 10);
      const prev = document.querySelector(`.form-step[data-step="${stepNum - 1}"]`);
      if (prev) {
        current.classList.remove("active");
        prev.classList.add("active");
        updateStepProgress(stepNum - 1);
      }
    };

    function updateStepProgress(activeStep) {
      document.querySelectorAll(".step-item").forEach((item) => {
        const n = parseInt(item.dataset.step, 10);
        item.classList.toggle("active", n === activeStep);
      });
      document.querySelectorAll(".step-connector").forEach((conn, i) => {
        conn.classList.toggle("done", i + 1 < activeStep);
      });
    }

    function validateStep(stepNum) {
      const step = document.querySelector(`.form-step[data-step="${stepNum}"]`);
      if (!step) return true;
      let valid = true;

      step.querySelectorAll("input, select").forEach((input) => {
        const error = document.getElementById(input.id + "Error");
        const group = input.closest(".form-group");

        if (!input.value.trim()) {
          if (error) error.classList.add("show");
          if (group) group.classList.add("error");
          valid = false;
        } else {
          if (error && input.type === "email" && !/^\S+@\S+\.\S+$/.test(input.value)) {
            error.classList.add("show");
            if (group) group.classList.add("error");
            valid = false;
          } else {
            if (error) error.classList.remove("show");
            if (group) group.classList.remove("error");
          }
        }
      });

      if (stepNum === 2) {
        const pw = document.getElementById("regPassword");
        const confirm = document.getElementById("regConfirmPassword");
        const pwErr = document.getElementById("regPasswordError");
        const confirmErr = document.getElementById("regConfirmPasswordError");

        if (pw && pw.value.length < 8) {
          if (pwErr) pwErr.classList.add("show");
          if (pw) pw.closest(".form-group").classList.add("error");
          valid = false;
        }
        if (confirm && pw && confirm.value !== pw.value) {
          if (confirmErr) confirmErr.classList.add("show");
          if (confirm) confirm.closest(".form-group").classList.add("error");
          valid = false;
        }
      }

      return valid;
    }

    function updateReviewCard() {
      const name = document.getElementById("reviewName");
      const email = document.getElementById("reviewEmail");
      const phone = document.getElementById("reviewPhone");
      const branch = document.getElementById("reviewBranch");
      const plan = document.getElementById("reviewPlan");

      const val = (id) => (document.getElementById(id)?.value || "—");
      const activePlan = document.querySelector(".plan-pill-option.active");

      if (name) name.textContent = val("regName") || "—";
      if (email) email.textContent = val("regEmail") || "—";
      if (phone) phone.textContent = val("regPhone") || "—";
      if (branch) branch.textContent = val("regBranch") || "—";
      if (plan && activePlan) {
        plan.textContent = activePlan.dataset.plan + " — " + activePlan.dataset.price;
      }
    }
  }

  /* -------------------------------------------------------
     PASSWORD STRENGTH METER
  ------------------------------------------------------- */
  function initPasswordStrength() {
    const input = document.getElementById("regPassword");
    if (!input) return;

    input.addEventListener("input", () => {
      const value = input.value;
      const fill = document.getElementById("strengthFill");
      const text = document.getElementById("strengthText");
      if (!fill || !text) return;

      let score = 0;
      if (value.length >= 8) score++;
      if (value.length >= 12) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;

      const levels = [
        { min: 0, label: "Too weak", color: "#ff3b3b", width: "12%" },
        { min: 2, label: "Weak", color: "#ff6b1a", width: "34%" },
        { min: 3, label: "Okay", color: "#ffd166", width: "58%" },
        { min: 4, label: "Strong", color: "#2ee59d", width: "82%" },
        { min: 5, label: "Very strong", color: "#2ee59d", width: "100%" },
      ];

      let current = levels[0];
      for (const lvl of levels) {
        if (score >= lvl.min) current = lvl;
      }

      fill.style.width = current.width;
      fill.style.background = current.color;
      text.textContent = current.label;
      text.style.color = current.color;
    });
  }

  /* -------------------------------------------------------
     PLAN PILL SELECTION (signup)
  ------------------------------------------------------- */
  window.selectPlanPill = function (btn) {
    document.querySelectorAll(".plan-pill-option").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const plan = document.getElementById("reviewPlan");
    if (plan) {
      plan.textContent = btn.dataset.plan + " — " + btn.dataset.price;
    }
    showToast(`Selected plan: ${btn.dataset.plan}`, "fa-solid fa-crown");
  };

  /* -------------------------------------------------------
     AUTH FORMS (login / signup submit)
  ------------------------------------------------------- */
  function initAuthForms() {
    const loginForm = document.getElementById("standaloneLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail")?.value.trim();
        const password = document.getElementById("loginPassword")?.value.trim();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
          showToast("Please enter a valid email address.", "fa-solid fa-circle-exclamation");
          return;
        }
        if (!password) {
          showToast("Please enter your password.", "fa-solid fa-circle-exclamation");
          return;
        }

        localStorage.setItem("ironPulseMember", JSON.stringify({ email, name: "Member" }));
        showToast("Welcome back, Iron Athlete! Redirecting…", "fa-solid fa-dumbbell");
        setTimeout(() => (window.location.href = "Member.html"), 1200);
      });

      const demoBtn = document.getElementById("demoLoginBtn");
      if (demoBtn) {
        demoBtn.addEventListener("click", () => {
          localStorage.setItem("ironPulseMember", JSON.stringify({ email: "demo@ironpulse.fit", name: "Demo Athlete" }));
          showToast("Demo login successful! Redirecting to your dashboard…", "fa-solid fa-bolt");
          setTimeout(() => (window.location.href = "Member.html"), 1200);
        });
      }

      const guestBtn = document.getElementById("guestLoginBtn");
      if (guestBtn) {
        guestBtn.addEventListener("click", () => {
          showToast("Continuing as guest (browse-only).", "fa-solid fa-user-secret");
          setTimeout(() => (window.location.href = "index.html"), 1000);
        });
      }
    }

    const signupForm = document.getElementById("standaloneSignupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const terms = document.getElementById("termsCheck");
        if (terms && !terms.checked) {
          showToast("Please accept the Terms & Conditions.", "fa-solid fa-circle-exclamation");
          return;
        }

        const name = document.getElementById("regName")?.value.trim() || "New Member";
        localStorage.setItem(
          "ironPulseMember",
          JSON.stringify({
            email: document.getElementById("regEmail")?.value.trim() || "",
            name,
            plan: document.querySelector(".plan-pill-option.active")?.dataset.plan || "Strength Pro",
          })
        );

        showToast(`Welcome to Iron Pulse, ${name}! Redirecting to your dashboard…`, "fa-solid fa-check");
        setTimeout(() => (window.location.href = "Member.html"), 1600);
      });
    }

    // Show just-joined banner on login page
    const params = new URLSearchParams(window.location.search);
    const banner = document.getElementById("justJoinedBanner");
    if (params.get("justJoined") === "1" && banner) {
      banner.classList.add("show");
      setTimeout(() => banner.classList.remove("show"), 6000);
    }
  }

  /* -------------------------------------------------------
     SOCIAL LOGIN / SIGNUP
  ------------------------------------------------------- */
  window.socialLogin = function (provider) {
    localStorage.setItem("ironPulseMember", JSON.stringify({ email: "social@" + provider.toLowerCase() + ".fit", name: provider + " Member" }));
    showToast(`Signed in with ${provider}! Redirecting…`, "fa-solid fa-share-nodes");
    setTimeout(() => (window.location.href = "Member.html"), 1200);
  };

  window.socialSignup = function (provider) {
    showToast(`Signing up with ${provider}…`, "fa-solid fa-share-nodes");
    setTimeout(() => (window.location.href = "Login.html?justJoined=1"), 1200);
  };

  /* -------------------------------------------------------
     AUTO YEAR
  ------------------------------------------------------- */
  function initAutoYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* -------------------------------------------------------
     TOAST NOTIFICATIONS
  ------------------------------------------------------- */
  let toastContainer = null;

  function initToast() {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  window.showToast = function (message, iconClass) {
    if (!toastContainer) initToast();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="${iconClass || "fa-solid fa-circle-info"}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, 3400);
  };

  /* -------------------------------------------------------
     MEMBER DASHBOARD (Member.html)
  ------------------------------------------------------- */
  function initMemberDashboard() {
    const memberName = document.getElementById("memberName");
    const memberPlan = document.getElementById("memberPlan");
    if (!memberName && !memberPlan) return;

    // Load member from localStorage (default to a demo athlete)
    let member = null;
    try {
      member = JSON.parse(localStorage.getItem("ironPulseMember") || "null");
    } catch (e) {
      member = null;
    }

    if (!member) {
      member = { email: "demo@ironpulse.fit", name: "Demo Athlete", plan: "Strength Pro" };
      localStorage.setItem("ironPulseMember", JSON.stringify(member));
    }

    if (memberName) {
      const firstName = String(member.name || "Champion").split(" ")[0];
      memberName.textContent = firstName.toUpperCase();
    }
    if (memberPlan) {
      memberPlan.textContent = member.plan || "Strength Pro";
    }

    // Animate progress bars when they come into view
    const fills = document.querySelectorAll(".progress-fill[data-width]");
    if (fills.length && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.width = entry.target.dataset.width + "%";
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      fills.forEach((f) => obs.observe(f));
    } else {
      fills.forEach((f) => (f.style.width = f.dataset.width + "%"));
    }
  }

  window.logoutMember = function () {
    localStorage.removeItem("ironPulseMember");
    showToast("You've been signed out. See you soon!", "fa-solid fa-arrow-right-from-bracket");
    setTimeout(() => (window.location.href = "Logout.html"), 1000);
  };

  /* -------------------------------------------------------
     HOME GALLERY CARDS → link to full gallery page
  ------------------------------------------------------- */
  function initHomeGalleryCards() {
    const cards = document.querySelectorAll(".gallery-card");
    if (!cards.length) return;

    const goToGallery = () => {
      window.location.href = "Gallary.html";
    };

    cards.forEach((card) => {
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", goToGallery);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToGallery();
        }
      });
    });
  }
})();

