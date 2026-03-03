/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nav: "#0B3557",
        pagebg: "#F4F7FB",
        line: "#E6EDF7",
        brand: "#1AA6A6",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(12, 38, 68, 0.10)",
      },
    },
  },
  plugins: [],
};
