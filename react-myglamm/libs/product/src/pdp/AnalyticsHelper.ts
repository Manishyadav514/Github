import format from "date-fns/format";

import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import Router from "next/router";
import { cartProduct } from "@typesLib/Cart";

import Adobe from "@libUtils/analytics/adobe";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { PDPProd, ProductData } from "@typesLib/PDP";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { GAProductReviewSubmitted } from "@libUtils/analytics/gtm";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

export const adobeCarouselEvent = (product: PDPProd) => {
  const { categories, productTag } = product;

  (window as any).digitalData = {
    common: {
      assetType: "product",
      ctaName: "Image view",
      linkName: `web|${categories.childCategoryName} - ${categories.subChildCategoryName}|production description page|Image view`,
      linkPageName: `web|${categories.subChildCategoryName}|${productTag}|production description page`,
      newAssetType: "product",
      newLinkPageName: `${productTag}|product description page`,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: `${categories.childCategoryName} - ${categories.subChildCategoryName}`,
    },

    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const setAdobeEvarCustom = (dataExists: boolean, variant: string, evarName: string, text: string) => {
  if (dataExists) {
    (window as any).evars[evarName] = `${variant}- ${text}`;
  }
};

export const pdpAdobePageLoad = (product: PDPProd, ChildProducts: ProductData[]) => {
  const { categories, ratings, freeProducts, productMeta } = product;

  let stockAvailablityStatus;
  try {
    stockAvailablityStatus = ChildProducts?.some((shade: any) => !shade.inStock);
  } catch (error) {
    console.error(`An error occurred in .some line: ${error} ChildProducts ${JSON.stringify(ChildProducts)} `);
    stockAvailablityStatus = undefined;
  }

  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: `web|${product?.productMeta?.cutThePrice ? "cut the price|" : ""}${categories.childCategoryName} - ${
        product.productTag
      }|product description page`,
      newPageName: "product description",
      subSection: `${categories.childCategoryName} - ${categories.subChildCategoryName}`,
      assetType: "product",
      newAssetType: "product",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
      source: SOURCE_STATE?.pdpSource || "other",
      widgetEntry: "scroll",
    },
    product: [
      {
        productSKU: product.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(product.offerPrice),
        productPrice: formatPrice(product.price),
        productDiscounte: formatPrice(product.price - product.offerPrice),
        productRating: ratings?.avgRating,
        productTotalRating: ratings?.totalCount,
        stockStatus: `${
          product?.type === 1 && stockAvailablityStatus
            ? "in stock"
            : "out of stock" || product.inStock
            ? "in stock"
            : "out of stock"
        }`,
        isPreOrder: `${product.productMeta.isPreOrder ? "yes" : "no"}`,
        PWP: freeProducts?.ids?.[0] || "",
        hasTryOn: productMeta.tryItOn ? "yes" : "no",
      },
    ],
  };
};

