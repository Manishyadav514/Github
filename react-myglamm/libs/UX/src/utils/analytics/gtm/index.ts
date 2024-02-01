import { SHOP } from "@libConstants/SHOP.constant";

import { isWebview } from "@libUtils/isWebview";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { bbcEventCallback } from "@libUtils/bbcWVCallbacks";
import { cartProduct, userCart } from "@typesLib/Cart";
import { getGAProductCart } from "@checkoutLib/Cart/Analytics";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

const isWebViewBBC = () => isWebview() && SHOP.SITE_CODE === "bbc";

const tryStringifyParse = (o: any) => {
  try {
    return JSON.parse(JSON.stringify(o));
  } catch (e) {
    return o;
  }
};

/**
 *
 * @param gaEventObject  - event object containing name and parament
 */

function gaEventFunc(gaEventObject: any) {
  try {
    ConsoleLog(gaEventObject.eventname, gaEventObject.eventobject);

    if (isWebViewBBC()) {
      return;
    }

    if ("dataLayer" in window) {
      (window as any).dataLayer.push({
        event: gaEventObject.eventname,
        ecommerce: tryStringifyParse(gaEventObject?.eventobject),
        eventCallback() {
          return true;
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function GAaddToCart(product: any, category?: any) {
  console.log("product", product);
  /* CallBack To Webview for BBC */
  bbcEventCallback("Product Added to Cart", {
    productName: product?.name || product?.cms[0]?.content.name,
    currency: getCurrency(),
    outOfStock: false,
    productSKU: product.sku,
    productId: product.id,
    quantity: 1,
    packageType: "product",
    brand: "",
    price: formatPrice(product.price),
    offerPrice: formatPrice(product.offerPrice),
    cart_id: "",
    product_id: "",
    name: "",
    sourceValue: "Card",
    screenName: "Cart",
    action: "Click",
  });

  const eventObj: any = {};
  const productGaObj: any = {};

  productGaObj.price = product.price > product.offerPrice ? formatPrice(product.price) : formatPrice(product.offerPrice);
  productGaObj.offerPrice = formatPrice(product.offerPrice);
  productGaObj.id = product.sku;
  productGaObj.name = product.name ? product.name : product?.cms[0]?.content?.name || "";
  productGaObj.category = category || "";
  productGaObj.brand = product?.brand?.name || "";
  productGaObj.variant = "";
  productGaObj.quantity = 1;
  productGaObj.upsellMainHeading = product.upsellHeading;
  if (product.productMeta) {
    productGaObj.Preorder = product.productMeta.isPreOrder;
    // if (data.inviteCode !== undefined && data.inviteCode !== null) {
    //   productGaObj["Invite code"] = data.inviteCode;
    // } else {
    //   productGaObj["Invite code"] = "";
    // }
  }
  const productCart: any = [];
  productCart.push(productGaObj);
  eventObj.eventname = "addToCart";
  eventObj.eventobject = {
    ecommerce: {
      currencyCode: getCurrency(),
      add: {
        products: productCart,
      },
    },
    webengage: {
      addToCart: product.webengage || {},
    },
  };
  gaEventFunc(eventObj);

  console.log({ productGaObj });

  GA4Event([
    {
      event: "add_to_cart",
      ecommerce: {
        currency: getCurrency(),
        value: productGaObj.offerPrice,
        items: [
          {
            item_id: productGaObj.id,
            item_name: productGaObj.name,
            price: productGaObj.offerPrice,
            quantity: 1,
            item_list_id: `ds_${productGaObj.upsellHeading?.split(" ").join("_").toLowerCase()}`,
            item_list_name: productGaObj.upsellHeading,
          },
        ],
      },
    },
  ]);
}

/** GA event for checkout_step_2 */
function GACheckoutStep(cartSummary: any, productNamesArray: any) {
  const eventObject: any = {};
  let obj: any = {};
  const referralCode = localStorage.getItem("rc");
  let productNameString: any = "";
  if (productNamesArray.length > 0) {
    productNameString = productNamesArray.join(", ");
  }
  obj = {
    "Cart Value": cartSummary.payableAmount ? cartSummary.payableAmount : cartSummary.netAmount,
    "Logged in": 1,
    "Referral Code": referralCode || "",
    "Product Names": productNameString || "",
  };
  eventObject.eventname = "Proceed to Pay"; // "checkout_step_2";
  eventObject.eventobject = obj;
  gaEventFunc(eventObject);
}
/** GA event for checkout_step_2 */

/**
 * @description - get executed on checkout initiate
 * @param productObj
 */
function GAcheckoutInitiate(userCart: userCart) {
  const eventObject: any = {
    eventobject: {
      checkout: {
        actionField: {
          step: 1,
        },
        products: getGAProductCart(userCart.allProducts),
      },
      webengage: {
        checkout: {
          shippingCharges: userCart.shippingCharges,
          giftCard: "",
          couponDiscount: userCart.couponData?.userDiscount,
        },
      },
    },
  };
  eventObject.eventname = "checkout";
  gaEventFunc(eventObject);
}

function GAInitiateCheckout(userCart: userCart) {
  const eventObject: any = {
    eventobject: {
      checkout: {
        products: getGAProductCart(userCart.allProducts),
        ["Cart Value"]: userCart.payableAmount,
      },
    },
  };
  eventObject.eventname = "Initiate Checkout";
  gaEventFunc(eventObject);
}

/**
 *@description - purchase event
 * @param paytype
 */
function GAPurchaseOrder(paytype: any) {
  const eventObject: any = {
    eventobject: {
      checkout: {
        actionField: {
          step: 3,
          option: paytype,
        },
      },
    },
  };
  eventObject.eventname = "checkout";
  gaEventFunc(eventObject);
}

/**
 *
 * @param orderDetail
 * @param utmObject
 */
function GAorderSucess(orderDetail: any, utmObject?: any) {
  const orderData = orderDetail.ecommerce.webengage.orderDetails;

  /* CallBack To Webview for BBC */
  bbcEventCallback("Order Placed", {
    products: orderData.items.map((product: any) => ({
      id: product["Product Id"],
      brand: "",
      price: product["Product Price"],
      quantity: product["Product Quantity"],
      name: product["Product Name"],
      product_type: "product",
      sku: product["Product SKU"],
    })),
    sourceValue: "Card",
    screenName: "Order Success",
    action: "Click",
    BBC_id: "",
    BBC_name: orderData.productNames,
    BBC_title: orderData.productNames,
    BBC_page: (window as any).location.href,
    orderId: orderDetail.order_id,
    cityName: orderData.cityName,
    pincode: orderData.pincode,
    state: orderData.state,
    numberOfItems: orderData.numberOfItems,
    couponCode: orderData.couponCode,
    grossOrderAmount: orderData.grossOrderAmount,
    discount: orderData.discount,
    babychakraRewardPoints: orderData.glammPOINTSApplied,
    status: "success",
    orderAmount: orderData?.orderAmount,
    paymentMethod: orderData.paymentMethod,
    netOrderAmount: orderData.netOrderAmount,
    shippingCharges: orderData.shippingCharges || 0,
    productNames: orderData.productNames,
    referral: orderData.referral,
    phoneNumber: orderDetail.phoneNumber,
    mrpRegularProducts: orderData.mrpRegularProducts,
    paymentType: "",
    offerPriceDiscount: orderData.offerPriceDiscount,
  });

  const pixelObject: any = orderDetail;
  if (utmObject && utmObject?.utm_source) {
    pixelObject.utm_source = utmObject.utm_source ? utmObject.utm_source : "";
  }
  ConsoleLog(pixelObject.event, pixelObject);
  if ("dataLayer" in window) {
    (window as any).dataLayer.push(pixelObject);
  }
}

/**
 *
 * @param orderDetail
 * @param utmObject
 */
function GAorderFailed(orderDetail: any, utmObject?: any) {
  const orderData = orderDetail.ecommerce.webengage.orderDetails;

  /* CallBack To Webview for BBC */
  bbcEventCallback("Payment Failed", {
    products: orderData.items.map((product: any) => ({
      id: product["Product Id"],
      brand: "",
      price: product["Product Price"],
      quantity: product["Product Quantity"],
      name: product["Product Name"],
      product_type: "product",
      sku: product["Product SKU"],
    })),
    sourceValue: "Card",
    screenName: "Order Failed",
    action: "Click",
    BBC_id: "",
    BBC_name: orderData.productNames,
    BBC_title: orderData.productNames,
    BBC_page: (window as any).location.href,
    orderId: orderDetail.order_id,
    cityName: orderData.cityName,
    pincode: orderData.pincode,
    state: orderData.state,
    numberOfItems: orderData.numberOfItems,
    couponCode: orderData.couponCode,
    grossOrderAmount: orderData.grossOrderAmount,
    discount: orderData.discount,
    babychakraRewardPoints: orderData.glammPOINTSApplied,
    status: "failed",
    orderAmount: orderData?.orderAmount,
    paymentMethod: orderData.paymentMethod,
    netOrderAmount: orderData.netOrderAmount,
    shippingCharges: orderData.shippingCharges || 0,
    productNames: orderData.productNames,
    referral: orderData.referral,
    phoneNumber: orderDetail.phoneNumber,
    mrpRegularProducts: orderData.mrpRegularProducts,
    paymentType: "",
    offerPriceDiscount: orderData.offerPriceDiscount,
  });

  const pixelObject: any = orderDetail;
  if (utmObject && utmObject?.utm_source) {
    pixelObject.utm_source = utmObject.utm_source ? utmObject.utm_source : "";
  }
  ConsoleLog(pixelObject.event, pixelObject);
  if ("dataLayer" in window) {
    (window as any).dataLayer.push(pixelObject);
  }
}

/**
 * @description - events gets fired on order summary page
 * @param productObj - product array
 * @param actionObj
 */
function GAEcomEvent(productObj: any, actionObj: any) {
  // window['dataLayer'].push({
  const eventObject: any = {
    eventobject: {
      purchase: {
        actionField: actionObj,
        products: productObj,
      },
    },
  };
  eventObject.eventname = "ecomm_event";
  gaEventFunc(eventObject);
}

/**
 * @description - common page view function for GTM
 * @param url - current path ot path e.g :- '/product/productslug'
 * @param extraParameter - extra value in object which are using in GTM variable
 * @param pageType - pageType is valid in case of product page otherwise
 *  it is undefined. e.g:- pageType = 'product' || undefined
 */
function GAPageView(url?: any, extraParameter?: any, pageType?: any) {
  /* CallBack To Webview for BBC */
  if (extraParameter?.product && pageType === "product") {
    const { product } = extraParameter;
    bbcEventCallback("Product Viewed", {
      productName: product.name,
      productId: product["Product ID"],
      packageType: "product",
      productSKU: product["Product SKU"],
      price: product.price,
      offerPrice: product["Selling Price"],
      percentDiscount: Math.round(((product.price - product["Selling Price"]) / product.price) * 100),
    });
  }

  let dataLayerObject: any = {};
  const obj = {
    event: "Virtual Page View",
    ecommerce: {
      url: url || "/",
    },
    /**
     * ga condition satisfied if it has some value otherwise
     * it needs undefined for condition check
     */
    trackPage: pageType || undefined,
  };

  if (extraParameter) {
    dataLayerObject = { ...obj, ...extraParameter };
  } else {
    dataLayerObject = obj;
  }

  /** check for UTM and added in object */
  //   var utmObject = this.common.getUtmParameters()
  //   if (utmObject) {
  //     dataLayerObject['utm_param'] = utmObject;
  //   }

  ConsoleLog(obj.event, obj);
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push(dataLayerObject);
  }
}

/**
 *
 * @param registrationObj - Hold the value to be passed to Google tag manager
 */
function GAcompleteRegistration(registrationObj: any) {
  const eventObject: any = {
    eventobject: {
      Identity: registrationObj.Identity,
      Gender: "female",
      status: "success",
      value: 0,
      currency: getCurrency(),
      webengage: {
        userDetails: registrationObj.webengage,
        registrationCompleted: {
          medium: registrationObj.webengage.medium,
          referral: registrationObj.webengage.referral,
          userType: registrationObj.webengage.userType,
          loginType: registrationObj.webengage.loginType || "",
        },
      },
    },
  };
  eventObject.eventname = "registration_completed";
  gaEventFunc(eventObject);
}

/**
 *
 * @param loginObj - Holds the value to be passed to Google tag manger
 */
function GALoginCompleted(userDetails?: any) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        loginCompleted: {
          Identity: localStorage.getItem("memberId") || "",
          Platform: userDetails?.platform,
          "User Type": userDetails?.userType,
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          phoneNumber: userDetails?.phoneNumber,
          email: userDetails?.email,
        },
      },
    },
  };
  eventObject.eventname = "Login Completed";
  gaEventFunc(eventObject);
}

function GALogout() {
  const eventObject: any = {
    eventobject: {},
  };
  eventObject.eventname = "User Logout";
  gaEventFunc(eventObject);
}
// Skin Analyser WebEngage
function GASkinAnalyzer(screenName: string, result?: any) {
  const webengageevent: any = {};
  webengageevent.eventname = "Skin Analyser PV";
  webengageevent.eventobject = {
    webengage: {
      skinAnaPageViewed: "Skin Analyser PV",
      screenName: screenName || "",
      analyserResult: result || [],
    },
  };
  gaEventFunc(webengageevent);
}

// WebEngage Event - Glamm Club Trial Catalog Page View
function GATrialCatalog(trialCatalogPageDetails: any) {
  const eventObject: any = { eventobject: { webengage: { trialCatalogPageDetails } } };
  eventObject.eventname = "Trial Catalog Page Viewed";
  gaEventFunc(eventObject);
}

function GACartViewed(cartDetails?: any) {
  if (cartDetails) {
    /* CallBack To Webview for BBC */
    bbcEventCallback("Cart Viewed", {
      products: cartDetails?.items?.map((product: any) => ({
        id: product["Product Id"],
        brand: "",
        price: product["Product Price"],
        quantity: product["Product Quantity"],
        name: product["Product Name"],
        package_type: "product",
        sku: product["Product SKU"],
      })),
      discount: cartDetails.discount,
      cartValue: cartDetails.cartValue,
      netOrderAmount: cartDetails.netOrderAmount,
      numberOfItems: cartDetails.numberOfItems,
      orderAmount: cartDetails?.orderAmount,
      productNames: cartDetails.productNames,
      grossOrderAmount: cartDetails.grossOrderAmount,
      mrpRegularProducts: cartDetails.mrpRegularProducts,
      babychakraRewardPoints: 0,
      couponCode: cartDetails.couponCode,
      offerPriceDiscount: cartDetails.offerPriceDiscount,
    });

    // #region Option - 2 | gtm hack - clear dlv [sameer]
    const eventClearObject: any = {
      eventobject: {
        webengage: {
          cartViewed: undefined,
        },
      },
    };
    eventClearObject.eventname = "Clear Cart Viewed";
    gaEventFunc(eventClearObject);
    // #endregion

    const eventObject: any = {
      eventobject: {
        webengage: {
          cartViewed: cartDetails,
        },
      },
    };
    eventObject.eventname = "Cart Viewed";
    gaEventFunc(eventObject);

    /* Triggering Cart View too with UA */
    GA4Event([
      {
        event: "view_cart",
        ecommerce: {
          currency: getCurrency(),
          value: cartDetails?.grossOrderAmount,
          items: cartDetails?.items?.map((p: any) => {
            return {
              item_id: p["Product SKU"],
              item_name: p["Product Name"],
              price: p["Product Price"],
              quantity: p["Product Quantity"],
            };
          }),
        },
      },
    ]);
  }
}

function GAProductRemovedFromCart(removedProductDetails: any) {
  /* CallBack To Webview for BBC */
  bbcEventCallback("Product Removed From Cart", {
    products: [
      {
        brand: "",
        price: removedProductDetails.price,
        quantity: 1,
        name: removedProductDetails.productName,
        product_type: "product",
        sku: removedProductDetails.sku,
      },
    ],
    currency: removedProductDetails.currency,
    offerPrice: removedProductDetails.offerPrice,
    quantity: 1,
    price: removedProductDetails.price,
    productNames: removedProductDetails.productName,
    productSKU: removedProductDetails.productSKU,
    brand: "",
    sourceValue: "Card",
    screenName: "Cart",
    action: "Click",
    BBC_id: "",
    BBC_name: removedProductDetails.productName,
    BBC_title: removedProductDetails.productName,
    BBC_page: (window as any).location.href,
  });

  const eventObject: any = {
    eventobject: {
      webengage: {
        removedProduct: removedProductDetails,
      },
    },
  };
  eventObject.eventname = "Product Removed From Cart";
  gaEventFunc(eventObject);
}

function GAOfferApplied(offerDetails: any) {
  bbcEventCallback("Offer Applied", {
    couponCodeApplied: true,
    couponCode: offerDetails.code,
    couponCodeType: "Coupon",
    offerAmount: offerDetails.offerAmount,
    couponCodeValid: true,
  });

  const eventObject: any = {
    eventobject: {
      webengage: {
        offerApplied: offerDetails,
      },
    },
  };
  eventObject.eventname = "Offer Applied";
  gaEventFunc(eventObject);
}

function GACategoryPageViewed(categoryPageDetails: any) {
  /* CallBack To Webview for BBC */
  bbcEventCallback("Category Viewed", { categoryName: categoryPageDetails.categoryName });

  const eventObject: any = {
    eventobject: {
      webengage: {
        categoryPageDetails,
      },
    },
  };
  eventObject.eventname = "Category Page Viewed";
  gaEventFunc(eventObject);
}

function GACollectionPageViewed(CollectionPageDetails: any) {
  /* CallBack To Webview for BBC */
  bbcEventCallback("Collection Viewed", { categoryName: CollectionPageDetails.collectionName });

  const eventObject: any = {
    eventobject: {
      webengage: {
        collectionPageDetails: CollectionPageDetails,
      },
    },
  };
  eventObject.eventname = "Collection Page Viewed";
  gaEventFunc(eventObject);
}

function GALandingPageViewed(LandingPageDetails: any) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        landingPageDetails: LandingPageDetails,
      },
    },
  };
  eventObject.eventname = "Landing Page Viewed";
  gaEventFunc(eventObject);
}

