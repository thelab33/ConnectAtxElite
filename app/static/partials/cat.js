// static/js/cta.js

// ---- Countdown Timer (Set your deadline below) ----
const deadline = new Date('2024-08-01T23:59:59'); // update as needed!
function updateCountdown() {
  const now = new Date();
  let diff = deadline - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / 864e5),
    hrs = Math.floor(diff / 36e5) % 24,
    mins = Math.floor(diff / 6e4) % 60;
  document.getElementById('cd-days').textContent = days
    .toString()
    .padStart(2, '0');
  document.getElementById('cd-hours').textContent = hrs
    .toString()
    .padStart(2, '0');
  document.getElementById('cd-mins').textContent = mins
    .toString()
    .padStart(2, '0');
}
setInterval(updateCountdown, 30 * 1000);
updateCountdown();

// ---- Supporters Micro-Ticker (random, demo only) ----
let supporters = Math.floor(30 + Math.random() * 20);
const elSupporters = document.getElementById('supportersCount');
if (elSupporters) {
  elSupporters.textContent = supporters;
  setInterval(
    () => {
      supporters++;
      elSupporters.textContent = supporters;
    },
    Math.floor(13000 + Math.random() * 17000)
  ); // simulate new supporter every ~15s
}

// ---- Progress Tooltip always syncs with bar ----
const pb = document.getElementById('progressBar');
const tooltip = document.getElementById('progressTooltip');
if (pb && tooltip) {
  pb.addEventListener('mouseenter', () => (tooltip.style.opacity = 1));
  pb.addEventListener('mouseleave', () => (tooltip.style.opacity = 0));
}

// ---- Preset/Custom Amount Logic ----
let selectedAmt = null;
const presetBtns = document.querySelectorAll('.preset-amt');
const customAmt = document.getElementById('customAmt');
presetBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    presetBtns.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    customAmt.value = '';
    selectedAmt = btn.dataset.amt;
  });
});
customAmt &&
  customAmt.addEventListener('focus', () => {
    presetBtns.forEach((b) => b.classList.remove('selected'));
    selectedAmt = null;
  });

// ---- Donate Button (opens dialog) ----
const donateBtn = document.getElementById('donateBtn');
const donateDialog = document.getElementById('donateDialog');
const formAmt = document.getElementById('formAmt');
if (donateBtn && donateDialog) {
  donateBtn.addEventListener('click', () => {
    donateDialog.showModal();
    // If preset/custom is set, prefill
    formAmt.value = selectedAmt || customAmt.value || '';
    formAmt.focus();
  });
}

// ---- Confetti when goal is hit ----
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  const W = (canvas.width = canvas.offsetWidth),
    H = (canvas.height = canvas.offsetHeight);
  const pieces = Array.from({ length: 96 }, () => ({
    x: Math.random() * W,
    y: Math.random() * -H,
    s: Math.random() * 8 + 5,
    a: Math.random() * 2 * Math.PI,
    c: `hsl(${Math.random() * 60 + 35},96%,55%)`,
  }));
  let t = 0,
    frame;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a + t / 24);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.42);
      ctx.restore();
      p.y += p.s * 0.43 + Math.sin(t / 16) * 0.6;
      p.x += Math.sin(p.a + t / 8) * 1.2;
      if (p.y > H + 24) (p.y = Math.random() * -64), (p.x = Math.random() * W);
    });
    t++;
    frame = requestAnimationFrame(draw);
    if (t > 100) {
      cancelAnimationFrame(frame);
      canvas.style.display = 'none';
    }
  }
  draw();
}

// --- Listen for donation form submit: fake success triggers confetti
const donateForm = document.getElementById('donateForm');
if (donateForm) {
  donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    donateDialog.close();
    launchConfetti();
    setTimeout(() => alert('Thank you for your support!'), 1100);
  });
}
