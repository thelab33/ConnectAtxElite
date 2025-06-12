(() => {
  const testimonials = [
    {
      quote:
        "Connect ATX Elite transformed my son's confidence and skills beyond the court.",
      author: "— Maria J.",
    },
    {
      quote:
        "A community that builds leaders, not just athletes. Truly inspiring!",
      author: "— David P.",
    },
    {
      quote:
        "The dedication here is unmatched. Highly recommend sponsoring this team.",
      author: "— Sarah K.",
    },
  ];

  let currentIdx = 0;
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const confettiEmoji = document.getElementById("confettiEmoji");
  const copyBtn = document.getElementById("copyQuoteBtn");
  const dots = document.querySelectorAll(".carousel-dot");

  // Show testimonial by index
  function showTestimonial(idx) {
    if (idx < 0 || idx >= testimonials.length) return;
    currentIdx = idx;
    quoteText.textContent = testimonials[idx].quote;
    quoteAuthor.textContent = testimonials[idx].author;

    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-amber-400", i === idx);
      dot.classList.toggle("scale-110", i === idx);
      dot.classList.toggle("bg-zinc-700", i !== idx);
      dot.setAttribute("aria-selected", i === idx ? "true" : "false");
      dot.tabIndex = i === idx ? 0 : -1;
    });

    // Confetti sparkle effect
    confettiEmoji.style.opacity = "1";
    setTimeout(() => {
      confettiEmoji.style.opacity = "0";
    }, 1200);
  }

  // Initialize first testimonial
  showTestimonial(0);

  // Dot navigation click
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.idx, 10);
      showTestimonial(idx);
      // Move focus for accessibility
      dot.focus();
    });
  });

  // Copy quote to clipboard
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(testimonials[currentIdx].quote);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy Quote"), 1500);
    } catch {
      copyBtn.textContent = "Failed to copy";
      setTimeout(() => (copyBtn.textContent = "Copy Quote"), 1500);
    }
  });
})();
