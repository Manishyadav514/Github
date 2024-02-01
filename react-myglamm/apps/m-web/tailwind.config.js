const { join } = require("path");

const extend = {
  /* Color Pallete for text/backaground/border.etc
   * anyplace where color can be used
   */
  colors: {
    color1: "var(--color1)",
    color2: "var(--color2)",
    color3: "var(--color3)",
    color4:"var(--color4)",
    themeGray: "#f4f4f4",
    themePink: "var(--themePink)",
    offerPDP: "var(--offerPDP)",
    pdpConcern: "var(--pdpConcern)",
    ratingGreen: "#189918",
  },
  fontSize: {
    7: "7px",
    10: "9px",
    11: "11px",
    13: "13px",
    15: "15px",
    17: "17px",
    18: "18px",
    22: "22px",
    xxs: ".6rem",
    "2rem": "2rem",
  },
  /* Sizes for height/width/margin/padding */
  spacing: {
    "85%": "85%",
    "18px": "18px",
    "82px": "82px",
    "50px": "50px",
    "73px": "73px",
    "110px": "110px",
    "115px": "115px",
  },
  outline: { 0: "none !important" },
  backgroundImage: {
    underline: `linear-gradient(transparent 65%, var(--color1) 12px)`,
    ctaImg: "var(--btnBg)",
    pdpLabel: `linear-gradient(180deg,transparent 65%, var(--color2) 0)`,
  },
  maxHeight: { "75vh": "75vh" },
  minWidth: { 85: "85%" },
  boxShadow: { combo: "0 0 4px 0 rgba(0, 0, 0, 0.22)", checkout: "0 0 3px 0 rgba(0,0,0,.19)" },
  borderWidth: { 3: "3px" },
  flex: { sliderChild: "0 0 auto" },
  borderRadius: { 3: "3px" },
};

/* Tailwind Config */
module.exports = {
  content: [
    `${join(__dirname, "src/**/**/*.{js,ts,jsx,tsx}")}`,
    `${join(__dirname, "src/**/**/**/*.{js,ts,jsx,tsx}")}`,
    "libs/**/src/**/**/**/*.{js,ts,jsx,tsx}",
    "libs/**/src/**/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend,
    fontFamily: {
      body: ["--gbcfont", "Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
