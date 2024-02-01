import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { PaymentOffers } from "@typesLib/Payment";
import MyGlammAPI from "../MyGlammAPI";

type SimplPayload = {
  amount: number; // In Paise
  phone: string; // Without Country Code
  fingerprint: string;
};

class PaymentAPI extends MyGlammAPI {
  /**
   * Order Signature Call to report order Confirmation after
   * receiving success from Payment Gateway.
   * !This API should not be called on Client Side
   * @access Private
   */
  public orderSignature(payload: any) {
    const data = {
      ...payload,
      vendorCode: MyGlammAPI.Filter.APIVendor,
    };
    return this.myGlammV2.post(`/payment-ms/signature`, data);
  }

  /**
   * Get Available Payment Methods with their Sort Order
   */
  public getJuspayPaymentMethodOrder() {
    return this.myGlammV2.get(`/payment-v2-ms/v1/juspay/getPaymentMethods`);
  }

  /**
   * Get Available Payment Methods with their Sort Order
   */
  public getPaymentMethodOrder() {
    return this.myGlammV2.get("/payment-ms/paymentMethods?enableGiftCard=true");
  }

  /**
   * Check Simpl Payment Eligibility
   */
  public checkSimplEligibilty(payload: SimplPayload) {
    return this.myGlammV2.post(`/payment-ms/isSimplEligible`, payload);
  }

  /**
   * Validate UPI Razorpay
   */
  public validateUPI(upiValue: string) {
    return this.myGlammV2.get(`/payment-ms/validate/vpa/${upiValue}`);
  }

  public JuspayValidateUPI(upiValue: string) {
    return this.myGlammV2.post(`/payment-v2-ms/v1/juspay/verifyVpa`, {
      vpa: upiValue,
    });
  }

  /**
   * VPA Suggestion API
   */
  public VPASuggestion(upiValue: string) {
    return this.myGlammV2.get(`/payment-ms/suggest/vpa/${upiValue}`);
  }

  /**
   * Suggested Payment Method Call
   */
  public getSuggestedPaymentMethods(memberId: string) {
    return this.myGlammV2.get(`/utility-ms/suggest/paymentMethod/${memberId}`);
  }

  /**
   * Validate UPI payU
   */
  public validatePayUUPI(upiValue: string) {
    const upiPaymentData = {
      paymentRequest: {
        meta: {
          paymentMethod: {
            method: "upi",
            details: {
              type: "collect",
              name: upiValue,
              value: {
                razorpay: upiValue,
                payu: upiValue,
              },
            },
          },
        },
      },
    };

    return this.myGlammV2.post(`/payment-v2-ms/v1/payu/verifyVpa`, upiPaymentData);
  }

  /**
   * Get GiftCard Balance
   */
  public giftCardBalance(payload: any) {
    return this.myGlammV2.post(`/gift-card-ms/gcBalance`, payload);
  }

  /* Get Offers according to payment mode (except card) */
  public getJuspayOffersList = (payload: PaymentOffers) => {
    return this.myGlammV2.post("/payment-v2-ms/v1/juspay/getOffersList", {
      ...payload,
      shippingAddressId: sessionStorage.getItem(SESSIONSTORAGE.SHIPPING_ID) || "",
    });
  };

  /**
   * Check Pincode is serviceable or not
   */
  public checkPincodeIsServiceable(pinCode: string) {
    return this.myGlammV2.get(`/tms-v2-ms/isServiceable/pinCode/${pinCode}`);
  }

  public checkEligibility({ paymentMethod, orderAmount }: { paymentMethod: "CRED" | "TWID"; orderAmount?: number }) {
    return this.myGlammV2.post("/payment-v2-ms/v1/juspay/paymentMethodConsumer/eligibility", {
      data: [
        {
          paymentMethod,
          metaData: {
            isCredAppPresent: paymentMethod === "CRED" ? false : undefined,
            amount: paymentMethod === "TWID" ? orderAmount : undefined,
          },
        },
      ],
    });
  }

  public orderConversionThroughPaymentLink = (token: string) =>
    this.myGlammV2.post(`/order-ms/markOrderAsCOD?hashValue=${token}`);

  public generateUpiPaymentLink = (token: string, paymentType?: string) =>
    this.myGlammV2.post(`/order-ms/generatePaymentLink?method=upi&hashValue=${token}&type=${paymentType}`);

  public getSavedCardsList = () => this.myGlammV2.get("/payment-v2-ms/v1/juspay/cards?enabledCardsOnly=true");

  public updateCardDetails = (payload: { nickName: string; nameOnCard: string; card_reference: string }) =>
    this.myGlammV2.patch("/payment-v2-ms/v1/juspay/cards", payload);

  public deleteCard = (payload: { card_reference: string }) =>
    this.myGlammV2.delete(`/payment-v2-ms/v1/juspay/cards`, { data: payload });

  public convertCODOrderToOnline = (hashValue: string, method: string, type: string) =>
    this.myGlammV2.post(`/order-ms/codToPrepaidPaymentLink?hashValue=${hashValue}&method=${method}&type=${type}`);

  public fetchPaymentMethodsOffers = (payload: PaymentOffers) =>
    this.myGlammV2.post("/payment-v2-ms/v1/juspay/offers/multiple", {
      ...payload,
      shippingAddressId: sessionStorage.getItem(SESSIONSTORAGE.SHIPPING_ID) || "",
    });
}

export default PaymentAPI;
