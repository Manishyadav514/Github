import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import { IUpiBankList } from "./index";
import { SavePaymentDetails, UpiCollectInputField, UpiSuggestions, findUpiAppWithDowntime } from "./UpiHelperComponents";
import UPILogo from "../../../../public/svg/UPI-Logo.svg";
import { UpiIntent } from "@typesLib/Payment";
import { formatPrice } from "@libUtils/format/formatPrice";
import { isWebview } from "@libUtils/isWebview";
import { SHOP } from "@libConstants/SHOP.constant";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import clsx from "clsx";
import { RadioButtonPayment } from "@libStyles/TSStyles/radio-button-payment";
import { getFinalAmountAfterDiscount } from "@checkoutLib/Payment/HelperFunc";
import { useFetchUpiMethod } from "@libHooks/useFetchUpiMethods";
import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import dynamic from "next/dynamic";

const FreeShippingStrip = dynamic(() => import("@libComponents/Cart/FreeShippingStrip"), { ssr: false });
const GetFreeShippingCTA = dynamic(() => import("../GetFreeShippingCTA"), { ssr: false });
interface IUpiJuspay {
  upiValidationError: string;
  loading: boolean;
  orderCall: (upiFlowType: "intent" | "collect", selectedBankCode: string) => void;
  handleUPISubmit: () => void;
  UPIVal: string;
  handleUPIValChange: (e: any) => void;
  setConsentChecked: (e: any) => void;
  consentChecked: boolean;
  appendSelectedSuggestion: (suggestion: string) => void;
  vpaSuggestionList: string[];
}

