import { proxy } from "valtio";
import { ValtioStore } from "@typesLib/ValtioStore";
import {
  userState,
  configState,
  constantState,
  contestState,
  paymentState,
  navState,
  cartState,
  adobeState,
} from "@typesLib/Redux";

export const USER_REDUCER: userState = proxy({
  userProfile: null,
  g3Profile: null,
  userAddress: [],
  userMobileNumber: {
    number: "",
    isdCode: "",
  },
  shippingAddress: undefined,
  userWishlist: [],
  isPincodeServiceable: true,
  minutes: null,
  seconds: null,
  userGuestDump: undefined,
});

// @ts-ignore
export const CART_REDUCER: cartState = proxy({ cart: { loader: false }, cartLoaded: false });

export const commonData = {
  wallPosts: {
    isFreshReload: false,
    posts: [],
    skip: 0,
    isDataScienceAPI: true,
  },
  questionPosts: {
    isFreshReload: false,
    posts: [],
    skip: 0,
  },
  liveVideoPosts: {
    isFreshReload: false,
    posts: [],
    skip: 0,
  },
  polls: {
    posts: [],
    skip: 0,
    isFreshReload: false,
  },
};

export const COMMUNITY_REDUCER = proxy({
  feedData: commonData,
  feedByTags: {
    posts: [],
    skip: 0,
    tag: "",
  },
  feedByTopics: {
    ...commonData,
    topic: "",
  },
  widgetWallData: [],
});

export const CONFIG_REDUCER: configState = proxy({
  shareModalConfig: {
    shareUrl: "",
    productName: "",
    slug: "",
    category: "",
    module: "product",
    platform: "facebook",
    image: "",
    overrideRouterPath: "",
    shareMessage: "",
  },
  surveyConfig: "noSurvey",
  configV3: {},
});
export const ADOBE_REDUCER: adobeState = proxy({
  adobePageLoadData: null,
});

export const CONTEST_REDUCER: contestState = proxy({
  data: [],
  hasMore: false,
  count: 0,
  relationalData: {
    userVotedContestEntries: [],
  },
  filter: "popularity",
});

export const NAV_REDUCER: navState = proxy({
  sideMenu: null,
  offersIcon: null,
  footer: null,
  headerMenu: null,
  topBanner: null,
  bottomNav: undefined,
});

export const PAYMENT_REDUCER: paymentState = proxy({
  vendorMerchantId: undefined,
  paymentOrder: undefined,
  allJuspayOffers: undefined,
  razorPayData: undefined,
  juspayLoaded: false,
  expectedDelivery: undefined,
  isCodEnable: undefined,
  codDisableMessage: undefined,
  upiAppDetails: undefined,
  upiIntentFlowUrl: undefined,
  clientAuthDetails: undefined,
  isUpiPaymentScreenLoading: false,
  isPaymentProcessing: false,
  isCouponExpired: false,
  suggestedPaymentMethods: undefined,
  CRED: undefined,
  TWID: undefined,
  isSimplEligible: undefined,
  simplEligibleMessage: undefined,
  isCredEligible: undefined,
  paymentMethodOffers: undefined,
  isUserWatchingOrderConfirmationScreen: undefined,
  showUpsellOnPaymentsPage: undefined,
  userRedeemedGlammPoints: undefined,
  hasUserAddedProductFromUpsellPayment: undefined,
  giftCardAddedFromPayment: undefined,
  giftCardProduct: undefined,
  shippingMessage: undefined,
});

export const CONSTANT_REDUCER: constantState = proxy({
  isdCodes: undefined,
  countryConstants: undefined,
  citiesConstants: undefined,
  addressCountryList: [],
});

export const TRYON_REDUCER = proxy({
  selectedImage: "",
  tryonActiveState: "",
});

export const valtioReduxStore: ValtioStore = proxy({
  adobeReducer: ADOBE_REDUCER,
  userReducer: USER_REDUCER,
  cartReducer: CART_REDUCER,
  communityReducer: COMMUNITY_REDUCER,
  configReducer: CONFIG_REDUCER,
  constantReducer: CONSTANT_REDUCER,
  contestReducer: CONTEST_REDUCER,
  navReducer: NAV_REDUCER,
  paymentReducer: PAYMENT_REDUCER,
  tryonReducer: TRYON_REDUCER,
});
