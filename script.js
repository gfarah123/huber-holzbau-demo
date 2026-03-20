document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const submenuItems = document.querySelectorAll(".nav-item--submenu");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (submenuItems.length) {
    const desktopNav = window.matchMedia("(min-width: 821px)");

    const closeAllSubmenus = () => {
      submenuItems.forEach((item) => {
        item.classList.remove("is-open");
        if (item._closeTimer) {
          window.clearTimeout(item._closeTimer);
          item._closeTimer = null;
        }
      });
    };

    submenuItems.forEach((item) => {
      const openItem = () => {
        if (!desktopNav.matches) {
          return;
        }

        closeAllSubmenus();
        item.classList.add("is-open");
      };

      const scheduleClose = () => {
        if (!desktopNav.matches) {
          return;
        }

        if (item._closeTimer) {
          window.clearTimeout(item._closeTimer);
        }

        item._closeTimer = window.setTimeout(() => {
          item.classList.remove("is-open");
          item._closeTimer = null;
        }, 180);
      };

      const cancelClose = () => {
        if (item._closeTimer) {
          window.clearTimeout(item._closeTimer);
          item._closeTimer = null;
        }
      };

      item.addEventListener("pointerenter", openItem);
      item.addEventListener("pointerleave", scheduleClose);
      item.addEventListener("focusin", openItem);
      item.addEventListener("focusout", () => {
        window.setTimeout(() => {
          if (!item.contains(document.activeElement)) {
            scheduleClose();
          }
        }, 0);
      });
      item.addEventListener("pointermove", cancelClose);
    });

    window.addEventListener("resize", () => {
      if (!desktopNav.matches) {
        closeAllSubmenus();
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      );

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
});
