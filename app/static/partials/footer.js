// newsletter stub
function handleNewsletterSignup(e) {
  e.preventDefault();
  const email = e.target.newsletter_email.value;
  alert(`🎉 Thanks! We'll keep you updated at ${email}`);
  e.target.reset();
}

// simple countdown (set your target date)
const target = new Date('2025-07-01T10:00:00Z');
function updateCountdown() {
  const diff = target - new Date();
  if (diff <= 0) return;
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  document.getElementById('countdown-timer').textContent =
    `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();
