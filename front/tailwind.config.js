/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c60d2',
        secondary: '#d13282',
        'dark-bg': '#1e1e2f'
      }
    }
  },
  plugins: []
}
