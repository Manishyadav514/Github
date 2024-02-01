import React, { useEffect, useRef, useState, useCallback } from "react";
import { GiNextIco } from "@libComponents/GlammIcons";

import useLogin from "@libHooks/useLogin";
import useTranslation from "@libHooks/useTranslation";

import { isNumber } from "@libUtils/validation";
import Adobe from "@libUtils/analytics/adobe";
import { removeUserLocalStorage } from "@libUtils/localStorage";
import { getClientQueryParam } from "@libUtils/_apputils";

import { SHOP } from "@libConstants/SHOP.constant";
import { REGEX } from "@libConstants/REGEX.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { STATES } from "@libConstants/Auth.constant";

import FacebookSocialLogin from "./SocialLogin/Facebook";
import GoogleSocialLogin from "./SocialLogin/Google";

import PopupModal from "../PopupModal/PopupModal";
import LoadSpinner from "../Common/LoadSpinner";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

type LoginModalProps = {
  show: boolean;
  onRequestClose: any;
  mergeCart?: boolean;
  onSuccess?: any;
  hasSocialLogin?: boolean;
  hasGuestCheckout?: boolean;
  analyticsData?: any;
  memberTag?: string;
  overrideCheckoutURL?: string;
  redirectToPayment?: boolean;
  otpMetaData?: any;
};