function GALookPageViewed(LookPageDetails: any) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        lookPageDetails: LookPageDetails,
      },
    },
  };
  eventObject.eventname = "Look Page Viewed";
  gaEventFunc(eventObject);
}

function GAProductReviewSubmitted(productReview: any) {
  const { productName, starRating, productSku: productSKU } = productReview || {};

  /* CallBack To Webview for BBC */
  bbcEventCallback("Product Review Submitted", { productName, productSKU, starRating, packageType: "product" });

  const eventObject: any = {
    eventobject: {
      webengage: {
        productReviewDetails: productReview,
      },
    },
  };
  eventObject.eventname = "Product Review Submitted";
  gaEventFunc(eventObject);
}

function GASearched(search: any) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        searchDetails: search,
      },
    },
  };
  eventObject.eventname = "Searched";
  gaEventFunc(eventObject);
}

function GAShared(share: any) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        shareDetails: share,
      },
    },
  };
  eventObject.eventname = "Shared";
  gaEventFunc(eventObject);
}

const GAreferralInvite = (share: any) => {
  const eventObject: any = {
    eventobject: {
      webengage: {
        shareDetails: share,
      },
    },
  };
  eventObject.eventname = "Referral Invite";
  gaEventFunc(eventObject);
};

function ConsoleLog(eventType: any, eventData: any) {}

