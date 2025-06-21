// ─────────────────────────────────────────────
// Connect ATX Elite · Main Runtime Enhancements
// ─────────────────────────────────────────────

import 'focus-visible';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.getElementById('bodyRoot');
  const themeToggle = document.getElementById('themeToggle');
  const skip = document.querySelector('.skip-to-content');
  const progressBar = document.getElementById('progressBar');

  // Fade-in effect
  body?.classList.add('loaded');

  // Skip-to-content link
  skip?.addEventListener('click', () => {
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });

  // Dark-mode toggle
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') root.classList.add('dark');
  updateThemeIcon();

  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    const theme = root.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
  }

  // Scroll progress bar
  window.addEventListener(
    'scroll',
    () => {
      if (progressBar) {
        const s = document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const progress = h ? (s / h).toFixed(3) : 0;
        progressBar.style.transform = `scaleX(${progress})`;
      }
    },
    { passive: true }
  );

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.classList.add('in-view');
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

  // Keyboard jump (j / k)
  const jumpSections = Array.from(document.querySelectorAll('[data-jump]'));
  window.addEventListener('keydown', (e) => {
    if (/^(input|textarea)$/i.test(e.target.tagName)) return;
    let index = jumpSections.findIndex((sec) => sec.offsetTop > window.scrollY + 10);
    if (e.key === 'j') {
      // jump forward
      index = Math.min(index, jumpSections.length - 1);
      jumpSections[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'k') {
      // jump backward
      index = Math.max(0, index - 1);
      jumpSections[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Stats section observer (count-up trigger)
  const statsSection = document.querySelector('#hero-stats-row');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Stats section in view → animate!');
          // animateStats();  // Your custom count-up logic
          observer.unobserve(entry.target);
        }
      });
    });
    statsObserver.observe(statsSection);
  }
});
