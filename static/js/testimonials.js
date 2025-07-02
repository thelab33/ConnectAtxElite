import confetti from 'https://cdn.skypack.dev/canvas-confetti@1.6.0';

const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const testimonials = [
  {
    q: 'Winning felt amazing — but it’s being part of a team that believes in you that means the most.',
    a: 'Connect ATX Elite Player, Class of 2030',
  },
  {
    q: 'Being part of Connect ATX Elite helps me stay focused in school and basketball. I want to make my family proud.',
    a: 'Honor-Roll Scholar-Athlete',
  },
  {
    q: 'I’ve seen real changes in my son — he’s more disciplined, focused, and confident in class and in life.',
    a: 'Team Parent',
  },
];

let idx = 0,
  autoTimer;
const quoteEl = document.getElementById('quoteText');
const authorEl = document.getElementById('quoteAuthor');
const dots = Array.from(document.querySelectorAll('.carousel-dot'));
const emoji = document.getElementById('confettiEmoji');
const box = document.getElementById('quoteBox');

function show(i, animate = true) {
  idx = (i + testimonials.length) % testimonials.length;
  quoteEl.textContent = `“${testimonials[idx].q}”`;
  authorEl.textContent = `— ${testimonials[idx].a}`;
  dots.forEach((d, j) => d.classList.toggle('active', j === idx));
  if (animate && !prefersReduced) {
    box.style.opacity = 0;
    setTimeout(() => (box.style.opacity = 1), 50);
  }
}

dots.forEach((d) =>
  d.addEventListener('click', () => {
    clearInterval(autoTimer);
    show(+d.dataset.idx);
    startAuto();
  })
);

box.addEventListener('keydown', (e) => {
  if (['ArrowRight', 'ArrowDown'].includes(e.key)) show(idx + 1);
  if (['ArrowLeft', 'ArrowUp'].includes(e.key)) show(idx - 1);
});

let startX = null;
box.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), {
  passive: true,
});
box.addEventListener(
  'touchend',
  (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) show(delta < 0 ? idx + 1 : idx - 1);
    startX = null;
  },
  { passive: true }
);

document.getElementById('copyQuoteBtn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(
    `${testimonials[idx].q} — ${testimonials[idx].a}`
  );
  if (prefersReduced) return;
  emoji.style.opacity = 1;
  confetti({
    particleCount: 140,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#facc15', '#fde68a', '#0a0a0a'],
    disableForReducedMotion: true,
  });
  setTimeout(() => (emoji.style.opacity = 0), 1200);
});

function startAuto() {
  if (prefersReduced) return;
  autoTimer = setInterval(() => show(idx + 1, false), 8000);
}

box.addEventListener('mouseenter', () => clearInterval(autoTimer));
box.addEventListener('mouseleave', startAuto);
box.addEventListener('focusin', () => clearInterval(autoTimer));
box.addEventListener('focusout', startAuto);

show(0, false);
startAuto();