function LoginModal({
  show,
  onRequestClose,
  mergeCart = true,
  onSuccess,
  hasGuestCheckout = true,
  hasSocialLogin = false,
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
  overrideCheckoutURL = "/payment",
  redirectToPayment,
  otpMetaData,
}: LoginModalProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const OTPInput = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState({
    haveRefferal: false,
    otpResend: false,
  });

  const { t } = useTranslation();

  // #region // Adobe Analytics[10]-Page Load-refer and earn-enter login details
  useEffect(() => {
    if (show) {
      (window as any).digitalData = {
        common: {
          pageName: `${analyticsData.adobe.common.pageName}login|enter details`,
          newPageName: "login enter details",
          subSection: analyticsData.adobe.common.subSection,
          assetType: analyticsData.adobe.common.assetType,
          newAssetType: "login",
          pageLocation: "",
          platform: ADOBE.PLATFORM,
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.PageLoad();
    }
  }, [show]);
  // #endregion

  const {
    handleSocialLogin,
    loginForm,
    activeState,
    setActiveState,
    storeData,
    router,
    otpForm,
    isNewUser,
    timer,
    handleResendOTP,
    referralValid,
    onSubmit,
    onSetOTPMetaValues,
  } = useLogin({
    mergeCart,
    redirect: false,
    onSuccess,
    memberTag,
    redirectToPayment,
  });

  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    setState({ ...state, haveRefferal: !!getClientQueryParam("rc") || !!localStorage.getItem("rc") });
  }, []);

  useEffect(() => {
    if (otpMetaData && typeof otpMetaData === "object") {
      onSetOTPMetaValues(otpMetaData);
    }
  }, [otpMetaData]);

  const mobile = loginForm.watch("mobile");

  useEffect(() => {
    setDisableButton(loginForm.formState.isSubmitting || !loginForm.formState.isValid);
  }, [loginForm.formState.isSubmitting, loginForm.formState.isValid, mobile]);

  useEffect(() => {
    if (activeState === STATES.AUTH_COMPLETE) {
      onRequestClose();
    }
  }, [activeState]);

  useEffect(() => {
    router.prefetch(overrideCheckoutURL);

    return () => onRequestClose();
  }, []);

  useEffect(() => {
    if (OTPInput.current) {
      OTPInput.current.focus();
    }
  }, [OTPInput]);

  const [name, email, referralCode] = otpForm.watch(["name", "email", "referralCode"]);

  const handleGuestLogin = () => {
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guest-token");
    localStorage.removeItem("guestDetails");
    onRequestClose();
    if (hasGuestCheckout && overrideCheckoutURL === "/payment") {
      localStorage.setItem("isGuest", "true");
      router.push("/addAddress");
    } else {
      router.push(overrideCheckoutURL);
    }
  };

  function handleCancel() {
    removeUserLocalStorage();
    otpForm.reset();
    setActiveState(STATES.LOGIN_USING_INPUT);
  }

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <section className="rounded-t-xl">
        {(activeState === STATES.LOGIN_USING_INPUT || activeState === STATES.SOCIAL_SIGNUP) && (
          <div className="p-2 py-5">
            {activeState === STATES.SOCIAL_SIGNUP ? (
              <React.Fragment>
                <p className="text-center mt-4">
                  {t("welcome")},&nbsp;
                  <span className="font-bold">{storeData.socialData?.name}</span>
                </p>
                <p className="text-sm text-center mb-4">{t("socialSignupMobileMsg")}</p>
              </React.Fragment>
            ) : (
              <>
                <p className="font-bold text-center">{t("loginOrSignup")}</p>
                {SHOP.ENABLE_GLAMMPOINTS && <p className="text-center text-xs mb-4">{t("applyGlamPromo")}</p>}
              </>
            )}
            <form className="mx-4 my-2" onSubmit={loginForm.handleSubmit(onSubmit.login)}>
              <CountryMobileInput loginForm={loginForm} />

              <button
                type="submit"
                ref={buttonRef}
                disabled={disableButton}
                className="uppercase w-full text-center text-sm bg-ctaImg font-bold text-white h-9 mt-4 rounded-sm"
                onSubmit={() => {
                  if (buttonRef.current) {
                    buttonRef.current.click();
                  }
                }}
              >
                {loginForm.formState.isSubmitting ? <LoadSpinner className="relative w-6 m-auto" /> : t("getOtp")}
              </button>
            </form>
            {hasSocialLogin && !(activeState === STATES.SOCIAL_SIGNUP) && (
              <div className="flex justify-around p-4 mb-4">
                <FacebookSocialLogin
                  handleSocialLogin={handleSocialLogin}
                  btnStyle={{ backgroundColor: "#4267B2" }}
                  isModal
                  btnClassName="py-1 px-4 relative text-center h-8 text-white w-full rounded-sm font-bold text-sm flex justify-center items-center"
                />
                <div className="w-4" />
                <GoogleSocialLogin
                  handleSocialLogin={handleSocialLogin}
                  isModal
                  btnClassName="py-1 px-4 relative text-center border-gray-600 border-2 w-full rounded-sm font-bold text-sm flex justify-center items-center"
                />
              </div>
            )}
            {hasGuestCheckout && !SHOP.ENABLE_JUSPAY && (
              <div className="w-full flex justify-center">
                <button type="button" onClick={handleGuestLogin} className="text-center text-sm">
                  {t("continueGuest")}
                  <GiNextIco height="25px" className="inline-block" />
                </button>
              </div>
            )}
            <style jsx>
              {`
                .adddress-form-wrapper {
                  background-color: #fff;
                  padding: 1rem;
                }
                .input-element-wrapper {
                  width: 100%;
                  position: relative;
                }
                .input-element-wrapper label {
                  font-size: 9px;
                  color: #666;
                  background: #fff;
                  position: absolute;
                  left: 5px;
                  top: -7px;
                  padding: 0 3px;
                  text-transform: uppercase;
                  z-index: 2;
                }

                .mobile-input {
                  width: 100%;
                  padding: 0.75rem 0.75rem;
                  line-height: 1.5;
                  background-color: #fff;
                  background-clip: padding-box;
                  border: 1px solid #000;
                  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                  outline: none;
                  color: black;
                }

                input:disabled {
                  background-color: #e2e2e2;
                }
              `}
            </style>
          </div>
        )}
        {activeState === STATES.OTP_VERIFICATION && (
          <form onSubmit={otpForm.handleSubmit(onSubmit.otp)} className="flex flex-col justify-between mx-4 py-4">
            <>
              <h5 className="text-center uppercase text-sm my-2">{t("numberToSignin")}</h5>
              <div className="flex flex-col">
                {!isNewUser && (
                  <img
                    src="https://files.myglamm.com/site-images/original/mob-otp.png"
                    alt="OTP"
                    className="mx-auto my-2 mb-8"
                  />
                )}
                <p className="uppercase font-bold text-sm text-center my-4">
                  {t("otpSentOn")} {storeData.mobileNumber.number || "XXXXXX4321"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="-220 -80 1000 1000"
                    height="30px"
                    width="30px"
                    className="ml-1 inline-block"
                    onClick={handleCancel}
                    role="img"
                    aria-labelledby="edit number"
                  >
                    <path
                      transform="scale(1,-1) translate(0, -650)"
                      fill="#bf9b30"
                      d="M3 117l292 292 99-99-292-292-99 0z m467 270l-48-48-99 99 48 48c5 5 11 8 19 8 7 0 14-3 18-8l62-62c5-5 8-11 8-18 0-8-3-14-8-19z"
                    />
                  </svg>
                </p>
                <input
                  type="tel"
                  aria-label="Enter OTP"
                  aria-labelledby="otp"
                  placeholder="----"
                  className="mx-auto py-2 px-4 w-32 border-b-2 border-gray-900 text-center outline-none tracking-widest"
                  pattern="^[0-9]...$"
                  minLength={4}
                  maxLength={4}
                  autoComplete="off"
                  {...otpForm.register("otp", {
                    required: true,
                    maxLength: 4,
                    minLength: 4,
                    pattern: /[0-9]{4}/,
                  })}
                  required
                  role="textbox"
                />
                {state.otpResend && timer > 0 && (
                  <span className="text-center text-green-600 text-sm">{t("otpSentSuccess")}</span>
                )}
                {timer > 0 ? (
                  <p className="text-center py-2">
                    00:{timer < 10 && "0"}
                    {timer}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    aria-hidden
                    className="uppercase font-bold text-sm text-center w-32 mx-auto"
                    style={{ height: "40px" }}
                  >
                    {t("resendOtp")}
                  </button>
                )}
              </div>
            </>
            {isNewUser && (
              <div className="flex flex-col">
                <div className="input-element-wrapper my-2">
                  <label>
                    <sup>* </sup>
                    {t("name")}
                  </label>
                  <div className="mobile-input border-black">
                    <input
                      {...otpForm.register("name", {
                        required: isNewUser,
                      })}
                      type="text"
                      className="inline-block h-8 ml-4 outline-none"
                      required
                    />
                  </div>
                </div>
                {otpForm.formState.errors.name?.message && (
                  <span className="text-center text-red-600 text-sm">{otpForm.formState.errors.name.message}</span>
                )}
                <div className="input-element-wrapper my-2">
                  <label>
                    <sup>* </sup>
                    {t("email")}
                  </label>
                  <div className="mobile-input border-black">
                    <input
                      {...otpForm.register("email", {
                        required: isNewUser,
                        pattern: {
                          value: REGEX.EMAIL,
                          message: t("validationValidEmailId"),
                        },
                      })}
                      type="text"
                      className="inline-block h-8 ml-4 outline-none"
                      required
                    />
                  </div>
                </div>
                {otpForm.formState.errors.email?.type === "required" && (
                  <span className="text-center text-red-600 text-sm">{otpForm.formState.errors.email.message}</span>
                )}
                <div className="my-2">
                  <button
                    type="button"
                    className="referral-btn w-full flex justify-between items-center font-semibold outline-none text-sm text-[#1b2125]"
                    onClick={() => setState({ ...state, haveRefferal: !state.haveRefferal })}
                  >
                    <span>{t("haveReferral")}</span>
                    <i
                      className={`down-arrow border-black border-solid border-b-2 border-r-2 inline-block mr-1 p-[3px] transform ${
                        state.haveRefferal ? "rotate-[225deg] mt-0" : "rotate-45 -mt-1"
                      }`}
                    />
                  </button>
                </div>
                {state.haveRefferal && (
                  <div className="input-element-wrapper my-2">
                    <label>{t("referralCode")}</label>
                    <div className="mobile-input border-black">
                      <input
                        {...otpForm.register("referralCode", {
                          required: false,
                        })}
                        type="text"
                        name="referralCode"
                        className="inline-block h-8 ml-4 outline-none"
                      />
                      <div className="h-4">
                        {otpForm.formState.errors.referralCode && (
                          <span className="text-center text-red-600 text-sm">
                            {otpForm.formState.errors.referralCode.message}
                          </span>
                        )}
                        {referralValid && <span className="text-green-500 text-sm pt-1">Referral Code is Valid</span>}
                      </div>
                    </div>
                  </div>
                )}
                <style jsx>
                  {`
                    .adddress-form-wrapper {
                      background-color: #fff;
                      padding: 1rem;
                    }
                    .input-element-wrapper {
                      width: 100%;
                      position: relative;
                    }
                    .input-element-wrapper label {
                      font-size: 9px;
                      color: #666;
                      background: #fff;
                      position: absolute;
                      left: 5px;
                      top: -7px;
                      padding: 0 3px;
                      text-transform: uppercase;
                      z-index: 2;
                    }

                    .mobile-input {
                      width: 100%;
                      padding: 0.5rem 0.75rem;
                      line-height: 1.5;
                      background-color: #fff;
                      background-clip: padding-box;
                      border: 1px solid #000;
                      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                      outline: none;
                      color: black;
                    }

                    input:disabled {
                      background-color: #e2e2e2;
                    }
                  `}
                </style>
              </div>
            )}
            <button
              type="submit"
              className="uppercase my-4 w-full text-center text-sm bg-ctaImg text-white h-9 rounded-sm"
              disabled={
                otpForm.formState.isSubmitting ||
                !(
                  otpForm.formState.isValid ||
                  (otpForm.getValues("otp")?.length === 4 &&
                    otpForm.getValues("name") &&
                    REGEX.EMAIL.test(otpForm.getValues("email")))
                )
              }
            >
              {otpForm.formState.isSubmitting ? <LoadSpinner className="relative w-6 m-auto" /> : t("verifyAndLogin")}
            </button>
          </form>
        )}
      </section>
    </PopupModal>
  );
}

export default LoginModal;
