import React, { useEffect, useRef, useState } from "react";
import PopupModal from "./PopupModal";
import CardIcon from "../../../public/svg/icon_card.svg";
import { paymentSuggestion, ReduxStore } from "@typesLib/Redux";
import useTranslation from "@libHooks/useTranslation";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { PaymentData, PaymentType } from "@typesLib/Payment";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { showErrorMessageForCardsTxns } from "@checkoutLib/Payment/HelperFunc";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { paymentInitiatedBySuggestedPayments } from "@checkoutLib/Cart/HelperFunc";

const CardCVVModal = ({
  show,
  onClose,
  paymentDetails,
  handleCreateOrder,
  cardOffer,
}: {
  show: boolean;
  onClose: () => void;
  paymentDetails: paymentSuggestion;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => any;
  cardOffer: any;
}) => {
  const { t } = useTranslation();

  const juspayCvvInput = useRef<any>();
  const orderId = useRef<any>("");

  const [isLoading, setIsLoading] = useState(false);
  const [isCvvCodeValid, setIsCvvCodeValid] = useState(false);

  const vendorMerchantId = useSelector((store: ValtioStore) => store.paymentReducer.vendorMerchantId);

  useEffect(() => {
    if ((window as any).Juspay?.Setup && show) {
      setTimeout(() => {
        juspayCvvInput.current = (window as any).Juspay?.Setup({
          payment_form: `#${paymentDetails.meta.card_token}`,

          error_handler: function (error_code: string, error_message: string) {
            if (error_code === "FAILURE") {
              showErrorMessageForCardsTxns(error_message);
            }
          },
          iframe_elements: {
            security_code: {
              /* Class name of the <div> which will hold the iframe element for card security code. */
              container: ".security_code_div",
              attributes: {
                /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
                placeholder: "Enter CVV",
              },
            },
          },
          styles: {
            /* Add the styling for card security code input field here */
            ".security_code": {
              "line-height": "2px",
              "font-size": "14px",
              padding: "10px",
              "border-width": "1px",
              border: "1px solid #dedede",
              "border-radius": "4px",
            },
            /* Add the styling to be added to input fields in focus state */
            ":focus": {},
          },

          iframe_element_callback: function (event: any) {
            if (!["focus", "onready"].includes(event.type)) {
              setIsCvvCodeValid(event.valid);
            }
          },
        });
      }, 200);
    }
  }, []);

  const handleProcessOrder = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    setIsLoading(true);

    paymentInitiatedBySuggestedPayments();

    await handleCreateOrder("juspay", {
      method: "creditCard",
    });

    const orderDetails = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);

    if (orderDetails) {
      orderId.current.value = orderDetails.id;

      /* submit the juspay form */
      juspayCvvInput.current.submit_form();
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <PopupModal show={show} onRequestClose={onClose}>
      <div className="bg-white p-2 rounded-t-lg">
        <div className="flex justify-center mt-3">
          <CardIcon />
        </div>
        <p className="text-center mt-3 px-5">
          Enter your <span className="font-bold">3-digit CVV</span> for your {paymentDetails.meta.long_label}
        </p>
        <form
          className="juspay_inline_form"
          id={paymentDetails.meta.card_token}
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <input type="hidden" className="merchant_id" value={vendorMerchantId} />
          <input type="hidden" className="order_id" id="order_id" ref={orderId} />
          <input type="hidden" className="card_token" value={paymentDetails.meta.card_token} />
          <input type="hidden" className="card_isin" value={paymentDetails.meta.card_bin} />
          <input type="hidden" className="offers" value={cardOffer?.offers[0]?.offer_id ?? ""} />
          <input type="hidden" className="redirect" value="true" />
          <div className="flex justify-center items-center mt-3 ">
            <div
              className="security_code_div"
              style={{
                height: "40px",
                width: "100px",
              }}
            ></div>
            <div className="w-1/3 text-xs ml-3">{t("cvvInfo")}</div>
          </div>

          <div className="flex justify-between items-center mt-4 border-t-2 border-gray-100 pt-3">
            <button
              onClick={onClose}
              className="text-sm flex items-center text-gray-400 font-semibold uppercase py-3 px-16 justify-evenly  rounded"
            >
              {t("back")}
            </button>
            <button
              type="submit"
              disabled={isLoading || !isCvvCodeValid}
              onClick={handleProcessOrder}
              className="text-sm flex items-center text-white font-semibold uppercase py-3 px-16 justify-evenly bg-ctaImg rounded make_payment"
            >
              {t("proceed")}
              {isLoading && <LoadSpinner className="inset-0 m-auto w-5" />}
            </button>
          </div>
        </form>
      </div>
    </PopupModal>
  );
};

export default React.memo(CardCVVModal);
