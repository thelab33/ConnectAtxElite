document.addEventListener('DOMContentLoaded', () => {
  const faqToggle = document.getElementById('tiers-faq-toggle');
  const faqBody = document.getElementById('tiers-faq-body');

  faqToggle.addEventListener('click', () => {
    const expanded = faqToggle.getAttribute('aria-expanded') === 'true';
    faqToggle.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      faqBody.hidden = false;
      faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
    } else {
      faqBody.style.maxHeight = '0';
      faqBody.addEventListener(
        'transitionend',
        () => {
          faqBody.hidden = true;
        },
        { once: true }
      );
    }
  });
});
