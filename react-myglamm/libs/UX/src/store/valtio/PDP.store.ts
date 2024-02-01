import { proxy } from "valtio";

import {
  DecoySubscription,
  PDPBundleProd,
  ProductData,
  PDPFreeProdData,
  PDPOffersData,
  SelectedSubscription,
  CTPProduct,
  CTPUser,
} from "@typesLib/PDP";

type PDPStoreVariants = {
  dynamicOfferVariant?: string;
  pdpRecurringSubscriptionVariant?: string;
  customerAlsoViewedVariant?: string;
  pdpMultiWidgetPopupVariant?: string;
  similarProductsVariant?: string;
  pdpTagsFlagVariant?: string;
  PDPConcernIngredientVariant?: string;
  frequentlyBroughtVariant?: string;
  addOnProductVariant?: string;
  downloadCtaVariant?: string;
  newPDPRevamp?: string;
  widgetonAddtocart?: string;
  similiarProductsTagFilterVariant?: string;
};

export let PDP_VARIANTS: PDPStoreVariants = proxy({});

type PDPStates = {
  pdpOffers: PDPOffersData;
  showBestOffer?: boolean;
  selectedChildProducts?: ProductData[];
  PDPFreeProductData?: PDPFreeProdData;
  selectedDecoyProduct?: DecoySubscription;
  selectedRecurringSubscription?: SelectedSubscription;
  frequentlyBoughtData?: any;
  frequentlyBoughtDataV2?: any;
  bundleProductData?: PDPBundleProd;
  CTP: { ctpProductData?: CTPProduct; userLogs?: CTPUser[] };
  modalStates: {
    similarProductModal?: boolean;
    partnerShipModal?: boolean;
    SubmitReviewModal?: boolean;
    CTPCongratsModal?: boolean;
    videoPopupModal?: boolean;
    shadeSelectionModal?: boolean;
  };
  addOnData: {
    addOnMethod: string;
    showMiniPDPModal: boolean;
    addOnExp: boolean;
    dsKey: string;
    addOnProduct: any;
  };
  prodWidgetData: {
    widgetLogic: string;
    widgetVarint: string;
    widgetShow: boolean;
  };
};

const INIT_PDPSTATES = {
  pdpOffers: {},
  modalStates: {},
  CTP: {},
  addOnData: {
    addOnMethod: "AddOnSelect",
    showMiniPDPModal: false,
    addOnExp: false,
    dsKey: "",
    addOnProduct: {},
  },
  prodWidgetData: {
    widgetLogic: "show",
    widgetVarint: "",
    widgetShow: false,
  },
  selectedChildProducts: [],
};

export let PDP_STATES: PDPStates = proxy(INIT_PDPSTATES);

export const RESET_PDP_STATES = () => {
  const varKeys = Object.keys(PDP_VARIANTS);
  if (varKeys?.length) {
    varKeys.forEach(key => {
      if (key !== "newPDPRevamp") {
        // @ts-ignore
        PDP_VARIANTS[key] = null;
      }
    });
  }

  // PDP_STATES = JSON.parse(JSON.stringify(INIT_PDPSTATES))

  const stateKeys = Object.keys(PDP_STATES);
  if (stateKeys?.length) {
    stateKeys.forEach(key => {
      // @ts-ignore
      if (INIT_PDPSTATES[key] && typeof INIT_PDPSTATES[key] === "object") {
        // @ts-ignore
        PDP_STATES[key] = JSON.parse(JSON.stringify(INIT_PDPSTATES[key]));
      } else {
        // @ts-ignore
        PDP_STATES[key] = INIT_PDPSTATES[key] || {};
      }
    });
  }
};
