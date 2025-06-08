/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        netflix: {
          DEFAULT: "#e50914",
          dark: "#141414",
          gray: "#222222",
        },
      },
      fontFamily: {
        netflix: ['"Bebas Neue"', "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
