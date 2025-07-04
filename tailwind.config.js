// tailwind.config.js
module.exports = {
  darkMode: 'class', // Manual dark mode support via .dark on <html>
  content: [
    './app/templates/**/*.html',
    './app/static/**/*.css',
    './app/static/js/**/*.js',
    // Add more globs as needed!
  ],
  safelist: [
    'text-primary', 'bg-primary', 'border-primary', // dynamic classes in Jinja/JS
    'bg-secondary', 'text-foreground', 'bg-primary-yellow', // new: used in templates
    'font-bold', 'tracking-tight', // text utilities used via @apply
    'font-heading', // heading font in base layer
    'shadow-gold-glow', 'gold-glow', // custom utilities
    'rounded-full', 'rounded-xl',    // frequent border radius
    'backdrop-blur',                 // custom utility
  ],
  theme: {
    extend: {
      colors: {
        // Elite brand palette (and utility colors actually used in HTML/CSS)
        primary: '#facc15',
        'primary-hover': '#e0b511',
        'primary-yellow': '#facc15',
        secondary: '#18181b',         // "bg-secondary" for dark backgrounds
        'zinc-dark': '#18181b',
        'foreground': '#e5e7eb',      // "text-foreground" for light text
        'text-light': '#fffbe7',
        'text-muted': 'rgba(255,255,255,0.7)',
        'cta': '#fdba74',
        black: '#18181b',
        white: '#ffffff',
        amber: { 400: '#fbbf24', 300: '#fde68a' },
        // ...add more as needed!
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 36px 0 #facc15cc',
        // matches .shadow-gold-glow
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
        spacing: 'margin, padding',
        shadow: 'box-shadow',
        transform: 'transform',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        fast: '120ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4,0,0.2,1)',
        soft: 'cubic-bezier(.8,.2,.1,1.0)',
      },
      keyframes: {
        'gold-glow': {
          '0%': { boxShadow: '0 4px 16px #facc1580, 0 0 8px #facc1570' },
          '100%': { boxShadow: '0 0 36px 0 #facc15cc' },
        },
      },
      animation: {
        'gold-glow': 'gold-glow 2.8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),        // Beautiful forms
    require('@tailwindcss/typography'),   // Prose and markdown
    require('@tailwindcss/aspect-ratio'), // Responsive images/videos
  ],
  variants: {
    extend: {
      backgroundColor: ['active', 'group-hover', 'focus-visible'],
      textColor: ['active', 'group-hover', 'focus-visible'],
      ringColor: ['focus-visible'],
      opacity: ['disabled'],
    },
  },
  corePlugins: {},
};
	
