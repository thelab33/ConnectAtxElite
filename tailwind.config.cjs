module.exports = {
  darkMode: 'class',
  content: [
    './app/templates/**/*.html',
    './app/static/**/*.css',
    './app/static/js/**/*.js',
    './app/**/*.py',
  ],
  safelist: [
    'font-bold', 'tracking-tight', 'text-primary', 'bg-primary',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#facc15',
        'primary-hover': '#e0b511',
        'bg-dark': '#18181b',
        'text-light': '#fffbe7',
        'text-muted': 'rgba(255,255,255,0.7)',
      },
      boxShadow: {
        'gold-glow': '0 0 36px 0 #facc1580',
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 4px 16px rgba(245,197,24,0.8), 0 0 8px rgba(245,197,24,0.5)' },
          '100%': { boxShadow: '0 6px 32px rgba(245,197,24,1), 0 0 24px rgba(245,197,24,0.8)' },
        },
      },
      animation: {
        glow: 'glow 2.8s ease-in-out infinite alternate',
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

