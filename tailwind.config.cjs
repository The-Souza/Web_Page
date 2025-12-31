/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgComponents: "var(--color-bgComponents)",
        background: "var(--color-bg)",
        bgTableHeader: "var(--color-bgTableHeader)",
        primary: "var(--color-primary)",
        primaryMuted: "var(--color-primary-muted)",
        accent: "var(--color-accent)",
        textColor: "var(--color-textColor)",
        textColorHeader: "var(--color-textColorHeader)",
        textColorCard: "var(--color-textColorCard)",
        textColorHover: "var(--color-textColorHover)",
        placeholder: "var(--color-placeholder)",
        buttonSolidHover: "var(--button-solidHover-bg)",
        buttonSolidRed: "var(--button-solidRed-bg)",
        buttonSolidHoverRed: "var(--button-solidHoverRed-bg)",
        buttonBorder: "var(--button-border-bg)",
        buttonBorderText: "var(--button-borderText-bg)",
      },
      boxShadow: {
        theme: "0 5px 20px var(--shadow-color)",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [],
};
