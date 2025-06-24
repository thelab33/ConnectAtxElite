(() => {
  // Donation modal toggle
  window.toggleDonationModal = (show) => {
    const modal = document.getElementById('donation-modal');
    if (!modal) return;
    if (show) {
      modal.classList.remove('hidden');
      modal.querySelector('input, button, select, textarea').focus();
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && menuClose && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('flex', 'opacity-100', 'pointer-events-auto');
      menuBtn.setAttribute('aria-expanded', 'true');
    });

    menuClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    });
  }
})();