/**
 *
 * @param loginObj - Holds the value to be passed to Google tag manger
 */
function GASurveyTypeFormLoaded(formDetails?: any, formStatus?: number) {
  const eventObject: any = {
    eventobject: {
      webengage: {
        typeForm: {
          FormName: formDetails.formName || "",
          FormId: formDetails.formId,
        },
      },
    },
  };
  if (formStatus === 1) {
    eventObject.eventname = "TypeForm Loaded";
  } else {
    eventObject.eventname = "TypeForm Submitted";
  }
  gaEventFunc(eventObject);
}

function GAAddressSet(cartData: userCart) {
  const cartDetails =
    localStorage.getItem("webengageCartDetails") && JSON.parse(localStorage.getItem("webengageCartDetails") || "");

  const { cart } = cartDetails || {};

  /* CallBack To Webview for BBC */
  if (cart) {
    bbcEventCallback("Address Checkout", {
      screenName: "Address",
      productIds: "",
      BBC_name: cart.productNames,
      BBC_title: cart.productNames,
      totalPrice: cart.netOrderAmount,
      products: cart.items.map((product: any) => ({
        id: product["Product Id"],
        brand: "",
        price: product["Product Price"],
        quantity: product["Product Quantity"],
        name: product["Product Name"],
        product_type: "product",
        sku: product["Product SKU"],
      })),
      sourceValue: "Card",
      action: "Click",
      BBC_id: "",
      BBC_page: (window as any).location.href,
      shippingCharges: formatPrice(cartData.shippingCharges),
      offerPriceDiscount: cart.offerPriceDiscount,
      couponCode: cart.couponCode || "",
      orderId: "",
      discount: cart.discount,
      netOrderAmount: cart.netOrderAmount,
      numberOfItems: cart.numberOfItems,
      orderAmount: cart?.orderAmount,
      productNames: cart.productNames,
      grossOrderAmount: cart.grossOrderAmount,
      mrpRegularProducts: cart.mrpRegularProducts,
      babychakraRewardPoints: 0,
    });

    const digitalData = {
      event: "Address Confirmed",
      userType: checkUserLoginStatus() ? "Member" : "Guest",
      identity: checkUserLoginStatus() || "",
      products: cart.items.map((product: any) => ({
        id: product["Product Id"],
        brand: "",
        price: product["Product Price"],
        quantity: product["Product Quantity"],
        name: product["Product Name"],
        product_type: "product",
        sku: product["Product SKU"],
      })),
      checkout: {
        totalPrice: cart.netOrderAmount,
        shippingCharges: formatPrice(cartData.shippingCharges),
        offerPriceDiscount: cart.offerPriceDiscount,
        couponCode: cart.couponCode || "",
        orderId: "",
        discount: cart.discount,
        netOrderAmount: cart.netOrderAmount,
        numberOfItems: cart.numberOfItems,
        orderAmount: cart?.orderAmount,
        productNames: cart.productNames,
        grossOrderAmount: cart.grossOrderAmount,
        mrpRegularProducts: cart.mrpRegularProducts,
        babychakraRewardPoints: 0,
      },
    };

    if ("dataLayer" in window) {
      (window as any).dataLayer.push(digitalData);
    }
  }
}

