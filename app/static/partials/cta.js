// cta.js — Call To Action section scripts

document.addEventListener('DOMContentLoaded', () => {
  const confetti-canvas = document.getElementById('confetti-canvas');
  if (!confetti-canvas) return;

  // Simple confetti animation trigger on CTA button click
  const ctaBtn = document.querySelector('#cta button');
  if (!ctaBtn) return;

  ctaBtn.addEventListener('click', () => {
    confetti-canvas.style.display = 'block';

    // Simulate confetti duration with timeout (replace with real lib for production)
    setTimeout(() => {
      confetti-canvas.style.display = 'none';
    }, 4000);
  });
});
