import CartAPI from "@libAPI/apis/CartAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { showError } from "@libUtils/showToaster";
import { getVendorCode } from "@libUtils/getAPIParams";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import {
  addToBagProd,
  cartCoupon,
  cartFreeProduct,
  cartProduct,
  FPOtherData,
  freeProductData,
  productTypes,
  upSellBuckets,
  UpsellData,
  userCart,
} from "@typesLib/Cart";

import { checkUserLoginStatus, getCartIdentifier, getCouponandPoints } from "../Storage/HelperFunc";
import { replaceAV } from "@libHooks/useTranslation";
import { upsellAddToBagClickEvent, GAAddProduct } from "./Analytics";
import { adobeRemoveGiftCard } from "../Payment/Payment.Analytics";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { paymentSuggestion } from "@typesLib/Redux";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { BestOffers, NetBankingOffer, UpiCollect, UpiIntent, WalletOffer } from "@typesLib/Payment";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { addToBag, updateCart } from "@libStore/actions/cartActions";
import Router from "next/router";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { isGiftCardFromPhase1 } from "../Payment/HelperFunc";

/**
 * Create a layer or object based on the response received from Cart-ms
 * @returns Custom Cart Response to be used on Checkout Pages
 */
export function cartCustomRepsonseLayer(data: any): userCart {
  const {
    applicableGlammPoints,
    appliedGlammPoints,
    applicableSubscriptionDetails,
    cart,
    expectedDeliveryDate,
    dsMinExpectedDeliveryDate,
    dsExpectedDeliveryDate,
    redeemPointsOnFirstOrderInfoMsg,
    shippingCharges,
    tax,
    discounts,
    missingProductFreeProductsDiscounts,
    userSpecificDiscount,
    usersGlamPoints,
    cloudfrontCountryId,
    subscriptionDetails,
    upsellOfferProducts,
  } = data || {};

  /* Extracting all Product Free Products from normal and pre-order products */
  let prodCount = 0;
  let instantDiscountCode: string | null = null;
  const pwpProducts: Array<cartProduct> = [];
  const skusWithNoHasShade: Array<string> = [];

  const isPreorder = (product: cartProduct): boolean => !!product.productMeta.isPreOrder;

  const patchFreeProduct = (freeProduct: cartProduct, prod: cartProduct) => ({
    ...freeProduct,
    parentId: prod.productId,
    cartType: isPreorder(prod) ? 4 : 2,
  });

  if (Router.pathname === "/shopping-bag") setLocalStorageValue(LOCALSTORAGE.SHIPPING_CHARGES, shippingCharges / 100, true);

  /**
   * Calculating Quantity of Products, adding cartType for PWP
   * and collecting products with hasShade === null
   */
  const products = [...cart.products, ...cart.preOrderProducts].map((prod: cartProduct) => {
    /* Evaluating the Quantity of Each Product */
    prodCount += prod.quantity;

    /* Filtering the skus with no hasShade paramter */
    if (prod.childProducts.length === 0 && typeof prod.hasShade !== "boolean") {
      skusWithNoHasShade.push(prod.sku);
    }

    /* Searching for instantDiscountCode if present in any product */
    const discountCode = prod.productMeta.instantDiscountCode;
    if (discountCode && discountCode !== userSpecificDiscount?.couponCode) {
      instantDiscountCode = discountCode;
    }

    /* Filtering the PWP product if Available */
    if (prod.freeProducts.length) {
      prod.freeProducts.forEach((freeProduct: any) => {
        // @ts-ignore
        pwpProducts.push(patchFreeProduct(freeProduct, prod));
      });
    }

    /* Appending Cart Type and returning */
    return {
      ...prod,
      cartType: isPreorder(prod) ? 3 : 1,
      freeProducts: prod.freeProducts?.map(freeProduct => patchFreeProduct(freeProduct, prod)) || [],
    };
  });

  /* GWP Cart Fee Products appending cartType */
  const gwpProducts = cart.freeProducts.map((gwp: cartProduct) => ({
    ...gwp,
    cartType: 8,
  }));

  /* Miscellaneous Cart Products - e.g. Glamm Membership */
  const miscellaneousProducts = cart.miscellaneousProduct.map((miscellaneousProduct: cartProduct) => ({
    ...miscellaneousProduct,
    cartType: miscellaneousProduct?.type || 1,
  }));

  /* check If virtual product exist in cart products & get offerprice of that product */
  const virtualProductData = products.find(product => product.productMeta.isVirtualProduct && product.type === 1);
  const virtualProductOfferPrice = virtualProductData?.offerPrice || 0;
  /* check if only subscription product exist in cart */
  const isSingleSubscriptionProduct = products?.length === 1 && virtualProductData ? true : false;
  /* Subscription dynamic discount value calculation - if include shipping / not included shipping discount  - START */
  const subscriptionDisTotal =
    (formatPrice(cart.grossAmount - (cart.additionalDiscount || 0) - (userSpecificDiscount.userDiscount || 0)) as number) -
      appliedGlammPoints || 0;

  const subscriptionDiscountValue = !cart.subscriptionDiscountIncludesShipping
    ? subscriptionDisTotal < (formatPrice(cart.subscriptionDiscountValue) as number) && subscriptionDisTotal > 0
      ? (formatPrice(subscriptionDisTotal, false, false) as number)
      : (formatPrice(cart.subscriptionDiscountValue) as number)
    : (formatPrice(cart.subscriptionDiscountValue) as number);
  /* Subscription dynamic discount value calculation - END */

  let totalSaving = ((cart.additionalDiscount / 100 || 0) +
    (subscriptionDiscountValue || 0) +
    (userSpecificDiscount.userDiscount / 100 || 0) +
    (appliedGlammPoints || 0)) as number;

  let customResponse: userCart = {
    totalSaving,
    tax,
    firstOrder: cart.firstOrder,
    countryId: cloudfrontCountryId,
    freeShippingThreshold: cart.freeShippingThreshold,
    totalDutyCharges: cart.totalDutyCharges || 0,
    additionalDiscount: formatPrice(cart.additionalDiscount) as number,
    redeemPointsOnFirstOrderInfoMsg: redeemPointsOnFirstOrderInfoMsg || "",
    expectedDeliveryDate: new Date(expectedDeliveryDate.split("T")[0]),
    applicableSubscriptionDetails: applicableSubscriptionDetails, // if subscription product is exist on cart
    hasCartGcDiscount: cart.hasCartGcDiscount,
    /* If virtual product exist in cart [ substract virtualproduct offer price from gross amount ] Case 1 */
    grossAmount: virtualProductData
      ? (formatPrice(cart.grossAmount - virtualProductOfferPrice) as number)
      : (formatPrice(cart.grossAmount) as number),
    virtualProductSubscriptionAmount: virtualProductOfferPrice, // for display seperatly in amounts summary in cart
    codEnabledForSubscription: isSingleSubscriptionProduct, // for COD option condition for user subscription
    isGiftCardSku: !!products.find(product => product.productMeta.giftCardSku),
    /* IF PWP available for any product in cart */
    missingProductFreeProducts: (missingProductFreeProductsDiscounts || []).map((freeProd: any) => ({
      parentProductId: freeProd.systemRules.productId,
      freeProduct: {
        id: freeProd.discountValue.freeProducts.ids[0],
        type: freeProd.discountValue.freeProducts.type,
        ids: freeProd.discountValue.freeProducts.ids,
      },
    })),
    shippingCharges: formatPrice(shippingCharges) as number,
    shippingChargesAfterDiscount: cart.shippingChargesAfterDiscount,
    cartShippingCharges: formatPrice(cart.shippingCharges) as number,
    shippingChargesDiscount: cart.shippingChargesDiscount,
    shippings: cart.shippings,
    identifier: cart.identifier,
    isShippingChargeCashBack: cart.isShipingChargeCashBack,
    skusWithNoHasShade,
    instantDiscountCode,
    productCount: prodCount + cart.freeProducts.length + pwpProducts.length,
    couponData: {},
    binSeriesData: {},
    /* IF GWP is applicable on user's current cart value or payableAmount */
    discounts: {
      id: discounts?.cartDiscount?.discountValue.freeProducts.ids[0] || null,
      type: discounts?.cartDiscount?.discountValue.freeProducts.type || null,
      description: discounts?.cartDiscount?.cms[0]?.content?.cartTextAfterOfferEligibility || null,
      ids: discounts?.cartDiscount?.discountValue.freeProducts.ids || null,
    },
    amountToSpendForNextDiscount: formatPrice(
      discounts.nextCartDiscount?.systemRules?.netAmount - discounts.netAmountCartDiscounts || 0
    ) as number,
    // @ts-ignore
    products,
    gwpProducts,
    pwpProducts,
    miscellaneousProducts,
    allProducts: [...products, ...pwpProducts, ...gwpProducts, ...miscellaneousProducts],
    netAmount: formatPrice(cart.netAmount) as number,
    /**
     * user existing subscription details
     */
    subscriptionDetails,
    subscriptionDiscountValue: subscriptionDiscountValue,

    /**
     * Main Payable Amount to a user ------------- netAmount + shippingCharges - couponDiscount - glammpoints
     * NOTE: netAmount,shippingCharges and couponDiscount are in paise while glammpoints is in ruppee
     */

    /* If user is already subscribed then [ substract subscriptionDiscountValue from payable amount] Case 2*/
    payableAmount: ((formatPrice(cart.netAmount + shippingCharges - (userSpecificDiscount.userDiscount || 0)) as number) -
      (appliedGlammPoints || 0) -
      ((subscriptionDiscountValue as number) || 0)) as number,

    shoppingBagPayableAmount: ((formatPrice(cart.netAmount - (userSpecificDiscount.userDiscount || 0)) as number) -
      ((subscriptionDiscountValue as number) || 0)) as number,

    userCouponDiscountValue: formatPrice(userSpecificDiscount.userDiscount || 0) as number,

    /*  GlammCoins get applied only when it exceeds or is equal to this amount */
    thresHoldCartValueForGlammCoins: formatPrice(cart.thresHoldCartValueForGlammCloins) as number,

    deliverDates: {
      expectedDeliveryDate,
      dsExpectedDeliveryDate,
      dsMinExpectedDeliveryDate,
    },
    upsellOfferProducts: upsellOfferProducts?.products,
    allowIntShipping: cart?.allowIntShipping,
  };

  /* NOTE: We maintain the last instance of this user's cart data in redux to avoid an extra call */
  /**
   * In Case on Add to Bag call we don't get glammPoints Data
   */
  if (usersGlamPoints !== undefined) {
    customResponse = {
      ...customResponse,
      usersGlamPoints,
      applicableGlammPoints,
      appliedGlammPoints,
    };
  }

  if (shippingCharges === 0 && !customResponse.isGiftCardSku) {
    customResponse = {
      ...customResponse,
      totalSaving: (totalSaving + (cart?.shippings?.[0]?.shippingCharges || 0)) as number,
    };
  }

  /* if applicable on MRP key is there in userSpecificDiscount  */
  if (userSpecificDiscount.applicableOnMRP === false) {
    customResponse = {
      ...customResponse,
      applicableOnMRP: userSpecificDiscount.applicableOnMRP,
    };
  }

  /**
   * In Case on No Coupon or Autoapply false param we don't get coupon Data
   */
  if (userSpecificDiscount.couponCode) {
    customResponse = {
      ...customResponse,
      couponData: {
        autoApply: userSpecificDiscount.autoApply,
        action: userSpecificDiscount.actions?.[0],
        couponCode: userSpecificDiscount.couponCode.toUpperCase(),
        couponDescription: userSpecificDiscount.couponDescription,
        userDiscount: cart?.hasCartGcDiscount
          ? (formatPrice(userSpecificDiscount.userDiscount - cart.giftCardDiscount) as number)
          : (formatPrice(userSpecificDiscount.userDiscount) as number),
        userCashback: formatPrice(userSpecificDiscount.userCashback) as number,
        freeProduct: {
          id: userSpecificDiscount.freeProducts?.ids[0],
          type: userSpecificDiscount.freeProducts?.type,
          ids: userSpecificDiscount.freeProducts?.ids,
        },
        disableGuestLogin: userSpecificDiscount.disableGuestLogin,
      },
    };

    if (userSpecificDiscount.discountValue) {
      customResponse = {
        ...customResponse,
        isShippingChargeCashBack: userSpecificDiscount.discountValue.isShipingChargeCashBack,
      };
    }
    if (userSpecificDiscount.binSeriesData) {
      /* Storing Binseries Data inCase of Binseries Coupon */
      customResponse = {
        ...customResponse,
        binSeriesData: {
          bankName: userSpecificDiscount.binSeriesData?.filter((binData: any) => binData.field === "bankName")[0],
          paymentMethods: userSpecificDiscount.binSeriesData?.filter((binData: any) => binData.field === "paymentMethods")[0],
          binSeries: userSpecificDiscount.binSeriesData?.filter((binData: any) => binData.field === "binSeries")[0],
        },
      };
    }
  }

  return customResponse;
}

