import { Regions, VendorCodes } from "@typesLib/APIFilters";

interface SHOP_CONSTANT {
  LOGO: string;
  FAVICON: string;
  SITE_CODE: VendorCodes;
  CONFIG_V: "globalV2" | "globalV3";

  /* FEATURE FLAGS */
  ENABLE_CARTIMAGE_AB: boolean;
  ENABLE_GLAMMPOINTS: boolean;
  ENABLE_WHATSAPP: boolean;
  ENABLE_SHARE: boolean;
  IS_MYGLAMM: boolean;
  ENABLE_SEARCH: boolean;
  ENABLE_OFFERS: boolean;
  ENABLE_GAMIFICATION: boolean;
  ENABLE_SCRATCHCARD: boolean;
  ENABLE_G3_LOYALTY_PROGRAM: boolean;
  ENABLE_JUSPAY: boolean;
  ENABLE_SURVEY_COUPON_RESTRICTION: boolean;
  ENABLE_SSO: boolean;
  ENABLE_CARTMINIPDP: boolean;
  ENABLE_TRUECALLER: boolean;
  ENABLE_WHATSAPP_OTP: boolean;
  ENABLE_DS_UPSELL: boolean;
  ENABLE_AUTOSUGGEST: boolean;
  ENABLE_SAVE_CARDS: boolean;
  ENABLE_LIVE_API: boolean;
  ENABLE_BOOSTING_ALGO: boolean;
  ENABLE_TWO_UPSELL_ROWS: boolean;
  ENABLE_QUICK_FILTER: boolean;
  ENABLE_COUNTRY_SELECTION: boolean;
  ENABLE_GUEST_CHECKOUT: boolean;
  DISABLE_NEED_HELP_VERLOOP: boolean;
  /* FEATURE FLAGS */

  /* COUNTRY / REGION */
  REGION: Regions;

  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  PRIMARY_COLOR_RGBA: string;
  PRIMARY_COLOR_DARK: string;
  EXPECTED_DELIVERY_VARIANT: string;
  COLOR_3: string;
  SOCIAL: {
    TWITTER: string;
    FACEBOOK: string;
    INSTAGRAM: string;
    YOUTUBE: string;
    WHATSAPP: string;
    PINTEREST: string;
  };
}

export let SHOP: SHOP_CONSTANT = JSON.parse(process.env.NEXT_PUBLIC_SHOP_CONSTANT || "{}") || {};

export const setSHOP = (data: any) => (SHOP = { ...SHOP, ...data });
