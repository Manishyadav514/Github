import { format } from "date-fns";
import { hi } from "date-fns/locale";
import router from "next/router";

import AuthAPI from "@libAPI/apis/AuthAPI";
import MyGlammAPI from "@libAPI/MyGlammAPI";
import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { CURRENCY } from "@libConstants/CURRENCY.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { User } from "@typesLib/Consumer";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

import { getExpectedDeliveryDate } from "@checkoutLib/Payment/HelperFunc";
import { FallBackJuspayPaymentOrder } from "@checkoutLib/constant/PaymentOrder.constant";

import { PaymentOrder } from "@typesLib/Payment";
import { userCart } from "@typesLib/Cart";

const paymentApi = new PaymentAPI();
const clientToken = new AuthAPI();

const fallbackToCODOnly = () => {
  PAYMENT_REDUCER.paymentOrder = FallBackJuspayPaymentOrder as PaymentOrder[];
  console.error("Fallback to COD only");
};

export const fetchPaymentOrderJuspay = async () => {
  if (!PAYMENT_REDUCER.paymentOrder || PAYMENT_REDUCER.paymentOrder?.length === 0) {
    try {
      const response = await paymentApi.getJuspayPaymentMethodOrder();

      if (response?.data?.data?.payment_methods?.length === 0) {
        fallbackToCODOnly();
      } else {
        PAYMENT_REDUCER.paymentOrder = response?.data?.data?.payment_methods;
        PAYMENT_REDUCER.vendorMerchantId = response?.data?.data?.juspay_merchant_key;
      }
    } catch (err) {
      fallbackToCODOnly();
      console.error(err);
    }
  }
};

export const fetchPaymentOrder = async () => {
  try {
    const response = await paymentApi.getPaymentMethodOrder();
    PAYMENT_REDUCER.paymentOrder = response?.data?.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchAllJuspayOffers = async ({ profile, payableAmount, vendorMerchantId }: any) => {
  try {
    const response = await paymentApi.getJuspayOffersList({
      customer: {
        id: profile?.id ?? "",
      },
      order: {
        amount: `${payableAmount}`,
        merchant_id: vendorMerchantId,
        currency: CURRENCY[MyGlammAPI.Filter.CountryFilter].currency,
        payment_channel: "mweb",
      },
    });

    if (response.data.status) {
      PAYMENT_REDUCER.allJuspayOffers = response.data.data.offers;
    }
  } catch (err) {
    console.error(err);
  }
};

export const fetchDeliveryDate = async (userCart: userCart) => {
  const { dsMinExpectedDeliveryDate, dsExpectedDeliveryDate, expectedDeliveryDate } = userCart.deliverDates;

  const minDate = format(new Date(dsMinExpectedDeliveryDate), "dd MMM yyyy", {
    locale: router.locale === "hi-in" ? hi : undefined,
  });

  const maxDate = format(new Date(dsExpectedDeliveryDate), "dd MMM yyyy", {
    locale: router.locale === "hi-in" ? hi : undefined,
  });

  const expectedDate = format(new Date(expectedDeliveryDate), "dd MMM yyyy", {
    locale: router.locale === "hi-in" ? hi : undefined,
  });

  PAYMENT_REDUCER.expectedDelivery = {
    minDeliveryDate: minDate,
    maxDeliveryDate: maxDate,
    dsExpectedDeliveryDate: getExpectedDeliveryDate({ expectedDate, minDate, maxDate }),
  };
};

export const fetchClientAuthDetails = async (profile: User) => {
  try {
    const response = await clientToken.getClientAuthToken({
      memberId: profile?.id,
      mobileNumber: profile?.phoneNumber,
      memberCountry: profile?.location?.countryCode,
    });

    if (response.data.status) {
      const { client_auth_token, userId, juspay_customer_id, client_auth_token_expiry } = response.data.data.data;

      const payload = {
        clientAuthToken: client_auth_token,
        userId: userId,
        customerId: juspay_customer_id,
        clientAuthTokenExpiry: client_auth_token_expiry,
      };

      PAYMENT_REDUCER.clientAuthDetails = payload;
    }
  } catch (err) {
    console.error(err);
  }
};

export const fetchAllPaymentMethodsOffers = async ({
  profile,
  vendorMerchantId,
  payableAmount,
}: {
  profile: User;
  vendorMerchantId: string;
  payableAmount: number;
}) => {
  try {
    const payload = {
      customer: {
        id: profile.id,
      },
      order: {
        amount: `${payableAmount}`,
        currency: CURRENCY[MyGlammAPI.Filter.CountryFilter].currency,
        merchant_id: vendorMerchantId,
        payment_channel: "mweb",
      },
      payment_method_info: [
        {
          payment_method_type: "NB",
          payment_method_reference: "NB",
        },
        {
          payment_method_type: "WALLET",
          payment_method_reference: "WALLET",
        },
        {
          payment_method_type: "UPI",
          payment_method_reference: "UPI",
        },
      ],
      shippingAddressId: sessionStorage.getItem(SESSIONSTORAGE.SHIPPING_ID) || "",
    };

    const response = await paymentApi.fetchPaymentMethodsOffers(payload);

    if (response.status) {
      PAYMENT_REDUCER.paymentMethodOffers = response.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
