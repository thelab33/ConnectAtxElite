document.addEventListener('DOMContentLoaded', () => {
  const hud = document.getElementById('goal-hud');
  if (!hud) return;

  const goal = +hud.dataset.goal || 1;
  const raised = +hud.dataset.raised || 0;

  hud.querySelector('[data-goal-label]').textContent =
    `$${raised.toLocaleString()} / $${goal.toLocaleString()}`;

  const bar = hud.querySelector('[data-goal-bar]');
  bar.value = raised;

  const pct = Math.min(raised / goal, 1);
  hud.style.setProperty('--pct', pct);
});
