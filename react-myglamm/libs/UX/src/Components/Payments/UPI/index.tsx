import React, { useState, useEffect } from "react";
import useTranslation from "@libHooks/useTranslation";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { Downtimes, Gateways, PaymentType, PaymentData } from "@typesLib/Payment";
import UPILogo from "../../../../public/svg/UPI-Logo.svg";
import { SHOP } from "@libConstants/SHOP.constant";
import { SavePaymentDetails, UpiCollectInputField, UpiSuggestions, isCollectUpiIdDown } from "./UpiHelperComponents";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const WhatsappEnabeCheckbox = dynamic(() => import("../WhatsappEnableCheckbox"), { ssr: false });
const UpiJuspay = dynamic(() => import("./UpiJuspay"), { ssr: false });
const DowntimeMsg = dynamic(() => import("../DowntimeMsg"), { ssr: false });

export interface IUpiBankList {
  ios_package: string;
  code: string;
  name: string;
  imageUrl: string;
  android_package?: string;
  web_package: string;
}
interface UPIProps {
  gateway?: Gateways;
  handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => any;
  bankOrder: string[];
  bankList: IUpiBankList[];
  setActiveTab: (name: string) => void;
  activeTab: string;
  name: string;
  downtimes?: Downtimes;
}

const UPI = ({ handleCreateOrder, bankList, bankOrder, activeTab, setActiveTab, name, downtimes }: UPIProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  const [UPIVal, setUPIVal] = useState("");
  const [upiValidationError, setUpiValidationError] = useState("");
  const [vpaSuggestionList, setVpaSuggestionList] = useState<string[]>([]);

  const paymentApi = new PaymentAPI();
  const isPincodeServiceable = useSelector((store: ValtioStore) => store.userReducer.isPincodeServiceable);

  const downtimePaymentMethod = downtimes?.unavailablePaymentMethods;

  useEffect(() => {
    setUpiValidationError("");
  }, [UPIVal]);

  /* Call For Suggestion List once valid upi "@" symbol is find in the value */
  const handleUPIValChange = (e: any) => {
    const { value } = e.target;
    setUPIVal(value);

    if (value.length > 2 && value.includes("@") && value.indexOf("@") < value.length - 1 && !vpaSuggestionList?.length) {
      const paymentApi = new PaymentAPI();
      paymentApi
        .VPASuggestion(value)
        .then(({ data: res }) => setVpaSuggestionList(res?.data))
        .catch(err => console.error(err));
    }
  };

  /* Append Selected Suggestion to upiValue */
  const appendSelectedSuggestion = (selectedSuggestion: any) => {
    setUPIVal(`${UPIVal.split("@")[0]}@${selectedSuggestion}`);
    setVpaSuggestionList([]);
  };

  /* validate UPI id if Juspay is enabled */
  const validateJuspayUpi = () => {
    if (isCollectUpiIdDown(UPIVal, downtimePaymentMethod)) {
      setLoading(false);

      /* display message   */
      const getUpiId = UPIVal.split("@")?.[1];
      return setUpiValidationError(`@${getUpiId} is currently disabled due to low success rates.`);
    }

    return paymentApi
      .JuspayValidateUPI(UPIVal)
      .then((data: any) => {
        const { status, message } = data.data.data;

        if (status) {
          orderCall("collect");
        }
        setUpiValidationError(message);
      })
      .catch(err => {
        setUpiValidationError(err?.response?.data?.message || "Something's Wrong!!! Please Retry");
      })
      .finally(() => setLoading(false));
  };

  /* validate UPI id if Juspay is disabled */
  const validateUpiId = async () => {
    await paymentApi
      .validateUPI(UPIVal)
      .then(() => orderCall("collect"))
      .catch(err => {
        console.log(err?.response?.data);
        setLoading(false);
        setUpiValidationError(err?.response?.data?.message || "Something's Wrong!!! Please Retry");
      });
  };

  /* Before Hitting Create Order API Checking UPI if Valid or not */
  const handleUPISubmit = () => {
    setLoading(true);

    if (SHOP.ENABLE_JUSPAY) {
      validateJuspayUpi();
    } else {
      validateUpiId();
    }
  };

  const orderCall = async (upiFlowType: "intent" | "collect", selectedAppCode?: string) => {
    setLoading(true);
    // Find the bank details from selected bank code

    if (SHOP.ENABLE_JUSPAY) {
      const selectedAppForUpiIntent = bankList?.find(bank => bank.code === selectedAppCode);
      //For juspay payment only
      await handleCreateOrder("juspay", { method: "UPI", vpa: UPIVal, upiFlowType, selectedAppForUpiIntent });
    } else {
      handleCreateOrder("razorpay", { method: "upi", vpa: UPIVal });
    }

    setLoading(false);
  };

  return (
    <details
      open={SHOP.ENABLE_JUSPAY && activeTab === name}
      className={`bg-white rounded py-3 px-2 mb-2 text-sm ${!isPincodeServiceable ? "pointer-events-none opacity-50" : ""}`}
    >
      <summary
        className="outline-none"
        onClick={e => {
          if (SHOP.ENABLE_JUSPAY) {
            e.preventDefault();
            setActiveTab(name);
            if (activeTab === name) {
              setActiveTab("");
            } else {
              setActiveTab(name);
            }
          }
        }}
      >
        <UPILogo width="30px" height="30px" className="inline mr-4" role="img" aria-labelledby="Google Pay / PhonePe / UPI" />
        {t("upi")}
      </summary>

      <div className="p-2">
        <div className="px-2">
          <DowntimeMsg downtimeMsg={downtimes?.message} />

          <WhatsappEnabeCheckbox />
        </div>

        {SHOP.ENABLE_JUSPAY && bankOrder.length ? (
          <UpiJuspay
            UPIVal={UPIVal}
            handleUPISubmit={handleUPISubmit}
            handleUPIValChange={handleUPIValChange}
            loading={loading}
            upiValidationError={upiValidationError}
            orderCall={orderCall}
            setConsentChecked={setConsentChecked}
            consentChecked={consentChecked}
            appendSelectedSuggestion={appendSelectedSuggestion}
            vpaSuggestionList={vpaSuggestionList}
          />
        ) : (
          <React.Fragment>
            <form className="flex justify-between mb-2 mt-2">
              <div className="w-2/3 mr-4">
                <UpiCollectInputField
                  UPIVal={UPIVal}
                  handleUPIValChange={handleUPIValChange}
                  upiValidationError={upiValidationError}
                />
              </div>

              <button
                type="button"
                disabled={loading || !!upiValidationError || UPIVal.length < 3}
                onClick={handleUPISubmit}
                className="bg-ctaImg rounded text-white w-1/3 px-4 relative h-10 py-2 text-sm uppercase _analytics-gtm-payment-info"
              >
                {loading && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
                {t("verify")}
              </button>
            </form>

            <UpiSuggestions appendSelectedSuggestion={appendSelectedSuggestion} vpaSuggestionList={vpaSuggestionList} />
            <SavePaymentDetails
              setConsentChecked={setConsentChecked}
              consentChecked={consentChecked}
              title="Securely save this UPI ID for faster payments."
            />
          </React.Fragment>
        )}
      </div>
    </details>
  );
};

export default UPI;
