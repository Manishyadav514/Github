import { proxy } from "valtio";

type FEATURE_FLAGS = {
  enableShowShippingChargesOnPayments?: boolean;
  similarProductButton?: boolean;
  plpFilterUnSticky?: boolean;
  gamificationScreen?: boolean;
  cartAdobeEventKey?: string;
  isCodOrderFlowEnabled?: boolean;
  hideAvailableOffers?: boolean;
  enableDsUpsell?: boolean;
  enableCupSizeGuide?: boolean;
  disableATCBestPriceAP?: boolean;
  enableComboV2?: boolean;
  enableGA4?: boolean;
  enableDsUpsellWithPersonalizedPicks?: boolean;
  enableRecommendForOOSProductTag?: boolean;
  enableSideNavMenuV2?: boolean;
  enableTruecaller?: boolean;
  enableGuestFlow?: boolean;
  disableGoKwik?: boolean;
  enableCommunityOnBoardingPopup?: boolean;
  enableCTP?: boolean;
  enableNewComboUi?: boolean;
  disableDiscountPartnership?: boolean;
  enablePDPOffers?: boolean;
  disableBlacklistWidget?: boolean;
  hideShippingChargesOnPayment?: boolean;
  newShareMessage?: boolean;
  fetchPdpCustomBranding?: boolean;
  disableQwikcilverGC?: boolean;
  enableGPonPayment?: boolean;
  enableNewPDP?: boolean;
  partnershipExp?: boolean;
  comboShadeVariant?: boolean;
  enableTypeFormFallback?: boolean;
  enableViewSimilar?: boolean;
  enableCartComboUI?: boolean;
  disableGlammClubIcon?: boolean;
  enableGlammClubMembershipSticker?: boolean;
};

export let FEATURES: FEATURE_FLAGS = proxy({});

export const INIT_FEATURES = (state?: FEATURE_FLAGS) => {
  FEATURES = state || {};
};
