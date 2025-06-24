document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('newsletter-popup');
  const closeBtn = document.getElementById('newsletter-close');
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const errorMsg = document.getElementById('email-error');

  // Show popup after 3 seconds
  setTimeout(() => {
    popup.classList.add('visible');
    popup.focus();
  }, 3000);

  // Close popup function
  function closePopup() {
    popup.classList.remove('visible');
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
    emailInput.value = '';
  }

  // Close on close button click
  closeBtn.addEventListener('click', closePopup);

  // Close on click outside modal content
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';

    if (!emailInput.validity.valid) {
      errorMsg.textContent = 'Please enter a valid email address.';
      errorMsg.classList.remove('hidden');
      emailInput.focus();
      return;
    }

    // TODO: Replace with actual subscription logic (API call, etc.)
    alert(`Thanks for subscribing, ${emailInput.value}!`);
    closePopup();
  });
});
