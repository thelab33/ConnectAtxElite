(() => {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.newsletter_email.value;
    alert(`Thanks for subscribing: ${email}`);
    form.reset();
  });

  (() => {
    const target = new Date('2025-07-01T10:00:00Z');
    const el = document.getElementById('countdown-timer');

    function update() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        el.textContent = 'Tournament is live!';
        return;
      }
      const d = Math.floor(diff / 86400000),
        h = Math.floor((diff % 86400000) / 3600000),
        m = Math.floor((diff % 3600000) / 60000),
        s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }

    update();
    setInterval(update, 1000);
  })();
})();
