document.addEventListener('DOMContentLoaded', () => {
  const storyBtn = document.getElementById('storyBtn');
  const storyModal = document.getElementById('storyModal');
  const counters = document.querySelectorAll('.count[data-target]');
  const quotes = [
    {
      text: '“Without gym access, my son missed critical development time.”',
      meta: 'Team Parent',
      title: 'Class of 2030',
    },
    {
      text: '“Our kids learned teamwork and discipline—life lessons beyond the court.”',
      meta: 'Coach Smith',
      title: 'Head Coach',
    },
    {
      text: '“I gained confidence and leadership from this program.”',
      meta: 'Player A',
      title: 'Player Spotlight',
    },
  ];
  let idx = 0;

  function animateCount(el, target) {
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 80));
    const timer = setInterval(() => {
      count += step;
      el.textContent = count >= target ? target : count;
      if (count >= target) clearInterval(timer);
    }, 20);
  }

  new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        counters.forEach((el) => animateCount(el, +el.dataset.target));
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  ).observe(document.getElementById('mission'));

  storyBtn.addEventListener('click', () => {
    storyModal.showModal();
    storyBtn.setAttribute('aria-expanded', 'true');
  });

  storyModal.addEventListener('close', () => {
    storyBtn.setAttribute('aria-expanded', 'false');
  });

  document.getElementById('prevStory').addEventListener('click', () => {
    idx = (idx - 1 + quotes.length) % quotes.length;
    updateQuote();
  });
  document.getElementById('nextStory').addEventListener('click', () => {
    idx = (idx + 1) % quotes.length;
    updateQuote();
  });

  function updateQuote() {
    document.getElementById('story-quote').textContent = quotes[idx].text;
    document.querySelector('.story-meta').textContent = quotes[idx].meta;
    document.querySelector('.story-title').textContent = quotes[idx].title;
  }

  window.shareMission = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Connect ATX Elite Mission',
          text: 'Support Connect ATX Elite: Empower youth through basketball and academics!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert('Sharing not supported on this browser.');
    }
  };
});
