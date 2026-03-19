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
        <span class="wood-rail__slat" data-factor="0.18" data-phase="0.0" style="--top: 0%; --height: 18%; --width: 100%; --opacity: 0.56;"></span>
        <span class="wood-rail__slat" data-factor="-0.14" data-phase="0.9" style="--top: 14%; --height: 12%; --width: 74%; --opacity: 0.7;"></span>
        <span class="wood-rail__slat" data-factor="0.24" data-phase="1.8" style="--top: 31%; --height: 19%; --width: 92%; --opacity: 0.64;"></span>
        <span class="wood-rail__slat" data-factor="-0.2" data-phase="2.8" style="--top: 50%; --height: 14%; --width: 68%; --opacity: 0.72;"></span>
        <span class="wood-rail__slat" data-factor="0.22" data-phase="3.6" style="--top: 64%; --height: 21%; --width: 100%; --opacity: 0.66;"></span>
        <span class="wood-rail__slat" data-factor="-0.12" data-phase="4.2" style="--top: 84%; --height: 11%; --width: 80%; --opacity: 0.58;"></span>
      </div>
    `;
    document.body.appendChild(woodRail);

    if (!reduceMotion) {
      const slats = Array.from(woodRail.querySelectorAll('.wood-rail__slat'));
      let ticking = false;

      const updateWoodRail = () => {
        const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = window.scrollY / scrollRange;

        slats.forEach((slat) => {
          const factor = Number.parseFloat(slat.dataset.factor || '0');
          const phase = Number.parseFloat(slat.dataset.phase || '0');
          const y = (progress - 0.5) * 220 * factor;
          const x = Math.sin(progress * 8 + phase) * 3.5;
          const rotate = Math.sin(progress * 6 + phase) * 1.2 * factor;
          const opacity = Math.max(0.46, Math.min(0.9, 0.64 + Math.sin(progress * 7 + phase) * 0.08));
          slat.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
          slat.style.opacity = opacity.toFixed(3);
        });

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
