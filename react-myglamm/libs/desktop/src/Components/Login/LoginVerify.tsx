import React, { useEffect } from "react";

import OtpInput from "react-otp-input";
import { UseFormReturn } from "react-hook-form";

import { LoginState, VerifyState } from "@typesLib/Auth";

import useTranslation from "@libHooks/useTranslation";

import { isNumber } from "@libUtils/validation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { REGEX } from "@libConstants/REGEX.constant";

import EditIcon from "../../../../UX/public/svg/edit.svg";
import { GA4Event } from "@libUtils/analytics/gtm";

interface VerifyProps {
  otpForm: UseFormReturn<VerifyState>;
  loginForm: UseFormReturn<LoginState>;
  timer: number;
  isNewUser: boolean;
  handleResendOTP: () => void;
  handleReset: () => void;
  onSubmit: () => void;
}

const LoginVerify = ({ timer, isNewUser, otpForm, loginForm, handleResendOTP, handleReset, onSubmit }: VerifyProps) => {
  const { t } = useTranslation();

  const { otp } = otpForm.formState.errors;

  const [ISDCode, mobile] = loginForm.watch(["ISDCode", "mobile"]);

  const OTP = otpForm.watch("otp");

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

  return (
    <form className="py-4 px-8" onSubmit={onSubmit}>
      <div className="pt-2 text-sm text-center">
        {isNewUser ? (
          <>
            <h5 className="uppercase mb-5">{t("numberToRegister")}</h5>
            <p className="flex w-full justify-center items-center uppercase mb-8">
              {t("otpSentOn")}&nbsp;
              <bdi className="font-bold">
                {ISDCode}&nbsp;{mobile}
              </bdi>
              <EditIcon className="ml-1.5 cursor-pointer w-3" onClick={handleReset} />
            </p>
          </>
        ) : (
          <>
            <h5 className="mb-5 relative">
              <img
                alt="back"
                onClick={handleReset}
                className="inset-y-0 my-auto left-0 absolute cursor-pointer"
                src="https://files.myglamm.com/site-images/original/arrow.png"
              />
              {t("numberToSignin")}
            </h5>

            <img alt="mobile" src="https://files.myglamm.com/site-images/original/mob-otp_1.png" className="mx-auto" />

            <p className="font-bold uppercase mt-10 mb-5">
              {t("otpSentOn")}&nbsp;
              <bdi>
                {ISDCode}&nbsp;{mobile}
              </bdi>
            </p>
          </>
        )}
      </div>

      {document.dir === "ltr" ? (
        <>
          <input {...otpForm.register("otp")} hidden type="number" placeholder="get OTP" />
          <OtpInput
            isInputNum
            numInputs={4}
            shouldAutoFocus
            inputStyle={{
              outline: "none",
              fontSize: "22px",
              fontWeight: "bold",
              width: "50px",
              height: "50px",
              backgroundColor: "#F0F0F0",
              borderRadius: "50px",
            }}
            value={otpForm.getValues("otp")}
            containerStyle="flex justify-between mb-5 px-20"
            onChange={(e: string) => otpForm.setValue("otp", e)}
          />
        </>
      ) : (
        <input
          {...otpForm.register("otp")}
          type="tel"
          maxLength={4}
          onKeyPress={isNumber}
          placeholder="* * * *"
          className="w-3/5 mx-auto text-2xl border-b border-black outline-none tracking-widest font-bold text-center mb-5 py-1"
        />
      )}

      {otp?.message && <span className="otp-error-msg error-field fullwidth">{otp.message}</span>}

      {timer ? (
        <div className="bg-themeGray w-max mx-auto rounded-full px-3 text-sm py-1 tracking-widest">
          00:<strong>{timer.toString().padStart(2, "0")}</strong>
        </div>
      ) : (
        <button type="button" className="flex w-full text-xs font-bold justify-center items-center" onClick={handleResendOTP}>
          <img src="https://files.myglamm.com/site-images/original/icons8-envelope-24.png" className="mr-1 w-3" />{" "}
          {t("resendOtp")}
        </button>
      )}

      {isNewUser && (
        <>
          <div className="flex justify-between w-full p-4 gap-10 mb-1 pt-6">
            <div className="w-1/2">
              <h4 className="font-bold mb-1">{t("name")}</h4>
              <input
                {...otpForm.register("name", {
                  required: isNewUser,
                })}
                placeholder={`*${t("fullName")}`}
                className="border-b border-black capitalize w-full"
              />
            </div>

            <div className="w-1/2">
              <h4 className="font-bold mb-1">{t("email")}</h4>
              <input
                {...otpForm.register("email", {
                  required: isNewUser,
                  pattern: {
                    value: REGEX.EMAIL,
                    message: t("validationValidEmailId"),
                  },
                })}
                placeholder={`*${t("emailAddress")}`}
                className="border-b border-black w-full"
              />
            </div>
          </div>

          <details className="py-2 pl-1 w-1/2">
            <style jsx>
              {`
                summary:after {
                  margin: 4px 28px 0 0;
                  content: "";
                  height: 8px;
                  width: 8px;
                  color: #000;
                  border-bottom: 2px solid currentColor;
                  border-right: 2px solid currentColor;
                  transition: all 0.3s ease;
                  float: right;
                  display: inline-block;
                  transform: rotate(45deg);
                  transform-origin: center;
                }
                details[open] summary:after {
                  content: "";
                  margin-top: 6px;
                  transform: rotate(-135deg);
                }
              `}
            </style>
            <summary className="font-bold text-sm cursor-pointer mb-1.5">
              {t("haveReferral") || "Have a Referral Code?"}
            </summary>

            <input
              {...otpForm.register("referralCode", { required: false })}
              className="ml-3 border-b border-black capitalize w-48"
              placeholder={t("referralOptional") || "Referral Code (Optional)"}
            />
          </details>
        </>
      )}

      {/* Verify Button in all Cases for OTP */}
      <button
        type="submit"
        disabled={OTP?.length !== 4 || otpForm.formState.isSubmitting || !otpForm.formState.isValid}
        className="h-12 uppercase text-white font-bold bg-ctaImg w-full mt-8 mb-4 rounded mx-auto relative"
      >
        {otpForm.formState.isSubmitting ? <LoadSpinner className="inset-0 absolute w-8 m-auto" /> : t("verify")}
      </button>
    </form>
  );
};

export default LoginVerify;
