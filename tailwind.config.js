/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-bg': '#D9F0FF',
        primary: '#83C9F4',
        'text-dark': '#1E1E1E',
        'dark-bg': '#7681B3',
        secondary: '#6F73D2',
        'text-light': '#FFFFFF',
        'info-accent': '#0EA5E9',
        'success-accent': '#22C55E',
        'warn-accent': '#FFD166',
        'error-accent': '#FF6B6B',
        divider: '#E0E0E0',
      },
    },
  },
  plugins: [],
}