const UpiJuspay = ({
  upiValidationError,
  loading,
  orderCall,
  handleUPISubmit,
  UPIVal,
  handleUPIValChange,
  setConsentChecked,
  consentChecked,
  appendSelectedSuggestion,
  vpaSuggestionList,
}: IUpiJuspay) => {
  const { t } = useTranslation();

  const { upiList, downTimes, upiIntentOffers, bestOffer } = useFetchUpiMethod();

  const { payableAmount, showUpsellOnPaymentsPage } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    showUpsellOnPaymentsPage: store.paymentReducer.showUpsellOnPaymentsPage,
  }));
  const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>();

  const isBBCWebView = SHOP.SITE_CODE === "bbc" && isWebview();

  const [selectedBank, setSelectedBank] = useState<string>("");

  // console.log({ bestOffer, upiIntentOffers });

  useEffect(() => {
    /* Set the first app as selected but if it has a downtime
   filter by availability of upi app */
    if (!downTimes?.unavailablePaymentMethods) {
      setSelectedBank(upiList?.[0]?.code);
    } else {
      const unavailablePaymentMethods =
        upiList?.filter(upiCode => !downTimes?.unavailablePaymentMethods?.intent?.includes(upiCode.code))?.[0]?.code ??
        "enter_upi_id";

      setSelectedBank(unavailablePaymentMethods);
    }
  }, [upiList]);

  /* fetching offers for UPI intent  */
  useEffect(() => {
    /* fetch discounted amount from selected UPI intent bank  */
    const findSelectedBankUpiOffer = getFinalAmountAfterDiscount({ selectedBank, bestOffer, paymentMethod: "upi" });

    if (findSelectedBankUpiOffer) {
      return setAmountAfterDiscount(parseInt(findSelectedBankUpiOffer));
    }
    return setAmountAfterDiscount(payableAmount);
  }, [selectedBank, upiIntentOffers, payableAmount]);

  /* fetching offers for UPI collect flow */
  useEffect(() => {
    if (UPIVal.length > 3 && UPIVal.includes("@")) {
      /* get upi bank id  */
      const getUpiId = UPIVal.split("@")?.[1];

      /* Find the discounted amount from users upi id */
      const getUpiOffer = bestOffer?.upi_offers?.collect.filter(x => x.vpa_handle === `@${getUpiId}`);

      if (getUpiOffer) {
        return setAmountAfterDiscount(parseInt(getUpiOffer[0]?.effective_amount));
      }

      return setAmountAfterDiscount(payableAmount);
    }
  }, [UPIVal]);

  /* Store the UPI intent bank details selected by the user */
  useEffect(() => {
    const getSelectedBankResults = upiList?.find((bank: IUpiBankList) => bank.code === selectedBank);

    PAYMENT_REDUCER.upiAppDetails = {
      ...getSelectedBankResults,
      amount: amountAfterDiscount ? amountAfterDiscount : payableAmount,
    };
  }, [selectedBank, amountAfterDiscount]);

  /* display UPI intent offers */
  const showUpiIntentFlowOffers = (bankCode: string) => {
    if (upiIntentOffers.length > 0) {
      return upiIntentOffers?.map((offer: UpiIntent) => {
        if (bankCode === offer?.code) {
          return (
            <div key={offer.offer_id} className="p-1 px-2 ml-3 bg-[#edfdf5]">
              <span className="text-[#1adb80] font-semibold">
                {t("save")} {formatPrice(+offer?.discount_amount, true, false)}
              </span>
            </div>
          );
        }
      });
    }
  };

  const displayTopUpiMethods = (
    <React.Fragment>
      {upiList?.map((bank: IUpiBankList) => {
        /* Are upi apps disabled which are facing downtime */
        const isDisabled = findUpiAppWithDowntime(bank.code, downTimes?.unavailablePaymentMethods);

        return (
          <div key={bank.code} className="flex items-center mt-5">
            <label className={clsx("flex items-center w-full", isDisabled && "opacity-25 grayscale")}>
              <input
                id={bank.code}
                type="radio"
                value={bank.code}
                checked={selectedBank === bank.code}
                onChange={e => setSelectedBank(e.target.value)}
                disabled={isDisabled}
              />
              <img
                src={bank.imageUrl}
                alt={bank.name}
                className="ml-2.5 w-11 h-11 rounded-full flex justify-center border border-gray-200"
              />
              <div className="ml-3">
                <span>{bank.name}</span>
                {isDisabled && (
                  <div className="text-xxs mt-1">
                    {t("paymentDisabledReason") || "Currently disabled due to low success rates."}
                  </div>
                )}
              </div>

              {/* UPI intent flow Offers */}
              {!isDisabled && showUpiIntentFlowOffers(bank.code)}
            </label>
          </div>
        );
      })}

      {/* radio button UI CSS */}
      {RadioButtonPayment}
    </React.Fragment>
  );

  const displayUpiInput = (
    <div className="flex items-center mt-5">
      <label className="flex items-center w-full">
        <input
          type="radio"
          value="enter_upi_id"
          checked={selectedBank === "enter_upi_id"}
          onChange={() => setSelectedBank("enter_upi_id")}
        />
        <UPILogo
          className="ml-2.5 w-11 h-11 rounded-full flex justify-center border border-gray-200"
          role="img"
          aria-labelledby="enter upi id"
        />
        <span className="ml-3">Enter UPI ID </span>
      </label>
    </div>
  );

  return (
    <React.Fragment>
      <div className="mb-4 px-2" aria-hidden="true">
        {/* Hide UPI intent flow on babyChakra app webview */}
        {isBBCWebView ? (
          <UpiCollectInputField
            UPIVal={UPIVal}
            handleUPIValChange={handleUPIValChange}
            upiValidationError={upiValidationError}
          />
        ) : (
          <>
            {/* UPI intent apps */}
            {displayTopUpiMethods}

            {/** Enter UPI Id manually */}
            {displayUpiInput}

            {selectedBank === "enter_upi_id" && (
              <div className="mt-4 mb-4">
                <UpiCollectInputField
                  UPIVal={UPIVal}
                  handleUPIValChange={handleUPIValChange}
                  upiValidationError={upiValidationError}
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedBank === "enter_upi_id" || isBBCWebView ? (
        <React.Fragment>
          <UpiSuggestions appendSelectedSuggestion={appendSelectedSuggestion} vpaSuggestionList={vpaSuggestionList} />
          <SavePaymentDetails
            title="Securely save this UPI ID for faster payments."
            setConsentChecked={setConsentChecked}
            consentChecked={consentChecked}
          />
        </React.Fragment>
      ) : null}

      {showUpsellOnPaymentsPage && <FreeShippingStrip showStripOnPayments={true} />}

      <div className={clsx("mt-3", showUpsellOnPaymentsPage ? "flex items-center justify-between" : "")}>
        {showUpsellOnPaymentsPage && <GetFreeShippingCTA />}
        <button
          type="button"
          onClick={e => {
            if (selectedBank === "enter_upi_id" || isBBCWebView) {
              handleUPISubmit();
            } else {
              e.currentTarget.disabled = true;
              orderCall("intent", selectedBank);
            }
          }}
          className=" bg-ctaImg rounded font-bold uppercase  text-white relative w-full  py-2 text-sm  _analytics-gtm-payment-info"
        >
          {loading && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
          {t("pay")} {formatPrice(amountAfterDiscount ? amountAfterDiscount : payableAmount, true, false)}
        </button>
      </div>

      {/* Payment button styling */}
      {RadioButtonPayment}
    </React.Fragment>
  );
};

export default UpiJuspay;
