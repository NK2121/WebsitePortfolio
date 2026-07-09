document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const siteNav = document.querySelector('.site-nav');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const magneticItems = Array.from(document.querySelectorAll('.magnetic'));
const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));

const setYear = () => {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
};

const setNavState = (isOpen) => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

const initNav = () => {
  if (!siteNav || !navToggle || !navMenu) {
    return;
  }

  navToggle.addEventListener('click', () => {
    const isOpen = !siteNav.classList.contains('is-open');
    setNavState(isOpen);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavState(false));
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target)) {
      setNavState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavState(false);
    }
  });
};

const initReveal = () => {
  if (prefersReducedMotion.matches || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
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
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const initMagneticButtons = () => {
  if (prefersReducedMotion.matches || magneticItems.length === 0) {
    return;
  }

  magneticItems.forEach((item) => {
    const reset = () => {
      item.style.transform = 'translate3d(0, 0, 0)';
    };

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      item.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    item.addEventListener('pointerleave', reset);
    item.addEventListener('blur', reset);
  });
};

const initParallax = () => {
  if (prefersReducedMotion.matches || parallaxItems.length === 0) {
    return;
  }

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item, index) => {
      const depth = Number(item.getAttribute('data-parallax-depth')) || 0.02 + index * 0.01;
      const offset = Math.min(scrollY * depth, 42);
      item.style.setProperty('--parallax-y', `${offset}px`);
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
};

setYear();
initNav();
initReveal();
initMagneticButtons();
initParallax();
