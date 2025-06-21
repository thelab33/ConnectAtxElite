// about.js — Animations & Interactions for About Section

document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  // Animate stat cards on scroll into view using IntersectionObserver
  const statCards = aboutSection.querySelectorAll('.stat-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  statCards.forEach((card) => observer.observe(card));
});
