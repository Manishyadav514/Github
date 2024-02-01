import React, { useEffect, useState } from "react";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { paymentSuggestion } from "@typesLib/Redux";
import { fetchClientAuthDetails } from "@libStore/actions/paymentActions";

import Arrow from "../../../../public/svg/rightArrowWhite.svg";
import UpArrow from "../../../../public/svg/up-arrow.svg";
import { GiCash2Ico1 } from "@libComponents/GlammIcons";

import { useRouter } from "next/router";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useCreateOrder } from "@checkoutLib/Payment/useCreateOrder";
import { checkCredEligibilty, createPayloadForCardOffers, fetchOffersForCard } from "@checkoutLib/Payment/HelperFunc";
import useTranslation from "@libHooks/useTranslation";
import { fetchSuggestedPaymentOffers } from "@checkoutLib/Cart/HelperFunc";

import PayShippingAddress from "@libComponents/Payments/PayShippingAddress";
import CartPaymentProcessingModal from "../../PopupModal/CartPaymentProcessingModal";
import CardCVVModal from "@libComponents/PopupModal/CardCVVModal";
import PaymentSpinner from "@libComponents/Payments/PaymentSpinner";
import PaymentStatusScreen from "@libComponents/Payments/PaymentStatusScreen";
import { User } from "@typesLib/Consumer";

