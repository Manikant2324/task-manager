/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 120px -40px rgba(14, 165, 233, 0.45)",
      },
      backgroundImage: {
        "dashboard-gradient":
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 20%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
};