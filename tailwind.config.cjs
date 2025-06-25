// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/templates/**/*.html',      // Jinja/HTML
    './app/static/**/*.css',          // All global and modular CSS
    './app/static/js/**/*.js',        // JS with tw classes (dropdowns, nav, etc)
    './app/**/*.py',                  // Optional: for class extraction in Python-flask strings
  ],
  safelist: [
    // Allow for dynamic class creation via Jinja/macros
    'font-bold', 'tracking-tight', 'text-primary', 'bg-primary',
    'rounded-full', 'shadow-gold-glow', 'btn', 'glass',
    'bg-amber-400', 'text-amber-400', 'bg-amber-300', 'text-black',
    'focus-visible:ring-4', 'focus-visible:ring-amber-400/70',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#facc15',         // Main gold brand
        'primary-hover': '#e0b511',
        'bg-dark': '#18181b',       // App background
        'bg-header': '#18181b',
        'text-light': '#fffbe7',    // Soft cream text
        'text-muted': 'rgba(255,255,255,0.7)',
        'foreground': '#f3f3f9',
        'secondary': '#23232b',
      },
      boxShadow: {
        'gold-glow': '0 0 36px 0 #facc1580',
        'input': '0 1px 3px 0 #0a1f4420',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 4px 16px rgba(245,197,24,0.8), 0 0 8px rgba(245,197,24,0.5)' },
          '100%': { boxShadow: '0 6px 32px rgba(245,197,24,1), 0 0 24px rgba(245,197,24,0.8)' },
        },
        // Fade-up for scroll animation
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'scroll-ticker': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        glow: 'glow 2.8s ease-in-out infinite alternate',
        'fade-up': 'fade-up 0.9s cubic-bezier(.4,0,.2,1) both',
        'scroll-ticker': 'scroll-ticker 22s linear infinite',
      },
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
        shadow: 'box-shadow',
        transform: 'transform',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