function GAPaymentInit(cartData: userCart) {
  const cartDetails = JSON.parse(localStorage.getItem("webengageCartDetails") || "");
  const { cart } = cartDetails;

  /* CallBack To Webview for BBC */
  if (cart) {
    bbcEventCallback("Payment Initiated", {
      products: cart.items.map((product: any) => ({
        id: product["Product Id"],
        brand: "",
        price: product["Product Price"],
        quantity: product["Product Quantity"],
        name: product["Product Name"],
        product_type: "product",
        sku: product["Product SKU"],
      })),
      orderId: "",
      shipping: formatPrice(cartData.shippingCharges),
      currency: getCurrency(),
      discount: cart.discount,
      coupon_code: cart.couponCode || "",
      rewards_points: 0,
      product_names: cart.productNames,
      product_ids: cart.items.map((prod: any) => prod["Product Id"]).join(","),
    });
  }

  if ("dataLayer" in window) {
    (window as any).dataLayer.push({
      event: "payment_init",
      eventobject: {
        checkout: {
          actionField: {
            step: 3,
          },
          products: cart.items.map((product: any) => ({
            id: product["Product Id"],
            brand: "",
            price: product["Product Price"],
            quantity: product["Product Quantity"],
            name: product["Product Name"],
            product_type: "product",
            sku: product["Product SKU"],
          })),
        },
      },
    });
  }
}

