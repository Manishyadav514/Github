import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import OtpInput from "react-otp-input";
import { UseFormReturn } from "react-hook-form";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import useTranslation from "@libHooks/useTranslation";

import { getWebsiteDir } from "@libUtils/getWebsiteDir";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";
import { isNumber } from "@libUtils/validation";
import { GA4Event } from "@libUtils/analytics/gtm";

import { langLocale } from "@typesLib/APIFilters";
import { VerifyState } from "@typesLib/Auth";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

interface otpInput {
  otpForm: UseFormReturn<VerifyState>;
  onSubmit: { otp: (value: any) => Promise<void> };
  isNewUser: boolean;
  handleResendOTP: () => void;
  userMobileNumber: {
    number: string;
    isdCode: string;
  };
  handleCancel: () => void;
  timer: number;
  analyticsData?: any;
  dontAllowUserToEditNumber?: boolean;
}

const OnlyMobileOTP = ({
  otpForm,
  onSubmit,
  isNewUser,
  handleResendOTP,
  userMobileNumber,
  handleCancel,
  timer,
  dontAllowUserToEditNumber,
  analyticsData,
}: otpInput) => {
  const { t } = useTranslation();

  const { locale } = useRouter();
  const isWhatsAppOpted = getLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, true);

  useEffect(() => {
    GA4Event([
      {
        event: "login_enter_otp",
        ecommerce: {
          login_type: "simplified",
        },
      },
    ]);
  }, []);

  /* ADOBE */
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      whatsAppConsent: isWhatsAppOpted ? "whatsapp consent opt-in" : "whatsapp consent opt-out",
      common: {
        pageName: `${analyticsData.adobe.common.pageName}simplified login|enter details login|enter otp`,
        newPageName: "login enter otp",
        subSection: analyticsData.adobe.common.subSection,
        assetType: analyticsData.adobe.common.assetType,
        newAssetType: "login",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const [otp, referralCode] = otpForm.watch(["otp", "referralCode"]);

  return (
    <form onSubmit={otpForm.handleSubmit(onSubmit.otp)} className="text-center">
      <style jsx>
        {`
          #referInput::placeholder {
            font-weight: 400;
            text-transform: capitalize;
            color: #3e3e3e;
            opacity: 0.7;
          }
        `}
      </style>

      <p className="text-sm text-center my-4">
        {t("otpSentOn")}{" "}
        <span className="font-bold">
          <bdi>
            {formatPlusCode(userMobileNumber.isdCode)}&nbsp;{userMobileNumber.number || "XXXXXX4321"}
          </bdi>
        </span>
        {!dontAllowUserToEditNumber ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="-220 -80 1000 1000"
            height="30px"
            width="30px"
            id="noRotate"
            className="inline-block"
            onClick={handleCancel}
          >
            <path
              transform="scale(1,-1) translate(0, -650)"
              fill="#bf9b30"
              d="M3 117l292 292 99-99-292-292-99 0z m467 270l-48-48-99 99 48 48c5 5 11 8 19 8 7 0 14-3 18-8l62-62c5-5 8-11 8-18 0-8-3-14-8-19z"
            />
          </svg>
        ) : null}
      </p>

      <p className="text-center font-semibold pb-3">{t("otp")}</p>

      {getWebsiteDir(locale as langLocale) === "ltr" ? (
        <Fragment>
          <input {...otpForm.register("otp")} hidden type="number" placeholder="get OTP" />
          <OtpInput
            isInputNum
            numInputs={4}
            shouldAutoFocus
            inputStyle={{
              width: "54px",
              height: "48px",
              fontSize: "1.5rem",
              borderRadius: 4,
              border: "1px solid #dedede",
              outline: "none",
              fontWeight: "bold",
            }}
            value={otpForm.getValues("otp")}
            containerStyle="flex justify-evenly pb-4"
            focusStyle={{ border: "2px solid #000" }}
            placeholder="&#8226;&#8226;&#8226;&#8226;"
            onChange={(e: string) => otpForm.setValue("otp", e)}
          />
        </Fragment>
      ) : (
        <input
          {...otpForm.register("otp")}
          type="tel"
          maxLength={4}
          onKeyPress={isNumber}
          placeholder="* * * *"
          className="w-3/5 mx-auto text-2xl border-b border-black outline-none tracking-widest font-bold text-center mb-4 py-1"
        />
      )}

      {isNewUser && (
        <div className="relative my-4">
          {referralCode?.length > 0 && (
            <span className="text-xs text-gray-500 pr-3 pl-1 absolute -top-2 bg-white left-3">{t("haveReferral")}</span>
          )}
          <input
            {...otpForm.register("referralCode", { required: false })}
            type="text"
            id="referInput"
            placeholder={t("haveReferral")}
            className="w-full border h-12 rounded px-4 uppercase font-semibold text-sm border-black outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={otp?.length !== 4 || otpForm.formState.isSubmitting}
        className="bg-ctaImg w-full font-semibold text-white rounded h-12 uppercase text-sm mb-5 relative"
      >
        {otpForm.formState.isSubmitting && <LoadSpinner className="inset-0 absolute m-auto w-8" />}
        {t("verifyAndLogin")}
      </button>

      {timer > 0 ? (
        <p className="text-center py-2">
          {t("resendOtpIn")} <span className="font-bold">00:{timer < 10 && "0"}</span>
          {timer}
        </p>
      ) : (
        <p className="text-xs opacity-75 text-center">
          {t("didntReceiveOTP") || "Didn’t receive OTP yet?"}&nbsp;
          <button type="button" className="font-semibold ml-1" onClick={handleResendOTP}>
            {t("resend")}
          </button>
        </p>
      )}
    </form>
  );
};

export default OnlyMobileOTP;
