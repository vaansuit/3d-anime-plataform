/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Ensure it matches your file structure
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#81d4e2', // Define custom light blue color
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient( #81d4e2 )', // Radial gradient from light-blue at the edges to white at the center
      },
    },
  },
  plugins: [],
};