function GAShopView() {
  /* CallBack To Webview for BBC */
  bbcEventCallback("Shop Viewed", "{}");
}

function GAaddToWishlist(product: any, category?: any) {
  /* CallBack To Webview for BBC */
  bbcEventCallback("Added to Wishlist", {
    productName: product?.name,
    currency: getCurrency(),
    outOfStock: false,
    productSKU: product?.sku,
    productId: product.id,
    quantity: 1,
    packageType: "product",
    brand: "",
    price: formatPrice(product.price),
    offerPrice: formatPrice(product.offerPrice),
    cart_id: "",
    product_id: "",
    name: "",
    sourceValue: "Card",
    screenName: "Cart",
    action: "Click",
  });

  const eventObj: any = {};
  const productGaObj: any = {};

  productGaObj.price = product.price > product.offerPrice ? formatPrice(product.price) : formatPrice(product.offerPrice);
  productGaObj.offerPrice = formatPrice(product.offerPrice);
  productGaObj.id = product?.sku;
  productGaObj.name = product.name ? product.name : product?.productName || "";
  productGaObj.category = category || "";
  productGaObj.brand = product?.brandName || "";
  productGaObj.variant = "";
  productGaObj.quantity = 1;
  if (product.productMeta) {
    productGaObj.Preorder = product.productMeta.isPreOrder;
  }
  const productCart: any = [];
  productCart.push(productGaObj);
  eventObj.eventname = "addToWishlist";
  eventObj.eventobject = {
    ecommerce: {
      currencyCode: getCurrency(),
      add: {
        products: productCart,
      },
    },
    webengage: {
      addToWishlist: product.webengage || {},
    },
  };
  gaEventFunc(eventObj);
  GA4Event([
    {
      event: "add_to_wishlist",
      ecommerce: {
        currency: getCurrency(),
        value: productGaObj.offerPrice,
        items: [
          {
            item_id: productGaObj.id,
            item_name: productGaObj.productName,
            price: productGaObj.offerPrice,
            quantity: 1,
          },
        ],
      },
    },
  ]);
}

