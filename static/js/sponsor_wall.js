document.addEventListener('DOMContentLoaded', () => {
  const marquees = document.querySelectorAll('.vendor-marquee ul');
  marquees.forEach((marquee) => {
    const totalWidth = marquee.scrollWidth;
    const viewport = document.documentElement.clientWidth;
    marquee.style.animationDuration =
      Math.max(20, (totalWidth / viewport) * 30) + 's';
  });

  document.getElementById('sponsor-cta').addEventListener('click', () => {
    import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/+esm').then(
      ({ default: confetti }) => {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#facc15', '#4ade80'],
        });
      }
    );
    document.querySelector('#donateModal')?.classList.add('open');
  });
});
