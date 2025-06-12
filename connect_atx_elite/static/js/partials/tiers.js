// tiers.js — Sponsorship tiers interactivity

document.addEventListener('DOMContentLoaded', () => {
  const tierButtons = document.querySelectorAll('.tier-cta');
  if (!tierButtons.length) return;

  tierButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.classList.add('scale-up');
    });
    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('scale-up');
    });
    btn.addEventListener('focus', () => {
      btn.classList.add('scale-up');
    });
    btn.addEventListener('blur', () => {
      btn.classList.remove('scale-up');
    });
  });
});
