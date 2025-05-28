const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './templates/**/*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#facc15',
        'accent-hover': '#fde68a',
        'accent-soft': '#facc1580',
        'cyber-night': '#0a0a0a',
        'prestige-black': '#09090b',
        foreground: '#ffffff',
        'foreground-light': '#ffffffd9',
        'foreground-muted': '#ffffffb3',
      },
      boxShadow: {
        gold: '0 0 25px rgba(250,204,21,0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

