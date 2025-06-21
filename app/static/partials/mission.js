// mission.js
(() => {
  const storyBtn = document.getElementById('storyBtn');
  const storyModal = document.getElementById('storyModal');
  const closeStoryModalBtn = document.getElementById('closeStoryModal');
  const storyVideo = document.getElementById('storyVideo');

  // Open modal and manage aria-expanded
  storyBtn.addEventListener('click', () => {
    storyModal.showModal();
    storyBtn.setAttribute('aria-expanded', 'true');
    storyVideo.focus();
  });

  // Close modal handler
  closeStoryModalBtn.addEventListener('click', () => {
    storyModal.close();
    storyBtn.setAttribute('aria-expanded', 'false');
    storyBtn.focus();
    storyVideo.pause();
    storyVideo.currentTime = 0;
  });

  // Close modal on Esc or click outside content
  storyModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      storyModal.close();
      storyBtn.setAttribute('aria-expanded', 'false');
      storyBtn.focus();
      storyVideo.pause();
      storyVideo.currentTime = 0;
    }
  });

  storyModal.addEventListener('click', (e) => {
    if (e.target === storyModal) {
      storyModal.close();
      storyBtn.setAttribute('aria-expanded', 'false');
      storyBtn.focus();
      storyVideo.pause();
      storyVideo.currentTime = 0;
    }
  });

  // Animate counters when visible
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 80);
    const update = () => {
      count += step;
      if (count > target) count = target;
      el.textContent = count;
      if (count < target) {
        requestAnimationFrame(update);
      }
    };
    update();
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 }
  );
  counters.forEach((counter) => observer.observe(counter));
})();
