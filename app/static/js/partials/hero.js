window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct = (window.scrollY / docHeight) * 100;
  document.getElementById('hero-meter-bar').style.width = scrollPct + '%';

  document.getElementById('floating-cta').classList.toggle(
    'opacity-100',
    window.scrollY > window.innerHeight * 0.3
  );
  document.getElementById('floating-cta').classList.toggle(
    'pointer-events-auto',
    window.scrollY > window.innerHeight * 0.3
  );
});

document.getElementById('scroll-hint').addEventListener('click', () => {
  document.getElementById('tiers').scrollIntoView({ behavior: 'smooth' });
});

// Countdown Timer
(function () {
  const deadline = new Date("{{ config.get('DEADLINE','2024-12-31T23:59:59Z') }}");
  const el = document.getElementById('funds-countdown');
  const updateCountdown = () => {
    const diff = deadline - new Date();
    if (diff < 0) {
      el.textContent = '— Deadline passed';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    el.textContent = `— ${days}d ${hours}h ${minutes}m left`;
  };
  setInterval(updateCountdown, 60000);
  updateCountdown();
})();

// Initialize AOS if available
if (window.AOS) AOS.init({ once: true, duration: 700 });

