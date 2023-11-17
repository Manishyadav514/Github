/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         
        primary: "var(--primary-color)",
        secondary: "var(--primary-light-color)",
        // blue shade
        blueLight: "#E3ECFC",
        blueDark: "#518CEB",
        // orange shade
        orangeDark: "#F9982D",
        orangeLight: "#FFF4E6",
        // red shade
        redDark: "#F35425",
        redLight: "#FCE7E5",
        // yellow shade
        yellowDark: "#FEC134",
        yellowLight: "#FBF7E6",
        // green shade
        greenLight: "#DBFAE7",
        greenDark: "#4FA845",
        greenDark2: "#8BC34A",
        greenBackGround:"rgba(139, 195, 74, 0.1)",
        greenLight1: "#F2F7E6",
      },
    },
  },
  plugins: [],
};
