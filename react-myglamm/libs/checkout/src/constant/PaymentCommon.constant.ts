import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const FORM_STYLES = {
  "m-web": {
    height: "40px",
    marginBottom: "16px",
  },
  web: {
    height: "60px",
    marginBottom: "20px",
  },
};

const INPUT_STYLES = {
  "m-web": {
    "line-height": "2px",
    "font-size": "16px",
    padding: "8px",
    "border-width": "1px",
    border: "1px solid #dedede",
    "border-radius": "4px",
  },
  web: {
    "line-height": "2px",
    "font-size": "16px",
    padding: "12px",
    "border-width": "1px",
    border: "1px solid #dedede",
    "border-radius": "4px",
    "background-color": "#f7f7f7",
    "font-weight": "300",
  },
};

export const INPUT_STYLES_WEB: React.CSSProperties = {
  lineHeight: "2px",
  fontSize: "16px",
  padding: "12px",
  borderWidth: "1px",
  border: "1px solid #dedede",
  borderRadius: "4px",
  backgroundClip: "#f7f7f7",
};

export const COMMON_FORM_STYLES = FORM_STYLES[
  (process.env.NEXT_PUBLIC_ROOT || "m-web") as keyof typeof FORM_STYLES
] as React.CSSProperties;

export const COMMON_INPUT_STYLES = INPUT_STYLES[
  (process.env.NEXT_PUBLIC_ROOT || "m-web") as keyof typeof INPUT_STYLES
] as React.CSSProperties;

export const PAY_CHANNEL = IS_DESKTOP ? "WEB" : "MWEB";