/**
 * Fetching User Cart along side other details
 */
export function fetchCart(pincode?: string) {
  const cartApis = new CartAPI();
  const { coupon, gp } = getCouponandPoints();

  return cartApis
    .updateCart(coupon, gp, pincode)
    .then(({ data: result }) => result)
    .catch(err => {
      console.error(err);

      /* Hit Once Again cart-ms removing the coupon and gp if applied - on api failure */
      if (coupon || gp) {
        removeLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);
        removeLocalStorageValue(LOCALSTORAGE.COUPON);
        cartApis.updateCart().then(({ data: result }) => result);
      }
    });
}

/**
 * Called for Add, Update and Removal of Products from Cart
 * @returns Update Cart Data on Success
 *          Undefined with Toaster on Failure
 */
export const updateProducts = async (
  product: addToBagProd | addToBagProd[],
  quantity: number,
  hideDSTag = false
): Promise<any> => {
  const cartApis = new CartAPI();

  const getListOfProducts = () => {
    let products = [];
    if (Array.isArray(product)) {
      return (products = product.map((prod: any) => ({
        quantity,
        parentId: prod.parentId,
        type: prod.cartType || 1, // cartType is type used by AddToBag call and incase of cart it's already calculated
        subProductType: prod.type,
        productId: prod.id || prod.productId,
        childProducts: prod.childProductIds,
        tag: !hideDSTag ? prod?.upsellKey || SOURCE_STATE.addToBagSource || undefined : undefined,
      })));
    }
    return [];
  };
  const payload = {
    identifier: getCartIdentifier(),
    isGuest: !checkUserLoginStatus(),
    products: Array.isArray(product)
      ? getListOfProducts()
      : [
          {
            quantity,
            parentId: product.parentId,
            type: product.cartType || 1,
            subProductType: product.type,
            productId: product.id || product.productId,
            childProducts: product?.childProductIds || [],
            offerID: product?.offerID || undefined,
            variantValue: product?.variantValue || undefined,
            vendorCode: product?.offerID ? getVendorCode() : undefined,
            tag: !hideDSTag ? product.upsellKey || SOURCE_STATE.addToBagSource || undefined : undefined,
          },
        ],
  };
  return await cartApis
    .addToBag(payload, true)
    .then(({ data: result }) => result)
    .catch(async (err: any) => {
      if (err.response?.data?.message?.match(/promo|offer|discount code|promotion/)) {
        setLocalStorageValue(
          "couponErrorDetails",
          {
            errorMessage: err.response?.data?.message,
            couponName: LOCALSTORAGE.COUPON,
          },
          true
        );

        removeLocalStorageValue(LOCALSTORAGE.COUPON);
        return updateProducts(product, quantity);
      }

      if (err.response?.data?.message.match("quantity")) {
        // early return no error msg
        return false;
      }

      showError(err.response?.data?.message || "Error");
      console.error(err);
      return undefined;
    });
};

