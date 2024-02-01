import Adobe from "@libUtils/analytics/adobe";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

import { adobeProduct, cartFreeProduct, cartProduct, productCategory, userCart, WidgetProduct } from "@typesLib/Cart";

import { ADOBE } from "@libConstants/Analytics.constant";

import { checkUserLoginStatus } from "../Storage/HelperFunc";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import format from "date-fns/format";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { paymentSuggestion } from "@typesLib/Redux";
import { UserAddress } from "@typesLib/Consumer";
import { GAOfferApplied } from "@libUtils/analytics/gtm";
import Router from "next/router";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

/**
 * Generates Common Digital Data
 * @param cart userCart
 * @param commonObj common from digitalData
 * @returns Common Adobe Digital Data used for Cart Pageload, Apply Promo and Glammpoints
 */
export const getCartAdobeDigitalData = (cart: userCart, commonObj?: any) => {
  console.log("cart", cart);
  let common = {
    pageName: `web|cart summary page|shopping bag`,
    subSection: "cart summary page",
    newPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
    assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
    newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
    platform: ADOBE.PLATFORM,
    pageLocation: "",
    technology: ADOBE.TECHNOLOGY,
  };
  /* If CommonData received reassignedd common */
  if (commonObj) common = commonObj;

  /* Generating Products Adobe Data */
  const { product, gmv, mrp, stockStatus } = getCartAdobeProduct(cart.allProducts);

  /* Generating Shipping-Bag Adobe Data */
  const shoppingBag = {
    gmv,
    mrp,
    stockStatus,
    netPayable: cart.payableAmount,
    numberOfProducts: cart.productCount,
    GWP: cart.gwpProducts[0]?.productTag || "",
    glammPointsApplied: cart.appliedGlammPoints,
    couponCode: cart.couponData?.couponCode || "",
    cartDiscount: cart.couponData?.userDiscount || 0,
    offerAvailable: cart.discounts?.id ? "Yes" : "No",
    shippingCharges: cart.shippingCharges || 0,
  };

  setLocalStorageValue("adobeDataCartSummary", { common, product, shoppingBag, user: Adobe.getUserDetails() }, true);

  return { common, product, shoppingBag };
};

/**
 * Use for Product Repsonse received by Elastic Search
 * @param products Cart Free Products
 * @returns Array of Custom Object Required by Adobe
 */
export const getAdobeProduct = (products: Array<cartFreeProduct>) =>
  products.map(prod => ({
    productSKU: prod.sku,
    productQuantity: 1,
    productOfferPrice: formatPrice(prod.offerPrice),
    productPrice: formatPrice(prod.price),
    productDiscountedPrice: formatPrice(prod.price - prod.offerPrice),
    productRating: "",
    productTotalRating: "",
    stockStatus: prod.inStock ? "yes" : "no",
    isPreOrder: prod.productMeta?.isPreOrder ? "yes" : "no",
    PWP: "",
    hasTryOn: prod.productMeta?.tryItOn ? "yes" : "no",
  }));

/**
 * Use for Product Repsonse received by cart-ms
 * @param products Cart Products
 * @returns Array of Custom Object Required by Adobe
 */
export const getCartAdobeProduct = (products: Array<cartProduct>) => {
  console.log("products", products);
  let gmv = 0;
  let mrp = 0;
  const product: Array<adobeProduct> = [];

  const outOfStock = "out of stock";
  const stockStatus = products.find(x => x?.errorMessage?.includes(outOfStock)) ? outOfStock : "in stock";

  products?.forEach(prod => {
    const isFree = prod?.cartType !== 1 && prod?.cartType !== 3;

    gmv += formatPrice(prod?.totalPrice) as number;
    if (!isFree) {
      mrp += formatPrice(prod?.totalPrice) as number;
    }

    product.push({
      productSKU: prod.sku,
      productQuantity: prod.quantity,
      productOfferPrice: isFree ? 0 : (formatPrice(prod.price) as number),
      productPrice: formatPrice(prod.totalPrice) as number,
      productDiscountedPrice: (isFree ? formatPrice(prod.totalPrice) : formatPrice(prod.totalPrice - prod.price)) as number,
      productRating: "",
      productTotalRating: "",
      stockStatus: prod.errorMessage?.includes(outOfStock) ? "yes" : "no",
      isPreOrder: prod.productMeta?.isPreOrder ? "yes" : "no",
      PWP: prod.freeProducts?.[0]?.productTag || "",
      hasTryOn: prod.productMeta?.tryItOn ? "yes" : "no",
    });
  });

  return { product, gmv, mrp, stockStatus };
};

