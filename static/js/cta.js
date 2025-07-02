(() => {
  const showToast = (msg) => {
    const toast = document.getElementById('toast-cta');
    if (!toast) return;
    toast.textContent = msg || 'Copied!';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 1650);
  };

  window.addEventListener('load', () => {
    const bar = document.querySelector('.progress-bar');
    if (bar) {
      requestAnimationFrame(() => {
        bar.style.width = '65%';
      });
    }
  });

  // Countdown timer
  (() => {
    const deadline = new Date('2024-12-31T23:59:59Z'); // Update as needed!
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');

    function update() {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        dEl.textContent = '0';
        hEl.textContent = '0';
        mEl.textContent = '0';
        return;
      }
      dEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
      hEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
      mEl.textContent = Math.floor((diff / (1000 * 60)) % 60);
    }
    update();
    setInterval(update, 60000);
  })();

  // Donate button confetti + toast
  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) {
    donateBtn.addEventListener('click', () => {
      import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/+esm').then(
        ({ default: confetti }) => {
          confetti({ particleCount: 100, spread: 70 });
        }
      );
      showToast('Thank you for supporting our mission!');
      // You can also trigger your donation modal here if desired.
    });
  }

  // Sponsor marquee pause on hover
  const marquee = document.querySelector('.sponsor-marquee span');
  if (marquee) {
    marquee.addEventListener('mouseover', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }
})();
