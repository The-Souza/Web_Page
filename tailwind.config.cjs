/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#020202",
        forest: "#0d2818",
        greenDark: "#04471c",
        greenMid: "#058c42",
        greenLight: "#16db65",
      },
      boxShadow: {
        'dark': '0 5px 20px rgba(2,2,2,0.7)',        // dark
        'forest': '0 5px 20px rgba(13,40,24,0.5)',    // forest
        'greenDark': '0 5px 20px rgba(4,71,28,0.5)',  // greenDark
        'greenMid': '0 5px 20px rgba(5,140,66,0.5)',  // greenMid
        'greenLight': '0 5px 20px rgba(22,219,101,0.5)', // greenLight
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
