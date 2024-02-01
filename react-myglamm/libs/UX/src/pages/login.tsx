import React, { useEffect, ReactElement } from "react";
import Head from "next/head";

import useLogin from "@libHooks/useLogin";
import useTranslation from "@libHooks/useTranslation";

import OTPVerify from "@libComponents/Auth/OTP.View";
import FinalScreen from "@libComponents/Auth/FinalScreen";
import Registration from "@libComponents/Auth/Registration";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import LoginScreenFirst from "@libComponents/Auth/Login.View";

import SignupFreeLipstickThankyou from "@libComponents/Auth/SignupFreeLipstick.Thankyou";

import { getVendorCode } from "@libUtils/getAPIParams";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { STATES } from "@libConstants/Auth.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { useSSO } from "@libHooks/useSSO";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import Layout from "@libLayouts/Layout";

import { AdobeLoginStart, handleSSOEvents } from "@libAnalytics/Auth.Analytics";
import { GA4Event } from "@libUtils/analytics/gtm";

function Login() {
  const {
    loginForm,
    otpForm,
    handleResendOTP,
    handleSocialLogin,
    activeState,
    setActiveState,
    storeData,
    router,
    isNewUser,
    referralValid,
    timer,
    otpVerified,
    state,
    redirectToURL,
    onSubmit,
    isSocialLogin,
    setSocialLogin,
  } = useLogin({
    mergeCart: true,
    redirect: true,
  });

  const { t } = useTranslation();

  function redirect(url: any) {
    return router.push(url);
  }

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      localStorage.removeItem("stoken");
    });
  }, []);

  // Adobe Analytics[10] - Page Load - Login
  useEffect(() => {
    GA4Event([
      {
        event: "login_enter_details",
        ecommerce: {
          login_type: "fullscreen",
        },
      },
    ]);

    if (!SHOP.ENABLE_SSO) {
      let digitalData = {};
      if (getClientQueryParam("type") !== "Signupfreelipstick") {
        return AdobeLoginStart();
      } else {
        digitalData = {
          common: {
            pageName: "web|SignupMain",
            newPageName: "SignupMain",
            subSection: "Signup",
            assetType: "Signup",
            newAssetType: "Signup",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
        };
      }

      ADOBE_REDUCER.adobePageLoadData = digitalData;
    }
  }, []);

  useEffect(() => {
    // redirect to homepage if user goes back after logging in
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
    if (memberId && activeState === STATES.LOGIN_USING_INPUT) {
      redirect("/");
    }
  }, []);

  const { onSuccess, isSSOLoaded } = useSSO();

  useEffect(() => {
    if (SHOP.ENABLE_SSO && isSSOLoaded) {
      (window as any).g3Login({
        vendorCode: getVendorCode(),
        apikey: process.env.NEXT_PUBLIC_API_KEY,
        config: { onSuccess, eventCallbacks: handleSSOEvents, onClose: () => router.push("/") },
      });
    }
  }, [isSSOLoaded]);

  useEffect(() => {
    if (
      activeState === STATES.AUTH_COMPLETE &&
      !(
        SHOP.ENABLE_GLAMMPOINTS &&
        router.query.type !== "Signupfreelipstick" &&
        router.query.redirect !== "/glamm-insider" &&
        isNewUser
      )
    ) {
      router.push("/");
    }
  }, [activeState]);

  return (
    <React.Fragment>
      <Head>
        <title key="title">Login</title>
      </Head>

      {SHOP.ENABLE_SSO ? (
        <div style={{ minHeight: "calc(100vh - 3rem)" }}>
          <LoadSpinner className="absolute inset-0 m-auto w-16" />
        </div>
      ) : (
        <section className="min-h-screen">
          {(activeState === STATES.LOGIN_USING_INPUT || activeState === STATES.SOCIAL_SIGNUP) && (
            <div className="flex justify-center h-auto px-6 pt-6">
              <div className="pb-4 w-full">
                {activeState === STATES.SOCIAL_SIGNUP ? (
                  <React.Fragment>
                    <p className="text-center mt-4 text-sm">{t("welcome")}</p>
                    <p className="font-bold text-center mt-3 text-lg">{storeData.socialData?.email}</p>
                    <p className="text-sm text-center mb-8  mt-3" style={{ lineHeight: "1.29rem" }}>
                      {t("completeRegistration")}
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {router.query.type === "Signupfreelipstick" ? (
                      <img
                        className="my-8 mx-auto px-12"
                        alt="Sign up for a free lipstick"
                        src="https://files.myglamm.com/site-images/original/Signupfreelipstick.png"
                      />
                    ) : (
                      <>
                        <p
                          className="text-sm text-center mt-8 uppercase font-bold"
                          style={{ color: "#3e3e3e", fontSize: "11.7px" }}
                        >
                          {t("welcomeTo")}
                        </p>
                        <img width="221px" src={SHOP.LOGO} alt="Myglamm Logo" className="mb-12 mt-5 mx-auto w-32" />
                      </>
                    )}
                  </React.Fragment>
                )}
                <LoginScreenFirst
                  isNewUser={isNewUser}
                  loginForm={loginForm}
                  showSocialLogin={false}
                  storeData={storeData}
                  onSubmit={onSubmit}
                  handleSocialLogin={handleSocialLogin}
                  isSocialLogin={isSocialLogin}
                  setSocialLogin={setSocialLogin}
                  otpForm={otpForm}
                  t={t}
                  setActiveState={setActiveState}
                  activeState={activeState}
                />
                {activeState === STATES.SOCIAL_SIGNUP && isSocialLogin && (
                  <OTPVerify
                    mobileNumber={{
                      number: state.inputMobileNumber,
                      isdCode: state.location.phoneCode,
                    }}
                    isNewUser={isNewUser}
                    otpForm={otpForm}
                    location={state.location}
                    socialData={storeData.socialData}
                    handleResendOTP={handleResendOTP}
                    timer={timer}
                    otpVerified={otpVerified}
                    isBA={false}
                    referralValid={referralValid}
                    onSubmit={onSubmit}
                    isSocialLogin={isSocialLogin}
                    setActiveState={setActiveState}
                  />
                )}
              </div>
            </div>
          )}

          {activeState === STATES.OTP_VERIFICATION && (
            <div className="flex justify-center h-auto px-8 pt-2">
              <OTPVerify
                mobileNumber={{
                  number: state.inputMobileNumber,
                  isdCode: state.location.phoneCode,
                }}
                isNewUser={isNewUser}
                otpForm={otpForm}
                location={state.location}
                socialData={storeData.socialData}
                handleResendOTP={handleResendOTP}
                timer={timer}
                otpVerified={otpVerified}
                isBA={false}
                referralValid={referralValid}
                onSubmit={onSubmit}
                isSocialLogin={isSocialLogin}
                setActiveState={setActiveState}
              />
            </div>
          )}
          {activeState === STATES.NEW_USER_REGISTRATION && (
            <div className="h-auto px-8 pt-4">
              <Registration
                mobileNumber={{
                  number: state.inputMobileNumber,
                  isdCode: state.location.phoneCode,
                }}
                isNewUser={isNewUser}
                otpForm={otpForm}
                location={state.location}
                // send={xState.send}
                // current={xState.current}
                socialData={storeData.socialData}
                isBA={false}
                referralValid={referralValid}
                onSubmit={onSubmit}
              />
            </div>
          )}

          {SHOP.ENABLE_GLAMMPOINTS &&
            router.query.type !== "Signupfreelipstick" &&
            router.query.redirect !== "/glamm-insider" &&
            activeState === STATES.AUTH_COMPLETE &&
            isNewUser && <FinalScreen t={t} redirect={redirect} />}

          {SHOP.ENABLE_GLAMMPOINTS &&
            router.query.type === "Signupfreelipstick" &&
            activeState === STATES.AUTH_COMPLETE &&
            isNewUser && <SignupFreeLipstickThankyou t={t} redirect={redirect} />}
        </section>
      )}
    </React.Fragment>
  );
}

Login.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default Login;
