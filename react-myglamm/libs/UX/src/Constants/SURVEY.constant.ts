import { SITE_CODE } from "./GLOBAL_SHOP.constant";

const surveyRoutes: any = {
  mgp: "/myglammxo-survey",
  stb: "/stbotanicasurvey",
  tmc: "/the-moms-co-survey",
  orh: "/organicharvestsurvey",
  srn: "/thesironasurvey",
  bbc: "/bbcsurvey",
  popxo:
    process.env.NEXT_PUBLIC_PRODUCT_ENV === "PROD"
      ? "https://www.myglamm.com/myglammxo-survey"
      : "https://alpha-mr.myglamm.net/myglammxo-survey",
};

export const SURVEY_URL = surveyRoutes[SITE_CODE()];

export const GAMIFICATION_URL = SITE_CODE() === "mgp" ? "/myglammxo-rewards" : "/my-rewards";

export const CTP_SHARE_URL = "/collection/cut-the-price-collection";
