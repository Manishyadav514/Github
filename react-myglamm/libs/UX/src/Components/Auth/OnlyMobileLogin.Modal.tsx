import React, { useEffect } from "react";

import OnlyMobileOTP from "./OnlyMobile.OTP";
import OnlyMobileNumInput from "./OnlyMobile.NumInput";
import Spinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import CheckboxButton from "@libComponents/Buttons/CheckboxButton";

import useLogin from "@libHooks/useLogin";
import useTranslation from "@libHooks/useTranslation";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { getLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";
import { getVendorCode } from "@libUtils/getAPIParams";

import { AdobeSimplifiedLoginStart } from "@libAnalytics/Auth.Analytics";
import { GA4Event } from "@libUtils/analytics/gtm";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { STATES } from "@libConstants/Auth.constant";

import { SurveyState } from "@typesLib/Survey";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import CloseIcon from "../../../public/svg/group-2.svg";

interface LoginProps {
  show: boolean;
  hide: () => void;
  updateCart?: () => void;
  analyticsData?: any;
  memberTag?: string;
  showNameField?: boolean;
  onLoginSuccess?: () => void;
  mergeCart?: boolean;
  verifiedPhoneNumberPendingLogin?: boolean;
  onFailure?: () => void;
}

const OnlyMobileLogin = ({
  show,
  hide,
  updateCart,
  analyticsData = {
    adobe: {
      common: {
        pageName: "web|order checkout|",
        subSection: "checkout step1",
        assetType: "checkout login",
      },
    },
  },
  memberTag,
  showNameField,
  onLoginSuccess,
  mergeCart = true,
  verifiedPhoneNumberPendingLogin = false,
  onFailure,
}: LoginProps) => {
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const onSuccess = () => {
    const resSurveyId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
    const { url, module, platform, grantPoints }: SurveyState = JSON.parse(
      sessionStorage.getItem(SESSIONSTORAGE.SURVEY_INFO) || "{}"
    );

    /* Hit Glammpoint API to credit surveyPoints if responsesurveyId present */
    if (resSurveyId && grantPoints && SHOP.ENABLE_GLAMMPOINTS) {
      const consumerApi = new ConsumerAPI();
      consumerApi
        .freeGlammPoint({
          module,
          platform,
          slug: url,
          type: "glammPoints",
          vendorCode: getVendorCode(),
          identifier: getLocalStorageValue("memberId"),
        })
        .then(hide)
        .catch(err => {
          console.error(err);
          hide();
        });
    } else {
      hide();
    }

    /* In case a membertag key present in localstorage */
    removeLocalStorageValue(LOCALSTORAGE.SURVEY_MEMBERTAG);

    /* Update Options if Available in Props */
    if (updateCart) updateCart();

    if (onLoginSuccess) onLoginSuccess();
  };

  const { loginForm, activeState, setActiveState, otpForm, isNewUser, onSubmit, handleResendOTP, storeData, timer } = useLogin({
    mergeCart,
    redirect: false,
    onSuccess,
    memberTag,
    onlyMobileLogin: true,
    simplifiedLogin: true,
    verifiedPhoneNumberPendingLogin,
    onFailure,
  });

  const referralInput = otpForm.watch("referralCode");
  useEffect(() => {
    if (verifiedPhoneNumberPendingLogin) {
      const guestData = getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS, true);
      loginForm.setValue("ISDCode", guestData?.countryCode);
      loginForm.setValue("mobile", guestData?.phoneNumber);
      onSubmit.login({
        mobile: guestData?.phoneNumber,
        ISDCode: guestData?.countryCode,
        name: "",
      });
    } else {
      setActiveState(STATES.LOGIN_USING_INPUT);
    }

    /* Referral Value from LocalStorage retrieved from url params */
    const referralCode = getLocalStorageValue("rc");
    otpForm.setValue("referralCode", referralCode || "");
  }, []);

  useEffect(() => {
    if (activeState === STATES.NEW_USER_REGISTRATION) {
      otpForm.handleSubmit(() => onSubmit.register({ name: "", referralCode: referralInput || "", email: "", mobile: "" }))();
    }
  }, [activeState]);

  /* ADOBE */
  useEffect(() => {
    if (show) {
      AdobeSimplifiedLoginStart("no-variant", analyticsData?.adobe?.common?.pageName);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      window.dataLayer?.push({ event: "optimize.activate" });
    }
  }, [show]);

  useEffect(() => {
    GA4Event([
      {
        event: "login_enter_details",
        ecommerce: {
          login_type: "simplified",
        },
      },
    ]);
  }, []);

  const generateLoginUI = () => {
    if (verifiedPhoneNumberPendingLogin && activeState === STATES.LOGIN_USING_INPUT) {
      return (
        <div className="my-24">
          <p className="font-semibold text-center text-xl my-2">Generating OTP</p>
          <Spinner className="h-10 w-10 m-auto" />
          <p className="text-center text-base my-2">Please wait</p>
        </div>
      );
    } else if (activeState === STATES.LOGIN_USING_INPUT) {
      return (
        <>
          <OnlyMobileNumInput loginForm={loginForm} onSubmit={onSubmit} showNameField={showNameField} />
          {SHOP.ENABLE_WHATSAPP_OTP && <CheckboxButton />}
        </>
      );
    } else {
      if (
        activeState === STATES.OTP_VERIFICATION ||
        activeState === STATES.NEW_USER_REGISTRATION ||
        activeState === STATES.AUTH_COMPLETE
      ) {
        return (
          <OnlyMobileOTP
            otpForm={otpForm}
            onSubmit={onSubmit}
            isNewUser={isNewUser}
            handleResendOTP={handleResendOTP}
            userMobileNumber={storeData.mobileNumber}
            handleCancel={handleCancel}
            timer={timer}
            analyticsData={analyticsData}
            dontAllowUserToEditNumber={verifiedPhoneNumberPendingLogin}
          />
        );
      }
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("xtoken");
    otpForm.reset();
    setActiveState(STATES.LOGIN_USING_INPUT);
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <div
        className={`${
          glammClubConfig?.active ? "bg-gradient-to-r from-amber-200 via-yellow-700 to-amber-200" : ""
        } rounded-t-xl relative p-0.5`}
      >
        <section className="bg-white py-5 px-4 rounded-t-xl">
          {glammClubConfig?.active && glammClubConfig?.loginModalLogoImgSrc && (
            <img
              className="absolute m-auto left-0 right-0 -top-7 w-24"
              src={glammClubConfig?.loginModalLogoImgSrc}
              alt="Glamm Club"
            />
          )}
          <CloseIcon
            onClick={() => {
              hide();
            }}
            className="absolute right-5 top-3 w-6 h-6"
          />
          <p className={`font-semibold text-center ${glammClubConfig?.active ? "pt-8" : "pt-2"} `}>{t("loginOrSignup")}</p>
          <p className="text-sm pt-2 text-center">{t("applyGlamPromo")}</p>

          {/* MOBILE NUMBER INPUT - GET OTP */}
          {generateLoginUI()}
        </section>
      </div>
    </PopupModal>
  );
};

export default OnlyMobileLogin;
