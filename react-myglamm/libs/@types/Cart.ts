export type freeProductData = {
  id?: string;
  ids: string[];
  numberOfProducts?: number;
  type: APIProdTypes;
  categoryId?: string[];
};

export type userCart = {
  tax: number;
  firstOrder: boolean;
  usersGlamPoints?: number;
  appliedGlammPoints?: number;
  applicableSubscriptionDetails: subscriptionModel;
  applicableGlammPoints?: number;
  expectedDeliveryDate: Date;
  countryId: number;
  redeemPointsOnFirstOrderInfoMsg: string;
  skusWithNoHasShade: Array<string>;
  instantDiscountCode: string | null;
  identifier: string;
  missingProductFreeProducts: Array<{
    parentProductId: string;
    freeProduct: freeProductData;
  }>;

  additionalDiscount: number;
  shippingCharges: number;
  totalDutyCharges: number;
  productCount: number;
  couponData: cartCoupon;
  discounts: {
    id?: string;
    type?: APIProdTypes;
    description?: string;
    ids?: string[];
  };
  amountToSpendForNextDiscount: number;
  products: Array<cartProduct>;
  gwpProducts: Array<cartProduct>;
  pwpProducts: Array<cartProduct>;
  miscellaneousProducts?: Array<cartProduct>;
  allProducts: Array<cartProduct>;
  netAmount: number;
  payableAmount: number;
  loader?: boolean;
  binSeriesData?: binSeries;
  applicableOnMRP?: boolean;
  isShippingChargeCashBack?: boolean;
  grossAmount: number;
  freeShippingThreshold: number;
  shippings: shippings[];
  subscriptionDiscountIncludesShipping?: boolean;
  subscriptionDiscountValue?: number;
  subscriptionDetails: any;
  virtualProductSubscriptionAmount?: number;
  codEnabledForSubscription?: boolean;
  shippingChargesAfterDiscount?: number;
  shippingChargesDiscount?: number;
  cartShippingCharges?: number;
  userCouponDiscountValue?: number;
  cartUpsellKey?: string;
  isGiftCardSku?: boolean;
  thresHoldCartValueForGlammCoins: number;
  totalSaving?: number;
  hasCartGcDiscount?: boolean;
  shoppingBagPayableAmount: number;
  allowIntShipping?: boolean;
  deliverDates: {
    expectedDeliveryDate: string;
    dsExpectedDeliveryDate: string;
    dsMinExpectedDeliveryDate: string;
  };
  upsellOfferProducts: string[];
};

export type userSubscription = {
  existingSubscription: subscriptionModel | null;
  applicableSubscriptions: subscriptionModel | null;
};

export type subscriptionModel = {
  id: string;
  name: string;
  description: string;
  sku: string;
  offerType: string;
  displayUserSegment: string[];
  assets: Array<{
    type: "image" | "video";
    url: string;
    size: { height: number; width: number };
  }>;
  meta: string;
  vendorCode: string;
  discountType: string;
  discountValue: number;
  validity: number;
  minimumCartValue: number;
  maximumCartValue: number;
  statusId: number;
  subscriptionOfferPrice?: any;
  userSegment: string[];
  includeFreeShipping: boolean;
  minCartValueAfterSubscription?: number;
};

export type binSeries = {
  bankName?: { field: string; value: string };
  paymentMethods?: { field: string; value: Array<string> };
  binSeries?: { field: string; value: Array<string> };
};

export type cartProduct = {
  sku: string;
  quantity: number;
  productId: string;
  imageUrl: string;
  name: string;
  unitPrice: number;
  subtitle: string;
  price: number;
  offerPrice: number;
  parentId?: string;
  totalPrice: number;
  brandName: string;
  tagLabel?: string;
  errorFlag: boolean;
  errorMessage: string;
  productTag: string;
  type: 1 | 2;
  hasShade: boolean | null;
  cartType: cartType;
  shadeLabel?: string;
  shadeImage?: string;
  priceAfterCouponCodePerQuantity: number;
  productMeta: {
    isPreOrder: boolean;
    maxAllowedQuantityInCart: number;
    tryItOn: boolean;
    instantDiscountCode?: string;
    isVirtualProduct: boolean;
    giftCardSku?: string;
    isSubscriptionProduct: boolean;
    isDecoyPricedProduct: boolean;
    cutThePrice: boolean;
    recurringSubscriptionDetails?: {
      discountLabel?: string;
      frequency?: string;
      id?: string;
      offerPrice?: number;
      showBestOffer?: boolean;
      subscriptionSubtitle?: string;
      subscriptionTitle?: string;
      tag?: string | string[];
    };
    isTrial?: boolean;
  };
  childProducts: Array<cartProduct>;
  freeProducts: Array<cartProduct>;
  slug: string;
  productCategory: Array<any>;
  priceAfterCouponCode: number;
  wareHouseIdentifier: string;
  offerID: string;
  dsProductTags?: string[];
  productWidgetTag: string[];
  variantValue?: string;
  moduleName?: any;
};

