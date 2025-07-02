(() => {
  const fab = document.getElementById('live-chat-fab');
  const panel = document.getElementById('live-chat-panel');
  const closeBtn = document.getElementById('live-chat-close');
  const form = document.getElementById('live-chat-form');
  const input = document.getElementById('live-chat-input');
  const messages = document.getElementById('live-chat-messages');

  fab.addEventListener('click', () => {
    panel.classList.add('open');
    setTimeout(() => input.focus(), 180);
  });
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    fab.focus();
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('open');
      fab.focus();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    const userMsg = document.createElement('div');
    userMsg.textContent = 'You: ' + msg;
    userMsg.style.cssText = 'margin-bottom:0.5em;color:#facc15;';
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.textContent =
        "CoachBot: Thanks for reaching out! We'll respond soon.";
      botMsg.style.opacity = 0.76;
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 900);

    input.value = '';
  });

  document.addEventListener('mousedown', (e) => {
    if (
      panel.classList.contains('open') &&
      !panel.contains(e.target) &&
      !fab.contains(e.target)
    ) {
      panel.classList.remove('open');
    }
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = [closeBtn, input];
      const idx = focusable.indexOf(document.activeElement);
      if (e.shiftKey && idx === 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && idx === focusable.length - 1) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  });
})();
