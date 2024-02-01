import React from "react";

import { LoginForm } from "@typesLib/Login";
import { LoginState } from "@typesLib/Auth";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

interface NumInput {
  loginForm: LoginForm;
  onSubmit: { login: (value: LoginState) => Promise<void> };
  showNameField?: boolean;
}

const OnlyMobileNumInput = ({ loginForm, onSubmit, showNameField }: NumInput) => {
  const { t } = useTranslation();

  const disableButton = loginForm.formState.isSubmitting || !loginForm.formState.isValid;

  return (
    <form className="w-full text-sm mb-4 mt-8" onSubmit={loginForm.handleSubmit(onSubmit.login)}>
      <CountryMobileInput loginForm={loginForm} />

      {showNameField && (
        <div className="relative my-4">
          <span className="text-xs text-gray-500 pr-3 pl-1 absolute top-2 bg-white left-3 ">{t("name")}</span>
          <input
            {...loginForm.register("name", {
              required: true,
              validate: value => {
                if (value !== "") {
                  return true;
                }
                return false;
              },
            })}
            type="text"
            className="w-full border border-gray-400 h-12 rounded px-4 mt-4 uppercase font-semibold text-sm  outline-none"
          />
          {loginForm.formState?.errors["name"]?.type === "validate" && (
            <span className="absolute -bottom-5 left-2 text-11 text-red-600">{t("enterName")}</span>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={disableButton}
        className="font-semibold bg-ctaImg text-white text-sm h-12 w-full rounded uppercase relative mt-5"
      >
        {loginForm.formState.isSubmitting && <LoadSpinner className="inset-0 absolute m-auto w-8" />}
        {t("getOtp")}
      </button>
    </form>
  );
};

export default OnlyMobileNumInput;