/**
 * Calling Product API Based on the type and id received
 * @returns Array of Products on Sucess
 *          Shows Toaster with Error and return undefined
 */
export function getProductData(freeProduct: freeProductData, otherData?: FPOtherData, nextFreeProductCount?: number) {
  const cartApi = new CartAPI();

  const { id, type, ids } = freeProduct;
  const { cartType, parentId } = otherData || {};

  /* Elastic Search Product Call Types */
  const paramsKeys = {
    products: "id",
    productTag: "productTag",
    productCategory: "categories.id",
  };

  return cartApi
    .getCartFreeProductData({
      [paramsKeys[type]]: { inq: [encodeURIComponent(ids[nextFreeProductCount ? nextFreeProductCount : 0])] },
    })
    .then(({ data: res }) => {
      return {
        shades: res.data?.data?.map((prod: cartFreeProduct) => ({
          ...prod,
          parentId,
          cartType,
        })),
        categories: res.data?.relationalData?.categories,
      };
    })
    .catch((err: Error) => {
      console.error(err);
      return undefined;
    });
}

/**
 * In Case a user wants to reselect the free gift he/she can click on checkbox and based on
 * errorMessage we remove glammpoints/coupon re-enabling the gift in cart
 */
export function selectFreeGiftAgain(product: cartProduct, couponData: cartCoupon) {
  if (product.errorMessage.includes("glammPOINTS")) {
    localStorage.removeItem(LOCALSTORAGE.GLAMMPOINTS);
  } else if (product.errorMessage.includes("promo code")) {
    localStorage.removeItem(LOCALSTORAGE.COUPON);

    /* In case of autoapply coupon add it in the list of Ignored Coupons in Localstorage */
    if (couponData.autoApply) {
      const ignoredCoupons = JSON.parse(localStorage.getItem(LOCALSTORAGE.IGNORE_DISCOUNT) || "[]");
      localStorage.setItem(LOCALSTORAGE.IGNORE_DISCOUNT, JSON.stringify([...ignoredCoupons, couponData.couponCode]));
    }
  }
}

