/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f1c3f',
          800: '#152040',
          700: '#1a2545',
          600: '#1e2d57',
          500: '#253570',
        },
        slate: {
          muted: '#9daec8',
          light: '#f0f2f8',
          border: '#e4e6f0',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
