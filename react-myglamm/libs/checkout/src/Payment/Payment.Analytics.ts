import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { cartProduct } from "@typesLib/Cart";
import { getCartAdobeProduct } from "../../src/Cart/Analytics";

const getCommonData = () => ({
  common: {
    linkName: "web|order checkout|select payment method",
    linkPageName: "web|order checkout|select payment method",
    ctaName: "Pay Now",
    newLinkPageName: "payment options",
    subSection: "order checkout step4",
    assetType: "select payment method",
    newAssetType: "payment",
    pageLocation: "",
    platform: ADOBE.PLATFORM,
  },
  user: Adobe.getUserDetails(),
});

/**
 * Adobe On-click Event - event165
 */
export const adobeSocketNoMessageEvent = () => {
  let message = "No message received on the socket for more than 5 seconds";
  (window as any).digitalData = getCommonData();
  (window as any).evars.evar35 = message;
  console.error(message);
  Adobe.Click();
};

/**
 * Adobe On-click Event - event166
 */
export const adobePayErrMessageEvent = (msg: string) => {
  (window as any).digitalData = getCommonData();
  (window as any).evars.evar35 = msg;
  console.error(msg);
  Adobe.Click();
};

/**
 * Adobe Page-load Event - ScCheckout
 */
export const adobeScCheckoutEvent = () => {
  if ("adobeDataCartSummary" in localStorage) {
    const adobeCart = getLocalStorageValue("adobeDataCartSummary", true);

    /* scCheckout Event */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|order checkout|checkout",
        newPageName: "checkout",
        subSection: "order checkout step3",
        assetType: "checkout address",
        newAssetType: "checkout address",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      product: adobeCart?.product,
      checkout: adobeCart?.shoppingBag,
    };
  }
};

/**
 * Adobe Page-load Event - Payment Page load
 */
export const adobePaymentLoadEvent = (evar103: string) => {
  if ("adobeDataCartSummary" in localStorage) {
    const adobeCart = getLocalStorageValue("adobeDataCartSummary", true);

    setTimeout(() => {
      (window as any).evars.evar103 = evar103;

      ADOBE_REDUCER.adobePageLoadData = {
        common: {
          pageName: `web|order checkout|select payment method`,
          newPageName: "payment options",
          subSection: "order checkout step4",
          assetType: "select payment method",
          newAssetType: "payment",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        product: adobeCart?.product,
        payment: adobeCart?.shoppingBag,
      };
    }, 800);
  }
};

export const adobeClickEventForConfirmOrder = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|order re confirmation|confirm`,
      linkPageName: `web|order re confirmation|confirm`,
      ctaName: `confirm`,
      newLinkPageName: "order re confirmation",
      subSection: ADOBE.ORDER_RE_CONFIRMATION,
      assetType: "order re confirmation|confirm",
      newAssetType: ADOBE.ORDER_RE_CONFIRMATION,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
    },
  };
  Adobe.Click();
};

export const adobeInitEventPayment = (product: cartProduct, name: string, cta: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|cart summary page|${name}`,
      linkPageName: "web|cart summary page|payment",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: ADOBE.ASSET_TYPE.PAYMENT,
      subSection: "",
      platform: ADOBE.PLATFORM,
      ctaName: cta,
    },

    product: getCartAdobeProduct([product]).product,
  };
  Adobe.Click();
};

export const adobeUnCheckGiftCard = (product: cartProduct) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|GC payment`,
      linkPageName: "web|GC payment|Uncheck",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: "GC payment",
      subSection: "GC payment",
      platform: ADOBE.PLATFORM,
      ctaName: "Uncheck GC",
    },

    product: getCartAdobeProduct([product]).product,
  };
  Adobe.Click();
};

export const adobeKeepGiftCard = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|GC payment`,
      linkPageName: "web|GC payment|Keep Gift card",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: "GC payment",
      subSection: "GC payment",
      platform: ADOBE.PLATFORM,
      ctaName: "Keep Gift card",
    },
  };
  Adobe.Click();
};

export const adobeAddGiftCard = (product: cartProduct, ctaName = 'Check GC') => {
  (window as any).digitalData = {
    common: {
      linkName: `web|GC payment`,
      linkPageName: "web|GC payment|Check",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: "GC payment",
      subSection: "GC payment",
      platform: ADOBE.PLATFORM,
      ctaName,
    },

    product: getCartAdobeProduct([product]).product,
  };
  Adobe.Click();
};

export const adobeCloseGCModal = (product: cartProduct) =>{
  (window as any).digitalData = {
    common: {
      linkName: `web|GC payment`,
      linkPageName: "web|GC payment|Close",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: "GC payment",
      subSection: "GC payment",
      platform: ADOBE.PLATFORM,
      ctaName: "Close GC",
    },

    product: getCartAdobeProduct([product]).product,
  };
  Adobe.Click();
}

export const adobeRemoveGiftCard = (product: cartProduct, ctaName: string) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|GC payment`,
      linkPageName: "web|GC payment|Remove",
      assetType: ADOBE.ASSET_TYPE.PAYMENT,
      newAssetType: ADOBE.ASSET_TYPE.PAYMENT,
      newLinkPageName: "GC payment",
      subSection: "GC payment",
      platform: ADOBE.PLATFORM,
      ctaName,
    },

    product: getCartAdobeProduct([product]).product,
  };
  Adobe.Click();
};