export const viewDetaisAddOnClickEvent = (event: string) => {
  (window as any).digitalData = {
    common: {
      linkName: "web|PDP add-on",
      linkPageName: `web|PDP add-on| ${event}`,
      ctaName: `${event} addon gc`,
      newLinkPageName: "PDP add-on",
      subSection: "PDP add-on",
      assetType: "product",
      newAssetType: "product",
      pageLocation: "Product Description Page",
      pageName: `web|product description page`,
      newPageName: "product description page",
      source: SOURCE_STATE?.pdpSource || "other",
      widgetEntry: "scroll",
      platform: ADOBE.PLATFORM,
      technology: ADOBE.TECHNOLOGY,
    },

    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const onAdobeChangeShade = (product: any) => {
  const isShoppingBag = Router.pathname === "/shopping-bag";
  const adobeEventName = isShoppingBag ? ADOBE.ASSET_TYPE.SHOPPING_BAG : ADOBE.ASSET_TYPE.PDP;

  const digitalData = {
    common: {
      pageName: `web|${isShoppingBag ? "shopping bag" : "product description page"}|change shade`,
      newPageName: "change shade",
      subSection: adobeEventName,
      assetType: adobeEventName,
      newAssetType: adobeEventName,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
      source: SOURCE_STATE?.pdpSource || "other",
    },
    product: [
      {
        productSKU: product.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(product.offerPrice),
        productPrice: formatPrice(product.price),
        productDiscounte: formatPrice(product.price - product.offerPrice),
        productRating: "",
        productTotalRating: "",
        stockStatus: "in stock",
        isPreOrder: "no",
        PWP: "",
        hasTryOn: "no",
      },
    ],
  };

  ADOBE_REDUCER.adobePageLoadData = digitalData;
};

export const adobeClickShadeChange = (product: cartProduct) => {
  const type = Router.pathname === "/shopping-bag" ? "shopping bag" : "product description page";

  (window as any).digitalData = {
    common: {
      linkName: `web|${type}|change shade`,
      linkPageName: `web|${type}|change shade`,
      newLinkPageName: "change shade",
      assetType: type,
      newAssetType: type,
      subSection: type,
      platform: ADOBE.PLATFORM,
      ctaName: "change shade",
      pageLocation: "",
    },
    product: [
      {
        productSKU: product.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(product.offerPrice),
        productPrice: formatPrice(product.price),
        productDiscounte: formatPrice(product.price - product.offerPrice),
        productRating: "",
        productTotalRating: "",
        stockStatus: "in stock",
        isPreOrder: "no",
        PWP: "",
        hasTryOn: "no",
      },
    ],
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const adobeShadeChangeSuccess = (product: cartProduct) => {
  const type = Router.pathname === "/shopping-bag" ? "shopping bag" : "product description page";
  (window as any).digitalData = {
    common: {
      linkName: `web|${type}|change shade success`,
      linkPageName: `web|${type}|change shade success`,
      newLinkPageName: "change shade success",
      assetType: type,
      newAssetType: type,
      subSection: type,
      platform: ADOBE.PLATFORM,
      ctaName: "change shade success",
      pageLocation: "",
    },
    product: [
      {
        productSKU: product.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(product.offerPrice),
        productPrice: formatPrice(product.price),
        productDiscounte: formatPrice(product.price - product.offerPrice),
        productRating: "",
        productTotalRating: "",
        stockStatus: "in stock",
        isPreOrder: "no",
        PWP: "",
        hasTryOn: "no",
      },
    ],
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const getGAPageViewObject = (product: PDPProd) => {
  const { cms, assets, urlShortner, categories, productMeta, stock } = product;

  const tags: string[] = [];
  const { list } = product.tag || {};

  if (list.length > 0) {
    list.map((tag: any) => {
      tags.push(tag.name);
      tags.push(`${tag.name}-${format(new Date(), "ddMMyy")}`);
    });
  }

  const GAobj: any = {
    name: cms[0]?.content.name,
    id: product.sku,
    price: formatPrice(product.price),
    offerPrice: formatPrice(product.offerPrice),
    brand: product?.brand?.name,
    category: categories.childCategoryName,
    variant: "",
    "Logged in": 0,
    "Product ID": product.sku,
    "Stock Status": `${product.inStock ? 1 : 0}`,
    "Selling Price": formatPrice(product.offerPrice),
    "Product category ID": categories.childId,
    "Product SKU": product.sku,
    "Entry Location": window.location?.href,
    MRP: formatPrice(product.price),
  };
  // #region // *WebEngage [19] - Product View
  let strProductName = "";
  let strBundleName = "";
  if (product.type === 2) {
    strBundleName = cms[0]?.content.name;
  } else {
    strProductName = cms[0]?.content.name;
  }

  const WebEngageObj: any = {
    bundleName: strBundleName || "",
    outOfStock: product.inStock,
    preOrder: productMeta?.isPreOrder,
    currency: getCurrency(),
    discounted: product.offerPrice < product.price,
    inStock: product.inStock,
    price: formatPrice(product.price),
    offerPrice: formatPrice(product.offerPrice),
    productName: strProductName || "",
    productSubCategoryName: product.productTag,
    productSKU: product.sku,
    starRating: product?.ratings?.avgRating,
    userType: checkUserLoginStatus() ? "Member" : "Guest",
    virtualTryOn: false,
    productURL: urlShortner?.slug,
    productImageURL: assets?.find((x: any) => x.type === "image")?.imageUrl?.["200x200"] || "",
    productId: product.id,
    inventory: stock,
    primaryCategory: categories.childCategoryName,
    tags,
  };

  const pageViewobject = {
    product: GAobj,
    webengage: WebEngageObj,
  };
  return JSON.parse(JSON.stringify(pageViewobject));
};

// Adobe Analytics(6) - On Click - PDP - Frequently Brought Together - Add To Bag
export const adobeFrequentlyBroughtTogether = (combo: any, comboProduct: any, userProfile: any) => {
  const arrProductIds: any = [];
  const dataProducts: {
    productSku: any;
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
    widgetName: string;
  }[] = [];
  combo.products.forEach((productItem: any) => {
    arrProductIds.push(productItem);
    const tempProduct = comboProduct.relationalData.products[productItem];
    dataProducts.push({
      productSku: tempProduct.sku,
      productQuantity: 1,
      productOfferPrice: formatPrice(tempProduct.offerPrice) as number,
      productPrice: formatPrice(tempProduct.price) as number,
      productDiscountedPrice: formatPrice(tempProduct.price - tempProduct.offerPrice) as number,
      productRating: "",
      productTotalRating: "",
      stockStatus: tempProduct.inStock === true ? "in stock" : "out of stock",
      isPreOrder: tempProduct.productMeta.isPreOrder === true ? "yes" : "no",
      PWP: "",
      hasTryOn: "no",
      widgetName: "frequently bought together",
    });
  });

  const childCatId = combo?.categories?.filter((c: any) => c.type === "child");

  const subchildCatId = combo?.categories?.filter((c: any) => c.type === "subChild");

  const ddlChildCategory = comboProduct?.relationalData?.categories[childCatId[0]?.id]?.cms[0]?.content?.name;

  const ddlSubChildCategory = comboProduct?.relationalData?.categories[subchildCatId[0]?.id]?.cms[0]?.content?.name;

  (window as any).digitalData = JSON.parse(
    JSON.stringify({
      common: {
        linkName: `web|${ddlChildCategory} - ${combo.productTag}|product description page|add 2 products to bag`,
        linkPageName: `web|${combo.productTag}|product description page`,
        newLinkPageName: "product description",
        assetType: "product",
        newAssetType: "product",
        subSection: `${ddlChildCategory} - ${ddlSubChildCategory}`,
        platform: "mobile website",
        ctaName: "add 2 products to bag",
        source: SOURCE_STATE.addToBagSource || "other",
      },
      user: Adobe.getUserDetails(userProfile),
      product: dataProducts,
    })
  );
  Adobe.Click();
};

// #region // *WebEngage [16] - Product Add To Cart - PDP Page : GA Function
export const gaAddtoCart = (addedProduct: any, userProfile: any, comboProduct: any, isFreeProduct = false) => {
  const childId = addedProduct?.categories.filter((c: any) => c.type === "child")[0]?.id;
  const category = comboProduct?.relationalData?.categories[childId]?.cms[0]?.content.name;

  // #region // *WebEngage [16] - Product Add To Cart - PDP Page : Function Call
  const webEngageProductDataLayer = prepareWebengageAddedProductsDatalayer(addedProduct, userProfile, isFreeProduct, category);
  // #endregion // WebEngage [16] - Product Add To Cart - PDP Page : Function Call

  GAaddToCart(webEngageProductDataLayer, category);
};
// #endregion // WebEngage [16] - Product Add To Cart - PDP Page : GA Function

// #region // *WebEngage [16] - Product Add To Cart - PDP Page: Prepare Function
export const prepareWebengageAddedProductsDatalayer = (
  addedProduct: any,
  userProfile: any,
  isFreeProduct = false,
  category: any
) => {
  const product = addedProduct;
  let strProductName = "";
  let strBundleName = "";
  if (addedProduct?.type === 2) {
    strBundleName = addedProduct?.cms[0]?.content.name;
  } else {
    strProductName = addedProduct?.cms[0]?.content.name;
  }

  product.webengage = {
    bundleName: strBundleName,
    currency: getCurrency(),
    freeGiftWithProduct: false,
    inviteCode: "",
    preOrder: addedProduct?.productMeta?.isPreOrder,
    price: formatPrice(addedProduct?.price),
    productName: strProductName,
    productSKU: addedProduct?.sku,
    productSubCategoryName: addedProduct?.productTag,
    shade: addedProduct?.cms[0]?.attributes?.shadeLabel || "",
    type: addedProduct?.productMeta?.showInParty ? "Party" : "Normal",
    userType: userProfile ? "Member" : "Guest",
    isFreeProduct: !!isFreeProduct || addedProduct?.offerPrice === 0,
    offerPrice: formatPrice(addedProduct?.offerPrice),
    productType: addedProduct?.type,
    productURL: addedProduct.urlManager?.url || URL,
    productImageURL: addedProduct?.assets?.find((x: any) => x.type === "image")?.imageUrl["200x200"],
    productId: addedProduct.id,
    primaryCategory: category || "",
    isTrial: addedProduct?.productMeta?.isTrial || "",
    showingTrialProduct: getSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU) === product?.sku,
  };
  const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
  if (fbEventId) {
    product.webengage["eventID"] = fbEventId;
  }

  return JSON.parse(JSON.stringify(product));
};
// #endregion // WebEngage [16] - Product Add To Cart - PDP Page: Prepare Function

// Adobe Analytics(131) - On Click - Wishlisht Button click on ShoppingBag.
// write a review  | ask a question
export const adobeCallOnCTAClick = (product: PDPProd, eventName: string) => {
  const { subChildCategoryName: subCategory, childCategoryName: category } = product?.categories || {};

  (window as any).digitalData = {
    common: {
      linkName: `web|${category} - ${subCategory}|product description page|${eventName}`,
      linkPageName: `web|${subCategory}|${product.productTag}|product description page`,
      newLinkPageName: `${product.productTag}|product description page`,
      assetType: "product",
      newAssetType: "product",
      subSection: "",
      platform: ADOBE.PLATFORM,
      ctaName: eventName,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

// Adobe Analytics - Show Review More Event - PDP
export const AdobeReviewShowMoreEvent = (product: PDPProd) => {
  const { subChildCategoryName: subCategory, childCategoryName: category } = product?.categories || {};

  (window as any).digitalData = {
    common: {
      assetType: "product",
      ctaName: "Show More",
      linkName: `web|${category} - ${subCategory}|production description page|Review Show More`,
      linkPageName: `web|${subCategory}|${product.productTag}|production description page`,
      newAssetType: "product",
      newLinkPageName: `${product.productTag}|product description page`,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: `${category} - ${subCategory}`,
    },
    /* @ts-ignore */
    user: window.digitalData.user || {},
  };
  Adobe.Click();
};

export const readMoreAdobeClickEvent = (category: string, subCategory: string) => {
  (window as any).digitalData = {
    common: {
      assetType: "product",
      ctaName: "pdp read more",
      linkName: `web|${category} - ${subCategory}|production description page|readmore`,
      linkPageName: `web|${category} - ${subCategory}|production description page`,
      newAssetType: "product",
      newLinkPageName: "product description",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: `${category} - ${subCategory}`,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const TabToggleAdobeClickEvent = (product: PDPProd, sectionName: string, action: boolean) => {
  const { categories, freeProducts, ratings } = product || {};

  (window as any).digitalData = {
    common: {
      assetType: "product",
      ctaName: sectionName,
      linkName: `web|${categories.childCategoryName} - ${categories.subChildCategoryName}|production description page|${
        action ? "open" : "close"
      }`,
      linkPageName: `web|${categories.childCategoryName} - ${categories.subChildCategoryName}|production description page`,
      newAssetType: "product",
      newLinkPageName: "product description",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: `${categories.childCategoryName} - ${categories.subChildCategoryName}`,
    },
    product: [
      {
        productSKU: product.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(product.offerPrice),
        productPrice: formatPrice(product.price),
        productDiscountedPrice: formatPrice(product.price - product.offerPrice),
        productRating: ratings.avgRating,
        productTotalRating: ratings.totalCount,
        stockStatus: `${product.inStock ? "in stock" : "out of stock"}`,
        isPreOrder: `${product.productMeta.isPreOrder ? "yes" : "no"}`,
        PWP: freeProducts?.ids?.[0] || "",
        hasTryOn: "no",
      },
    ],
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};

export const onAddToBagError = (message: string, location: string) => {
  (window as any).evars.evar35 = message;
  (window as any).digitalData = {
    common: {
      assetType: "cart additional fail",
      ctaName: "cart additional fail",
      linkName: "cart additional fail",
      linkPageName: "cart additional fail",
      newAssetType: "cart additional fail",
      newLinkPageName: "cart additional fail",
      pageLocation: location,
      platform: ADOBE.PLATFORM,
      subSection: "cart additional fail",
    },
  };
  Adobe.Click();
};
export function triggeCTPAdobeClickEvent(cta: string) {
  (window as any).digitalData = {
    common: {
      linkName: `web|cut the price|${cta.toLocaleLowerCase()}`,
      linkPageName: "web|cut the price|product listing page",
      ctaName: cta.toLocaleLowerCase(),
      newLinkPageName: ADOBE.ASSET_TYPE.CTP_PLP,
      subSection: ADOBE.ASSET_TYPE.CTP_PLP,
      assetType: ADOBE.ASSET_TYPE.CTP_PLP,
      newAssetType: ADOBE.ASSET_TYPE.CTP_PLP,
      platform: ADOBE.PLATFORM,
      pageLocation: ADOBE.ASSET_TYPE.CTP_PLP,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
}

// Adobe Analytics(134) - On Click - PDP - Submit Question
export const adobeSubmitQuestion = (productAdobe: any, ratings: any = {}, category: any = "") => {
  let ddlStockStatus = "";
  let ddlIsPreOrder = "";
  const prepareDatalayer = async () => {
    ddlStockStatus = productAdobe.inStock ? `in stock` : `out of stock`;
    ddlIsPreOrder = productAdobe.productMeta.isPreOrder ? `yes` : `no`;
  };
  prepareDatalayer();

  (window as any).digitalData = {
    common: {
      linkName: `web|${category} - ${productAdobe.productTag}|product description page|submit question`,
      linkPageName: `web|${productAdobe.productTag}|product description page`,
      newLinkPageName: `${productAdobe.productTag}|product description page`,
      assetType: "product",
      newAssetType: "product",
      subSection: `${category} - ${productAdobe.productTag}`,
      platform: "mobile website",
      ctaName: "submit question",
    },
    user: Adobe.getUserDetails(),
    product: [
      {
        productSKU: productAdobe.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(productAdobe.offerPrice),
        productPrice: formatPrice(productAdobe.price),
        productDiscountedPrice: formatPrice(productAdobe.price - productAdobe.offerPrice),
        productRating: ratings?.avgRating || "",
        productTotalRating: ratings?.totalCount || "",
        stockStatus: `${ddlStockStatus}`,
        isPreOrder: `${ddlIsPreOrder}`,
        PWP: "",
        hasTryOn: "no",
        starCount: "",
      },
    ],
  };
  Adobe.Click();
};

// Adobe Analytics(132) - On Click - PDP - Submit Review
export const adobeSubmitReview = (productAdobe: any, categories: any, ratings: any) => {
  let ddlStockStatus = "";
  let ddlIsPreOrder = "";
  const prepareDatalayer = async () => {
    ddlStockStatus = productAdobe.inStock ? `in stock` : `out of stock`;
    ddlIsPreOrder = productAdobe.productMeta.isPreOrder ? `yes` : `no`;
  };
  prepareDatalayer();

  (window as any).digitalData = {
    common: {
      linkName: `web|${categories.childCategoryName} - ${productAdobe.productTag}|product description page|submit review`,
      linkPageName: `web|${productAdobe.productTag}|product description page`,
      newLinkPageName: `${productAdobe.productTag}|product description page`,
      assetType: "product",
      newAssetType: "product",
      subSection: `${categories.childCategoryName} - ${productAdobe.productTag}`,
      platform: "mobile website",
      ctaName: "submit review",
    },
    user: Adobe.getUserDetails(),
    product: [
      {
        productSKU: productAdobe.sku,
        productQuantity: 1,
        productOfferPrice: formatPrice(productAdobe.offerPrice),
        productPrice: formatPrice(productAdobe.price),
        productDiscountedPrice: formatPrice(productAdobe.price - productAdobe.offerPrice),
        productRating: ratings?.avgRating || "",
        productTotalRating: ratings?.totalCount || "",
        stockStatus: `${ddlStockStatus}`,
        isPreOrder: `${ddlIsPreOrder}`,
        PWP: "",
        hasTryOn: "no",
        starCount: "",
      },
    ],
  };
  Adobe.Click();
};

// #region // *WebEngage [18] - Product Review Submitted : Prepare Function
export const prepareWebengageSubmitReviewDataLayer = (productWebEngage: any, reviewDetails: any, categories: any) => {
  const webengageDataLayer = {
    productCategory: categories.subChildCategoryName,
    productSubCategoryName: productWebEngage.productTag,
    productName: productWebEngage?.cms[0]?.content?.name,
    productSku: productWebEngage.sku,
    starRating: reviewDetails.rating,
    userType: checkUserLoginStatus()?.memberId ? "Member" : "Guest",
  };
  GAProductReviewSubmitted(webengageDataLayer);
};
// #endregion // WebEngage [18] - Product Review Submitted : Prepare Function

export const evarValueGenerator = (product: PDPProd, variantValue: string) => {
  const newDataPresent =
    product.cms?.[0]?.content?.finerDetails?.description || product.cms?.[0]?.content?.keyBenefits?.description;

  return `v${variantValue}|${newDataPresent ? "true" : "false"}`;
};
