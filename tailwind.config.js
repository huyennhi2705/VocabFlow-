/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17233b",
        paper: "#f6f7fb",
        brand: "#5b5ce2",
        mint: "#dcf8ed"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(30, 41, 79, .08)"
      }
    }
  },
  plugins: []
};
