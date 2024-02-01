import { SITE_CODE } from "./GLOBAL_SHOP.constant";

const APP_NAMES: any = {
  mgp: "MyGlamm",
  popxo: "PopXO",
  stb: "St.Botanica",
  bbc: "BabyChakra",
  tmc: "The Moms Co",
  orh: "Organic Harvest",
  srn: "Sirona",
};

export const WEBSITE_NAME = APP_NAMES[SITE_CODE()];

export const G3_WEBSITE_NAME = () => APP_NAMES[SITE_CODE()];