/**
 * Use for Product Repsonse received by Elastic Search
 * @returns Array of Custom Object Required by GA Webengage
 */
export const getGAProduct = (product: WidgetProduct, category?: any, isFreeProduct = false) => {
  let strBundleName = "";
  let strProductName = "";

  if (product.type === 2) {
    strBundleName = product.cms?.[0]?.content?.name;
  } else {
    strProductName = product.cms?.[0]?.content?.name;
  }

  return {
    bundleName: strBundleName || "",
    outOfStock: !product.inStock,
    preOrder: product.productMeta?.isPreOrder,
    currency: getCurrency(),
    discounted: product.offerPrice < product.price,
    inStock: product.inStock,
    price: formatPrice(product.price),
    offerPrice: formatPrice(product.offerPrice),
    productName: strProductName || "",
    productSubCategoryName: product.productTag,
    productSKU: product.sku,
    starRating: "",
    userType: checkUserLoginStatus() ? "Member" : "Guest",
    virtualTryOn: false,
    productURL: product.urlManager?.url,
    productImageURL: product?.assets?.find((x: any) => x.type === "image")?.imageUrl["200x200"] || "",
    primaryCategory: category || "",
    freeGiftWithProduct: false,
    inviteCode: "",
    shade: product?.cms?.[0]?.attributes?.shadeLabel || "",
    type: product?.productMeta?.showInParty ? "Party" : "Normal",
    isFreeProduct: isFreeProduct,
    isTrial: product?.productMeta?.isTrial || "",
    showingTrialProduct: getSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU) === product?.sku,
  };
};

/**
 * Initiate Webenage Cart View Event
 * @param cart User Cart
 */
