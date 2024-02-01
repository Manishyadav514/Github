import React, { memo, useEffect, useRef, useState } from "react";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { PaymentType, PaymentData } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import WhatsappEnabeCheckbox from "./WhatsappEnableCheckbox";
import { showErrorMessageForCardsTxns } from "@checkoutLib/Payment/HelperFunc";

const SavedCardsCVVInput = ({
  handleCreateOrder,
  selectedCardToken,
  cardBinNumber,
  finalPayableAmount,
  offerId,
}: {
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => any;
  selectedCardToken: string;
  cardBinNumber: string;
  finalPayableAmount: number;
  offerId: string;
}) => {
  const { t } = useTranslation();
  const juspayCvvInput = useRef<any>();
  const orderId = useRef<any>("");

  console.log("order id", orderId);

  const [isCvvCodeValid, setIsCvvCodeValid] = useState<boolean>(false);

  const { vendorMerchantId, payableAmount } = useSelector((store: ValtioStore) => ({
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    payableAmount: store.cartReducer.cart.payableAmount,
  }));

  useEffect(() => {
    if ((window as any).Juspay?.Setup) {
      juspayCvvInput.current = (window as any).Juspay.Setup({
        payment_form: `#${selectedCardToken}`,
        success_handler: function (status: any) {},
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
          /*
           *  The following information will be available in the event object:
           *  1. event.target_element - (security_code) Name of the field field which generated this event.
           *
           *  2. event.valid - (true/false) This explains whether the value inside the input field of target_element is valid or not.
           *
           *  3. event.empty - (true/false) This explains whether the input field of target_element is empty or not.
           *
           *  4. event.card_brand - MASTERCARD/VISA/MAESTRO/AMEX/DINERS/DISCOVER/JCB/RUPAY
           *
           */
          if (!["focus", "onready"].includes(event.type)) {
            setIsCvvCodeValid(event.valid);
          }
        },
      });
    }
  }, []);

  const handleOrder = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    await handleCreateOrder("juspay", {
      method: "creditCard",
    });
  };

  const onOrderSuccess = () => {
    const orderDetails = getLocalStorageValue(LOCALSTORAGE.ORDER_DETAILS, true);
    if (orderDetails) {
      orderId.current.value = orderDetails.id;
      /* submit the juspay form */
      juspayCvvInput.current.submit_form();
    }
  };

  useEffect(() => {
    addEventListener("creditDebitSuccess", onOrderSuccess);
    return () => {
      removeEventListener("creditDebitSuccess", onOrderSuccess);
    };
  }, []);

  const commonFormStyles = {
    height: "40px",
    width: "100px",
  };

  return (
    <React.Fragment>
      <div className="px-12">
        <WhatsappEnabeCheckbox />
      </div>
      <form
        className="juspay_inline_form"
        id={selectedCardToken}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input type="hidden" className="merchant_id" value={vendorMerchantId} />
        <input type="hidden" className="order_id" id="order_id" ref={orderId} />
        <input type="hidden" className="card_token" value={selectedCardToken} />
        <input type="hidden" className="card_isin" value={cardBinNumber} />
        <input type="hidden" className="offers" value={offerId} />
        <input type="hidden" className="redirect" value="true" />

        <div className="flex items-center justify-center mt-2">
          <div className="security_code_div" style={commonFormStyles}></div>
          <button
            className="bg-black text-white px-7 py-3 text-sm font-semibold rounded-sm ml-8 uppercase make_payment"
            onClick={handleOrder}
            type="submit"
            disabled={!isCvvCodeValid}
          >
            {t("pay")} {formatPrice(finalPayableAmount ? finalPayableAmount : payableAmount, true, false)}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default memo(SavedCardsCVVInput);
