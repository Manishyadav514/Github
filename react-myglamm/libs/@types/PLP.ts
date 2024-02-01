export type PLPSSRStates = {
  products: Array<Array<any>>;
  navTabs: ArrayOfTABS;
  activeTab: number;
  priceBucket: Array<{ priceOffer: { between: Array<number> } }>;
  filterTags: Array<any>;
  selectedTags: { [char: string]: string[] };
  brandsList: FilterRow[];
  productCount: number;
  categoryMeta?: metaSEO;
  page: number;
  skip: number;
  widgets: any;
  sort?: any;
  campaignWidget: any;
  errorCode: 404 | 500;
  isServer: boolean;
  widgetPLPData: any;
  appliedFilters: {
    pricesApplied: Array<{ priceOffer: { between: Array<number> } }>;
    brandsApplied: Array<FilterRow>;
    categoriesApplied: Array<string>;
  };
};

export type PLPStates = {
  activeTab: number;
  navTabs: ArrayOfTABS;
  priceBucket: Array<{ priceOffer: { between: Array<number> } }>;
  selectedTags: { [char: string]: string[] };
  skip: number;
  sorting?: sortingType;
  hasNextPage: boolean;
  page: number;
  appliedFilters: {
    pricesApplied: Array<{ priceOffer: { between: Array<number> } }>;
    brandsApplied: Array<FilterRow>;
    categoriesApplied: Array<string>;
  };
};

export type SearchPLPStates = {
  priceBucket: Array<{ priceOffer: { between: Array<number> } }>;
  selectedTags: { [char: string]: string[] };
  sorting: sortingType;
  appliedFilters: {
    pricesApplied: Array<{ priceOffer: { between: Array<number> } }>;
    brandsApplied: Array<FilterRow>;
    categoriesApplied: Array<string>;
  };
};

export type sortingType = "priceOffer ASC" | "priceOffer DESC" | "offerPrice DESC" | "offerPrice ASC";

export type metaSEO = {
  id: string;
  cms: [
    {
      metadata: {
        title: string;
        keywords: string;
        description: string;
        pageDescription: string;
        canonicalTag: string;
        noIndex: boolean;
      };
      content: { faq: string; name: string; seoFaq?: any };
    }
  ];
  meta?: any;
};

export type APIStates = {
  productCount: number;
  products: Array<Array<any>>;
};

export type TAB = { url: string; label: string; subCatURL?: string; isBrand?: boolean };
export type ArrayOfTABS = Array<TAB>;

export type StateActionTypes =
  | "CHANGE_TAB"
  | "APPLY_FILTER"
  | "APPLY_FILTERS"
  | "SORT_PRODUCTS"
  | "GET_MORE_PRODUCTS"
  | "CHANGE_PAGE"
  | "SSR_CHANGE";

export type PLPActions = {
  type: StateActionTypes;
  payload?: any;
};

export type APIActionTypes = "MORE_PRODUCTS" | "NORMAL_STORE_DATA" | "SSR_CHANGE";

export type APIActions = {
  type: APIActionTypes;
  payload: {
    count: number;
    skipProd?: number;
    updatedProductData: Array<Array<any>>;
  };
};

export type PlpProductWhere = {
  [char: string]: { inq: Array<string> } | string | string[];
  // @ts-ignore
  or?: Array<{ priceOffer: { between: Array<number> } }>;
};

export type FilterParams = {
  where: { where?: PlpProductWhere; order?: [sortingType] };
  order?: Array<string>;
  navTabs?: ArrayOfTABS;
  relatedData: {
    index?: number;
    skipProd?: number;
    brandsData?: PLPFilterRow;
    priceRange?: Array<{ priceOffer: { between: Array<number> } }>;
    categoryL3?: Array<string>;
    sort?: sortingType;
    appliedTags?: { [char: string]: Array<string> };
  };
  widgetPLPData?: any;
  products?: Array<any>;
  variant?: string;
};

export type PLPProduct = {
  SKU: string;
  URL: string;
  imageAltTag: string;
  imageURL: string;
  meta: {
    discountPercentage: number;
    isFreeProduct?: boolean;
    isPreProduct: boolean;
    shadeCount: number;
    inStock: boolean;
    tryItOn: boolean;
    isNewLaunchTag?: boolean;
    isOfferAvailable?: boolean;
    cutThePrice?: boolean;
    preOrderDetails?: {
      expectedDeliveryDate?: string;
      shortDescription?: string;
      maxOrderQty: number;
      allowInviteCode?: boolean;
      quantityUsed: number;
      maxQtyAllowedInCart?: number;
    };
    tags?: Array<any>;
    memberTypeLevel?: Array<any>;
  };
  productType: number;
  priceMRP: number;
  priceOffer: number;
  productId: string;
  productName: string;
  productSubtitle: string;
  shadeLabel: string;
  productTag: string;
  rating: { avgRating: number; totalCount: number };
  shades: PLPProductShades;
  category?: string;
  subCategory: string;
  parentCategory?: string;
  urlManager?: { url: string };
  partnershipPayableAmount?: number;
  partnershipDiscountAmount?: number;
  subscription?: {
    sku: string;
    productId: string;
    decoyPricing: any[];
    couponList: subCoupon[];
    addOnProducts: any[];
  };
};

export type subCoupon = {
  couponCode: string;
  couponDescription: string;
  couponOfferType: string;
  payableAmount: number;
  discountAmount: number;
  endDate: string;
  offerText: string;
  offerFrom: string;
};

export type PLPProductShades = Array<{
  shadeLabel: string;
  slug: string;
  shadeImage: string;
  inStock: boolean;
  isPreOrder: boolean;
  productId: string;
  productImage: string;
  priceOffer: number;
  priceMRP: number;
}>;

export type PLPFilterParentRow = Array<{
  id: string;
  name: string;
  slug: string;
  isSelected: boolean;
  childCategories: PLPFilterRow;
}>;

export type PLPFilterRow = FilterRow[];

export type FilterRow = {
  id: string;
  name: string;
  slug: string;
  isSelected: boolean;
  productCount?: number;
  meta?: any;
};


export type DsProducts = {
  SKU: string;
  productId: string;
  productName: string | undefined;
  priceOffer: number;
  productTag: string | undefined;
  productSubtitle: string | undefined;
  priceMRP: number | undefined;
  shadeLabel: string | undefined;
  imageAltTag: string | undefined;
  imageURL: string | undefined;
  URL: string | undefined;
  urlManager: {
    url: string | undefined;
  };
  category: string;
  subCategory: string;
  parentCategory: string;
  productType: string | undefined;
  meta: {
    shadeCount: number;
    inStock: boolean;
  };
  shades: any[];
  rating: number;
  subscription: {};
}