const SuggestedPayments = ({ suggestedPaymentList }: { suggestedPaymentList: paymentSuggestion[] }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { handleCreateOrder } = useCreateOrder();

  const [suggestedPayment, setSuggestedPayment] = useState<paymentSuggestion>();
  const [showProcessingModal, setShowProcessingModal] = useState<boolean>(false);
  const [showCVVModal, setShowCVVModal] = useState<boolean>(false);
  const [cardOffer, setCardOffer] = useState();
  const [bestOffer, setBestOffer] = useState<{
    finalPayableAmount: string | undefined;
    discountAmount: string | undefined;
  }>();

  const {
    payableAmount,
    isPincodeServiceable,
    isPaymentProcessing,
    isUpiPaymentScreenLoading,
    vendorMerchantId,
    profile,
    clientAuthDetails,
  } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
    isPaymentProcessing: store.paymentReducer.isPaymentProcessing,
    isUpiPaymentScreenLoading: store.paymentReducer.isUpiPaymentScreenLoading,
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    profile: store.userReducer.userProfile,
    clientAuthDetails: store.paymentReducer.clientAuthDetails,
  }));

  useEffect(() => {
    if (profile && suggestedPayment?.method === "CARD") fetchClientAuthDetails(profile);

    if (!clientAuthDetails) fetchClientAuthDetails(profile as User);

    /* clear the payment loaders state once component unmounts */
    return () => {
      PAYMENT_REDUCER.isUpiPaymentScreenLoading = false;
      PAYMENT_REDUCER.isPaymentProcessing = false;
    };
  }, [suggestedPayment]);

  useEffect(() => {
    if (suggestedPaymentList?.length) {
      if (suggestedPaymentList[0]?.method === "CRED") {
        /* Check eligibility for CRED */
        isUserEligibleForCred();
      } else {
        /* select the first payment method  */
        setSuggestedPayment(suggestedPaymentList[0]);
      }
    }
  }, [suggestedPaymentList]);

  useEffect(() => {
    /* Fetch offers based on suggested payment */
    if (suggestedPayment?.method === "CARD" && clientAuthDetails) {
      getCardOffers();
    } else if (suggestedPayment && !suggestedPayment.method.match(/CRED|CARD/)) {
      getOffers();
    }
  }, [suggestedPayment, clientAuthDetails]);

  /* Fetching offers for payment methods like UPI,NB,WALLETS,etc */
  const getOffers = async () => {
    if (suggestedPayment && vendorMerchantId) {
      const { bestOffer } = await fetchSuggestedPaymentOffers(suggestedPayment, payableAmount, vendorMerchantId);
      if (bestOffer) setBestOffer(bestOffer);
    }
  };

  /* fetching offers for CARDS */
  const getCardOffers = async () => {
    if (suggestedPayment && profile && clientAuthDetails && vendorMerchantId) {
      const offers = await fetchOffersForCard({
        clientAuthToken: clientAuthDetails?.clientAuthToken ?? "",
        payload: createPayloadForCardOffers({ suggestedPayment, profile, payableAmount, vendorMerchantId, clientAuthDetails }),
      });

      setBestOffer({
        finalPayableAmount: offers?.best_offer_combinations[0].order_breakup?.final_order_amount,
        discountAmount: offers?.best_offer_combinations[0].order_breakup?.discount_amount,
      });

      setCardOffer(offers?.best_offer_combinations[0]);
    }
  };

  /* Check if user is eligible for CRED */
  const isUserEligibleForCred = async () => {
    const { isEligible } = await checkCredEligibilty();
    if (isEligible) {
      suggestedPaymentList && setSuggestedPayment(suggestedPaymentList[0]);
    } else {
      suggestedPaymentList && setSuggestedPayment(suggestedPaymentList[1]);
    }
  };

  const handleProcessOrder = () => {
    if (payableAmount === 0 || suggestedPayment?.method === "COD") return handleCreateOrder("cash");

    if (suggestedPayment?.method === "CARD") return setShowCVVModal(true);

    return setShowProcessingModal(true);
  };

  const suggestedPaymentDetails = (
    <div className="px-2">
      <div onClick={() => router.push("/payment")} className="flex justify-between">
        {payableAmount === 0 ? (
          <GiCash2Ico1
            className="inline"
            width="20px"
            height="20px"
            fill="#01c717"
            viewBox="0 50 500 700"
            role="img"
            aria-labelledby="Cash On Delivery"
          />
        ) : (
          <img src={suggestedPayment?.iconUrl} alt="image" className="w-5 h-5" />
        )}

        <span className="gray-200 text-xs font-bold text-gray-400 ml-2">Payment Method</span>
        <UpArrow className="ml-3 mt-1" />
      </div>
      <div className="flex items-center justify-center mt-1">
        <div className="font-bold text-sm text-center ">{payableAmount === 0 ? t("cod") : suggestedPayment?.name}</div>

        {bestOffer?.discountAmount && (
          <div className="text-sm ml-2 font-bold text-green-700">
            {`(${t("save")} ${bestOffer?.discountAmount && formatPrice(+bestOffer?.discountAmount, true, false)})`}
          </div>
        )}
      </div>
    </div>
  );

  if (isUpiPaymentScreenLoading) return <PaymentStatusScreen />;

  if (isPaymentProcessing && suggestedPayment?.method !== "CARD") return <PaymentSpinner />;

  if (suggestedPayment) {
    return (
      <React.Fragment>
        <div className="bg-white px-2.5 py-2">
          {/* Shipping strip */}
          <PayShippingAddress showExpectedDeliveryStrip={false} />

          <div className="w-full flex justify-between">
            {/* suggested payment method */}
            {suggestedPaymentDetails}

            <button
              disabled={!isPincodeServiceable}
              onClick={handleProcessOrder}
              className="text-sm flex relative items-center text-white font-semibold uppercase py-3.5 px-12 justify-evenly bg-ctaImg rounded _analytics-gtm-place-order"
            >
              {t("pay")}{" "}
              {bestOffer?.finalPayableAmount
                ? formatPrice(+bestOffer?.finalPayableAmount, true, false)
                : formatPrice(payableAmount, true, false)}
              <Arrow className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {showProcessingModal && (
          <CartPaymentProcessingModal
            show={showProcessingModal}
            closeModal={() => setShowProcessingModal(false)}
            suggestedPayment={suggestedPayment}
            handleCreateOrder={handleCreateOrder}
            bestOffer={bestOffer}
          />
        )}

        {showCVVModal && (
          <CardCVVModal
            show={showCVVModal}
            handleCreateOrder={handleCreateOrder}
            onClose={() => setShowCVVModal(false)}
            paymentDetails={suggestedPayment}
            cardOffer={cardOffer}
          />
        )}
      </React.Fragment>
    );
  }

  return null;
};

export default SuggestedPayments;
