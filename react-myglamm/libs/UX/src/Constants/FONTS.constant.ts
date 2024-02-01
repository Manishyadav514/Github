import localFont from "next/font/local";

import { Montserrat, Poppins, Open_Sans } from "next/font/google";

import { SITE_CODE } from "./GLOBAL_SHOP.constant";
import { VendorCodes } from "@typesLib/APIFilters";

const DIN_2014 = localFont({
  src: [
    { path: "../../public/fonts/DIN2014-Italic.woff", weight: "400" },
    { path: "../../public/fonts/DIN2014-Regular.woff", weight: "400" },
    { path: "../../public/fonts/DIN2014-DemiBold.woff", weight: "500" },
    { path: "../../public/fonts/DIN2014-Bold.woff", weight: "600" },
  ],
  variable: "--gbcfont",
  preload: false,
  fallback: ["Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
});

const MONTSERRAT = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--gbcfont",
  preload: false,
  fallback: ["Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
});

const POPPINS = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--gbcfont",
  preload: false,
  fallback: ["Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
});

const AVENIR = localFont({
  src: [
    { path: "../../public/fonts/Avenir.woff2", weight: "400" },
    { path: "../../public/fonts/Avenir-ext.woff2", weight: "400" },
    { path: "../../public/fonts/Avenir-Medium.woff2", weight: "500" },
  ],
  variable: "--gbcfont",
  preload: false,
  fallback: ["Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
});

export const getGBCFont = (vendor?: VendorCodes) => {
  switch (vendor || SITE_CODE()) {
    case "orh":
    case "mnm":
      return MONTSERRAT.className;

    case "stb":
      return POPPINS.className;

    case "tmc":
      return AVENIR.className;

    default:
      return DIN_2014.className;
  }
};

export const GOOD_POINTS_FONT = Open_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--openSans",
  preload: false,
  fallback: ["Roboto", "system-ui", "Arial", "Helvetica", "sans-serif"],
});
