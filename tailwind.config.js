export default {
  darkMode: 'class',  // ✅ DARK MODE ENABLED
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          600: "#1A2A49",
          700: "#152038"
        }
      }
    },
  },
  plugins: [],
}