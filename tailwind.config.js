/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poker-green': '#0f5132',
        'poker-red': '#dc3545',
        'chip-gold': '#ffd700',
      }
    },
  },
  plugins: [],
}