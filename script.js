document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const yearTarget = document.querySelector('[data-year]');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  if (window.innerWidth > 1080) {
    const woodRail = document.createElement('div');
    woodRail.className = 'wood-rail';
    woodRail.setAttribute('aria-hidden', 'true');
    woodRail.innerHTML = `
      <div class="wood-rail__track">
        <span class="wood-rail__slat" style="--top: 0%; --height: 18%; --width: 100%; --factor: 0.03; --opacity: 0.6;"></span>
        <span class="wood-rail__slat" style="--top: 14%; --height: 12%; --width: 74%; --factor: -0.02; --opacity: 0.72;"></span>
        <span class="wood-rail__slat" style="--top: 31%; --height: 19%; --width: 92%; --factor: 0.05; --opacity: 0.66;"></span>
        <span class="wood-rail__slat" style="--top: 50%; --height: 14%; --width: 68%; --factor: -0.035; --opacity: 0.74;"></span>
        <span class="wood-rail__slat" style="--top: 64%; --height: 21%; --width: 100%; --factor: 0.04; --opacity: 0.68;"></span>
        <span class="wood-rail__slat" style="--top: 84%; --height: 11%; --width: 80%; --factor: -0.025; --opacity: 0.62;"></span>
      </div>
    `;
    document.body.appendChild(woodRail);

    if (!reduceMotion) {
      let ticking = false;

      const updateWoodRail = () => {
        const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = window.scrollY / scrollRange;
        woodRail.style.setProperty('--wood-progress', `${(progress - 0.5) * 120}px`);
        ticking = false;
      };

      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            window.requestAnimationFrame(updateWoodRail);
            ticking = true;
          }
        },
        { passive: true }
      );

      updateWoodRail();
    }
  }
});
