/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10202f",
        harbor: "#0f766e",
        lagoon: "#0d9488",
        moss: "#3f7f58",
        honey: "#b7791f",
        civic: "#f6f3ed",
        paper: "#fffdf8",
        slateLine: "#d8e2e7"
      },
      boxShadow: {
        soft: "0 16px 44px rgba(16, 32, 47, 0.10)",
        lift: "0 22px 60px rgba(15, 118, 110, 0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
