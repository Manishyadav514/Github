import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE, COOKIE } from "@libConstants/Storage.constant";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { getClientQueryParam } from "@libUtils/_apputils";
import Adobe from "@libUtils/analytics/adobe";

import { GA4Event, GAEcomEvent, GAorderFailed, GAorderSucess, GAPurchaseOrder } from "@libUtils/analytics/gtm";
import { deleteCookie } from "@libUtils/cookies";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { getLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";

export const initoOrderSummaryEvent = (orderStatus: string) => {
  let fbObj: any = localStorage.getItem("fbObj");
  let gaEventObject: any = localStorage.getItem("gaEventObject");

  if (orderStatus === "success") {
    fbObj = JSON.parse(fbObj);

    if (gaEventObject) {
      // GA EcomEvent
      gaEventObject = JSON.parse(gaEventObject);

      GAEcomEvent(gaEventObject.prodGaArr, gaEventObject.actionField);
      GAPurchaseOrder(fbObj?.PaymentMethod);
      const orderDetail = {
        netAmount: gaEventObject?.actionField?.revenue,
        orderNumber: gaEventObject?.actionField?.id,
        Identity: fbObj?.Identity || "",
        PhoneNumber: fbObj?.PhoneNumber || "",
        Discount: formatPrice(fbObj?.Discount) || "",
        cashbackAmount: gaEventObject?.actionField?.cashbackAmount,
        goodPoints: gaEventObject?.actionField?.goodPoints,
        discountAmount: gaEventObject?.actionField?.discountAmount,
      };
      // #region // *WebEngage [13]- Order Placed (success) : Get Data from LS
      // Get Data from localstorage.
      const webengageOrderDetails = prepareWenengageOrderPlacedDatalayer(orderDetail, orderStatus);

      if (SESSIONSTORAGE.FB_EVENT_ID in sessionStorage) {
        webengageOrderDetails.eventID = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
      }

      const { couponCode, shippingCharges } = webengageOrderDetails.ecommerce.webengage.orderDetails;

      GAorderSucess(webengageOrderDetails);
      GA4Event([
        {
          event: "purchase",

          ecommerce: {
            currency: getCurrency(),
            transaction_id: orderDetail.orderNumber,
            value: orderDetail.netAmount,
            cashback_amount: orderDetail.cashbackAmount,
            good_points: orderDetail.goodPoints,
            net_payable_amount: orderDetail.netAmount,
            discount_amount: orderDetail.discountAmount,
            tax: gaEventObject?.actionField?.tax,
            shipping: shippingCharges,
            ...(couponCode !== "" ? { coupon: couponCode } : {}),
            items: gaEventObject.prodGaArr.map((p: any, index: number) => {
              return {
                item_id: p.id,
                item_name: p.name,
                price: p.price,
                quantity: p.quantity,
                discount: p.discount,
                index,
                item_brand: p.brand,
                item_category: p.parentCategory,
                item_category_2: p.childCategory,
                item_category_3: p.subChildCategory,
                item_variant: p.shadeLabel,
                coupon: couponCode || "",
              };
            }),
          },
        },
      ]);
      // #endregion // WebEngage [13]- Order Placed (success) : Get Data from LS
    }

    localStorage.removeItem("rc");
    localStorage.removeItem("gaEventObject");
    localStorage.removeItem("webengageCartDetails");
    sessionStorage.removeItem("freeXoProduct");
    // DELETE COOKIE AFTER ORDER PLACED SUCCESSFULLY
    deleteCookie(COOKIE.UTMPARAMS);
  } else if (orderStatus === "failed") {
    fbObj = JSON.parse(fbObj);
    if (gaEventObject) {
      gaEventObject = JSON.parse(gaEventObject);
      GAEcomEvent(gaEventObject.prodGaArr, gaEventObject.actionField);
      GAPurchaseOrder(fbObj?.PaymentMethod);
      const orderDetail = {
        netAmount: gaEventObject?.actionField?.revenue,
        orderNumber: gaEventObject?.actionField?.id,
        Identity: fbObj?.Identity || "",
        PhoneNumber: fbObj?.PhoneNumber || "",
        Discount: formatPrice(fbObj?.Discount) || "",
      };
      // #region // *WebEngage [13]- Order Placed (failed) : Get Data from LS
      // Get Data from localstorage.
      const webengageOrderDetails = prepareWenengageOrderPlacedDatalayer(orderDetail, orderStatus);
      GAorderFailed(webengageOrderDetails);
      // #endregion // WebEngage [13]- Order Placed (failed) : Get Data from LS
    }
  }

  localStorage.removeItem("fbObj");
};

// #region // *WebEngage [13]- Order Placed : Prepage WebEngage Order Placed Data Layer
const prepareWenengageOrderPlacedDatalayer = (orderDetail: any, orderStatus: string) => {
  let webengageDataLayer: any = {};
  let webEngageCart: any = {};
  let webEngageShipping: any = {};
  let webEngageCheckout: any = {};
  let guestDetails: any = localStorage.getItem("guestDetails") || "";
  if (guestDetails !== "") {
    guestDetails = JSON.parse(guestDetails);
  }
  const guestShipping = {
    cityName: guestDetails?.cityName || "",
    pincode: guestDetails?.zipcode || "",
    stateName: guestDetails.stateName || "",
  };

  if ("webengageCartDetails" in localStorage) {
    let obj: any = localStorage.getItem("webengageCartDetails");
    obj = JSON.parse(obj);

    webEngageCart = obj?.cart;
    webEngageShipping = obj?.shipping || guestShipping;
    webEngageCheckout = obj?.checkout;
  }

  let checkoutWebengage: any = localStorage.getItem("checkoutWebengage");
  if (checkoutWebengage) {
    checkoutWebengage = JSON.parse(checkoutWebengage);
  }

  webengageDataLayer = {
    event: `order_${orderStatus}`,
    order_total: orderDetail.netAmount,
    order_id: orderDetail.orderNumber,
    identity: orderDetail.Identity,
    phoneNumber: orderDetail.PhoneNumber,
    discount: orderDetail.Discount,
    ecommerce: {
      webengage: {
        orderDetails: {
          userType: webEngageCart?.userType,
          items: webEngageCart?.items,
          orderId: orderDetail.orderNumber,
          cityName: webEngageShipping.cityName,
          pincode: webEngageShipping.pincode,
          state: webEngageShipping.stateName,
          paymentMethod: checkoutWebengage ? checkoutWebengage["Payment Method"] : "",
          referral: false,
          productNames: webEngageCart?.productNames,
          numberOfItems: webEngageCart?.numberOfItems,
          preOrder: webEngageCart?.preOrder,
          identity: orderDetail.Identity,
          gwp: webEngageCart?.gwp,
          pwp: webEngageCart?.pwp,
          couponCode: webEngageCart?.couponCode,
          giftCardCode: "",
          grossOrderAmount: webEngageCart?.grossOrderAmount,
          mrpRegularProducts: webEngageCart?.mrpRegularProducts,
          offerPriceDiscount: webEngageCart?.offerPriceDiscount,
          shippingCharges: webEngageCheckout?.shippingCharges,
          additionalDiscount: webEngageCart?.additionalDiscount,
          giftCardApplied: webEngageCheckout?.giftCard,
          orderAmount: webEngageCart?.orderAmount,
          discount: webEngageCart?.discount,
          glammPOINTSApplied: webEngageCart?.glammPointsApplied,
          netOrderAmount: webEngageCart?.netOrderAmount,
          status: orderStatus,
          mrpFreeProducts: webEngageCart?.mrpFreeProducts,
          webengageItemsV2: webEngageCart?.webengageItemsV2,
        },
      },
    },
  };
  return webengageDataLayer;
};

export const OrderPurchaseEvent = () => {
  const isPaymentPending = getClientQueryParam("paymentStatus") === "inPending";
  const orderStatus = getClientQueryParam("status");

  if ("adobeDataCartSummary" in localStorage && !isPaymentPending) {
    const asset = FEATURES.gamificationScreen ? "Gamification" : "order summary";
    const eventName = FEATURES.gamificationScreen ? "MyGlammXOGamification" : "order checkout";

    // Adobe Analytics[30] Page Load - Payment Success/Failure API
    const adobeDataLS = getLocalStorageValue("adobeDataCartSummary", true);

    (window as any).digitalData = {
      common: {
        pageName: `web|${eventName}|payment ${orderStatus}`,
        newPageName: `${FEATURES.gamificationScreen ? eventName : ""} payment ${orderStatus}`,
        subSection: eventName,
        assetType: asset,
        newAssetType: asset,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(),
      product: adobeDataLS?.product || [],
      orderSummary: adobeDataLS?.shoppingBag || [],
    };

    Adobe.PageLoad();

    removeLocalStorageValue("adobeDataCartSummary");
  }

  if (isPaymentPending) {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web| order checkout| order placed payment pending`,
        newPageName: `payment pending`,
        subSection: "order checkout step5",
        assetType: "order summary",
        newAssetType: "order summary",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }
};
