import CartAPI from "@libAPI/apis/CartAPI";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { getMobileOperatingSystem } from "@libUtils/getDeviceOS";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { binSeries, cartProduct, freeProductData, userCart } from "@typesLib/Cart";
import { User, UserAddress } from "@typesLib/Consumer";
import {
  ClientAuthDetails,
  BestOffers,
  DutyModalProps,
  GiftCard,
  NetBankingOffer,
  PaymentOrder,
  PaymentType,
  SavedCardList,
  PaymentData,
  UpiIntent,
  UpiIntentApp,
  WalletOffer,
} from "@typesLib/Payment";

import { cartCustomRepsonseLayer } from "../Cart/HelperFunc";
import { FallBackPaymentOrder } from "../constant/PaymentOrder.constant";
import { checkUserLoginStatus, getCouponandPoints } from "../Storage/HelperFunc";
import router from "next/router";
import { GAInitiateCheckout } from "@libUtils/analytics/gtm";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import axios from "axios";
import { showError } from "@libUtils/showToaster";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { adobePayErrMessageEvent } from "./Payment.Analytics";
import { cartState, paymentSuggestion } from "@typesLib/Redux";
import { CART_REDUCER, CONSTANT_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import MyGlammAPI from "@libAPI/MyGlammAPI";
import { getCookie } from "@libUtils/cookies";

/**
 * Set Up Data for Analytics to submit
 * @param socketResponse -Response From Socket
 * @param type - Type of Payment Method
 */
export function setAnalyticsLocally(socketResponse: any, type: PaymentType) {
  try {
    // Event logic object creation START
    let gtnIds = "";
    const prodGaArr: any = [];
    const actionField: any = {};

    const { products, preProduct, freeProducts, userInfo, paymentDetails } = socketResponse;

    let taxAmount = 0;
    let cartItemsCount = 0;

    const fbObj: any = {
      value: formatPrice(socketResponse?.paymentDetails?.orderAmount),
      gtnIds: "",
      PaymentMethod: type === "cash" ? "COD" : "PG",
      Identity: userInfo.identifier,
      Discount: paymentDetails.discountAmount,
      OrderAmount: formatPrice(paymentDetails?.orderAmount),
      OrderNumber: socketResponse.orderNumber,
      PhoneNumber: userInfo.phoneNumber,
    };

    [...products, ...preProduct, ...freeProducts].forEach(product => {
      /* Custom Product Object for GA */
      prodGaArr.push({
        id: product.sku,
        name: product.name,
        price: formatPrice(product.price),
        quantity: product.quantity,
        brand: product.brandName,
        parentCategory: product?.parentCategory?.filter((category: any) => category.type === "parent")?.[0]?.name ?? "",
        childCategory: product?.parentCategory?.filter((category: any) => category.type === "child")?.[0]?.name ?? "",
        subChildCategory: product?.parentCategory?.filter((category: any) => category.type === "subChild")?.[0]?.name ?? "",
        shadeLabel: product.shadeLabel,
        discount: product.totalPrice - product.priceAfterCouponCodePerQuantity,
      });

      taxAmount += parseInt(product.taxAmount, 10);
      if (product.sku) {
        gtnIds += `${product.sku},`;
      }

      /* Evaluating No of Products for the order placed */
      cartItemsCount += product.quantity;
      if (product.freeProducts?.length) {
        cartItemsCount += product.freeProducts.length;
      }
    });

    fbObj.gtnIds = gtnIds.slice(0, -1);
    fbObj.Number_of_items = cartItemsCount;

    actionField.id = socketResponse.orderNumber || "";
    actionField.affiliation = "Online Store";
    actionField.revenue = formatPrice(paymentDetails?.orderAmount);
    actionField.tax = formatPrice(taxAmount);
    actionField.shipping = formatPrice(socketResponse.shipping_charges);
    actionField.netAmount = formatPrice(paymentDetails?.netAmount);
    actionField.cashbackAmount = formatPrice(paymentDetails?.cashbackAmount);
    actionField.discountAmount = formatPrice(paymentDetails?.discountAmount);
    actionField.goodPoints = formatPrice(paymentDetails?.paymentMode?.[0]?.amount);

    localStorage.setItem("fbObj", JSON.stringify(fbObj));
    localStorage.setItem("gaEventObject", JSON.stringify({ prodGaArr, actionField }));

    const adobeDataLS = getLocalStorageValue("adobeDataCartSummary", true);
    if (adobeDataLS) {
      adobeDataLS.shoppingBag.paymentMethod = type === "cash" ? "COD" : "PG";
      adobeDataLS.shoppingBag.transactionNo = socketResponse.orderNumber;
      adobeDataLS.shoppingBag.netPayable = formatPrice(socketResponse.paymentDetails?.orderAmount);
      adobeDataLS.shoppingBag.shippingCharges = formatPrice(socketResponse.shippingCharges);
      adobeDataLS.shoppingBag.couponCode = socketResponse.paymentDetails?.discountCode;
      adobeDataLS.shoppingBag.glammPointsApplied = socketResponse?.paymentDetails?.rewardPoints;

      setLocalStorageValue("adobeDataCartSummary", adobeDataLS, true);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Payment Method Selected Custom Click Event
 */
export const customAdobePayMethodClick = (type: PaymentType) => {
  // Adobe Analytics() - On Click - Payment Page - Payment Initiated
  if ("adobeDataCartSummary" in localStorage) {
    const adobeCart = getLocalStorageValue("adobeDataCartSummary", true);

    const isCodPrompt = sessionStorage.getItem(LOCALSTORAGE.ORDER_CREATED_THROUGH_COD_PROMPT);

    let paymentType: string = type;
    /* InCase Giftcard applied append it with the existing payment */
    if (getLocalStorageValue(LOCALSTORAGE.GIFT_CARDS, true)?.cards?.find((x: any) => x.used)) {
      if (type === "cash") paymentType = "giftCard";
      else paymentType = `${paymentType},giftCard`;
    }

    (window as any).digitalData = {
      common: {
        linkName: "web|order checkout|proceed to checkout|payment initiated",
        linkPageName: "web|order checkout| select payment method",
        assetType: "select payment method",
        newAssetType: "payment",
        newLinkPageName: "select payment method",
        subSection: "order checkout step4",
        platform: ADOBE.PLATFORM,
        ctaName: isCodPrompt && JSON.parse(isCodPrompt) ? "prompt-checkout" : "vertical-checkout",
        bankName: "",
        offerDescription: "",
        offerAmount: "",
        paymentMethodSelected: paymentType,
      },
      user: Adobe.getUserDetails(),
      product: adobeCart?.product,
      payment: adobeCart?.shoppingBag,
    };
    Adobe.Click();
  }
};

export function getGuestDetails() {
  const guest = getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS, true);

  if (guest?.name && !checkUserLoginStatus()) {
    /**
     * Generate Guest Object with required data to create guest order
     */
    const guestObj: any = {};

    [guestObj.firstName, guestObj.lastName] = guest.name.split(" ");
    guestObj.lastName = guestObj.lastName || "";
    guestObj.phoneNumber = guest.phoneNumber;
    guestObj.email = guest.email;

    const addressObj = {
      ...guest,
      defaultFlag: "false",
      meta: {
        source: "",
        appVersion: "app 100",
        deviceType: "",
        deviceId: "",
      },
    };
    guestObj.address = {
      shippingAddress: {
        ...addressObj,
      },
      billingAddress: {
        ...addressObj,
      },
    };
    return guestObj;
  }

  return {};
}

/**
 * Enable Whatsapp if disabled for guest user and user prompted to enable it
 */
export function handleEnableWhatsapp() {
  const isWAEnabled = getLocalStorageValue(LOCALSTORAGE.WHATSAPP_ENABLED, true);

  if (typeof isWAEnabled === "boolean" && isWAEnabled) {
    const profile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

    /* Hit Enable Whatsapp call only in-case user doesn't have already enabled it */
    if (profile?.id && profile.communicationPreference?.whatsApp === false) {
      const consumerApi = new ConsumerAPI();

      consumerApi
        .communicationPrefernce(
          {
            ...profile.communicationPreference,
            whatsApp: true,
          },
          profile.id
        )
        .catch(err => console.error(err));
    }
  }
}

/**
 * Get's Shippping Address for a user if any address present mapped to it
 * @returns Address Object
 */
export const getShippingAddress = async (): Promise<UserAddress | null> => {
  const isLoggined = checkUserLoginStatus();
  if (isLoggined) {
    const consumerApi = new ConsumerAPI();

    return await consumerApi
      .getAddress({ identifier: isLoggined.memberId, statusId: 1 })
      .then(({ data: allAddress }) => {
        let addressList: Array<UserAddress> = allAddress.data?.data;

        if (!Array.isArray(addressList)) return null;
        if (!CART_REDUCER?.cart?.allowIntShipping) {
          // assuming that international will be done only for india
          addressList = addressList?.filter(address => {
            return (
              address?.isoCode3 === undefined || address?.isoCode3 === (CONSTANT_REDUCER?.isdCodes?.[0]?.isoCode3 || "IND")
            );
          });
        }

        /* By Default Store all the addresses and set the index 0 as the shiping address */
        USER_REDUCER.userAddress = addressList;
        let [shippingAddress] = addressList;

        /* Check in Session if some address Id present then return it's whole object */
        const sessionAddress = addressList?.find(x => x.id === sessionStorage.getItem(SESSIONSTORAGE.SHIPPING_ID));
        if (sessionAddress?.id) shippingAddress = sessionAddress;
        else {
          /* In-case a default Address Present in listing */
          const defaultAddress = addressList?.find(x => x.defaultFlag === "true");
          if (defaultAddress) shippingAddress = defaultAddress;
        }

        USER_REDUCER.shippingAddress = shippingAddress;

        return shippingAddress;
      })
      .catch(handleAddressError);
  }

  return Promise.resolve(null);
};

function handleAddressError(err: Error) {
  console.error(err);
  alert("Something Went Wrong!!! Please Try Again");

  return Promise.reject(err);
}

export function getFormattedAddress(address: UserAddress) {
  if (address) {
    if (address.uiTemplate === "template_are") {
      return `${address.apartment} ${address.area}, ${address.location}, ${address.cityName}, ${address.countryName}`.replace(
        /\\\\/g,
        ""
      );
    }

    return `${address.flatNumber || ""} ${address.societyName || ""} ${address.location}, ${address.landmark || ""}${
      address.cityName
    }, ${address.zipcode}, ${address.stateName}`.replace(/\\\\/g, "");
  }

  return "";
}

/**
 * Checks Whether ther's a change in duty based on the new Address comparing old and new cart
 * @param currentCart
 * @param shippingAddress
 */
export async function checkDutyChanges(currentCartDuty: number, shippingAddress: UserAddress): Promise<DutyModalProps | false> {
  const { coupon, gp } = getCouponandPoints();
  sessionStorage.setItem(SESSIONSTORAGE.CITY_ID, shippingAddress.cityId);
  const cartApi = new CartAPI();
  const { data: rawCartData } = await cartApi.updateCart(coupon, gp, shippingAddress?.zipcode);
  const cartData = cartCustomRepsonseLayer(rawCartData.data);

  /* Comparing Old and New Cart Duty Charges */
  if (cartData.totalDutyCharges !== currentCartDuty) {
    return { rawCartData, cartData, shippingAddress };
  }

  return false;
}

/**
 * Payment Order API Call - Based on this the position and the whether a payment
 * is active or not decided
 */
export function getJuspayPaymentOrder(): Promise<{ juspay_merchant_key: string; payment_methods: PaymentOrder }> {
  const paymentApi = new PaymentAPI();

  return paymentApi
    .getJuspayPaymentMethodOrder()
    .then(({ data: payMethods }: any) => payMethods.data)
    .catch((err: any) => {
      console.error(err);
      return FallBackPaymentOrder;
    });
}

export function getBinSeriesPaymentOrder(binseriesData?: binSeries): PaymentOrder[] | null {
  const { bankName, paymentMethods } = binseriesData || {};

  if (bankName && paymentMethods?.value) {
    // @ts-ignore
    return paymentMethods.value.reduce((accState, curState, position) => {
      if (curState === "creditOrDebitCard") {
        return [
          ...accState,
          {
            active: true,
            position,
            isBin: true,
            fields: [],
            name: "CARD",
          },
        ];
      }
      if (curState) {
        return [
          ...accState,
          {
            active: true,
            position,
            isBin: true,
            fields: [],
            name: "netBankingBin",
          },
        ];
      }
      return accState;
    }, []) as unknown as PaymentOrder[];
  }

  return null;
}

export const commonOrderCreationData = (paymentData: PaymentData, paymentOrder: PaymentOrder[], consent = true) => {
  switch (paymentData?.method) {
    case "upi":
      return {
        type: getMethodaDatabyName(paymentOrder, "upi")?.gateway,
        methodData: {
          method: paymentData.method,
          vpa: paymentData.name,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: {
              type: "collect",
              name: paymentData.name,
              value: { razorpay: paymentData.name, payu: paymentData.name },
            },
            consent,
          },
        },
      };

    case "wallets":
    case "netbanking":
      const methodKey = paymentData.method === "wallets" ? "wallet" : "bank";
      const { gateway, data } = getMethodaDatabyName(paymentOrder, paymentData.method) || {};

      /* Handled Suggested as well as normal Pay data value(Name/Code) */
      const WN_DATA =
        (paymentData.name && data[paymentData.name]) ||
        (paymentData.name && getMethodaDatabyCode(data, paymentData.name, gateway));

      return {
        type: gateway,
        methodData: {
          method: paymentData.method.replace("wallets", "wallet"),
          [methodKey]: WN_DATA?.value[gateway || "razorpay"],
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { name: paymentData.name, value: WN_DATA?.value },
            consent,
          },
        },
      };

    case "paytm":
    case "paypal":
      const detailName = paymentData.method === "paytm" ? "Paytm Wallet" : "PayPal";

      return {
        type: paymentData.method,
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { name: detailName, value: {} },
            consent,
          },
        },
      };

    case "simpl":
      const chargeToken = getLocalStorageValue(LOCALSTORAGE.SIMPL_TOKEN);

      return {
        type: paymentData.method,
        methodData: { simpl: { chargeToken } },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { name: "Simpl", value: { simpl: { chargeToken } } },
            consent,
          },
        },
      };

    default:
      return null;
  }
};