export function GACartViewEvent(cart: userCart) {
  let fGrossOrderAmount = 0;
  let fMrpRegularProduct = 0;
  let fOfferPriceDiscount = 0;
  let fInternalOfferAmount = 0;
  let fAdditionalDiscount = 0;
  const arrWebengageItems: any = [];
  const arrWebengageItemsV2: any = [];
  let strWebengageProductsString = "";
  let category = "";

  /* Generating Product and Pricing Data for GA Webengage */
  cart.allProducts.forEach((product: cartProduct, index) => {
    const isFree = product.cartType !== 1 && product.cartType !== 3;

    if (product?.productCategory) {
      const categoryIndex = product?.productCategory?.findIndex((x: any) => x.type === "parent");
      category = product?.productCategory[categoryIndex]?.name;
    }

    const productObj = {
      "Product Quantity": product.quantity,
      "Product Id": product.productId,
      "Product SKU": product.sku,
      "Product Name": product.name,
      "Product Is Free": isFree,
      "Product Is Pre Order": product.productMeta?.isPreOrder,
      "Product Price": isFree ? 0 : formatPrice(product.totalPrice),
      "Product Category Parent":
        product.productCategory?.filter((category: productCategory) => category.type === "parent")?.[0]?.name ?? "",
      "Product Category Child":
        product.productCategory?.filter((category: productCategory) => category.type === "child")?.[0]?.name ?? "",
      "Product Category subChild":
        product.productCategory?.filter((category: productCategory) => category.type === "subChild")?.[0]?.name ?? "",
      brand: product.brandName,
      discount: product.totalPrice - product.priceAfterCouponCodePerQuantity,
      index,
      "Product Shade Label": product.shadeLabel,
      "Product Is Trial": product.productMeta?.isTrial || "",
      "Product showingTrialProduct": getSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU) === product?.sku,
    };

    arrWebengageItems.push(productObj);

    arrWebengageItemsV2.push({
      ...productObj,
      "Product ImageURL": product.imageUrl,
      "Product URL": product.slug,
      "Product Category": category,
    });

    strWebengageProductsString += `${product.name},`;

    // Gross Order Amount Calculation
    fGrossOrderAmount += formatPrice(product.totalPrice) as number;

    if (!isFree) {
      // MRP Regular Product.
      fMrpRegularProduct += formatPrice(product.totalPrice) as number;
      // Offer Price Discount
      fOfferPriceDiscount += formatPrice(product.totalPrice - product.price) as number;
      fInternalOfferAmount += formatPrice(product.price) as number;
    } else {
      // Additional Dicount
      fAdditionalDiscount += formatPrice(product.totalPrice) as number;
    }
  });

  // Order Amount
  const fOrderAmount = fInternalOfferAmount - (cart.couponData?.userDiscount || 0);
  // webenage datalayer object
  const webengageDataLayer = {
    userType: checkUserLoginStatus() ? "Member" : "Guest",
    items: arrWebengageItems,
    productNames: strWebengageProductsString.slice(0, -1),
    numberOfItems: cart.productCount || 0,
    preOrder: !!cart.products.find(x => x.productMeta?.isPreOrder),
    eligibleForCartOffer: !!(cart.gwpProducts.length || cart.discounts?.id),
    gwp: !!cart.gwpProducts.length,
    pwp: !!cart.pwpProducts.length,
    couponCode: cart.couponData?.couponCode || "",
    cartValue: cart.payableAmount || 0,
    grossOrderAmount: fGrossOrderAmount,
    mrpRegularProducts: fMrpRegularProduct,
    offerPriceDiscount: fOfferPriceDiscount,
    orderAmount: fOrderAmount,
    additionalDiscount: fAdditionalDiscount,
    discount: cart.couponData?.userDiscount || 0,
    glammPointsApplied: cart.appliedGlammPoints || 0,
    netOrderAmount: fOrderAmount - (cart.appliedGlammPoints || 0),
    mrpFreeProducts: fAdditionalDiscount,
    webengageItemsV2: arrWebengageItemsV2,
    shippingCharges: cart.shippingCharges || 0,
  };

  /* WebEngage [13]- Order Placed : Save Cart details in LS */
  if (typeof window !== "undefined") {
    localStorage.setItem("webengageCartDetails", JSON.stringify({ cart: webengageDataLayer }));
  }

  return webengageDataLayer;
}

// #region // *WebEngage [17] - Product Removed From Cart
export function GARemoveProduct(product: cartProduct) {
  let category = "";

  if (product?.productCategory) {
    const categoryIndex = product?.productCategory?.findIndex((x: any) => x.type === "parent");
    category = product?.productCategory[categoryIndex]?.name;
  }

  return {
    bundleName: "",
    id: product.sku,
    currency: getCurrency(),
    price: formatPrice(product.totalPrice),
    offerPrice: formatPrice(product.price),
    isFreeProduct: product.cartType !== 1 && product.cartType !== 3,
    outOfStock: !!product.errorMessage?.includes("out of stock"),
    preOrder: product.cartType === 3,
    productSKU: product.sku,
    productName: product.name,
    productSubCategoryName: product.productTag || "",
    userType: checkUserLoginStatus() ? "Member" : "Guest",
    productImageURL: product.imageUrl,
    productURL: product.slug || "",
    primaryCategory: category,
  };
}

// #region // *WebEngage [16] - Product Add To Cart - PDP Page : GA Function
export const GAAddProduct = (addedProduct: WidgetProduct, category?: any, freeProduct = false, upsellHeading?: string) => {
  const webengage: any = getGAProduct(addedProduct, category, freeProduct);

  const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
  if (fbEventId) {
    webengage["eventID"] = fbEventId;
  }

  return { ...addedProduct, webengage, upsellHeading };
};

