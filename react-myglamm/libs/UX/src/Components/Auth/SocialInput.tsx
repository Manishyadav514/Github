import React, { useRef, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import Spinner from "@libComponents/Common/LoadSpinner";

import { isNumber } from "@libUtils/validation";
import { removeUserLocalStorage } from "@libUtils/localStorage";

import { REGEX } from "@libConstants/REGEX.constant";
import { STATES } from "@libConstants/Auth.constant";

import { LoginForm } from "@typesLib/Login";
import { VerifyState } from "@typesLib/Auth";

type SocialInputProps = {
  loginForm: LoginForm;
  storeData: any;
  t: (value: string) => string;
  isSocialLogin?: boolean;
  otpForm: UseFormReturn<VerifyState>;
  setActiveState: any;
  setSocialLogin: any;
};

function SocialInput({ loginForm, storeData, t, isSocialLogin, otpForm, setActiveState, setSocialLogin }: SocialInputProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const disableButton = loginForm.formState.isSubmitting || !loginForm.formState.isValid;

  const handleOnKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    isNumber(event);
  }, []);

  function handleCancel(e: any) {
    e.preventDefault();
    removeUserLocalStorage();
    otpForm.reset();
    loginForm.reset();
    loginForm.setValue("mobile", "");
    setSocialLogin(false);
    setActiveState(STATES.LOGIN_USING_INPUT);
  }

  return (
    <>
      <div>
        <div className="input-element-wrapper w-full relative">
          <label className="text-xs text-black absolute bg-white">
            {t("mobileNumber")}
            <sup>* </sup>
          </label>
          <div className="w-full mobile-input border-black bg-white rounded-lg pt-1 pl-4">
            <span className={`text-black font-bold ${isSocialLogin && "input-disabled"}`} style={{ marginTop: "1px" }}>
              +91
            </span>

            <input
              {...loginForm.register("mobile", {
                maxLength: 10,
                minLength: 10,
                required: true,
                pattern: REGEX.MOBILE_NUMBER,
              })}
              type="tel"
              aria-label="Enter mobile number"
              aria-labelledby="mobile"
              className={`inline-block h-8 ml-1 outline-none font-bold ${isSocialLogin && "input-disabled"}`}
              inputMode="numeric"
              pattern="[0-9]{10}"
              defaultValue={storeData.mobileNumber && storeData.mobileNumber.number}
              maxLength={10}
              onKeyPress={handleOnKeyPress}
              required
              onSubmit={() => {
                if (buttonRef.current) {
                  buttonRef.current.click();
                }
              }}
              style={{
                width: "50%",
              }}
            />
            {!isSocialLogin ? (
              <button
                type="submit"
                ref={buttonRef}
                disabled={disableButton}
                className="w-24 text-white rounded-md bg-black relative uppercase font-semibold text-sm border-none mx-auto"
                style={{
                  width: "100px",
                  height: "43px",
                  float: "right",
                  right: "-1px",
                  marginTop: "-4px",
                  borderRadius: "7px",
                }}
              >
                {loginForm.formState.isSubmitting ? <Spinner className="relative w-6 mx-auto" /> : t("setActiveStateOtp")}
              </button>
            ) : (
              <button
                type="button"
                ref={buttonRef}
                onClick={handleCancel}
                disabled={disableButton}
                className="w-24 text-white rounded-md bg-black relative uppercase font-semibold text-sm border-none mx-auto"
                style={{
                  width: "98px",
                  height: "43px",
                  float: "right",
                  marginTop: "-4px",
                  right: "-1px",
                }}
              >
                {loginForm.formState.isSubmitting ? <Spinner className="relative w-6 mx-auto" /> : t("change")}
              </button>
            )}
          </div>

          <style jsx>
            {`
              .input-element-wrapper label {
                left: 14px;
                top: -9px;
                padding: 0 3px;
                text-transform: uppercase;
                z-index: 2;
              }

              .mobile-input {
                line-height: 1.5;
                outline: none;
                border: 1px solid #949494;
                height: 44px;
              }

              input:disabled {
                background-color: #e2e2e2;
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
}

export default SocialInput;