/* Based on different discount and freeproduct generating message to be showed in coupon div */
export function buildCongratsMessage(couponData: cartCoupon, t: any) {
  const { freeProduct, userDiscount, userCashback } = couponData || {};

  const COUPON_MSGS = t("couponMsgs");
  let message = `${t("you") || "You"} `;
  const arr: Array<string> = [];

  if (freeProduct?.id) {
    arr.push(COUPON_MSGS?.freeGift || `got a Free gift`);
  }

  if (userDiscount) {
    arr.push(
      replaceAV([formatPrice(userDiscount, true, false) as string], COUPON_MSGS?.couponDiscount) ||
        `saved additional ${formatPrice(userDiscount, true, false)}`
    );
  }

  if (userCashback) {
    arr.push(
      replaceAV([formatPrice(userCashback, true, false) as string], COUPON_MSGS?.cashback) ||
        `got a cashback of ${formatPrice(userCashback, true, false)}`
    );
  }

  const last = arr.pop();
  message = `${message} ${arr.join(", ") + (arr.length > 1 ? " and " : " ") + last}`;

  return last ? message : "";
}

export function getUpsellWidgetData(
  upsellBuckets: upSellBuckets,
  payableAmount: number,
  oldSlug?: string
): Promise<UpsellData | Record<string, never>> {
  /* Evaluating the Slug based on the Cart Payable Amount */
  const slugOrId = upsellBuckets.find((x: any) => x.min <= payableAmount && x.max >= payableAmount)?.slug;

  /* Checking if slug available and the data is not same as we already have */
  if (slugOrId && slugOrId !== oldSlug) {
    const widgetApi = new WidgetAPI();
    return widgetApi
      .getWidgets({ where: { slugOrId } })
      .then(({ data: res }) => {
        const { commonDetails } = res?.data?.data?.widget?.[0] || {};

        /* Patching Raw Response to Custom for Better Understandabilty */
        if (commonDetails) {
          return {
            slug: res.data.data.slug,
            title: commonDetails.title,
            subTitle: commonDetails.subTitle,
            products:
              commonDetails.descriptionData?.[0]?.value?.length &&
              commonDetails.descriptionData[0].value?.map((prod: any) => ({ ...prod, widgetName: "upsell" })),
          };
        }
        return {};
      })
      .catch(err => {
        console.error(err);
        return {};
      });
  }
  return Promise.resolve({});
}

