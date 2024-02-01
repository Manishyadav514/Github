import React, { Fragment } from "react";
import { BestOffers, UpiCollect } from "@typesLib/Payment";
import Checkbox from "../../../../public/svg/checkbox.svg";
import DisabledUpiIcon from "../../../../public/svg/DisabledUpiIcon.svg";
import useTranslation from "@libHooks/useTranslation";

export const SavePaymentDetails = ({
  setConsentChecked,
  consentChecked,
  title,
}: {
  setConsentChecked: any;
  consentChecked: boolean;
  title?: string;
}) => {
  return (
    <section
      role="presentation"
      className="mt-2 mb-4 px-2 flex items-center"
      onClick={() => setConsentChecked(!consentChecked)}
    >
      {consentChecked ? (
        <Checkbox width="20" height="20" className="w-5 my-auto mr-2" />
      ) : (
        <button type="button" className="border-2 border-color1 rounded w-5 h-5 bg-white my-auto mr-2 outline-none" />
      )}

      <p className="text-xs">{title}</p>
    </section>
  );
};

/* VPA SUGGESTIONS */

export const UpiSuggestions = ({
  appendSelectedSuggestion,
  vpaSuggestionList,
}: {
  appendSelectedSuggestion: (suggestion: string) => void;
  vpaSuggestionList: string[];
}) => (
  <div className="overflow-x-scroll whitespace-nowrap overflow-y-hidden">
    {vpaSuggestionList?.map(suggestion => (
      <button
        type="button"
        key={suggestion}
        onClick={() => appendSelectedSuggestion(suggestion)}
        className="inline-block px-2 py-1 mr-2 my-2 border border-color1 bg-red-50"
      >
        {`@${suggestion}`}
      </button>
    ))}
  </div>
);

interface IUpiCollectInputField {
  UPIVal: string;
  handleUPIValChange: (e: any) => void;
  upiValidationError: string;
}
export const UpiCollectInputField = (props: IUpiCollectInputField) => {
  const { UPIVal, handleUPIValChange, upiValidationError } = props;

  const { t } = useTranslation();
  return (
    <Fragment>
      <input
        name="upi"
        type="email"
        value={UPIVal}
        onChange={handleUPIValChange}
        placeholder={t("enterYourUpi")}
        className={`${
          upiValidationError ? "border-red-600" : "border-gray-400"
        } h-10 border rounded-sm py-1 px-2 w-full outline-none`}
        role="textbox"
        aria-label="enter upi id"
      />
      {upiValidationError && <span className="text-center text-red-600 text-xs">{upiValidationError}</span>}
    </Fragment>
  );
};

export const DisableEntireUPI = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded py-4 px-2 mb-2 flex items-start shadow ">
      <div>
        <DisabledUpiIcon width="30px" height="30px" className="inline ml-3" />
      </div>
      <div className="ml-4 mb-1 text-gray-400">
        {t("upi")}
        <p className="text-xs mt-2">{t("paymentDisabledReason") || "Currently disabled due to low success rates."} </p>
      </div>
    </div>
  );
};

/* Check which Upi Intent apps are facing downtime 
  or low success rate
  */
export const findUpiAppWithDowntime = (bankCode: string, downtimePaymentMethod?: { intent?: string[] }) => {
  if (!downtimePaymentMethod) {
    return false;
  }

  return downtimePaymentMethod.intent?.includes(bankCode);
};

/* check whether user entered upi has a downtime or not */
export const isCollectUpiIdDown = (UPIVal: string, downtimePaymentMethod?: { collect?: string[] }) => {
  const upiDowntimeApps = downtimePaymentMethod?.collect;

  const getUpiId = UPIVal.split("@")?.[1];

  if (!upiDowntimeApps) {
    return false;
  }

  return upiDowntimeApps?.includes(getUpiId);
};
