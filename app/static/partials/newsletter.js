// newsletter.js — Newsletter modal popup and subscription handling

document.addEventListener('DOMContentLoaded', () => {
  const newsletterModal = document.getElementById('newsletterModal');
  const openBtn = document.querySelector('#openNewsletter');
  const closeBtn = newsletterModal?.querySelector('.close-btn');
  const form = newsletterModal?.querySelector('form');

  if (!newsletterModal || !openBtn || !closeBtn || !form) return;

  // Show modal on button click
  openBtn.addEventListener('click', () => {
    newsletterModal.showModal();
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    newsletterModal.close();
  });

  // Basic form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      alert('Please enter a valid email.');
      return;
    }

    // TODO: Implement real subscription API call here
    alert(`Thanks for subscribing with ${email}!`);

    newsletterModal.close();
    form.reset();
  });
});