export function replaceShade(activeProduct: any, oldSKU: string) {
  const cartApis = new CartAPI();

  return cartApis
    .replaceProductInCart({ oldSKU, newSKU: activeProduct.sku })
    .then(({ data: result }) => {
      const cartData = result;

      /**
       * Mutating the Replaced Product "hasShade" value to true by default as backend consider it
       * as a new product and requires us to hit the api again which is not requried
       */
      const mutateProductwithSKU = (type: productTypes) => {
        const index = cartData.data.cart[type].findIndex((x: cartProduct) => x.sku === activeProduct.sku);
        if (index !== -1) {
          cartData.data.cart[type][index].hasShade = true;
          return cartData;
        }
        return cartData;
      };

      if (activeProduct.productMeta.isPreOrder) {
        mutateProductwithSKU("preOrderProducts");
      } else {
        mutateProductwithSKU("products");
      }
    })
    .catch(err => err);
}

export const fetchFreeProducts = async ({ productSlug, nextFreeProductCount }: any) => {
  const api = new ProductAPI();

  const where = {
    "urlManager.url": `/product/${productSlug ?? "".split("?")[0]}`,
  };
  const include = [
    "id",
    "price",
    "sku",
    "brand",
    "categories",
    "products",
    "productMeta",
    "offerPrice",
    "productTag",
    "type",
    "urlManager",
    "cms",
    "assets",
    "urlShortner",
    "wms",
    "inStock",
  ];

  const productRes = await api.getProduct(where, 0, include);

  const freeProductType =
    productRes?.data.data?.discountDetails?.[productRes.data.data.data[0].id].discountValue?.freeProducts?.type;
  let fPwhere = {};

  if (productRes?.data.data.discountDetails && freeProductType) {
    switch (freeProductType) {
      case "productCategory": {
        fPwhere = {
          "categories.id": {
            inq: [productRes.data.data.discountDetails.categoryId[nextFreeProductCount]],
          },
          inStock: true,
        };
        break;
      }

      case "products": {
        fPwhere = {
          id: {
            inq: [
              productRes?.data.data.discountDetails[productRes.data.data.data[0]?.id]?.discountValue?.freeProducts?.ids[
                nextFreeProductCount
              ],
            ],
          },
          inStock: true,
        };
        break;
      }

      case "productTag": {
        fPwhere = {
          productTag: {
            inq: [
              productRes?.data.data.discountDetails[productRes.data.data.data[0]?.id]?.discountValue?.freeProducts?.ids[
                nextFreeProductCount
              ],
            ],
          },
          inStock: true,
        };
        break;
      }
      default: {
        console.info(`No Free Product`);
      }
    }
  }

  if (productRes?.data.data.discountDetails) {
    const freeProduct = api.getProductShades("IND", fPwhere, 0, include);
    return freeProduct;
  }
  return null;
};

/* Dividing upsellProducts array into two equal parts for AB testing */
export const customizeUpsellDataBasedOnExpVariant = (upsellProducts?: any, showSingleRow?: boolean, variant?: string) => {
  const _upsellProducts = [...upsellProducts];

  if (Array.isArray(_upsellProducts) && _upsellProducts.length && !showSingleRow) {
    const even = _upsellProducts.filter((_, index) => index % 2 === 0);
    const odd = _upsellProducts.filter((_, index) => index % 2 === 1);

    return { firstHalfProducts: even, secondHalfProducts: odd };
  }

  return upsellProducts;
};

