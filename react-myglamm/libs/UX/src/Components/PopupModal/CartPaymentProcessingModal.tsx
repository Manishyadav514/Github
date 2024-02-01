import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { formatPrice } from "@libUtils/format/formatPrice";
import { PaymentType } from "@typesLib/Payment";
import { paymentSuggestion, ReduxStore } from "@typesLib/Redux";
import React, { useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import HomeIcon from "../../../public/svg/homeImage.svg";
import CloseIcon from "../../../public/svg/group-2.svg";

import SavingsIcon from "../../../public/svg/savings.svg";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { ValtioStore } from "@typesLib/ValtioStore";
import { paymentInitiatedBySuggestedPayments } from "@checkoutLib/Cart/HelperFunc";

const CartPaymentProcessingModal = ({
  show,
  closeModal,
  suggestedPayment,
  handleCreateOrder,
  bestOffer,
}: {
  show: boolean;
  closeModal: () => void;
  suggestedPayment: paymentSuggestion;
  handleCreateOrder: (arg1: PaymentType, arg2: paymentSuggestion, isSuggestedPaymentOrder: boolean) => void;
  bestOffer?: {
    finalPayableAmount: string | undefined;
    discountAmount: string | undefined;
  };
}) => {
  const { payableAmount, shippingAddress } = useSelector((store: ValtioStore) => ({
    shippingAddress: store.userReducer.shippingAddress,
    payableAmount: store.cartReducer.cart.payableAmount,
  }));

  useEffect(() => {
    /* Initiate the order request in 5 secs */
    let timeout: any;
    if (show) {
      timeout = setTimeout(() => {
        paymentInitiatedBySuggestedPayments();
        handleCreateOrder("juspay", suggestedPayment, true);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    /* Store the UPI details in redux for launching intent flow */
    if (suggestedPayment.method === "UPI" && suggestedPayment.type === "intent") {
      PAYMENT_REDUCER.upiAppDetails = {
        ios_package: suggestedPayment.meta.ios_package,
        code: suggestedPayment.meta.code,
        name: suggestedPayment.name,
        imageUrl: suggestedPayment.iconUrl,
        android_package: suggestedPayment.meta.android_package,
        web_package: suggestedPayment.meta.web_package,
        amount: bestOffer?.finalPayableAmount ? bestOffer?.finalPayableAmount : payableAmount,
      };
    }
  }, []);

  const displayShippingAddress = (
    <div className=" px-4 mt-3">
      <div className="flex items-start">
        <HomeIcon className="w-4 h-4 mt-1" />
        <div className="ml-2">
          <div>
            Delivery to
            <span className="font-bold"> {shippingAddress?.addressNickName}</span>
          </div>
          <div>
            <p
              className="truncate w-4/5 text-gray-600"
              dangerouslySetInnerHTML={{ __html: (shippingAddress && getFormattedAddress(shippingAddress)) ?? "" }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const displaySuggestedMethodDetails = (
    <div className="flex items-center px-4 mt-3">
      <img className="w-5 h-5" src={suggestedPayment.iconUrl} alt={suggestedPayment.name} />
      <div className="ml-2">
        Paying{" "}
        <span className="font-bold">
          {bestOffer?.finalPayableAmount
            ? formatPrice(+bestOffer?.finalPayableAmount, true, false)
            : formatPrice(payableAmount, true, false)}
        </span>{" "}
        using
        <span className="font-bold"> {suggestedPayment.name}</span>
      </div>
    </div>
  );

  const displaySavingAmount = bestOffer?.discountAmount && (
    <div className="flex items-center px-4 mt-3">
      <SavingsIcon className="w-4 h-4 mt-1" />
      <p className="ml-3">
        Saving <span className="font-bold">{formatPrice(+bestOffer?.discountAmount, true, false)}</span>
      </p>
    </div>
  );

  if (shippingAddress) {
    return (
      <>
        <PopupModal show={show} onRequestClose={closeModal}>
          <div className="bg-white  rounded-t-lg p-1">
            <div className="p-3 flex items-center justify-between border-b-2 border-gray-200 pb-2">
              <CloseIcon onClick={closeModal} className="absolute right-5 top-4 w-6 h-6" />
              <p className="text-lg font-bold">Placing Your Order</p>
            </div>
            {/* Display user Address */}
            {displayShippingAddress}

            {/* User suggested payment details */}
            {displaySuggestedMethodDetails}

            {/* Saving Amount */}
            {displaySavingAmount}

            {/* progress bar */}
            <div className="flex items-center justify-around mt-6 mb-3">
              <div className="w-9/12 bg-gray-200 rounded-full ">
                <div className="auto-coupon-modal"></div>
              </div>
              <button className="leading-2 font-bold uppercase" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </PopupModal>

        <style jsx>
          {`
            .auto-coupon-modal::after {
              content: "";
              animation: progress forwards 5s linear;
              width: 0px;
              height: 12px;
              background: green;
              border-radius: 10px;
              display: block;
            }
            @keyframes progress {
              from {
                width: 0px;
              }
              to {
                width: 100%;
              }
            }
            @-webkit-keyframes progress {
              from {
                width: 0px;
              }
              to {
                width: 100%;
              }
            }
          `}
        </style>
      </>
    );
  }
  return null;
};

export default CartPaymentProcessingModal;
