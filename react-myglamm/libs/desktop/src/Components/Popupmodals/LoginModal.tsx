import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import Link from "next/link";

import useLogin from "@libHooks/useLogin";
import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";
import { STATES } from "@libConstants/Auth.constant";
import { XTOKEN } from "@libConstants/Storage.constant";

import { removeLocalStorageValue } from "@libUtils/localStorage";

import { LOGIN_MODAL_CONSTANT, SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import LoginVerify from "../Login/LoginVerify";
import { GA4Event } from "@libUtils/analytics/gtm";

const LoginModal = () => {
  const { t } = useTranslation();

  const LOGIN_MODAL = useSnapshot(LOGIN_MODAL_CONSTANT).state;
  const { memberTag, mergeCart, onSuccess } = LOGIN_MODAL;

  const handleReset = () => {
    removeLocalStorageValue(XTOKEN());
    otpForm.reset();
    setActiveState(STATES.LOGIN_USING_INPUT);
  };

  const closeModal = () => {
    if ((LOGIN_MODAL.closeOnlyOnLoginned && checkUserLoginStatus()) || !LOGIN_MODAL.closeOnlyOnLoginned) {
      SHOW_LOGIN_MODAL({ ...LOGIN_MODAL, show: false });
    }
  };

  const onSuccessfullSignup = () => {
    onSuccess?.();
    closeModal();
  };

  const { loginForm, otpForm, handleResendOTP, setActiveState, timer, isNewUser, activeState, onSubmit } = useLogin({
    mergeCart,
    memberTag,
    onSuccess: onSuccessfullSignup,
  });

  const [name, email, referralCode] = otpForm.watch(["name", "email", "referralCode"]);

  useEffect(() => {
    if (activeState === STATES.NEW_USER_REGISTRATION) {
      otpForm.handleSubmit(() => onSubmit.register({ name, referralCode, email, mobile: loginForm.getValues("mobile") }))();
    }
  }, [activeState]);

  useEffect(() => {
    if (LOGIN_MODAL.show) setActiveState(STATES.LOGIN_USING_INPUT);
  }, [LOGIN_MODAL.show]);

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

  return (
    <PopupModal show={LOGIN_MODAL.show as boolean} onRequestClose={closeModal} type="center-modal">
      <section
        style={{ width: "475px", minHeight: "500px" }}
        className="bg-white rounded-md shadow-lg flex flex-col justify-center mb-24 relative"
      >
        <button
          type="button"
          onClick={closeModal}
          style={{ boxShadow: "0 1px 0 #fff" }}
          className="text-4xl font-bold absolute right-4 top-2 opacity-20 text-black hover:opacity-50"
        >
          ×
        </button>

        {activeState === STATES.LOGIN_USING_INPUT ? (
          <div className="pb-4 pt-6">
            {SHOP.ENABLE_GLAMMPOINTS && <p className="text-sm text-center mb-6">{t("getGlammpointsOnOrder")}</p>}

            <img src={SHOP.LOGO} className="mx-auto w-max mb-5" style={{ maxWidth: "255px" }} />

            <h3 className="text-sm font-bold capitalize py-2 border-b border-black w-max ml-10">*{t("mobileNumber")}</h3>

            <div className="border-b border-gray-300 w-full mb-6" />

            <form className="w-full px-10" onSubmit={loginForm.handleSubmit(onSubmit.login)}>
              <CountryMobileInput loginForm={loginForm} />

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting || !loginForm.formState.isValid}
                className="h-12 uppercase text-white font-bold bg-ctaImg w-full mt-10 rounded relative"
              >
                {loginForm.formState.isSubmitting ? <LoadSpinner className="inset-0 absolute w-8 m-auto" /> : t("signIn")}
              </button>
            </form>

            <p className="text-center text-xs mt-8 pb-2">
              {t("bySignUpAgree")}&nbsp;
              <Link href="/policies" className="font-bold">
                {t("termsAndConditions")}
              </Link>
            </p>
          </div>
        ) : (
          <LoginVerify
            timer={timer}
            otpForm={otpForm}
            isNewUser={isNewUser}
            loginForm={loginForm}
            handleReset={handleReset}
            handleResendOTP={handleResendOTP}
            onSubmit={otpForm.handleSubmit(onSubmit.otp)}
          />
        )}
      </section>
    </PopupModal>
  );
};

export default LoginModal;