/* Response of Upsell products from Data science is different from normal upsell
 widgets hence for using common component customizing the data
*/
export const getCustomDataToDisplayUpsellProduct = (product: any) => {
  if (!product) return null;
  return {
    id: product.productId,
    sku: product.sku,
    type: product.type,
    inStock: product.inStock || "",
    offerPrice: product.priceOffer,
    price: product.priceMRP,
    productTag: product.productTag,
    key: product.key,
    offerID: product.offerID,
    urlManager: { url: product.slug },
    shadeCount: product.shadeCount,
    subProductType: product.subProductType,
    isGiftCard: product.isGiftCard,
    minimumBillAmount: product.minimumBillAmount,
    childProductIds: product.products,
    assets: [{ imageUrl: { ["200x200"]: product.imageURL }, name: "" }],
    rating: {
      avgRating: product.rating?.avgRating,
      totalCount: product.rating?.totalCount,
    },

    cms: [
      {
        content: {
          name: product.productName,
          subtitle: product.productSubTitle,
        },
        attributes: {
          shadeLabel: product.shadeLabel,
        },
      },
    ],

    productMeta: {
      isPreOrder: false,
      showInParty: false,
      tryItOn: false,
      allowShadeSelection: false,
      tags: product?.meta?.tags || product?.productMeta?.tags,
    },
    brand: {
      name: product.brand.name,
    },
    products: [],
    productCategory: product?.productCategory,
  };
};

export const fetchRecommendedCoupons = async () => {
  const cartApi = new CartAPI();
  const { memberId } = checkUserLoginStatus() || {};
  if (memberId) {
    try {
      const response = await cartApi.getRecommendedCouponsV2(memberId);
      return response.data.data;
    } catch (err) {
      console.error(err);
    }
  }
};

export const createDSUpsellPayload = ({
  cart,
  couponFreeProductData,
  progressbarNextMilestone,
  progressbarMilestoneUpsellLabel,
}: {
  cart: userCart;
  couponFreeProductData: any;
  progressbarNextMilestone?: any;
  progressbarMilestoneUpsellLabel?: any;
}) => {
  const userSegment = getLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, true);
  const profile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  const patchDataForApi = (prod: cartProduct) => ({
    sku: prod.sku,
    type: prod.type || 1,
    vendorCode: getVendorCode(),
    wareHouseIdentifier: prod.wareHouseIdentifier,
    offerID: prod.offerID,
    productWidgetTag: prod.productWidgetTag,
    variantValue: prod.variantValue,
  });

  const products: any = [];
  const preOrderProducts: any = [];

  cart.products.forEach(prod => {
    if (prod.cartType === 3) return preOrderProducts.push(patchDataForApi(prod));

    if (prod.cartType === 1) products.push(patchDataForApi(prod));

    if (prod.childProducts.length > 0) prod.childProducts.map(childProduct => products.push(patchDataForApi(childProduct)));
  });

  const freeProds = [...cart.pwpProducts, ...cart.gwpProducts];
  if (couponFreeProductData) freeProds.push(couponFreeProductData);

  const freeProducts = freeProds.map((freeProd: any) => patchDataForApi(freeProd));

  const pdpsegment = profile?.meta?.attributes?.pdpOfferSegment;

  const shippingCut =
    cart.shippingCharges - (cart.totalDutyCharges || 0) &&
    parseFloat((cart.freeShippingThreshold - cart.payableAmount + cart.shippingCharges).toFixed(2));

  /** utm params logic  */
  const utmParams = getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true) || {};
  let utmParamsPayload: any = {};
  // if utm params available & progress bar label not present
  if (Object.keys(utmParams)?.length > 0 && !progressbarMilestoneUpsellLabel) {
    Object.keys(utmParams).forEach((key: any) => {
      if (utmParams[key]) {
        utmParamsPayload[key] = utmParams[key];
      }
    });
  }

  let cartData = {
    identifier: getCartIdentifier(),
    userSegment: userSegment?.length > 0 ? userSegment : [],
    products,
    preOrderProducts,
    freeProducts,
    shippingCut: shippingCut || 0,
    netAmount: cart.payableAmount * 100, // converting rupees to paise
    appliedGlammPoints: cart.appliedGlammPoints,
    discountCode: cart.couponData?.couponCode,
    discountAmount: cart.couponData?.userDiscount,
    shippingCharges: cart?.shippingCharges * 100, // converting rupees to paise
    progressbarNextMilestone,
    pdpsegment: pdpsegment?.length > 0 ? pdpsegment : [],

    /* UTM data passed to ds call */
    ...utmParamsPayload,
  };

  return cartData;
};

