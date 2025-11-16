/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003135',
        secondary: '#024950',
        accent: '#0FA4AF',
        highlight: '#964734',
        'accent-light': '#AFDDE5',
        'neutral-dark': '#333333',
        'neutral-mid': '#666666',
        'bg-light': '#FAFAFA',
        'surface': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1-desktop': ['48px', { lineHeight: '1.2' }],
        'h1-mobile': ['32px', { lineHeight: '1.2' }],
        'h2-desktop': ['32px', { lineHeight: '1.3' }],
        'h2-mobile': ['24px', { lineHeight: '1.3' }],
        'body-desktop': ['16px', { lineHeight: '1.5' }],
        'body-mobile': ['14px', { lineHeight: '1.5' }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.25rem',
          md: '1.5rem',
          lg: '1.5rem',
          xl: '1.5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '992px',
          xl: '1200px',
        },
      },
      maxWidth: {
        'container': '1200px',
      },
      spacing: {
        'gutter': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'button-hover': '0 4px 12px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

