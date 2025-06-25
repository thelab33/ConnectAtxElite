// app/static/js/partials/hero.js

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct = (window.scrollY / docHeight) * 100;

  const bar = document.getElementById('hero-meter-bar');
  const cta = document.getElementById('floating-cta');

  if (bar) bar.style.width = scrollPct + '%';
  if (cta) {
    cta.classList.toggle(
      'opacity-100',
      window.scrollY > window.innerHeight * 0.3
    );
    cta.classList.toggle(
      'pointer-events-auto',
      window.scrollY > window.innerHeight * 0.3
    );
  }
});

const scrollHint = document.getElementById('scroll-hint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const tiers = document.getElementById('tiers');
    if (tiers) tiers.scrollIntoView({ behavior: 'smooth' });
  });
}

(function countdownTimer() {
  const el = document.getElementById('funds-countdown');
  const deadline = new Date("{{ config.get('DEADLINE','2024-12-31T23:59:59Z') }}");

  const update = () => {
    const diff = deadline - new Date();
    if (!el) return;

    if (diff < 0) return (el.textContent = '— Deadline passed');

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);

    el.textContent = `— ${d}d ${h}h ${m}m left`;
  };

  update();
  setInterval(update, 60000);
})();
