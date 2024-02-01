import React from "react";
import { UseFormReturn } from "react-hook-form";
import Link from "next/link";

import GoogleSocialLogin from "@libComponents/Auth/SocialLogin/Google";
import FacebookSocialLogin from "@libComponents/Auth/SocialLogin/Facebook";
import LoginInput from "@libComponents/Auth/LoginInput";
import SocialInput from "@libComponents/Auth/SocialInput";
import SignInUsing from "@libComponents/Auth/SignInUsing";

import { STATES } from "@libConstants/Auth.constant";

import { LoginForm } from "@typesLib/Login";
import { VerifyState } from "@typesLib/Auth";

type LoginScreen = {
  isNewUser: boolean;
  loginForm: LoginForm;
  storeData: any;
  handleSocialLogin: any;
  t: (value: string) => string;
  onSubmit: any;
  showSocialLogin?: boolean;
  isSocialLogin?: boolean;
  setSocialLogin?: any;
  otpForm: UseFormReturn<VerifyState>;
  activeState: any;
  setActiveState: any;
};

function LoginScreenFirst({
  loginForm,
  storeData,
  handleSocialLogin,
  t,
  onSubmit,
  showSocialLogin = true,
  isSocialLogin,
  setSocialLogin,
  otpForm,
  activeState,
  setActiveState,
}: LoginScreen) {
  return (
    <React.Fragment>
      <form onSubmit={loginForm.handleSubmit(onSubmit.login)}>
        {!(activeState === STATES.SOCIAL_SIGNUP) ? (
          <LoginInput loginForm={loginForm} storeData={storeData} t={t} />
        ) : (
          <SocialInput
            loginForm={loginForm}
            storeData={storeData}
            t={t}
            isSocialLogin={isSocialLogin}
            setActiveState={setActiveState}
            otpForm={otpForm}
            setSocialLogin={setSocialLogin}
          />
        )}
      </form>
      {showSocialLogin && !(activeState === STATES.SOCIAL_SIGNUP) && (
        <React.Fragment>
          <SignInUsing t={t} />
          <div className="mb-2 flex">
            <FacebookSocialLogin
              handleSocialLogin={handleSocialLogin}
              btnClassName="py-1 px-4 h-12 relative text-center text-black w-full border-black border rounded-lg font-bold text-sm flex justify-center items-center"
            />
            <div className="w-4" />
            <GoogleSocialLogin
              handleSocialLogin={handleSocialLogin}
              btnClassName="py-1 px-4 h-12 relative text-center border-black rounded-lg border w-full  font-bold text-sm flex justify-center items-center"
            />
          </div>
        </React.Fragment>
      )}
      {!(activeState === STATES.SOCIAL_SIGNUP) && (
        <p className="text-xs text-center mt-8 font-thin">
          <Link href="/policies" prefetch={false} className="font-bold" aria-label={t("signingTermsConditions")}>
            {t("signingTermsConditions")}
          </Link>
        </p>
      )}
    </React.Fragment>
  );
}

export default LoginScreenFirst;