function GAOfferAppliedFailed(cart: any, message: any, coupon: any, autoApplied = false) {
  const arrWebengageItems: any = [];
  let strWebengageProductsString = "";

  cart.allProducts?.forEach((product: any) => {
    const isFree = product.type !== 1 && product.type !== 3;

    arrWebengageItems.push({
      "Product Quantity": product.quantity,
      "Product Id": product.productId,
      "Product SKU": product.sku,
      "Product Name": product.name,
      "Product Is Free": isFree,
      "Product Is Pre Order": product.productMeta?.isPreOrder,
      "Product Price": isFree ? 0 : formatPrice(product.price),
    });

    strWebengageProductsString += `${product.name},`;
  });

  const webEngageDetails = {
    userID: checkUserLoginStatus() ? "Member" : "Guest",
    items: arrWebengageItems,
    couponCode: coupon,
    errorMessage: message,
    cartAmount: formatPrice(cart.payableAmount),
    productNames: strWebengageProductsString.slice(0, -1),
    couponAppliedfrom: autoApplied ? "Auto Applied" : "Applied by user",
  };
  const eventObject: any = {
    eventobject: {
      webengage: {
        couponApplicationFailed: webEngageDetails,
      },
    },
  };
  eventObject.eventname = "Coupon Application Failed";
  gaEventFunc(eventObject);
}

