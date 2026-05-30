/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#1B3A2D',
          800: '#224835',
          700: '#2D5E45',
          600: '#3A7558',
        },
        cream: '#F5F0E8',
        stone: '#8C7B6B',
      },
    },
  },
  plugins: [],
};
