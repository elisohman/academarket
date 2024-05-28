/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-color': '#4ADE80',
        'light-gray': '#EEF2EF',
        'secondary-color': '#1D212F',
        'lavender': '#7950EE',
        'coral': '#F34F81', 
      },
    },
  },
  plugins: [],
}

