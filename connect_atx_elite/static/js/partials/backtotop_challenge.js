(() => {
  // Testimonial popover toggle
  const popBtn = document.getElementById('testimonial-pop-btn');
  const popover = document.getElementById('testimonial-pop');

  popBtn.addEventListener('mouseenter', () => {
    popover.classList.remove('hidden');
    popover.setAttribute('aria-hidden', 'false');
    popBtn.setAttribute('aria-expanded', 'true');
  });
  popBtn.addEventListener('mouseleave', () => {
    popover.classList.add('hidden');
    popover.setAttribute('aria-hidden', 'true');
    popBtn.setAttribute('aria-expanded', 'false');
  });

  // Back to Top button logic
  const backToTopBtn = document.getElementById('back-to-top');
  const scrollThreshold = 300; // px scrolled before showing

  const toggleBackToTop = () => {
    if (window.scrollY > scrollThreshold) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleBackToTop);
  // Initial check
  toggleBackToTop();
})();