export type cartFreeProduct = {
  id: string;
  price: number;
  offerPrice: number;
  sku: string;
  productTag: string;
  inStock: boolean;
  cartType: cartType;
  parentId?: string;
  type: 1 | 2;
  productMeta: { isPreOrder: boolean; tryItOn: null | boolean };
  cms: [
    {
      content: { name: string; subtitle: string };
      attributes: { shadeLabel: string; shadeImage: string };
    }
  ];
  assets: Array<{
    type: "image" | "video";
    name: string;
    imageUrl: { ["200x200"]?: string; ["400x400"]?: string };
  }>;
};

export type productCategory = { id: string; name: string; type: string };

export type adobeProduct = {
  productSKU: string;
  productQuantity: number;
  productOfferPrice: number;
  productPrice: number;
  productDiscountedPrice: number;
  productRating: string;
  productTotalRating: string;
  stockStatus: string;
  isPreOrder: string;
  PWP: string;
  hasTryOn: string;
};

export type addToBagProd = {
  id?: string;
  productId?: string;
  type: 1 | 2;
  parentId?: string;
  cartType: cartType;
  childProductIds?: Array<string>;
  offerID?: any;
  variantValue?: any;
  upsellKey?: string;
};

export type cartCoupon = {
  couponCode?: string;
  autoApply?: boolean;
  userDiscount?: number;
  userCashback?: number;
  couponDescription?: string;
  action?: string;
  freeProduct?: freeProductData;
  disableGuestLogin?: boolean;
};

export type APIProdTypes = "products" | "productTag" | "productCategory";

export type ProdAPIParams = { id: string; type: APIProdTypes };

export type cartType = 1 | 2 | 3 | 4 | 8;

export type FPOtherData = { cartType: cartType; parentId?: string };

export type FPData = {
  categories: any;
  shades: Array<cartFreeProduct>;
  freeProductData?: freeProductData;
  otherData?: FPOtherData;
};

export type UpsellData = {
  title?: string;
  subTitle?: string;
  slug?: string;
  products?: Array<WidgetProduct>;
};

export type WidgetProduct = {
  id: string;
  sku: string;
  type: 1 | 2;
  inStock: boolean;
  offerPrice: number;
  price: number;
  products: Array<string>;
  productTag: string;
  urlManager: { url: string };
  assets: Array<{ imageUrl: { ["200x200"]?: string }; name: string }>;
  cms: Array<{
    content: { name: string; subtitle: string };
    attributes?: { shadeLabel: string };
  }>;
  productMeta: {
    isPreOrder: boolean;
    tryItOn: boolean;
    showInParty: boolean;
    allowShadeSelection: boolean;
    tags?: any;
    isTrial?: boolean;
  };
  rating?: { avgRating?: number; totalCount?: number };
};

export type MiniPDPProd = {
  id: string;
  sku: string;
  productTag: string;
  childProductIds?: string | string[];
  mainComboProductId: string;
  mainComboProdOfferPrice: number;
  offerID?: string;
  variantValue?: string;
  upsellKey?: string;
};

export type eventInfo = "apply glammpoints" | "remove glammpoints" | "apply promocode" | "promocode remove";

export type upSellBuckets = Array<{
  min: number;
  max: number;
  slug: string;
}>;

export type productTypes = "products" | "preOrderProducts";

export type shippings = {
  rangeStarts: number;
  rangeEnds: number;
  shippingCharges: number;
  segmentWiseShippingCharges: {
    _id: string;
    tag: string;
    shippingCharge: number;
  }[];
};

export interface ICartUpsellProduct {
  product: any;
  loader?: string;
  handleAddToBag: (product: WidgetProduct) => void;
  openMiniPdpModal: (product: WidgetProduct) => void;
  variantTagsFlag?: string;
  isScrollTogether?:boolean;
  variants?:{
    giftCardUpsellVariant: string,
    glammClubUpsell:  string,
    scrollUpsellRowsTogether: string
  }
}
