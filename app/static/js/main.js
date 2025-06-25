/* ------------------------------------------------------------------ *
 * 1. Tier flip-cards + FAQ toggle + Sponsorship handler
 * ------------------------------------------------------------------ */
(() => {
  'use strict';

  /* Sponsor buttons — replace alert() with real checkout flow */
  document
    .querySelectorAll('[data-tier-cta]')
    .forEach((btn) => {
      const amount = Number(btn.dataset.amount || 0);

      btn.addEventListener('click', () => {
        // TODO: inject Stripe, PayPal, custom form…
        /* eslint-disable-next-line no-alert */
        alert(`Opening sponsorship form for $${amount.toLocaleString()}`);
      });
    });

  /* FAQ accordion */
  const faqBtn  = document.getElementById('tiers-faq-toggle');
  const faqBody = document.getElementById('tiers-faq-body');

  if (faqBtn && faqBody) {
    faqBtn.addEventListener('click', () => {
      const expanded = faqBtn.getAttribute('aria-expanded') === 'true';
      faqBtn.setAttribute('aria-expanded', String(!expanded));
      faqBody.hidden = expanded;
      faqBtn.firstElementChild.textContent = expanded ? '▶' : '▼';
    });
  }
})();

/* ------------------------------------------------------------------ *
 * 2. Funding-goal HUD (arc + bar + animated counter)
 * ------------------------------------------------------------------ */
(() => {
  'use strict';

  const hud = document.getElementById('goal-hud');
  if (!hud) return;

  const total      = Number(hud.dataset.goal || 0);
  let   raised     = Number(hud.dataset.raised || 0);
  const fullDash   = 565.48;                        // circumference, r = 90

  const arc   = hud.querySelector('[data-goal-arc]');
  const bar   = hud.querySelector('[data-goal-bar]');
  const label = hud.querySelector('[data-goal-label]');

  /* ===== helper: animate number ===== */
  const animateNumber = (from, to, ms = 1_400) => {
    const start = performance.now();

    const tick  = (now) => {
      const p   = Math.min((now - start) / ms, 1);
      const val = Math.floor(from + (to - from) * p);

      label.textContent =
        `$${val.toLocaleString()} / $${total.toLocaleString()}`;

      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ===== one-shot reveal when HUD enters viewport ===== */
  const playHud = () => {
    arc.style.strokeDashoffset = fullDash * (1 - raised / total);
    bar.value = raised;
    animateNumber(0, raised);
  };

  new IntersectionObserver(
    ([entry], obs) => {
      if (entry.isIntersecting) { playHud(); obs.disconnect(); }
    },
    { threshold: 0.35 }
  ).observe(hud);

  /* ===== optional live Socket.IO updates ===== */
  if (typeof window.io === 'function') {
    window.io().on('donation_update', ({ total: newTotal }) => {
      if (newTotal <= raised) return;

      animateNumber(raised, newTotal);
      raised = newTotal;
      bar.value = newTotal;
      arc.style.strokeDashoffset =
        fullDash * (1 - newTotal / total);
    });
  }
})();

