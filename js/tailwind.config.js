const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
  './templates/**/*.html',
  './connect_atx_elite/static/js/**/*.js',
  './connect_atx_elite/static/css/**/*.css'
],
  theme: {
    extend: {
      colors: {
        primary: '#f5c518',
        'primary-hover': '#e0b511',
        secondary: '#0a1f44',
        background: '#121212',
        foreground: '#f0f0f0',
        muted: '#a1a1a1',
        error: '#b83227',
        success: '#22c55e'
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(245, 197, 24, 0.6)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};

