// sponsor_wall.js — Sponsor logos marquee and interaction

document.addEventListener('DOMContentLoaded', () => {
  const marquee = document.querySelector('.vendor-marquee ul');
  if (!marquee) return;

  // Pause marquee on hover is handled via CSS (animation-play-state)

  // Optional: Add keyboard focus support for accessibility
  marquee.querySelectorAll('li').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('focus', () => {
      marquee.style.animationPlayState = 'paused';
    });
    item.addEventListener('blur', () => {
      marquee.style.animationPlayState = 'running';
    });
  });
});
