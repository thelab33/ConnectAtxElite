(() => {
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      button.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.classList.add('hidden');
      } else {
        panel.classList.remove('hidden');
        panel.focus();
      }
      // Animate icon rotation
      const icon = button.querySelector('svg');
      if (icon) {
        icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });

  // FAQ Search filter
  const faqSearch = document.getElementById('faq-search');
  const faqList = document.getElementById('faq-list');
  faqSearch.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const items = faqList.querySelectorAll('li');
    items.forEach((item) => {
      const question = item
        .querySelector('button span')
        .textContent.toLowerCase();
      if (question.includes(val)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
})();
