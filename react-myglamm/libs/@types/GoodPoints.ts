export type reward = {
  burnConfigType: 1 | 2 | 3 | 4;
  discountCode: string;
  discountCodeVendor: string;
  expireAt: string;
  id: string;
  cms: [{ content: { howToClaim: string; about: string; termsAndCondition: string } }];
  landingPageURL: string;
  name: string;
  percievedPrice: number;
  redeemablePoints: number;
  slug: string;
  subTitle: string;
  thumnailImage: { couponImage: string };
  cta: { app: string; web: string };
  discountDescription?: string;
};

export type BrandData = {
  id: string;
  description: string;
  name: string;
  meta: {
    site: string;
    appURL: string;
  };
  urls: { bannerURLForLoggedInGuest: string };
  brandImage: {
    favicon: string;
    frontendLogo: string;
  };
};

export type SingleReward = {
  reward: reward;
  vendorData: BrandRelationalData;
};

export type RewardListing = {
  data: reward[];
  relationalData: { discountCodeVendor: BrandRelationalData };
};

export type BrandRelationalData = {
  [char: string]: BrandData;
};

export type Widget = {
  customParam: string;
  id: string;
  label: string;
  visibility: "guest" | "login" | "both";
  meta: { widgetMeta: string };
  commonDetails: {
    title: string;
    subTitle: string;
    descriptionData: [{ value: reward[]; relationalData: { discountCodeVendor: BrandRelationalData } }];
  };
  multimediaDetails: WidgetMediaInfo[];
  apiData?: any;
};

export type WidgetMediaInfo = {
  assetDetails: {
    name: string;
    url: string;
    type: "image" | "video";
  };
  targetLink: string;
  sliderText: string;
  headerText: string;
  footerText: string;
  url: string;
  imageTitle: string;
  imageAltTitle: string;
  startDate: string;
  endDate: string;
};

export type WidgetInfo = { widget: Widget; index?: number; icid?: string };
