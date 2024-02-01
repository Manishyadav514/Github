import React, { useRef } from "react";

import { LoginForm } from "@typesLib/Login";

import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";

import Spinner from "@libComponents/Common/LoadSpinner";
import CheckboxButton from "@libComponents/Buttons/CheckboxButton";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

type LoginInputProps = {
  loginForm: LoginForm;
  storeData: any;
  t: (value: string) => string;
};

function LoginInput({ loginForm, storeData }: LoginInputProps) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const disableButton = loginForm.formState.isSubmitting || !loginForm.formState.isValid;

  return (
    <React.Fragment>
      <CountryMobileInput loginForm={loginForm} />

      <button
        type="submit"
        ref={buttonRef}
        disabled={disableButton}
        className="uppercase w-full text-center text-sm text-white py-3 px-4 mt-8 rounded-sm bg-ctaImg h-12 relative"
        onSubmit={() => {
          if (buttonRef.current) {
            buttonRef.current.click();
          }
        }}
      >
        {loginForm.formState.isSubmitting ? <Spinner className="absolute inset-0 w-8 m-auto" /> : t("signIn")}
      </button>
      {SHOP.ENABLE_WHATSAPP_OTP && <CheckboxButton />}
    </React.Fragment>
  );
}

export default LoginInput;