export const addToBagUpsellAnalytics = (product: any, upsellTitle: string, upsellKey?: string) => {
  let category = "";
  if (product?.productCategory) {
    const categoryIndex = product?.productCategory?.findIndex((x: any) => x.type === "parent");
    category = product?.productCategory?.[categoryIndex]?.name;
  }

  //creating custom product data for GA/Webengage
  const productData = getCustomDataToDisplayUpsellProduct(product);

  upsellAddToBagClickEvent(product, upsellTitle, upsellKey);
  // #region // *WebEngage [16] - Product Add To Cart -  : GA Function
  productData && GAaddToCart(GAAddProduct(productData, category), category);
};

export async function getPersonalisedUpsellWidget(slug: string): Promise<UpsellData | Record<string, never>> {
  const widgetApi = new WidgetAPI();
  return await widgetApi
    .getWidgets({ where: { slugOrId: slug } })
    .then(({ data: res }) => {
      const { commonDetails } = res?.data?.data?.widget?.[0] || {};

      /* Patching Raw Response to Custom for Better Understandabilty */
      if (commonDetails) {
        return {
          slug: res.data.data.slug,
          title: commonDetails.title,
          subTitle: commonDetails.subTitle,
          products:
            commonDetails.descriptionData?.[0]?.value?.length &&
            commonDetails.descriptionData[0].value?.map((prod: any) => ({ ...prod, widgetName: "upsell" })),
        };
      }
      return {};
    })
    .catch(err => {
      console.error(err);
      return {};
    });
}

// export const AdobeShippingChargesOnPayment = (
//   displayShippingOnPaymentVariant: string,
//   isShippingChargesDisplayedOnPay: boolean
// ) => {
//   if (displayShippingOnPaymentVariant === "0") {
//     if (isShippingChargesDisplayedOnPay) {
//       (window as any).evars.evar145 = "0-XO";
//       dispatchEvent(new CustomEvent("showShippingOnPayment"));
//     } else {
//       (window as any).evars.evar145 = "0-NXO";
//       dispatchEvent(new CustomEvent("showShippingOnPayment"));
//     }
//   } else if (displayShippingOnPaymentVariant === "1") {
//     if (isShippingChargesDisplayedOnPay) {
//       (window as any).evars.evar145 = "1-XO";
//       dispatchEvent(new CustomEvent("showShippingOnPayment"));
//     } else {
//       (window as any).evars.evar145 = "1-NXO";
//       dispatchEvent(new CustomEvent("showShippingOnPayment"));
//     }
//   } else {
//     console.log("dispatch");
//     dispatchEvent(new CustomEvent("showShippingOnPayment"));
//   }
// };

export const getUpsellTitleForAdobe = (variant: string) => {
  if (variant === "3") {
    return "cartupsell_tworows_with_perpicks";
  }

  return "cartupsell_tworows";
};

export const fetchSuggestedPaymentOffers = async (
  suggestedPayment: paymentSuggestion,
  payableAmount: number,
  vendorMerchantId: string
) => {
  const offerLists = new PaymentAPI();

  try {
    const response = await offerLists.getJuspayOffersList({
      customer: {
        id: checkUserLoginStatus() ? checkUserLoginStatus()?.memberId : "",
      },
      order: {
        amount: `${payableAmount}`,
        currency: getCurrency(),
        merchant_id: vendorMerchantId,
        payment_channel: "mweb",
      },
      payment_method_info: [
        {
          payment_method_type: suggestedPayment.method,
          payment_method_reference: suggestedPayment.method,
        },
      ],
    });

    if (response?.data?.status) {
      const bestOffer = response.data.data.offers.best_offer;
      return {
        bestOffer: getOfferPrice(bestOffer, suggestedPayment),
      };
    }

    return {
      bestOffer: null,
    };
  } catch (e) {
    console.error(e);

    return {
      bestOffer: null,
    };
  }
};

