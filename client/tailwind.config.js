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
      fontSize: {
        'smaller': '0.6em',
        'small': '0.8em',
        'medium': '1.0em',
        'large': '1.2em',
        'larger': '1.4em',
        'largest': '1.6em',
      },
      screens: {
        'vscreen': { 'raw': '(max-aspect-ratio: 1/1)' },
        'hscreen': { 'raw': '(min-aspect-ratio: 1/1)' },
        // Add more aspect ratio breakpoints as needed
      },
    },
  },
  plugins: [],
}

