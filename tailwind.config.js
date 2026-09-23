/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'card-bg': '#1f1f1f',
        'accent-blue': '#38bdf8',
      }
    },
  },
  plugins: [],
}