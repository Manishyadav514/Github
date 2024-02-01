const { join } = require("path");

module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-url": { url: "inline" },
    "postcss-preset-env": {},
    tailwindcss: { config: join(__dirname, "tailwind.config.js") },
    "postcss-rtlcss": { useCalc: true, processKeyFrames: true },
    autoprefixer: {},
    cssnano: {},
  },
};
