import React, { useEffect, ReactElement } from "react";
import Head from "next/head";

import useLogin from "@libHooks/useLogin";
import useTranslation from "@libHooks/useTranslation";

import OTPVerify from "@libComponents/Auth/OTP.View";
import FinalScreen from "@libComponents/Auth/FinalScreen";
import Registration from "@libComponents/Auth/Registration";
import LoginScreenFirst from "@libComponents/Auth/Login.View";

import { STATES } from "@libConstants/Auth.constant";

import Layout from "@libLayouts/Layout";

import { getClientQueryParam } from "@libUtils/_apputils";

function BASignup() {
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
    timer,
    otpVerified,
    state,
    referralValid,
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

  return (
    <React.Fragment>
      <Head>
        <title key="title">{t("BGLoginHead")}</title>
      </Head>
      <section
        //className="flex px-8 pt-12"
        // style={{ height: "calc(150vh - 8rem)" }}
        style={{ minHeight: "100vh" }}
      >
        {(activeState === STATES.LOGIN_USING_INPUT || activeState === STATES.SOCIAL_SIGNUP) && (
          <div className="flex px-8 pt-6">
            <div className="pb-4 w-full">
              {activeState === STATES.SOCIAL_SIGNUP ? (
                <React.Fragment>
                  <p className="text-center mt-8 text-sm">{t("welcome")}</p>
                  <p className="font-bold text-center mt-3 text-lg">{storeData.socialData?.email}</p>
                  <p className="text-sm text-center mb-8  mt-3" style={{ lineHeight: "1.29rem" }}>
                    {t("completeRegistration")}
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <p className="text-lg text-center">{t("welcomeVRProgram")}</p>
                  <br />
                  <p className="text-sm text-center">{t("signupTextBA")}</p>
                  <p className="text-sm text-center">{t("signupTextBA2")}</p>
                  <img
                    className="m-10 mr-auto ml-auto"
                    src="https://files.myglamm.com/site-images/original/beauty-associates.png"
                    alt="Myglamm Logo"
                  />
                </React.Fragment>
              )}
              <LoginScreenFirst
                isNewUser={isNewUser}
                loginForm={loginForm}
                storeData={storeData}
                handleSocialLogin={handleSocialLogin}
                isSocialLogin={isSocialLogin}
                setSocialLogin={setSocialLogin}
                otpForm={otpForm}
                onSubmit={onSubmit}
                t={t}
                activeState={activeState}
                setActiveState={setActiveState}
                showSocialLogin={false}
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
                  setActiveState={setActiveState}
                  socialData={storeData.socialData}
                  handleResendOTP={handleResendOTP}
                  timer={timer}
                  otpVerified={otpVerified}
                  isBA={false}
                  referralValid={referralValid}
                  onSubmit={onSubmit}
                  isSocialLogin={isSocialLogin}
                />
              )}
            </div>
          </div>
        )}
        {activeState === STATES.OTP_VERIFICATION && (
          <div className="flex px-8 pt-2">
            <OTPVerify
              mobileNumber={{
                number: state.inputMobileNumber,
                isdCode: state.location.phoneCode,
              }}
              isNewUser={isNewUser}
              otpForm={otpForm}
              location={state.location}
              setActiveState={setActiveState}
              socialData={storeData.socialData}
              handleResendOTP={handleResendOTP}
              timer={timer}
              otpVerified={otpVerified}
              referralValid={referralValid}
              onSubmit={onSubmit}
              isSocialLogin={isSocialLogin}
              isBA
            />
          </div>
        )}
        {activeState === STATES.NEW_USER_REGISTRATION && (
          <div className="px-8 pt-2">
            <Registration
              mobileNumber={{
                number: state.inputMobileNumber,
                isdCode: state.location.phoneCode,
              }}
              isNewUser={isNewUser}
              otpForm={otpForm}
              location={state.location}
              // send={setActiveState}
              // current={xState.current}
              socialData={storeData.socialData}
              isBA={false}
              referralValid={referralValid}
              onSubmit={onSubmit}
            />
          </div>
        )}
        {getClientQueryParam("type") !== "Signupfreelipstick" && activeState === STATES.AUTH_COMPLETE && isNewUser && (
          <FinalScreen t={t} redirect={redirect} />
        )}
      </section>
    </React.Fragment>
  );
}

BASignup.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default BASignup;
