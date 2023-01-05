/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter']
      },
      screens: {
        'xs': '400px',
      },
    },
  },
  plugins: [],
};
