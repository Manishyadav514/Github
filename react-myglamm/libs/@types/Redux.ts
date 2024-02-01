import { userCart } from "./Cart";
import { User, UserAddress } from "./Consumer";
import { VendorCodes, ME_VendorCodes, LanguageFilter, CountryFilter, langLocale } from "./APIFilters";
import { PaymentOrder, ClientAuthDetails, paymentMethods, twidData, credData, RZPayData } from "./Payment";
import { IContestData } from "./Contest";

export type loggedInUser = {
  type: string;
  payload: any;
};

export type userProfile = {
  type: string;
  payload: any;
};

export type mobileNumber = {
  type: string;
  payload: {
    number: string;
    isdCode: string;
  };
};

export type userActions = mobileNumber | userProfile | loggedInUser;

export type nav = {
  label: string;
  url: string;
  visibility: "both" | "login" | "guest";
  image: string;
  class: string;
  selectedImage: string;
};

export type navState = {
  sideMenu?: any;
  offersIcon?: any;
  footer?: any;
  headerMenu?: any;
  topBanner?: any;
  bottomNav?: nav[];
};

export type SocialData = {
  socialId: string;
  id: undefined | string;
  name: undefined | string;
  email: undefined | string;
  type: string;
};

export type userState = {
  userProfile: User | null;
  userAddress: Array<UserAddress>;
  userMobileNumber: {
    number: string;
    isdCode: string;
  };
  shippingAddress?: UserAddress;
  userWishlist: Array<string>;
  isPincodeServiceable: boolean;
  minutes: number | null;
  seconds: number | null;
  userGuestDump?: any;
};

export type InternationalShippingCountryList = {
  countryCode: string;
  countryFlag: string;
  countryLabel: string;
  countryName: string;
  isoCode2: string;
  isoCode3: string;
  phoneNoLength: number;
  phoneNumberValidationRegex: string;
  pinCodeRegex: string;
};

export type constantState = {
  isdCodes?: ISDConfig[];
  countryConstants?: CountryConfig[];
  citiesConstants?: cityConfig[];
  addressCountryList: InternationalShippingCountryList[];
};

export type configState = {
  shareModalConfig: {
    shareUrl?: string;
    productName?: string;
    slug?: string;
    category?: string;
    module?: string;
    platform?: string;
    image?: string;
    overrideRouterPath?: string;
    shareMessage?: string;
  };
  surveyConfig?: any;
  configV3?: any;
};

export type SocketState = {
  socket: SocketIOClient.Socket | undefined;
};

export type paymentSuggestion = {
  iconUrl: string;
  method: paymentMethods;
  name: string;
  type: null;
  paymentBankCode: string;
  addedDate: string;
  updatedAt: string;
  usedCount: number;
  merchant_id: string;
  meta: {
    card_brand: string;
    code: string;
    imageUrl: string;
    name: string;
    android_package: string;
    ios_package: string;
    web_package: string;
    android_scheme: string;
    card_number: string;
    payment_method_reference: string;
    expired: boolean;
    card_type: string;
    card_token: string;
    card_isin: string;
    card_bin: string;
    payment_method: string;
    long_label: string;
    card_alias: string;
    bank_code: string | null;
    metadata: {
      origin_merchant_id: string;
    };
  };
};

export type paymentState = {
  vendorMerchantId?: string;
  paymentOrder?: PaymentOrder[];
  allJuspayOffers?: any;
  juspayLoaded?: boolean;
  razorPayData?: RZPayData;
  expectedDelivery?: {
    minDeliveryDate: string;
    maxDeliveryDate: string;
    dsExpectedDeliveryDate: string;
  };
  isCodEnable?: boolean;
  codDisableMessage?: string;
  upiAppDetails?: any;
  upiIntentFlowUrl?: any;
  paymentMethodOffers?: any;
  showUpsellOnPaymentsPage?: boolean;
  clientAuthDetails?: ClientAuthDetails;
  isUpiPaymentScreenLoading: boolean;
  isPaymentProcessing: boolean;
  isCouponExpired: boolean;
  suggestedPaymentMethods?: paymentSuggestion[];
  CRED?: credData;
  TWID?: twidData;
  isSimplEligible?: boolean;
  simplEligibleMessage?: string;
  isCredEligible?: boolean;
  isUserWatchingOrderConfirmationScreen?: Boolean;
  userRedeemedGlammPoints?: boolean;
  hasUserAddedProductFromUpsellPayment?: boolean;
  giftCardAddedFromPayment?: boolean;
  giftCardProduct?: any;
  shippingMessage?: string;
};

export type contestState = {
  filter: string;
  hasMore: boolean;
  count: number;
  data: IContestData[];
  relationalData: any;
};

export type cartState = {
  cart: userCart;
  cartLoaded: boolean;
};
export type adobeState = {
  adobePageLoadData: any;
};

export type tryonReducerState = {
  selectedImage: string;
  tryonActiveState: string;
};

export type ReduxStore = {
  adobeReducer: adobeState;
  userReducer: userState;
  navReducer: navState;
  constantReducer: constantState;
  configReducer: configState;
  cartReducer: cartState;
  paymentReducer: paymentState;
  contestReducer: contestState;
  tryonReducer: tryonReducerState;
};

export type ModalConfig = {
  shareUrl: string;
  productName?: string;
  slug?: string;
  category?: string;
  shareMessage?: string;
  module: string;
  platform?: string;
  image?: string;
  overrideRouterPath?: string;
};

export type CountryConfig = {
  selectionLabel: string;
  isoCode2: string;
  isoCode3: CountryFilter;
  countryVendorCode: VendorCodes | ME_VendorCodes;
  countryFlag: string;
  isSelected: boolean;
  defaultCountryId: string;
  isServer: boolean;
  languages: Array<CountryLang>;
};

export type CountryLang = {
  code: LanguageFilter;
  default: boolean;
  label: string;
  translatedLabel: string;
  name: string;
  urlLang: langLocale;
  isSelected: boolean;
};

export type ISDConfig = {
  countryCode: string;
  countryFlag: string;
  countryLabel: string;
  isoCode3: CountryFilter;
  isoCode2: string;
  phoneNoLength: number;
  id: number;
  countryVendorCodeTag: string;
  currencyDenomination: number;
  uiTemplate: "template_are" | "template_ind";
};

export type cityConfig = {
  cityName: string;
  countryId: number;
  id: number;
  stateId: number;
};
