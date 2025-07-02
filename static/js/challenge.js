(() => {
  const btn = document.querySelector('.testimonial button');
  const pop = document.getElementById('testimonial-pop');
  if (btn && pop) {
    btn.addEventListener('mouseenter', () => (pop.style.display = 'block'));
    btn.addEventListener('mouseleave', () => (pop.style.display = 'none'));
    btn.addEventListener('focus', () => (pop.style.display = 'block'));
    btn.addEventListener('blur', () => (pop.style.display = 'none'));
    document.addEventListener('click', (e) => {
      if (!pop.contains(e.target) && !btn.contains(e.target)) {
        pop.style.display = 'none';
      }
    });
  }
})();