const getOfferPrice = (bestOffer: BestOffers, suggestedPayment: paymentSuggestion) => {
  switch (suggestedPayment.method) {
    case "UPI": {
      if (suggestedPayment.type === "collect") {
        return {
          finalPayableAmount: bestOffer?.upi_offers?.collect?.find(
            (offer: UpiCollect) => offer.vpa_handle === suggestedPayment.paymentBankCode
          )?.effective_amount,

          discountAmount: bestOffer?.upi_offers?.collect?.find(
            (offer: UpiCollect) => offer.vpa_handle === suggestedPayment.paymentBankCode
          )?.discount_amount,
        };
      }

      return {
        finalPayableAmount: bestOffer?.upi_offers?.intent?.find((offer: UpiIntent) => offer.code === suggestedPayment.meta.code)
          ?.effective_amount,

        discountAmount: bestOffer?.upi_offers?.intent?.find((offer: UpiIntent) => offer.code === suggestedPayment.meta.code)
          ?.discount_amount,
      };
    }

    case "WALLET":
      return {
        finalPayableAmount: bestOffer?.wallet_offers?.find(
          (walletOffer: WalletOffer) => walletOffer.wallet === suggestedPayment.paymentBankCode
        )?.effective_amount,
        discountAmount: bestOffer?.wallet_offers?.find(
          (walletOffer: WalletOffer) => walletOffer.wallet === suggestedPayment.paymentBankCode
        )?.discount_amount,
      };

    case "NB":
      return {
        finalPayableAmount: bestOffer?.nb_offers?.find(
          (offer: NetBankingOffer) => offer.bank === suggestedPayment.paymentBankCode
        )?.effective_amount,
        discountAmount: bestOffer?.nb_offers?.find((offer: NetBankingOffer) => offer.bank === suggestedPayment.paymentBankCode)
          ?.discount_amount,
      };

    default:
      return null;
  }
};

/** Check If certain coupons already stored in localstorage */
export const checkPrefixCouponsExist = (prefixCoupons: string[], coupon?: string) => {
  if (coupon) {
    return prefixCoupons?.some((prefix: string) => coupon.startsWith(prefix));
  } else {
    return false;
  }
};

export const paymentInitiatedBySuggestedPayments = () => {
  sessionStorage.setItem(SESSIONSTORAGE.PAYMENT_INITIATED_BY_SUGGESTED_PAYMENTS, JSON.stringify(true));
};

/* Combination and api call and updating valtio store */
export const fetchAndUpdatedCart = () => fetchCart().then(data => updateCart(data));

export const getAnalyticsOfTheUpsellProductClicked = (
  productSelected: any,
  upsellProducts: cartProduct[],
  shippingCharges: number,
  payableAmount: number,
  upsellVariantValue: string,
  cartUpsellBuckets?: { min: number; max: number }[]
) => {
  const indexOfTheProduct = upsellProducts.findIndex((product: cartProduct) => product.productId === productSelected.id);
  const findProductSku = upsellProducts.find((product: cartProduct) => product.sku === productSelected.sku)?.sku;
  const getUpsellPayableBucket =
    (cartUpsellBuckets?.length &&
      cartUpsellBuckets?.find(
        (bucket: { min: number; max: number }) => payableAmount >= bucket.min && payableAmount <= bucket.max
      )?.max) ||
    0;

  (window as any).evars.evar156 = `${findProductSku}_${indexOfTheProduct + 1}_${
    getUpsellPayableBucket / 100
  }_${shippingCharges}_${upsellVariantValue}`;
};

export const fetchUpsellProducts = async (cart: userCart, giftCardUpsellVariant: string) => {
  const cartApi = new CartAPI();
  try {
    const response = await cartApi.getUpsellData({
      payload: createDSUpsellPayload({ cart, couponFreeProductData: undefined }),
      giftCardUpsellVariant,
    });

    if (response?.data.data) {
      const result = response.data.data;
      return {
        upsellProducts: result.products?.map((prod: any) => ({ ...prod, widgetName: "upsell" })),
        upsellData: result,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export const fetchGiftCards = async (cart: userCart) => {
  const cartApi = new CartAPI();
  try {
    const response = await cartApi.getUpsellGiftCard(createDSUpsellPayload({ cart, couponFreeProductData: undefined }));
    if (response?.data.data) {
      const result = response.data.data;
      return {
        upsellProducts: result.products?.map((prod: any) => ({ ...prod, widgetName: "upsell" })),
        upsellData: result,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export const removeGiftCardProductFromCart = async (products: cartProduct[]) => {
  const giftCard = getLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, true);
  const upsellData = getLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, true);
  const isGiftCardPresent = !!isGiftCardFromPhase1(products);
  const giftCardVariant = getSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT);
  try {
    if (giftCardVariant === "2" && isGiftCardPresent) {
      const response = await updateProducts(
        { ...giftCard, type: giftCard.subProductType, upsellKey: upsellData?.key, variantValue: upsellData?.variantValue },
        -1
      );
      removeLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT);
      if (response) {
        addToBag(response);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const removeGiftCardFromShoppingBag = async (products: cartProduct) => {
  const upsellData = getLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, true);
  try {
    const response = await updateProducts(
      { ...products, type: products.type, upsellKey: upsellData?.key, variantValue: upsellData?.variantValue },
      -1
    );
    removeLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT);
    setLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY, true, true);
    if (response.status) {
      addToBag(response);
      fetchAndUpdatedCart();
      adobeRemoveGiftCard(products, "Remove GC");
    }
  } catch (err) {
    console.error(err);
  }
};
