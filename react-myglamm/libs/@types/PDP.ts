import { AllVendors } from "./APIFilters";

import { freeProductData } from "./Cart";

export interface PDPProd extends ProductData {
  categories: PDPCategory;
  ratings: {
    avgRating: number;
    totalCount: number;
    subRating?: { Colour: number; Longlasting: number; Packaging: number; "Value For Money": number };
  };
  stock: number;
  freeProducts?: freeProductData;
  questions: Array<{
    id: string;
    createdAt: string;
    post: string;
    answer: { createdAt: string; text: string; userImage: string; userName: string };
    userInfo: { userImage: string; userName: string };
  }>;
  reviews: {
    totalCount: number;
    reviewsList: Array<{
      createdAt: string;
      helpfulCountLength: number;
      rating: number;
      reviewContent: string;
      reviewId: string;
      reviewTitle: string;
      reviewerInfo: { firstName: string };
      meta: { images?: [string]; productName: string };
      questionAnswers?: any;
    }>;
  };
  shades: Array<ProductData>;
  childProducts: Array<ProductData>;
  partnerShipData: any;
  questionsCount?: number;
}

export type PDPFreeProdData = { data: { data: ProductData[]; relationalData: any } };

export type PDPCategory = {
  childId: string;
  subChildId: string;
  parentId: string;
  childCategoryName: string;
  subChildCategoryName: string;
  parentCategoryName: string;
  parentSlug: string;
  childSlug: string;
  subChildSlug: string;
};

export type GlobalAsset = {
  id: string;
  type: "image" | "video" | "ogImage";
  url: string;
  imageUrl: { [char in "1200x1200" | "200x200" | "400x400" | "800x800"]: string };
  name: string;
  properties: { imageAltTag?: string; videoId: string; thumbnailUrl: string; title: string; description: string };
};

export type ProductData = {
  assets: Array<GlobalAsset>;
  brand: { name: string };
  id: string;
  inStock: boolean;
  price: number;
  offerPrice: number;
  productTag: string;
  products: string[];
  type: 1 | 2;
  sku: string;
  urlShortner: {
    slug: string;
    shortUrl: string;
    url: string;
    type: string;
  };
  urlManager: { url: string };
  productMeta: {
    isPreOrder: boolean;
    tryItOn: boolean;
    cutThePrice: boolean;
    showInParty: boolean;
    enableSubscriptionText: string;
    sellerId: AllVendors;
    allowShadeSelection: boolean;
    searchText: string[];
    marketplaceRatings?: Array<{ showMarketplaceRating: boolean; totalRatings: number }>;
    tags: Array<{ name: string; ranking: string; rankingName: string }>;
    preOrderDetails: { shortDescription: string; maxOrderQty: number; quantityUsed: number };
    expiryDate?: string;
    productInsightData?: Array<{ colors: Array<{ startIndex: number; color: string; endIndex: number }>; text: string }>;
    isTrial?: boolean;
  };
  tag: {
    list: Array<{ color: string; id: string; name: string }>;
  };
  cms: [
    {
      content: {
        name: string;
        subtitle: string;
        searchText: string[];
        whatIsIt: string;
        seoFaq: any;
        faq: string;
        finerDetails?: any;
        productDetails?: any;
        provenResults?: any;
        keyBenefits?: any;
        testimonials?: any;
      };
      attributes: { shadeImage: string; shadeLabel: string; shadeThumbnail: string; concern: string; ingredient: string };
      metadata: {
        title: string;
        description: string;
        keywords: string;
        canonicalTag: string;
        ogTitle: string;
        ogDescription: string;
        noIndex: boolean;
      };
    }
  ];
};

export type PDPOffersData = {
  couponList?: PDPCouponList[];
  decoyPricing?: DecoySubscription[];
  addOnProducts?: any;
};

export type PDPCouponList = {
  couponCode: string;
  couponDescription: string;
  couponOfferType: "Price Discount";
  offerText: string;
  selected: boolean;
  payableAmount: number;
  discountAmount: number;
  appDownload?: string;
  offerFrom: "DS" | "BACKEND";
};

export type DecoySubscription = {
  id: string;
  offerPrice: number;
  price: number;
  quantity: number;
  showBestOffer: boolean;
  tag: Array<string>;
  unitOfferPrice: number;
  subscriptionsFrequencies?: SubscriptionFrequency[];
};

export type SubscriptionFrequency = {
  discountLabel: string;
  frequency: string;
  id: string;
  order: number;
  offerPrice: number;
  showBestOffer: boolean;
  subscriptionSubtitle: string;
  subscriptionTitle: string;
  unitOfferPrice: number;
  tag: Array<string>;
};

export type SelectedSubscription = {
  quantity: number;
  decoyPriceId: string;
  subscriptionId: string;
  frequency: string;
};

export type PDPBundleProd = {
  productData: ProductData;
  relationalData: any;
  CTA: string;
  bundleImg: string;
};

export type PDPOffersWidget = { imgSrc: string; text: string };

export type PDPNewChildProducts = PDPNewChildProduct[];

export type PDPNewChildProduct = { productDetails: ProductData[] };

export interface PDPPage {
  isBot: boolean;
  PDPProduct: PDPProd;
  errorCode?: number;
  PDPWidgets: {
    offers: PDPOffersWidget[];
    footerBanners: any;
    flashSale: any;
    newPDPWidget: any;
  };
  enableNewPDP?: boolean;
}

export type BreadCrumbData = { name: string; slug?: string };

export type PDPCarouselSlides = { type: string; alt?: string; src?: string; item: GlobalAsset }[];

export type CTPData = { ctpProductData: CTPProduct; userLogs: CTPUser[] };

export type CTPProduct = {
  createdAt: string;
  ctpExpiryTime: string;
  gameExpiryTime: string;
  point: number;
  startTime: string;
  _id: string;
  statusId: number;
};

export type CTPUser = {
  phoneNumber: string;
  point: number;
  statusId: number;
  createdAt: string;
};
