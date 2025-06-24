window.addEventListener('DOMContentLoaded', () => {
  const raised = document.querySelector('#hero-raised');
  const goal = document.querySelector('#hero-goal');
  if (!raised || !goal) return;
  const hud = document.createElement('div');
  hud.id = 'goalHud';
  hud.textContent = `💰 ${parseInt(raised.textContent.replace(/\D/g, '')).toLocaleString()} / ${parseInt(goal.textContent.replace(/\D/g, '')).toLocaleString()} goal`;
  hud.style.cssText =
    'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#facc15;padding:0.5rem 1rem;font-family:monospace;border-radius:9999px;box-shadow:0 4px 16px rgba(0,0,0,0.5);z-index:50;display:none;align-items:center;gap:0.5rem;pointer-events:none;user-select:none;';
  document.body.appendChild(hud);
  window.addEventListener(
    'scroll',
    () => {
      hud.style.display = window.scrollY > 300 ? 'flex' : 'none';
    },
    { passive: true }
  );
});
