(() => {
  const totalGoal = 10000;
  let current = 7900; // initial value

  // helper to animate an element's numeric value
  function animateValue(el, start, end, duration) {
    const range = end - start;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      el.textContent = `$${Math.floor(start + progress * range).toLocaleString()} / $${totalGoal.toLocaleString()}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // IntersectionObserver to trigger gauge + progress animation
  const section = document.getElementById('goal');
  const gaugeArc = document.getElementById('gauge-arc');
  const bar = document.getElementById('goal-bar');
  const label = document.getElementById('goal-amount');

  const obs = new IntersectionObserver(
    (entries) => {
      for (let e of entries) {
        if (e.isIntersecting) {
          // animate radial gauge
          const dashOffset = 565.48 * (1 - current / totalGoal);
          gaugeArc.style.transition = 'stroke-dashoffset 1.5s ease-out';
          gaugeArc.style.strokeDashoffset = dashOffset;

          // animate progress bar
          bar.max = totalGoal;
          bar.value = 0;
          bar.style.transition = 'value 1.5s ease-out';
          setTimeout(() => (bar.value = current), 50);

          // animate label
          animateValue(label, 0, current, 1500);

          // milestone confetti
          [0.5, 0.75, 1].forEach((ratio) => {
            if (current / totalGoal >= ratio) {
              import(
                'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/+esm'
              ).then(({ default: confetti }) => {
                confetti({
                  particleCount: 50,
                  spread: 40,
                  origin: { y: 0.6 },
                  colors: ['amber-400', '#4ade80', '#0a0a0a'],
                });
              });
            }
          });

          obs.disconnect();
        }
      }
    },
    { threshold: 0.4 }
  );
  obs.observe(section);

  // Socket.IO live updates
  if (window.io) {
    const io = window.io();
    io.on('donation_update', ({ total }) => {
      current = total;
      bar.value = total;
      label.textContent = `$${total.toLocaleString()} / $${totalGoal.toLocaleString()}`;
      // update gauge
      gaugeArc.style.strokeDashoffset = 565.48 * (1 - total / totalGoal);
    });
  }

  // scrolling donor ticker
  const ticker = document.getElementById('donor-ticker');
  let offset = 0;
  setInterval(() => {
    offset = (offset + 1) % ticker.scrollWidth;
    ticker.scrollLeft = offset;
  }, 50);
})();
