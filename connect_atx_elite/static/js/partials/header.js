// static/js/partials/header.js — Advanced header behaviors
(() => {
  // Feature 1: Shadow on scroll, hide on scroll down, show on scroll up
  let lastScroll = window.scrollY, ticking, header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 24;
        header.classList.toggle('scrolled', scrolled);
        // Hide on scroll down, show on scroll up
        if (window.scrollY > 80) {
          if (window.scrollY > lastScroll) {
            header.classList.add('hide');
          } else {
            header.classList.remove('hide');
          }
        }
        lastScroll = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Feature 2: Animated mobile menu open/close
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('mobile-menu-close');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileMenu.classList.remove('hidden');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
    });
    menuClose?.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.classList.add('hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
    // Close menu when clicking outside or pressing Esc
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') mobileMenu.classList.remove('open');
    });
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) mobileMenu.classList.remove('open');
    });
  }
})();
