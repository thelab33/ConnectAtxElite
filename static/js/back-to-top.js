(() => {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          btn.classList.toggle('show', window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  btn.addEventListener('click', scrollUp);
  btn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      scrollUp();
    }
  });
})();