export const getGAProductCart = (products: cartProduct[]) => {
  return products.map(prod => {
    let strProductName = "";
    let strBundleName = "";
    let category = "";

    if (prod.type === 2) {
      strBundleName = prod?.name;
    } else {
      strProductName = prod?.name;
    }

    if (prod?.productCategory) {
      const categoryIndex = prod?.productCategory?.findIndex((x: any) => x.type === "child");
      category = prod.productCategory[categoryIndex]?.name;
    }

    return {
      id: prod.productId,
      bundleName: strBundleName || "",
      currency: getCurrency(),
      freeGiftWithProduct: false,
      inviteCode: "",
      preOrder: prod?.productMeta?.isPreOrder,
      price: formatPrice(prod.price),
      productName: strProductName || "",
      productSKU: prod.sku,
      productSubCategoryName: prod.productTag,
      shade: prod?.shadeLabel || "",
      type: "Normal",
      userType: checkUserLoginStatus() ? "Member" : "Guest",
      isFreeProduct: prod.cartType !== 1 && prod.cartType !== 3,
      offerPrice: formatPrice(prod.offerPrice),
      productType: prod.type,
      productImageURL: prod?.imageUrl,
      productURL: prod.slug || "",
      primaryCategory: category,
    };
  });
};

export function GAUpsellMiniDPDLoad(activeProduct: any, relationalData: any) {
  let category = "";
  let categoryId = "";
  let subCategory = "";

  let tags: any = [];
  const { list } = activeProduct?.tag || [];

  if (list?.length > 0) {
    list.map((tag: any) => {
      tags.push(tag.name);
      tags.push(`${tag.name}-${format(new Date(), "ddMMyy")}`);
    });
  }

  if (relationalData?.categories) {
    categoryId = activeProduct?.categories?.find((x: any) => x.type === "child")?.id;
    category =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
    subCategory =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content.name;
  }

  // GA : GTM , FBPixel Object required for Page Load Event & AddToBag Event

  const GAobj = {
    name: activeProduct.cms[0]?.content?.name || "",
    id: activeProduct.sku,
    price: formatPrice(activeProduct.price),
    brand: "myglamm",
    category,
    variant: "",
    "Logged in": 0,
    "Product ID": activeProduct.sku,
    "Stock Status": `${activeProduct.inStock ? 1 : 0}`,
    "Selling Price": formatPrice(activeProduct.offerPrice),
    "Product category ID": categoryId,
    "Product SKU": activeProduct.sku,
    "Entry Location": window?.location?.href,
    MRP: formatPrice(activeProduct.price),
  };

  const GAPageViewObject: any = {
    product: GAobj,
    webengage: getGAProduct(activeProduct),
  };

  GAPageViewObject.webengage["tags"] = tags;

  return { GAPageViewObject, category, subCategory };
}

/**
 * @description Adobe Upsell click event which was triggering on upsell strip
 *              now this event will fire on add to bag click along with add to bag event
 */
export const upsellClickEvent = (userProfile: any, cart: any) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|upsell`,
      linkPageName: "upsell",
      ctaName: `upsell top - ${cart.shippingCharges ? "free shipping" : "cart upsell"}`,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
    },
    user: Adobe.getUserDetails(userProfile),
  };
  Adobe.Click();
};

/**
 * @description - Adobe Upsell add to bag event
 * @param product
 */
export const upsellAddToBagClickEvent = (product: any, upsellTitle: string, upsellKey?: string) => {
  setTimeout(() => {
    (window as any).digitalData = {
      common: {
        linkName: `web|${upsellKey || "upsell"}`,
        linkPageName: upsellKey || "upsell",
        ctaName: "add to bag",
        newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        subSection: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        source: SOURCE_STATE?.addToBagSource || "other",
      },
      user: Adobe.getUserDetails(),
      product: getAdobeProduct([product]),
      dsRecommendationWidget: {
        title: upsellTitle || "upsell",
      },
    };
    Adobe.Click();
  }, 500);
};

/**
 * @description - Adobe Upsell Tag Click event
 * @param categoryTag
 */

export const upsellTagClickEvent = (userProfile: any, categoryTag: any) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|upsell`,
      linkPageName: "web|cart summary page",
      ctaName: categoryTag,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
    },
    user: Adobe.getUserDetails(userProfile),
  };
  Adobe.Click();
};

/**
 * @description Adobe Upsell click event which was triggering on upsell strip
 *              now this event will fire on add to bag click along with add to bag event
 */