// This is specific to Babychakra events for GA
function GAgenericEvent(
  eventCategory: "commerce" | "Content & Community" | "engagement",
  eventAction: string,
  eventLabel: string,
  eventValue = null
) {
  if ("dataLayer" in window) {
    window.dataLayer.push({
      event: "Generic Event",
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      eventCallback: () => true,
    });
  }
}

function GAdispatchTagManagerEvents(eventName: string, data: object) {
  window.dataLayer.push({
    event: eventName,
    ...data,
    eventCallback: () => true,
  });
}

function GAUpdateDetails(eventName: string, data: object) {
  GAdispatchTagManagerEvents(eventName, data);
}

export const GA4AddPaymentInfoEvent = (userCart: userCart) => {
  return [
    {
      event: "add_payment_info",
      ecommerce: {
        currency: getCurrency(),
        value: userCart.payableAmount,
        coupon: userCart?.couponData?.couponCode ?? "",
        items: userCart.allProducts.map((product: cartProduct, index: number) => {
          return {
            item_id: product.productId,
            item_name: product.name,
            coupon: userCart?.couponData?.couponCode,
            discount: product.totalPrice - product.priceAfterCouponCodePerQuantity,
            item_variant: product.shadeLabel,
            index,
            item_category: product.productCategory?.filter((category: any) => category.type === "parent")?.[0]?.name ?? "",
            item_category2: product.productCategory?.filter((category: any) => category.type === "child")?.[0]?.name ?? "",
            item_category3: product.productCategory?.filter((category: any) => category.type === "subChild")?.[0]?.name ?? "",
          };
        }),
      },
    },
  ];
};

