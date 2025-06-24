// hero.js — Hero Section interactive effects

document.addEventListener('DOMContentLoaded', () => {
  // Simple parallax effect on hero background
  const heroBg = document.querySelector('#hero .background-image');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    heroBg.style.transform = `translateY(${offset}px) scale(1.1)`;
  });
});
