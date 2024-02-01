import React, { useState, useRef, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import OtpInput from "react-otp-input";
import { UseFormReturn } from "react-hook-form";

import Adobe from "@libUtils/analytics/adobe";
import Webengage from "@libUtils/analytics/webengage";
import { getLocalStorageValue, removeUserLocalStorage } from "@libUtils/localStorage";
import { isNumber } from "@libUtils/validation";
import { getWebsiteDir } from "@libUtils/getWebsiteDir";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";

import useTranslation from "@libHooks/useTranslation";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { STATES } from "@libConstants/Auth.constant";

import { langLocale } from "@typesLib/APIFilters";
import { VerifyState } from "@typesLib/Auth";

import Spinner from "../Common/LoadSpinner";
import { GA4Event } from "@libUtils/analytics/gtm";

interface OTPProps {
  mobileNumber: {
    number: string;
    isdCode: string;
  };
  isNewUser: boolean;
  location: {
    countryCode: string;
    countryName: string;
    phoneCode: string;
  };
  otpForm: UseFormReturn<VerifyState>;
  handleResendOTP: any;
  socialData: any;
  otpVerified: any;
  timer: any;
  isBA: boolean;
  referralValid: boolean;
  onSubmit: any;
  isSocialLogin: boolean;
  setActiveState: any;
}

function OTPVerify(props: OTPProps) {
  const {
    mobileNumber,
    isNewUser,
    otpForm,
    otpVerified,
    timer,
    handleResendOTP,
    isBA,
    onSubmit,
    isSocialLogin,
    setActiveState,
  } = props;

  const { locale } = useRouter();

  const [state, setState] = useState({
    haveRefferal: !!otpForm.getValues("referralCode"),
    otpResend: false,
  });

  const { t } = useTranslation();

  useEffect(() => {
    GA4Event([
      {
        event: "login_enter_otp",
        ecommerce: {
          login_type: "fullscreen",
        },
      },
    ]);
  }, []);

  useEffect(() => {
    if (isNewUser && isBA) {
      otpForm.setValue("isBA", true);
    }
  }, [isBA]);

  useEffect(() => {
    // if the user closes the referral accordian, reset it and discard the referralCode
    if (!state.haveRefferal) {
      otpForm.setValue("referralCode", "");
    }
  }, [state.haveRefferal]);

  // Adobe Analytics[11] - Page Load - OTP Verify
  useEffect(() => {
    if (!props.isNewUser) {
      const isWhatsAppOpted = getLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, true);
      (window as any).digitalData = {
        whatsAppConsent: isWhatsAppOpted ? "whatsapp consent opt-in" : "whatsapp consent opt-out",
        common: {
          pageName: "web|order checkout|login|enter otp",
          newPageName: "login enter otp",
          subSection: "checkout step1",
          assetType: "checkout login",
          newAssetType: "login",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.PageLoad();
    }
  }, []);

  // Adobe Analytics[12] - Page Load - OTP API Success
  useEffect(() => {
    if (otpVerified) {
      (window as any).digitalData = {
        common: {
          pageName: "web|order checkout|login|success",
          newPageName: "login success",
          subSection: "checkout step1",
          assetType: "checkout login",
          newAssetType: "login",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        login: {
          loginType: "otp",
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.PageLoad();
    }
  }, [otpVerified]);

  // Webengage[29] - Login Completed
  useEffect(() => {
    if (otpVerified) {
      const locationurl = window.location.href;
      const screenName = locationurl.includes("glamm-insider") === true ? "glammINSIDER Page" : locationurl;
      const webengageevent: any = {};
      webengageevent.eventname = "Login Completed";
      webengageevent.eventobject = {
        "Screen Name": screenName,
        "User Type": "Member",
      };
      Webengage.Track(webengageevent);
    }
  }, [otpVerified]);

  function handleCancel() {
    removeUserLocalStorage();
    otpForm.reset();
    setActiveState(STATES.LOGIN_USING_INPUT);
  }

  function handleChange(e: any) {
    otpForm.clearErrors();
    otpForm.setValue("otp", e);
  }

  return (
    <form onSubmit={otpForm.handleSubmit(onSubmit.otp)} className="flex flex-col w-full mx-auto">
      <>
        <div className="flex flex-col">
          {!isSocialLogin && (
            <>
              <h5 className="text-center text-sm mt-8 ">{t("otpSent")}</h5>
              <p className="uppercase font-bold text-lg flex justify-center items-center my-4">
                <bdi>
                  {formatPlusCode(mobileNumber.isdCode)}&nbsp;{mobileNumber.number || "XXXXXX4321"}
                </bdi>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  width="16px"
                  viewBox="0 0 16 16"
                  className="ml-2 inline-block"
                  id="noRotate"
                  onClick={handleCancel}
                >
                  <g fill="none" fillRule="evenodd">
                    <g fill="#000" fillRule="nonzero">
                      <g>
                        <path
                          d="M113.964 2.036c-1.378-1.381-3.617-1.381-4.995 0l-9.157 9.154c-.071.072-.115.164-.13.263l-.678 5.025c-.02.144.031.287.13.386.085.085.205.136.324.136.02 0 .04 0 .061-.003l4.964-.675c.252-.035.43-.266.395-.519-.034-.252-.266-.43-.518-.395L99.997 16l.473-3.505 3.689 3.69c.085.084.205.136.324.136.12 0 .239-.048.324-.137l9.157-9.154c.668-.669 1.036-1.555 1.036-2.5 0-.944-.368-1.83-1.036-2.495zm-4.817 1.125l1.537 1.537-8.356 8.357-1.537-1.537 8.356-8.357zm-4.66 12.049l-1.504-1.504 8.356-8.356 1.503 1.503-8.356 8.357zm8.996-9.015l-3.678-3.679c.467-.385 1.05-.596 1.663-.596.699 0 1.354.272 1.848.763s.764 1.15.764 1.848c0 .618-.212 1.197-.597 1.664z"
                          transform="translate(-222 -185) translate(123 184)"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </p>
            </>
          )}
          <span className="text-lg text-center pb-3 mt-6">{t("enterOtp")}</span>
          {/* An Hidden OTP input is required as React Hook Form need to attach a ref
           * for initialization
           */}
          {getWebsiteDir(locale as langLocale) === "ltr" ? (
            <Fragment>
              <input {...otpForm.register("otp")} hidden type="number" name="otp" placeholder="get OTP" />
              <OtpInput
                value={otpForm.getValues("otp")}
                onChange={handleChange}
                numInputs={4}
                isInputNum
                inputStyle={{
                  width: "2.75rem",
                  height: "2.75rem",
                  fontSize: "1.5rem",
                  borderRadius: 7,
                  border: "1px solid rgba(0,0,0,0.3)",
                  outline: "thin",
                  fontWeight: "bold",
                }}
                containerStyle="flex justify-evenly px-6 otp-input"
                shouldAutoFocus
                focusStyle={{
                  border: "2px solid var(--color2)",
                }}
                placeholder="&#8226;&#8226;&#8226;&#8226;"
              />
            </Fragment>
          ) : (
            <input
              {...otpForm.register("otp")}
              type="tel"
              name="otp"
              maxLength={4}
              onKeyPress={isNumber}
              placeholder="* * * *"
              className="w-3/5 mx-auto text-2xl border-b border-black outline-none tracking-widest font-bold text-center mb-4 pb-2 placeholder:text-sm"
              role="textbox"
              aria-label="enter otp for login"
            />
          )}

          {state.otpResend && timer > 0 && <span className="text-center text-green-600 text-sm mt-2">{t("otpSent")}</span>}
        </div>
      </>

      <button
        disabled
        type="submit"
        className="uppercase my-8 w-full text-center text-sm bg-ctaImg text-white py-3 px-4 rounded-sm h-12 relative"
      >
        {otpForm.formState.isSubmitting || otpForm.getValues("otp")?.length === 4 ? (
          <Spinner className="absolute w-8 m-auto inset-0" />
        ) : (
          t("verify")
        )}
      </button>

      {timer > 0 ? (
        <p className="text-center py-2">
          00:{timer < 10 && "0"}
          {timer}
        </p>
      ) : (
        <button type="button" onClick={handleResendOTP} aria-hidden className="text-sm text-right underline">
          {t("resend")}
        </button>
      )}
    </form>
  );
}

export default OTPVerify;