// progressbarMilestoneUpsellLabel: if contains data, Triggered from AB progress bar popup upsell addToBag.
export const upsellClickV2Event = (userProfile: any, cart: any, progressbarMilestoneUpsellLabel?: any) => {
  (window as any).digitalData = {
    common: {
      linkName: progressbarMilestoneUpsellLabel ? `web|progress bar popup upsell` : `web|Upsell`,
      linkPageName: progressbarMilestoneUpsellLabel ? `progress bar popup upsell` : "Upsell",
      ctaName: `Upsell`,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
    },
    user: Adobe.getUserDetails(userProfile),
  };
  Adobe.Click();
};

//  Promo Code Apply failed

export const promoCodeFailedAdobeEvent = (errorMessage?: string, couponCode?: string) => {
  (window as any).evars.evar35 = errorMessage;
  (window as any).evars.evar21 = couponCode;

  (window as any).digitalData = {
    common: {
      linkName: "web|cart summary page|Apply Promo code failed",
      linkPageName: "web|cart summary page",
      assetType: "Apply Promo Code",
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: "cart summary page",
      platform: ADOBE.PLATFORM,
      ctaName: "promocode apply",
    },
    offer: {
      couponCode,
    },

    user: Adobe.getUserDetails(),
  };

  Adobe.Click();
};

export const adobeEventForSuggestedPayments = (
  suggestedPaymentsVariant: string,
  suggestedPaymentsList?: paymentSuggestion[],
  shippingAddress?: UserAddress
) => {
  if (suggestedPaymentsVariant === "1") {
    if ((suggestedPaymentsList as paymentSuggestion[])?.length > 0 && shippingAddress?.id) {
      (window as any).evars.evar163 = `${suggestedPaymentsVariant}|suggestions:true`;
      dispatchEvent(new CustomEvent("suggestedPayments"));
    } else {
      (window as any).evars.evar163 = `${suggestedPaymentsVariant}|suggestions:false`;
      dispatchEvent(new CustomEvent("suggestedPayments"));
    }
  } else if (suggestedPaymentsVariant === "0") {
    (window as any).evars.evar163 = "0";
    dispatchEvent(new CustomEvent("suggestedPayments"));
  } else {
    dispatchEvent(new CustomEvent("suggestedPayments"));
  }
};

export const adobeEventsForNewComboUI = (products: cartProduct[], variant: string) => {
  products.forEach((product: cartProduct) => {
    if (product.childProducts.length > 0) {
      (window as any).evars.evar166 = `${variant}-true`;
      dispatchEvent(new CustomEvent("showNewComboUI"));
    } else {
      (window as any).evars.evar166 = `${variant}-false`;
      dispatchEvent(new CustomEvent("showNewComboUI"));
    }
  });
};

// Adobe Analytics(15) - On Click Shopping Bag - Apply GlammPOINTS
export const analyticsPrmoCode = (cartData: userCart) => {
  if (cartData.productCount) {
    const common = {
      linkName: `web|cart summary page|shopping bag|${
        Router.pathname === "/shopping-bag" ? "shopping-bag-promocode-success" : "apply promocode-success"
      }`,
      linkPageName: "web|cart summary page|shopping bag-new",
      assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: "order checkout step3",
      platform: ADOBE.PLATFORM,
      ctaName: "promocode apply success",
    };

    const adobeData = {
      ...getCartAdobeDigitalData(cartData, common),
      user: Adobe.getUserDetails(),
    };
    (window as any).digitalData = adobeData;
    Adobe.Click();

    // #region // *WebEngage [12] - Offer Applied
    const offerApplied = {
      applied: true,
      code: cartData.couponData?.couponCode,
      codeType: "Coupon",
      offerAmount: cartData.couponData?.userDiscount || 0,
      userType: checkUserLoginStatus() ? "Member" : "Guest",
      valid: true,
    };
    GAOfferApplied(offerApplied);
  }
};
export const adobeEventForEditOrder = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|order re confirmation|edit`,
      linkPageName: `web|order re confirmation|edit`,
      ctaName: `edit`,
      newLinkPageName: "order re confirmation|edit",
      subSection: ADOBE.ORDER_RE_CONFIRMATION,
      assetType: "order re confirmation|edit",
      newAssetType: ADOBE.ORDER_RE_CONFIRMATION,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
    },
  };
  Adobe.Click();
};

export const adobeEventForOrderReConfirmationScreen = () => {};
