// app/static/js/partials/about_section.js
function animateCount(el, end, dur = 1100) {
  let start = 0, st = null;
  function step(ts) {
    if (!st) st = ts;
    const prog = Math.min((ts - st) / dur, 1),
      val = Math.floor(start + prog * (end - start));
    el.textContent = val;
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = end;
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.stat-value[data-target]').forEach((el) => {
    let played = false;
    const target = +el.dataset.target;
    new IntersectionObserver((ents, obs) => {
      ents.forEach((e) => {
        if (e.isIntersecting && !played) {
          animateCount(el, target);
          if (target >= 10) {
            import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/+esm').then(({ default: c }) =>
              c({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#facc15']
              })
            );
          }
          played = true;
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 }).observe(el);
  });
  if (window.AOS) AOS.init({ once: true, duration: 600 });
});
