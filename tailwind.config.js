const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)"],
      },
      colors: {
        background: "#FAF3E0",
        "primary-button": "#FFB6C1",
        "secondary-button": "#FFE4B5",
        text: "#AF937D",
        "heading-home": "#FFD3E0",
        "heading-listing": "#E6E6FA",
        "heading-form": "#FAD8C7",
        accent: "#C2D1B3",
        border: "#AED9E0",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
