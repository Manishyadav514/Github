import { VendorCodes } from "./APIFilters";

export type SurveyInfo = {
  index: string;
  name: string;
  slug: string;
};

export interface SurveyState {
  url: string;
  phase: string;
  module: string;
  chatUI: boolean;
  title?: string;
  description?: string;
  platform: string;
  memberTag?: string;
  grantPoints: boolean;
  eventData?: any;
  CTA?: string;
  CTAStyle?: React.CSSProperties;
  skipSurvey?: boolean;
  autoSurveyStart?: boolean;
  customSurveyId?: string;
  launchNativeSurvey?: boolean;
  glammClub?: boolean;
  splashScreenImage?: string;
  skipSurveyLanding?: boolean;
  skipSurveyLandingBanner?: string;
  productInfo?: SurveyProduct;
}

export type SurveyProduct = {
  slug?: string;
  productIds?: string[];
  coupon?: string;
  offerPrice?: number;
  discount?: number;
  CTA?: string;
};

export type SurveyThankyouState = {
  phase: string;
  platform: string;
  coupon: string;
  CTA: string;
  autoApply?: boolean;
  openMiniPDP?: boolean;
  discount?: number;
  slug?: string;
  productIds?: string[];
  eventData?: any;
  backgroundColor: string;
  skipSurvey?: boolean;
  priceLabel?: string;
  slotMachine?: boolean;
  bestSelling?: boolean;
  productsUnavailableMessage?: string;
  customSurveyId?: string;
  glammClub?: boolean;
  showCongratsV2?: boolean;
};

export interface g3Config extends coinConfig, bannerConfig, guestBannerConfig {
  coinIcon: string;
  surveyBanner: string;
  surveyBannerGuest: string;
  popxoSurveyBanner?: string;
  popxoSurveyBannerGuest?: string;
  stickyBannerImg: string;
  surveyRedirection: boolean;
}

type coinConfig = { [char in `${VendorCodes}CoinIcon`]?: string };
type bannerConfig = { [char in `${VendorCodes}SurveyBanner`]?: string };
type guestBannerConfig = { [char in `${VendorCodes}SurveyBannerGuest`]?: string };
