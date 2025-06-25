(() => {
  'use strict';

  // Sponsor buttons
  document.querySelectorAll('[data-tier-cta]').forEach((btn) => {
    const amount = Number(btn.dataset.amount || 0);
    btn.addEventListener('click', () => {
      alert(`Opening sponsorship form for $${amount.toLocaleString()}`);
    });
  });

  // FAQ toggle
  const faqBtn = document.getElementById('tiers-faq-toggle');
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
