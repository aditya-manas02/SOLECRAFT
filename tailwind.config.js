/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/js/**/*.{js,jsx,ts,tsx}',
    './resources/views/**/*.blade.php',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F5F3EF',
          panel: '#FFFFFF',
          border: '#E5E5E5',
          accent: '#E85D26',
          dark: '#111111',
          overlay: 'rgba(0,0,0,0.85)',
        }
      }
    },
  },
  plugins: [],
}
