// 'î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î'
// Connect ATX Elite '∑ Main Runtime Enhancements
// 'î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î''î'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const skip = document.querySelector('.skip-to-content');

  // Fade-in effect
  document.getElementById('bodyRoot')?.classList.add('loaded');

  // Skip-link focus
  skip?.addEventListener('click', () => {
    const main = document.getElementById('main-content');
    main?.setAttribute('tabindex','-1');
    main?.focus();
  });

  // Dark-mode toggle
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') root.classList.add('dark');
  themeToggle.textContent = root.classList.contains('dark') ? ''''Ô∏è' : 'üå'';
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    const newTheme = root.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? ''''Ô∏è' : 'üå'';
  });

  // Scroll progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = \'scaleX(\${h ? (s / h).toFixed(3) : 0})\';
    }, { passive: true });
  }
});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.hash);if(t){t.scrollIntoView({behavior:'smooth'});t.setAttribute('tabindex','-1');t.focus();}}));
new IntersectionObserver((e,o)=>{e.forEach(({target,isIntersecting})=>{if(isIntersecting)target.classList.add('in-view')})},{threshold:.3}).observe(document.querySelectorAll('[data-reveal]'));
(function(){const s=[...document.querySelectorAll('[data-jump]')];window.addEventListener('keydown',e=>{if(/input|textarea/i.test(e.target.tagName))return;let i=s.findIndex(t=>t.offsetTop>window.scrollY+10);i=e.key==='j'?i:i-1;if(i<0)i=0;if(i>=s.length)i=s.length-1;if(e.key==='j'||e.key==='k')s[i]?.scrollIntoView({behavior:'smooth',block:'start'});});})();
document.addEventListener('DOMContentLoaded', () => document.body.classList.add('loaded'));
import 'focus-visible';

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Your animateStats() function here or simple count-up logic
      console.log('Stats section in view ''î animate!');
      statsObserver.unobserve(e.target);
    }
  });
});
const statsSection = document.querySelector('#hero-stats-row');
if (statsSection) statsObserver.observe(statsSection);

window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.transform = 'scaleX(${progress})';
});

const themeToggleBtn = document.getElementById('themeToggle');
if(themeToggleBtn){
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') root.classList.add('dark');
  themeToggleBtn.textContent = root.classList.contains('dark') ? ''''Ô∏è' : 'üå'';

  themeToggleBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? ''''Ô∏è' : 'üå'';
  });
}
