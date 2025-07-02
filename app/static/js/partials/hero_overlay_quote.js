const QUOTES = [
  {
    text: "Our boys are more than athletes—they’re scholars, leaders, and champions.",
    author: "Coach Rodriguez",
    title: "Head Coach & Founder",
    avatar: "{{ url_for('static', filename='coach1.jpg') }}",
  },
  {
    text: "We strive to mentor our young men for success on and off the court. Excellence means integrity in all we do.",
    author: "Coach Los",
    title: "Assistant Coach / Leadership Mentor",
    avatar: "{{ url_for('static', filename='coach_los.jpg') }}",
  },
  {
    text: "Winning games is great, but changing lives is our real legacy. Proud to coach this brotherhood.",
    author: "Coach Lay",
    title: "Skills Development Coach",
    avatar: "{{ url_for('static', filename='coach_lay.jpg') }}",
  },
];

let idx = 0,
  timer = null,
  card = document.getElementById("hero-quote-card");
const interval = 6700;

function showQuote(i) {
  idx = (i + QUOTES.length) % QUOTES.length;
  const q = QUOTES[idx];
  document.getElementById("hero-quote-text").innerText = `“${q.text}”`;
  document.getElementById("hero-quote-author").innerText = `— ${q.author}`;
  document.getElementById("hero-quote-title").innerText = q.title;
  const avatar = document.getElementById("hero-quote-avatar");
  avatar.src = q.avatar;
  avatar.alt = `${q.author}, ${q.title}`;
  card.setAttribute("aria-label", `Quote by ${q.author}: ${q.text}`);
}
function showNextQuote() {
  showQuote(idx + 1);
  restartTimer();
}
function showPrevQuote() {
  showQuote(idx - 1);
  restartTimer();
}
function startTimer() {
  timer = setInterval(() => showNextQuote(), interval);
}
function stopTimer() {
  clearInterval(timer);
}
function restartTimer() {
  stopTimer();
  startTimer();
}
card.addEventListener("mouseenter", stopTimer);
card.addEventListener("mouseleave", startTimer);
card.addEventListener("focusin", stopTimer);
card.addEventListener("focusout", startTimer);
card.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") showNextQuote();
  else if (e.key === "ArrowLeft") showPrevQuote();
});
function copyQuote() {
  const q = QUOTES[idx];
  const text = `“${q.text}” — ${q.author}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showToast("Quote copied!");
  } else {
    alert("Copy not supported");
  }
}
function shareQuote() {
  const q = QUOTES[idx];
  const text = `“${q.text}” — ${q.author}`;
  if (navigator.share) {
    navigator.share({ title: "Connect ATX Elite", text });
  } else {
    copyQuote();
  }
}
function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style =
    "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:99999;background:#facc15;color:#0a1f44;font-weight:700;padding:0.75em 1.3em;border-radius:99px;box-shadow:0 2px 14px #0a1f4441;font-size:1.1rem;";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1700);
}

// Initialize first quote & timer
showQuote(0);
startTimer();
