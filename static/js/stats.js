document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('stats');
  const counters = section.querySelectorAll('.counter');
  function animateCounters() {
    counters.forEach((el) => {
      const target = +el.dataset.target;
      let count = 0;
      const increment = Math.max(1, Math.ceil(target / 64));
      function step() {
        count += increment;
        if (count >= target) {
          el.textContent = target;
        } else {
          el.textContent = count;
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  }
  new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    },
    { threshold: 0.3 }
  ).observe(section);
});
