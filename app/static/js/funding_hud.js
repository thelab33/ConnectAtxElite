(() => {
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const tiers = document.getElementById('tiers');
      if (tiers) tiers.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const floatingCTA = document.getElementById('floating-cta');
  const heroBar = document.getElementById('hero-meter-bar');

  window.addEventListener('scroll', () => {
    const pct =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    if (heroBar) heroBar.style.width = pct + '%';

    if (floatingCTA) {
      const show = window.scrollY > window.innerHeight * 0.3;
      floatingCTA.classList.toggle('opacity-100', show);
      floatingCTA.classList.toggle('pointer-events-auto', show);
    }
  });

  // Countdown logic
  const el = document.getElementById('funds-countdown');
  const deadline = el?.dataset?.deadline
    ? new Date(el.dataset.deadline)
    : null;

  if (el && deadline) {
    const update = () => {
      const diff = deadline - new Date();
      if (diff < 0) return (el.textContent = '— Deadline passed');

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);

      el.textContent = `— ${d}d ${h}h ${m}m left`;
    };

    update();
    setInterval(update, 60000);
  }
})();
