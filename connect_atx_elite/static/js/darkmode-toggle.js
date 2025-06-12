(() => {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  btn.textContent = localStorage.theme === 'dark' ? '☀️' : '🌙';
  if (localStorage.theme === 'dark') root.classList.add('dark');
  btn.onclick = () => {
    root.classList.toggle('dark');
    localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light';
    btn.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
  };
})();
