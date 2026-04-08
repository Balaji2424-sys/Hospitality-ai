export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf9f7",
          100: "#d4f0eb",
          500: "#0f766e",
          700: "#115e59",
          900: "#102f2d"
        }
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"]
      }
    }
  },
  plugins: []
};