export function GA4Event(payloads: Array<any>) {
  if (FEATURES.enableGA4) {
    // commented to fix datadog error
    // window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    payloads.forEach((p: any) => window.dataLayer.push(JSON.parse(JSON.stringify(p))));
  }
}

function GA4promoCodeSuccess(cartData: userCart) {
  GA4Event([
    {
      event: "promocode_success",
      ecommerce: {
        discount_code: cartData?.couponData?.couponCode,
      },
    },
  ]);
}

function GA4promoCodeFailure(errorMessage: string, couponCode: string) {
  GA4Event([
    {
      event: "promocode_failure",
      ecommerce: {
        discount_code: couponCode,
        error_label: errorMessage,
      },
    },
  ]);
}

function GA4promoCodeRemove(couponCode: string) {
  GA4Event([
    {
      event: "promocode_remove",
      ecommerce: {
        discount_code: couponCode,
      },
    },
  ]);
}

export {
  GACartViewed,
  GACategoryPageViewed,
  GACollectionPageViewed,
  GALandingPageViewed,
  GALoginCompleted,
  GALogout,
  GALookPageViewed,
  GAOfferApplied,
  GAProductRemovedFromCart,
  GAProductReviewSubmitted,
  GASearched,
  GAShared,
  GAaddToCart,
  GAcompleteRegistration,
  GAorderSucess,
  GAorderFailed,
  GAPageView,
  GAEcomEvent,
  GACheckoutStep,
  GAPurchaseOrder,
  GAcheckoutInitiate,
  GASurveyTypeFormLoaded,
  gaEventFunc,
  GAAddressSet,
  GAPaymentInit,
  GAShopView,
  GAOfferAppliedFailed,
  GAaddToWishlist,
  GAInitiateCheckout,
  GAgenericEvent,
  GAdispatchTagManagerEvents,
  GAUpdateDetails,
  GAreferralInvite,
  GA4promoCodeSuccess,
  GA4promoCodeFailure,
  GA4promoCodeRemove,
  GASkinAnalyzer,
  GATrialCatalog,
};
