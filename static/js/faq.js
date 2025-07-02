(() => {
  document.querySelectorAll('.faq-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = btn.nextElementSibling;
      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  });

  const searchInput = document.getElementById('faq-search');
  const clearBtn = document.querySelector('.clear-btn');
  const faqItems = document.querySelectorAll('.faq-item');

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    faqItems.forEach((item) => {
      const q = item.querySelector('.faq-toggle span').textContent.toLowerCase();
      item.style.display = q.includes(term) ? '' : 'none';
    });
    clearBtn.style.display = term ? 'inline' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
})();
