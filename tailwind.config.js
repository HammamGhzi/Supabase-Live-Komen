/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ['"Space Grotesk"', "sans-serif"],
      },
      colors: {
        cream: "#FFFBF5",
        charcoal: "#1A1A1A",
        nb: {
          yellow: "#FFE033",
          pink: "#FF6B9D",
          blue: "#3D5AFE",
          green: "#00C853",
          orange: "#FF6D00",
        },
      },
      boxShadow: {
        nb: "4px 4px 0px #1A1A1A",
        "nb-lg": "6px 6px 0px #1A1A1A",
        "nb-xl": "8px 8px 0px #1A1A1A",
        "nb-hover": "2px 2px 0px #1A1A1A",
      },
    },
  },
  plugins: [],
};
