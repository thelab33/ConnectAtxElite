(() => {
  const modal = document.getElementById('donation-modal');
  const closeBtn = document.getElementById('donation-modal-close');
  const form = document.getElementById('donation-form');

  function toggleDonationModal(show = true) {
    if (!modal) return;
    modal.classList.toggle('open', show);
    if (show) {
      setTimeout(() => document.getElementById('donor-name').focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleDonationModal(false));
  }

  document.addEventListener('keydown', (e) => {
    if (modal?.classList.contains('open') && e.key === 'Escape') {
      toggleDonationModal(false);
    }
  });

  modal?.addEventListener('mousedown', (e) => {
    if (e.target === modal) toggleDonationModal(false);
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        amount: parseInt(form.amount.value, 10),
      };
      alert(`Thank you, ${data.name}! Redirecting to secure payment...`);
      toggleDonationModal(false);
    });
  }

  window.toggleDonationModal = toggleDonationModal;
})();
