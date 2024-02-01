import { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

import { getCurrency } from "@libUtils/format/formatPrice";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { COMMON_INPUT_STYLES, PAY_CHANNEL } from "../constant/PaymentCommon.constant";
import { fetchOffersForCard, isSavedCardEnabled, showErrorMessageForCardsTxns } from "./HelperFunc";

export function useJuspaycard(isBin?: boolean, defaultOfferId = "") {
  const [binError, setBinError] = useState<boolean>(false);

  const [offerId, setOfferId] = useState<string>(defaultOfferId);

  const [discountedAmount, setDiscounttedAmount] = useState();
  const [offerDescription, setOfferDescription] = useState<string>();
  const [isTokenizeSupportApplicable, setIsTokenizeSupportApplicable] = useState<boolean>(false);

  /* states for handling card validation */
  const [isMonthValid, setIsMonthValid] = useState(false);
  const [isYearValid, setIsYearValid] = useState(false);
  const [isCvvCodeValid, setIsCvvCodeValid] = useState(false);
  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);

  const { profile, paymentReducer, cart } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
    cart: store.cartReducer.cart,
    paymentReducer: store.paymentReducer,
  }));

  const { binSeriesData, payableAmount } = cart;
  const { paymentOrder, vendorMerchantId, clientAuthDetails, juspayLoaded } = paymentReducer;

  const saveCard = paymentOrder && isSavedCardEnabled(paymentOrder) && isTokenizeSupportApplicable;

  const jusPaySetup = useRef<any>();
  const binSeriesRef = useRef<any>();

  useEffect(() => {
    if (binSeriesData && isBin) {
      binSeriesRef.current = {
        bin: binSeriesData.binSeries?.value,
      };
    }
  }, [binSeriesData, isBin]);

  /* Fetch the card offers based on card bin number  */
  const HandleFetchCardOffers = async ({
    cardBinNumber,
    cardType,
    cardBrand,
    fingerPrintToken,
    bankCode,
  }: {
    cardBinNumber: string;
    cardType: string;
    cardBrand: string;
    fingerPrintToken: string;
    bankCode: string;
  }) => {
    if (profile && payableAmount && vendorMerchantId && clientAuthDetails) {
      const payload = {
        customer: {
          id: clientAuthDetails?.customerId ?? "",
          email: profile.email,
          phone: profile.phoneNumber,
        },
        order: {
          amount: `${payableAmount}`,
          currency: getCurrency(),
          merchant_id: vendorMerchantId,
          payment_channel: PAY_CHANNEL.toLocaleLowerCase(),
        },
        payment_method_info: [
          {
            payment_method_type: "CARD",
            payment_method: cardBrand,
            card_type: cardType,
            card_bin: cardBinNumber,
            payment_method_reference: "CARD",
            card_alias: fingerPrintToken,
            bank_code: bankCode,
          },
        ],
      };

      const offers = await fetchOffersForCard({ clientAuthToken: clientAuthDetails.clientAuthToken, payload });

      /* Store the discounted amount */
      setDiscounttedAmount(offers?.best_offer_combinations?.[0]?.order_breakup?.final_order_amount);

      setOfferId(offers?.best_offer_combinations?.[0]?.offers?.[0].offer_id);
      /* Get the offer description  */
      getOfferDescription({
        offerId: offers?.best_offer_combinations?.[0]?.offers?.[0].offer_id,
        offersList: offers?.offers,
      });
    }
  };

  /* Fetch the offer  to display the offer description */
  const getOfferDescription = ({ offerId, offersList }: { offerId: string; offersList: Array<any> }) => {
    const _offerdescription = offersList.find(offer => offer.offer_id === offerId)?.offer_description?.description ?? "";
    setOfferDescription(_offerdescription);
  };

  /* fetching offers list for card payment */
  const fetchCardOffers = debounce(async (cardBinNumber: string, cardType: string, cardBrand: string, bankCode: string) => {
    let fingerPrintToken;

    /* get card fingerprint Token  */
    jusPaySetup.current?.get_card_fingerprint({
      success_handler: async function (response: any) {
        fingerPrintToken = response.card_fingerprint;

        if (fingerPrintToken) {
          await HandleFetchCardOffers({ cardBinNumber, cardType, cardBrand, fingerPrintToken, bankCode });
        }
      },
      error_handler: function (response: any) {
        console.log("got error_handler response", response);
      },
    });
  }, 2000);

  /* validate card for bin series */
  const validateCardForOffer = (cardNumber: string) => {
    const _binData = binSeriesRef.current.bin;

    if (_binData && !_binData.includes(cardNumber.slice(0, 6))) {
      setBinError(true);
    } else {
      setBinError(false);
    }
  };

  /* juspay setup */
  useLayoutEffect(() => {
    if (juspayLoaded) {
      jusPaySetup.current = (window as any).Juspay?.Setup({
        payment_form: "#payment_form",
        tokenize_support: true,

        success_handler(status: any) {
          /** */
        },
        error_handler(error_code: any, error_message: any, bank_error_code: any, bank_error_message: any, gateway_id: any) {
          if (error_code === "FAILURE") {
            showErrorMessageForCardsTxns(error_message);
          }
        },
        card_bin_info_min_digits: 9,

        customer: {
          customer_id: clientAuthDetails?.customerId ?? "",
          client_auth_token: clientAuthDetails?.clientAuthToken ?? "",
        },
        iframe_elements: {
          card_number: {
            container: ".card_number_div",
            attributes: {
              placeholder: "Card Number",
            },
          },
          name_on_card: {
            container: ".name_on_card_div",
            attributes: {
              placeholder: "Name on Card",
            },
          },
          card_exp_month: {
            container: ".card_exp_month_div",
            attributes: {
              placeholder: "MM",
            },
          },
          card_exp_year: {
            container: ".card_exp_year_div",
            attributes: {
              placeholder: "YY",
            },
          },
          security_code: {
            container: ".security_code_div",
            attributes: {
              placeholder: "CVV",
            },
          },
        },

        auto_tab_enabled: true,

        auto_tab_from_card_number: "card_exp_month",
        styles: {
          /* Add common styling for all input fields here */
          input: {},
          /* Add the styling for card number input field here */
          ".card_number": COMMON_INPUT_STYLES,
          /* Add the styling for card holder name input field here */
          ".name_on_card": COMMON_INPUT_STYLES,
          /* Add the styling for card expiry month input field here */
          ".card_exp_month": COMMON_INPUT_STYLES,
          /* Add the styling for card expiry year input field here */
          ".card_exp_year": COMMON_INPUT_STYLES,
          /* Add the styling for card security code input field here */
          ".security_code": COMMON_INPUT_STYLES,
          /* Add the styling to be added to input fields in focus state */
          ":focus": {},
        },

        iframe_element_callback(event: any) {
          console.log("event", event);
          if (event.target_element === "security_code" && !["focus", "onready"].includes(event.type)) {
            setIsCvvCodeValid(!event.valid);
          }

          if (event.target_element === "card_exp_month" && event.type === "blur") {
            setIsMonthValid(!event.valid);
          }
          if (event.target_element === "card_exp_year" && event.type === "blur") {
            setIsYearValid(!event.valid);
          }

          if (event.target_element === "card_number" && event.type === "blur") {
            setIsCardNumberValid(!event.valid);
          }

          if (event.card_isin && isBin && binSeriesData) {
            validateCardForOffer(event.card_isin);
          }

          if (event.target_element === "card_number" && event.tokenize_support) {
            setIsTokenizeSupportApplicable(true);
          }

          if (
            event.card_isin &&
            event.target_element === "card_number" &&
            event.card_type &&
            event.card_brand &&
            //check if bin series is an empty object or not
            binSeriesData &&
            Object.keys(binSeriesData).length === 0
          ) {
            fetchCardOffers(event.card_isin, event.card_type, event.card_brand, event.juspay_bank_code);
          }

          if (event.expiry_valid && event.valid && !event.empty) {
            setIsCardValid(true);
          }
        },
      });

      jusPaySetup.current?.tokenize({
        /* juspay_form is the reference of the object returned from Juspay.Setup() */
        success_handler(response: any) {
          response.token();
          response.start_payment();
        },
        error_handler(response: any) {
          /** */
        },
      });
    }
  }, [juspayLoaded]);

  return {
    CARD_STATES: { isMonthValid, isYearValid, isCvvCodeValid, isCardNumberValid, isCardValid },
    discountedAmount,
    offerDescription,
    binError,
    offerId,
    jusPaySetup,
    isTokenizeSupportApplicable,
  };
}