export const getSuggestedPaymentOrderCreationData = (paymentData: paymentSuggestion, consent: boolean) => {
  switch (paymentData?.method) {
    case "UPI":
      return {
        type: "juspay",
        methodData: {
          method: "upi",
          vpa: paymentData,
        },
        metaData: {
          paymentMethod: {
            method: "upi",
            details: {
              type: paymentData.type,

              name: paymentData.name,
              value:
                paymentData.type === "intent"
                  ? {
                      app_name: getUserDeviceForUpiIntentFlow(paymentData.meta)?.appLink,
                      app_code: paymentData.meta?.android_package,
                    }
                  : { upi_vpa: paymentData.paymentBankCode, app_code: paymentData.paymentBankCode },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };

    case "NB":
      return {
        type: "juspay",
        methodData: {
          method: "netbanking",
          bank: paymentData.meta.name,
        },
        metaData: {
          paymentMethod: {
            method: "netbanking",
            details: {
              name: paymentData.meta.name,
              value: {
                bank_code: paymentData.meta.code,
              },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };
    case "WALLET":
      return {
        type: "juspay",
        methodData: {
          method: "wallet",
          bank: paymentData.meta.name,
        },
        metaData: {
          paymentMethod: {
            method: "wallet",
            details: {
              name: paymentData.meta.name,
              value: {
                wallet_code: paymentData.meta.code,
              },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };

    case "creditCard":
    case "CARD":
      return {
        type: "juspay",
        methodData: {
          method: paymentData.method,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { value: {} },
            consent,
          },
        },
      };
    case "CRED":
      return {
        type: "juspay",
        methodData: {
          method: paymentData.method,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: {
              value: {
                isCredAppPresent: false,
              },
              type: "collect",
            },
            consent,
          },
        },
      };
    default:
      return null;
  }
};

export const getJuspayOrderCreationData = (paymentData: PaymentData, paymentOrder: PaymentOrder[], consent = true) => {
  switch (paymentData?.method) {
    case "UPI":
      return {
        type: "juspay",
        methodData: {
          method: "upi",
          vpa: paymentData.name,
        },
        metaData: {
          paymentMethod: {
            method: "upi",
            details: {
              type: paymentData.upiFlowType,

              name:
                paymentData.upiFlowType === "collect"
                  ? paymentData.vpa
                  : getUserDeviceForUpiIntentFlow(paymentData.selectedAppForUpiIntent)?.name,
              value:
                paymentData.upiFlowType === "intent"
                  ? {
                      app_name: getUserDeviceForUpiIntentFlow(paymentData.selectedAppForUpiIntent)?.appLink,
                      app_code: paymentData.selectedAppForUpiIntent?.android_package,
                    }
                  : { upi_vpa: paymentData.vpa, app_code: paymentData.selectedAppForUpiIntent?.android_package },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };

    case "WALLET":
      return {
        type: "juspay",
        methodData: {
          method: "wallet",
          bank: paymentData?.bankName || getBankName(paymentOrder, paymentData),
        },
        metaData: {
          paymentMethod: {
            method: "wallet",
            details: {
              name: paymentData.bankName || getBankName(paymentOrder, paymentData),
              value: {
                wallet_code: paymentData.wallet,
              },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };
    case "NB":
      return {
        type: "juspay",
        methodData: {
          method: "netbanking",
          bank: paymentData.bankName || getBankName(paymentOrder, paymentData),
        },
        metaData: {
          paymentMethod: {
            method: "netbanking",
            details: {
              name: paymentData.bankName || getBankName(paymentOrder, paymentData),
              value: {
                bank_code: paymentData.bank,
              },
            },
            consent,
          },
          payment_channel: "mweb",
        },
      };

    case "paytm":
    case "paypal":
      const detailName = paymentData.method === "paytm" ? "Paytm Wallet" : "PayPal";

      return {
        type: paymentData.method,
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { name: detailName, value: {} },
            consent,
          },
        },
        payment_channel: "mweb",
      };

    case "simpl":
      const chargeToken = getLocalStorageValue(LOCALSTORAGE.SIMPL_TOKEN);

      return {
        type: paymentData.method,
        methodData: { simpl: { chargeToken } },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { name: "Simpl", value: { simpl: { chargeToken } } },
            consent,
          },
        },
        payment_channel: "mweb",
      };

    case "creditCard":
      return {
        type: "juspay",
        methodData: {
          method: paymentData.method,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: { value: { save_to_locker: paymentData.saveCardDetails } },
            consent,
          },
        },
      };

    case "CRED":
      return {
        type: "juspay",
        methodData: {
          method: paymentData.method,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: {
              value: {
                isCredAppPresent: false,
              },
              type: "collect",
            },
            consent,
          },
        },
      };

    case "TWID":
      return {
        type: "juspay",
        methodData: {
          method: paymentData.method,
        },
        metaData: {
          paymentMethod: {
            method: paymentData.method,
            details: {
              value: {},
            },
            consent,
          },
        },
      };

    default:
      return null;
  }
};

// Create order payload based on payment gateway
export const getOrderCreationData = (
  paymentData: PaymentData | paymentSuggestion,
  paymentOrder: PaymentOrder[],
  isSuggestedPaymentOrder?: boolean,
  consent = true
) => {
  if (SHOP.ENABLE_JUSPAY && isSuggestedPaymentOrder) {
    return getSuggestedPaymentOrderCreationData(paymentData as paymentSuggestion, consent);
  }
  if (SHOP.ENABLE_JUSPAY) {
    return getJuspayOrderCreationData(paymentData as PaymentData, paymentOrder, (consent = true));
  }
  return commonOrderCreationData(paymentData as PaymentData, paymentOrder, (consent = true));
};

const getUserDeviceForUpiIntentFlow = (selectedApp?: UpiIntentApp) => {
  if (!selectedApp) return;
  /* send the app launch link according to the user device */
  if (getMobileOperatingSystem() === "iOS") {
    return { name: selectedApp.name, appLink: selectedApp.ios_package };
  }
  if (getMobileOperatingSystem() === "Android" && selectedApp?.android_package) {
    return { name: selectedApp.name, appLink: selectedApp.web_package };
  }
  return { name: selectedApp?.name, appLink: selectedApp?.web_package };
};

export const getBankList = (paymentOrder: PaymentOrder[], paymentData: PaymentData) => {
  return paymentOrder.find((method: any) => method.name === paymentData.method)?.data;
};

export const getBankName = (paymentOrder: PaymentOrder[], paymentData: PaymentData) => {
  return getBankList(paymentOrder, paymentData)?.find(
    (bank: { code: string; name: string }) => bank.code === (paymentData.bank || paymentData.wallet)
  )?.name;
};

export function getMethodaDatabyName(paymentOrder: PaymentOrder[], methodName: string) {
  return paymentOrder.find((data: any) => data.name.toLowerCase() === methodName);
}

export function getMethodaDatabyCode(data: any, code: string, gateway?: string) {
  return data[Object.keys(data).find((x: any) => data[x].value[gateway || "razorpay"] === code) as string];
}

export function getGiftCardArray() {
  const GIFT_CARDS: Array<GiftCard> | undefined = getLocalStorageValue(LOCALSTORAGE.GIFT_CARDS, true)?.cards;

  /* If any giftcard present that is used move forward */
  if (GIFT_CARDS?.length && GIFT_CARDS.find(x => x.used)) {
    let value = 0; // totalRedeemed Value

    const giftCards = GIFT_CARDS.filter(x => x.used).map(card => {
      value += card.used * 100;
      return { giftCardNumber: card.cardNumber, amount: card.used * 100 };
    });

    return [{ type: "giftCard", value, giftCards }];
  }

  return [];
}

export const getExpectedDeliveryVariant = () => {
  if (SHOP.EXPECTED_DELIVERY_VARIANT) {
    return SHOP.EXPECTED_DELIVERY_VARIANT;
  }

  return "0";
};

export const getStickyCheckbox = ({
  variant,
  checkData,
  stickySubscriptionText,
}: {
  variant: string;
  checkData: boolean;
  stickySubscriptionText: string;
}) => {
  localStorage.setItem("subscriptionoptinstatus", "");
  if (variant === "0") {
    (window as any).evars.evar110 = variant;
  }

  if (variant === "1") {
    if (stickySubscriptionText) {
      (window as any).evars.evar110 = `${variant}|sticky:true`;
      if (checkData) {
        localStorage.setItem("subscriptionoptinstatus", "y");
        (window as any).evars.evar109 = "1";
      } else {
        localStorage.setItem("subscriptionoptinstatus", "n");
        (window as any).evars.evar109 = "0";
      }
    } else {
      (window as any).evars.evar110 = `${variant}|sticky:false`;
    }
  }
};

export const getDowntimeStatus = (
  paymentOrder: PaymentOrder[],
  isCodEnable: boolean,
  codDisableMessage: any,
  isCredEligible: boolean,
  isSimplEligible: boolean,
  isSimplEligibleMessage: any
) => {
  const credEligibilityStatus = `isCred:${isCredEligible}|label:${isCredEligible ? "eligible" : "Ineligible"}`;
  const SimplEligibilityStatus = `isSimpl:${isSimplEligible}|label:${isSimplEligibleMessage}`;
  const CodEligibilityStatus = `isCoD:${isCodEnable}|label:${!isCodEnable ? codDisableMessage : "null"}`;
  const UpiDownTimeStatus = paymentOrder?.find((payment: any) => payment.name === "UPI")?.downtimes?.status ?? "up";
  return `upi:${UpiDownTimeStatus}|${CodEligibilityStatus}|${SimplEligibilityStatus}|${credEligibilityStatus}`;
};

export const fetchOffersForCard = async ({ clientAuthToken, payload }: { clientAuthToken: string; payload?: any }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_JUSPAY_CARD_OFFER_URL}`, payload, {
      headers: {
        client_auth_token: clientAuthToken,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getCardInfo = (savedCardsList: SavedCardList[]) => {
  let cardInfo: any = [];

  savedCardsList.forEach((card: SavedCardList) => {
    cardInfo.push({
      payment_method_type: "CARD",
      payment_method: card.card_brand ?? "",
      card_type: card.card_type,
      payment_method_reference: card.card_token,
      card_token: card.card_token,
      bank_code: card.juspay_bank_code,
      card_alias: card.card_fingerprint,
    });
  });

  return cardInfo;
};
export const getFinalAmountAfterDiscount = ({
  bestOffer,
  paymentMethod,
  selectedBank,
}: {
  paymentMethod: string;
  selectedBank: string;
  bestOffer?: BestOffers;
}) => {
  switch (paymentMethod) {
    case "wallet":
      return bestOffer?.wallet_offers?.find((walletOffer: WalletOffer) => walletOffer.wallet === selectedBank)
        ?.effective_amount;
    case "upi":
      return bestOffer?.upi_offers?.intent?.find((offer: UpiIntent) => offer.code === selectedBank)?.effective_amount;
    case "NB":
      return bestOffer?.nb_offers?.find((offer: NetBankingOffer) => offer.bank === selectedBank)?.effective_amount;
    default:
      return null;
  }
};

export const checkIfCouponOrPointsAvailable = ({ zeroPayableAmount, cart, giftCards }: any) => {
  if (
    zeroPayableAmount &&
    !cart.productCount &&
    !cart.couponData?.userDiscount &&
    !cart.appliedGlammPoints &&
    !giftCards.find((x: any) => x.used)
  ) {
    router.push("/shopping-bag");
  } else {
    GAInitiateCheckout(cart);
  }
};

export const createOrderPayload = ({
  dsExpectedDeliveryDate,
  userCart,
  shippingAddress,
  type,
  otherPayload,
  isNewOrderFlowEnabled,
  codEnabledForSubscription,
  experimentVariants,
  userRedeemedGlammPoints,
}: any) => {
  const deliveryDateExperimentVariant = getExpectedDeliveryVariant();
  const urlParams = `${router.locale !== "en-in" ? `?lang=${router.locale}` : ""}`;

  /* For Simpl passs simplToken in payment's meta data */
  const simplData = type === "simpl" ? { simpl: { chargeToken: getLocalStorageValue(LOCALSTORAGE.SIMPL_TOKEN) } } : {};

  /* Add Product Id of Coupon Free Product if Available */
  const userDiscountFreeProductsIds: Array<string> = [];
  if (LOCALSTORAGE.DISCOUNT_PRODUCT_ID in localStorage) {
    userDiscountFreeProductsIds.push(getLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID)!);
  }

  const successURL = `${location.origin}${getStaticUrl(`/api/psuccess${urlParams}`)}`;
  const cancelUrl = `${location.origin}${getStaticUrl(`/api/pfailed${urlParams}`)}`;

  const CALLBACK_URL = ["simpl", "paytm", "paypal"].includes(type)
    ? successURL
    : `${location.origin}${getStaticUrl(`/api/juspayCallback${urlParams}`)}`;

  const shippingOnPaymentVariant = sessionStorage.getItem(LOCALSTORAGE.SHIPPING_CHARGES_ON_PAYMENT_VARIANT);

  const isPaymentInitiatedBySuggestedPayment = sessionStorage.getItem(SESSIONSTORAGE.PAYMENT_INITIATED_BY_SUGGESTED_PAYMENTS);

  const {
    variant,
    pdpRecurringSubscriptionVariant,
    orderReConfirmationVariant,
    changeShadeAddressVariant,
    cancellationReasonExp,
  } = experimentVariants;
  const getExperimentsData = () => {
    let experimentsData: any = [];

    /*  pdpRecurringSubscriptionVariant - evar157, ComboPDPUi - evar164, cartProgressBar - evar159 */
    const {
      evar85,
      evar87,
      evar91,
      evar96,
      evar104,
      evar105,
      evar119,
      evar121,
      evar138,
      evar139,
      evar144,
      evar152,
      evar153,
      evar155,
      evar156,
      evar157,
      evar159,
      evar163,
      evar164,
      evar166,
      evar171,
      evar172,
      evar173,
      evar178,
      evar149,
      evar182,
      evar183,
      evar185,
      evar188,
      evar189,
    } = (window as any)?.evars;

    const evar185Variant = getCookie("st-pdpRevamp")?.split("__")?.[0] || evar185?.split("|")?.[0].trim();
    const warehouseVariant = getSessionStorageValue(SESSIONSTORAGE.WAREHOUSE_VARIANT);
    const upsellComboVariant = getSessionStorageValue(SESSIONSTORAGE.UPSELL_COMBO_VARIANT);
    const guestCheckoutVariant = getSessionStorageValue(SESSIONSTORAGE.GUEST_PAYMENT_FLOW_VARIANT, true);
    const cartUpsellVariant = getCookie("st-cartUpsellVariant")?.split("__")?.[0] || evar87;

    if (evar172 && evar172 !== "no-variant") {
      experimentsData.push({
        experimentName: "upsellOnPayments",
        experimentVariant: evar172,
      });
    }

    if (evar166) {
      experimentsData.push({
        experimentName: "comboCartUi",
        experimentVariant: evar166,
      });
    }

    if (shippingOnPaymentVariant) {
      experimentsData.push({
        experimentName: "shippingonpayment",
        experimentVariant: shippingOnPaymentVariant,
      });
    }

    if (evar159 && evar159 !== "no-variant") {
      experimentsData.push({
        experimentName: "ShippingChargeCoupon",
        experimentVariant: evar159,
      });
    }

    if (pdpRecurringSubscriptionVariant && pdpRecurringSubscriptionVariant !== "no-variant") {
      if (evar157 && evar157 !== "no-variant") {
        experimentsData.push({
          experimentName: "recurringsubscription",
          experimentVariant: evar157,
        });
      }
    }

    if (evar164 && evar164 !== "no-variant") {
      experimentsData.push({
        experimentName: "comboPdpUi",
        experimentVariant: evar164,
      });
    }

    if (evar171 && evar171 !== "no-variant") {
      experimentsData.push({
        experimentName: "orderreConfirmationPagevariant",
        experimentVariant: evar171,
      });
    }

    if (evar156 && evar156 !== "no-variant") {
      experimentsData.push({
        experimentName: "mycupsize",
        experimentVariant: evar156,
      });
    }

    if (getSessionStorageValue("changeShadeSelectionId")) {
      experimentsData.push({
        experimentName: "changeSelectionCombo",
        experimentVariant: evar178,
      });
    }

    if (evar104 && evar104 !== "no-variant") {
      experimentsData.push({
        experimentName: "lowerCogs",
        experimentVariant: evar104,
      });
    }

    if (evar149 && evar149 !== "no-variant") {
      experimentsData.push({
        experimentName: "giftCardUpsell",
        experimentVariant: `${evar149}`,
      });
    }

    if (evar121 && evar121 !== "no-variant") {
      experimentsData.push({
        experimentName: "scrollUpsellRowsTogether",
        experimentVariant: evar121,
      });
    }

    if (evar183 && evar183 !== "no-variant") {
      experimentsData.push({
        experimentName: "codText",
        experimentVariant: evar183,
      });
    }

    if (evar182 && evar182 !== "no-variant") {
      experimentsData.push({
        experimentName: "glammCoinRedemption",
        experimentVariant: evar182,
      });
    }

    if (warehouseVariant) {
      experimentsData.push({
        experimentName: "warehouseVariant",
        experimentVariant: warehouseVariant,
      });
    }

    if (upsellComboVariant) {
      experimentsData.push({
        experimentName: "upsellComboVariant",
        experimentVariant: upsellComboVariant,
      });
    }

    if (evar189 && evar189 !== "no-variant") {
      experimentsData.push({
        experimentName: "giftCardPaymentPhase2",
        experimentVariant: `evar189-v${evar189}`,
      });
    }

    if (evar188 && evar188 !== "no-variant") {
      experimentsData.push({
        experimentName: "gcPayment",
        experimentVariant: `evar188-v${evar188}`,
      });
    }

    if (evar185Variant) {
      experimentsData.push({
        experimentName: "PdpRevamp",
        experimentVariant: evar185Variant !== "no-variant" ? `v${evar185Variant}` : "no-variant",
      });
    }

    if (cartUpsellVariant) {
      experimentsData.push({
        experimentName: "cartUpsell",
        experimentVariant: cartUpsellVariant,
      });
    }

    if (evar144) {
      experimentsData.push({
        experimentName: "categoryRanking",
        experimentVariant: evar144,
      });
    }

    if (evar91) {
      experimentsData.push({
        experimentName: "searchRanking",
        experimentVariant: evar91,
      });
    }

    if (evar96) {
      experimentsData.push({
        experimentName: "widgetonAddtocart",
        experimentVariant: evar96 !== "no-variant" ? evar96 : "no-variant",
      });
    }

    if (evar173) {
      experimentsData.push({
        experimentName: "collectionRanking",
        experimentVariant: evar173,
      });
    }

    if (evar138) {
      experimentsData.push({
        experimentName: "listingpageWidget",
        experimentVariant: evar138,
      });
    }
    if (evar155) {
      experimentsData.push({
        experimentName: "productpageWidget",
        experimentVariant: evar155,
      });
    }
    if (evar153) {
      experimentsData.push({
        experimentName: "pdpBanner",
        experimentVariant: evar153,
      });
    }
    if (evar163) {
      experimentsData.push({
        experimentName: "suggestedPaymentUsed",
        experimentVariant: evar163 !== "no-variant" ? `evar163-v${evar163}` : "evar163-no-variant",
      });
    }

    if (evar139) {
      experimentsData.push({
        experimentName: "dynamicDSoffer",
        experimentVariant: evar139,
      });
    }
    if (evar119) {
      experimentsData.push({
        experimentName: "glammClubUpsell",
        experimentVariant: evar119,
      });
    }

    if (evar152) {
      experimentsData.push({
        experimentName: "widgetonViewsimilar",
        experimentVariant: evar152,
      });
    }

    if (evar105) {
      experimentsData.push({
        experimentName: "MiniPDPonCollection",
        experimentVariant: evar105,
      });
    }

    if (guestCheckoutVariant) {
      experimentsData.push({
        experimentName: "guestCheckoutVariant",
        experimentVariant: guestCheckoutVariant,
      });
    }

    return experimentsData;
  };

  return {
    isGlammPointProgramm: userRedeemedGlammPoints,
    dsExpectedDeliveryDate,
    identifier: userCart.identifier,
    couponCode: userCart.couponData?.couponCode || "",
    address: {
      billingAddressId: shippingAddress?.id || "",
      shippingAddressId: shippingAddress?.id || "",
    },
    paymentData: [
      {
        type,
        value: userCart.payableAmount * 100,
        successURL: SHOP.ENABLE_JUSPAY ? CALLBACK_URL : successURL,
        cancelURL: SHOP.ENABLE_JUSPAY ? CALLBACK_URL : cancelUrl,
        meta: {
          ...simplData,
          ...(otherPayload || {}),
        },
      },
      {
        type: "glamm",
        value: userCart.appliedGlammPoints || 0,
      },
      ...getGiftCardArray(),
    ],
    userDiscountFreeProductsIds,
    meta: {
      suggestedPaymentUsed: isPaymentInitiatedBySuggestedPayment ? JSON.parse(isPaymentInitiatedBySuggestedPayment) : false,
      shippingonpayment: shippingOnPaymentVariant ? shippingOnPaymentVariant : undefined,
      deliveryDateExperimentVariant,
      deviceType: `${IS_DESKTOP ? "Desktop" : "Mobile"}_Website`,
      browser: `${navigator.appCodeName}/${navigator.appVersion}`,
      referralCode: getLocalStorageValue(LOCALSTORAGE.REFERRAL_CODE) || "",
      checkoutType: "vertical",
      paymentExperimentVariant: isNewOrderFlowEnabled && !codEnabledForSubscription ? "1" : "0",
      codExperimentVariant:
        type === "cash"
          ? (FEATURES?.isCodOrderFlowEnabled || variant === "1") && !codEnabledForSubscription
            ? "1"
            : "0"
          : undefined,
      affiliate: LOCALSTORAGE.REFERRAL_CODE in localStorage,
      bestCouponAutoApplied: getLocalStorageValue(LOCALSTORAGE.BEST_COUPON_AUTO_APPLIED) || "0",
      /* Affiliate Vendor passed to order's call */
      ...(LOCALSTORAGE.AFFILIATE_VENDOR in localStorage
        ? { affiliate_vendor: getLocalStorageValue(LOCALSTORAGE.AFFILIATE_VENDOR) }
        : {}),
      /* UTM data passed to order's call */
      ...(getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true) || {}),
      myOrderPagevariant: "1",
      experimentVariants: getExperimentsData(),
      orderEditVariant: changeShadeAddressVariant?.changeShadeAndAddress,
      orderCancellationVariant: cancellationReasonExp,
      trialSkus: getTrialSKUs(userCart?.products || []),
    },
    consumerDetails: { ...getGuestDetails() },
    guestOrder: !checkUserLoginStatus(),
    ...(MyGlammAPI.Filter.AddressCountryCode && { addressCountyCode: MyGlammAPI.Filter.AddressCountryCode }),
  };
};

const getTrialSKUs = (cartProducts: cartProduct[]) => {
  return cartProducts?.filter((product: any) => product?.productMeta?.isTrial).map((product: any) => product?.sku || "");
};

export const createPayTmForm = (gatewayResponselogs: any) => {
  /**
   * -------- PAYTM Form ----------
   * Create HTML form with received data from socket
   * and make a request to paytm callback url this will
   * redirect consumer to paytm payment page.
   */
  const form = document.createElement("form");

  form.name = "patymForm";
  form.method = "post";
  form.action = gatewayResponselogs.paytmUrl || process.env.NEXT_PUBLIC_PAYTM_URL;

  Object.keys(gatewayResponselogs.paytmObj).forEach(key => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = gatewayResponselogs.paytmObj[key];
    form.appendChild(input);
  });

  const checksumInput = document.createElement("input");

  checksumInput.type = "hidden";
  checksumInput.name = "CHECKSUMHASH";
  checksumInput.value = gatewayResponselogs.checksum;

  form.appendChild(checksumInput);

  document.body.appendChild(form);

  form.submit();
};

export const getTwidPayableAmount = ({
  payableAmount,
  bestOffer,
  offerApplicable,
  twidBalance,
}: {
  payableAmount: number;
  bestOffer?: BestOffers;
  offerApplicable?: boolean;
  twidBalance: number;
}) => {
  let amount;

  if (twidBalance > 0) {
    amount = payableAmount - twidBalance;

    return `₹${amount}`;
  }

  if (twidBalance > 0 && offerApplicable && bestOffer && bestOffer.effective_amount) {
    amount = payableAmount - twidBalance - parseInt(bestOffer.effective_amount);
    return `₹${amount}`;
  }

  if (twidBalance === 0 && offerApplicable && bestOffer && bestOffer.effective_amount) {
    amount = payableAmount - parseInt(bestOffer.effective_amount);
    return `₹${amount}`;
  }

  return `₹${payableAmount}`;
};

export const getExpectedDeliveryDate = ({ minDate, maxDate, expectedDate }: any) => {
  const deliveryDateExperimentVariant = getExpectedDeliveryVariant();

  switch (deliveryDateExperimentVariant) {
    case "0":
      return expectedDate;
    case "1":
      return minDate.slice(0, minDate.length - 5) + " - " + maxDate.slice(0, maxDate.length - 5);

    case "2":
      return minDate;
    case "3":
      return maxDate;
    default:
      return;
  }
};

export const createRazorPayForm = ({ gatewayResponselogs, socketResponse, razorPayData }: any) => {
  /**
   * Consumer Billing Address provided by Socket Response
   */
  const { billingAddress } = socketResponse.data.address || {};

  const langParam = router.locale !== "en-in" ? `?lang=${router.locale}` : "";

  /**
   * Razor pay Options Data
   */
  (window as any)
    .Razorpay({
      key: GBC_ENV.NEXT_PUBLIC_RAZORPAY_KEY,
      image: SHOP.LOGO,
      callback_url: `${location.origin}${getStaticUrl(`/api/rzsuccess${langParam}`)}`,
      redirect: true,
    })
    .createPayment({
      amount: gatewayResponselogs.amount, // Should be in Paisa
      currency: gatewayResponselogs.currency,
      email: socketResponse.data.userInfo.email,
      contact: socketResponse.data.userInfo.phoneNumber,
      notes: {
        address: `${billingAddress?.location}, ${billingAddress?.cityName}
                              , ${billingAddress?.zipcode}.`,
      },
      order_id: gatewayResponselogs.id,
      ...razorPayData,
    });
};

export const showErrorMessageForCardsTxns = (message: string) => {
  adobePayErrMessageEvent(`pay-v3.js|${message || ""}`); // event166
  showError(message, 3000);
  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

/* check if saved card feature is enabled or not */
export const isSavedCardEnabled = (paymentOrder: PaymentOrder[]) => {
  return paymentOrder.find((payment: any) => payment.name === "CARD")?.isSaveCardEnabled ?? false;
};

export const checkCredEligibilty = async () => {
  const paymentApi = new PaymentAPI();
  try {
    const response = await paymentApi.checkEligibility({ paymentMethod: "CRED" });
    if (response?.data?.status) {
      return {
        isEligible: response.data.data[0].metaData.isEligible,
        credData: response.data.data[0].metaData.layout,
        paymentMethod: response.data.data[0].metaData.payment_method,
      };
    }

    return {
      isEligible: response.data.data[0].metaData.isEligible,
      credData: null,
      paymentMethod: response.data.data[0].metaData.payment_method,
    };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const handleVerifyUpiId = async (UpiValue: string) => {
  const paymentApi = new PaymentAPI();
  try {
    const data = await paymentApi.JuspayValidateUPI(UpiValue);
    const { status, message } = data.data.data;

    return {
      status,
      message,
    };
  } catch (err: any) {
    return err?.response?.data?.message;
  }
};

export const createPayloadForCardOffers = ({
  suggestedPayment,
  profile,
  payableAmount,
  vendorMerchantId,
  clientAuthDetails,
}: {
  suggestedPayment: paymentSuggestion;
  profile: User;
  payableAmount: number;
  vendorMerchantId: string;
  clientAuthDetails: ClientAuthDetails;
}) => {
  return {
    customer: {
      id: clientAuthDetails.customerId,
      email: profile?.email,
      phone: profile?.phoneNumber,
    },
    order: {
      amount: `${payableAmount}`,
      currency: getCurrency(),
      merchant_id: vendorMerchantId,
      payment_channel: "mweb",
    },
    payment_method_info: [
      {
        payment_method_type: "CARD",
        payment_method: suggestedPayment.meta?.payment_method,
        card_type: suggestedPayment.meta?.card_type,
        payment_method_reference: suggestedPayment.meta?.card_token,
        card_token: suggestedPayment.meta?.card_token,
        bank_code: suggestedPayment.meta?.bank_code,
        card_alias: suggestedPayment.meta?.card_alias,
      },
    ],
  };
};

export const isGiftCardFromPhase1 = (products: cartProduct[]) => {
  const giftCard = getLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, true);
  return products?.find(product => giftCard?.sku === product?.sku);
};

export const isGiftCardFromPhase2 = (miscProducts: any[]) => {
  return miscProducts?.find(product => product.moduleName === 2);
};
