// cta.js — Call To Action section scripts

document.addEventListener('DOMContentLoaded', () => {
  const confettiCanvas = document.getElementById('confettiCanvas');
  if (!confettiCanvas) return;

  // Simple confetti animation trigger on CTA button click
  const ctaBtn = document.querySelector('#cta button');
  if (!ctaBtn) return;

  ctaBtn.addEventListener('click', () => {
    confettiCanvas.style.display = 'block';

    // Simulate confetti duration with timeout (replace with real lib for production)
    setTimeout(() => {
      confettiCanvas.style.display = 'none';
    }, 4000);
  });
});
