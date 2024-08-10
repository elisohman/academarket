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
        'smallerer': '0.4em',
        'smaller': '0.6em',
        'small': '0.8em',
        'mediumsmall': '0.9em',
        'medium': '1.0em',
        'mediumlarge': '1.1em',
        'large': '1.2em',
        'larger': '1.4em',
        'largest': '1.6em',
      },
      screens: {
        'vscreen': { 'raw': '(max-aspect-ratio: 1/1)' },
        'hscreen': { 'raw': '(min-aspect-ratio: 1/1)' },
      },
    },
  },
  plugins: [],
}

