import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import format from "date-fns/format";
import differenceInYears from "date-fns/differenceInYears";
import isValid from "date-fns/isValid";

import useTranslation from "@libHooks/useTranslation";

import { REGEX } from "@libConstants/REGEX.constant";
import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { isNumber } from "@libUtils/validation";

import { VerifyState } from "@typesLib/Auth";

import Spinner from "../Common/LoadSpinner";

interface RegistrationProps {
  mobileNumber: {
    number: string;
    isdCode: string;
  };
  isNewUser: boolean;
  location: {
    countryCode: string;
    countryName: string;
    phoneCode: string;
  };

  otpForm: UseFormReturn<VerifyState>;
  // handleResendOTP: any;
  socialData: any;
  isBA: boolean;
  referralValid: boolean;
  onSubmit: any;
}
function Registration(props: RegistrationProps) {
  const {
    isNewUser,
    otpForm,
    socialData,

    onSubmit,
    referralValid,
  } = props;

  const { t } = useTranslation();

  const [dobValue, setDobValue] = useState("");
  const [validDob, setValidDob] = useState<boolean>(true);

  function isAdult(value: any) {
    if (differenceInYears(new Date(), new Date(value)) >= 18 && differenceInYears(new Date(), new Date(value)) <= 115) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    if (dobValue !== "" && dobValue !== "DD/MM/YYYY") {
      checkValidBirthDate(dobValue);
    } else {
      setValidDob(true);
    }
  }, [dobValue]);

  const handleDateChange = (e: any) => {
    let { value } = e.target;

    if (!value.match(/^[0-9/]*$/) && !e.nativeEvent.inputType.includes("delete")) {
      return;
    }

    if ((value.length === 2 || value.length === 5) && !e.nativeEvent.inputType.includes("delete")) {
      value += "/";
    }

    setDobValue(value);
  };

  function checkValidBirthDate(dob: any) {
    try {
      const dobDate = dob.split("/");
      const formattedDob = `${dobDate[2]}/${dobDate[1]}/${dobDate[0]}`;

      // console.log("d instanceof Date && !isNaN(d)", dob instanceof Date);
      const validDate = isValid(new Date(dobDate[2], dobDate[1], dobDate[0]));
      const birthdate = new Date(formattedDob);

      if (validDate && isAdult(birthdate)) {
        setValidDob(true);
        otpForm.setValue("dob", format(new Date(birthdate), "yyyy-MM-dd") || "");
        return true;
      }

      setValidDob(false);
      return false;
    } catch (error) {
      console.log("error", error);
      setValidDob(false);
      return false;
    }
  }

  useEffect(() => {
    if (socialData && otpForm.getValues("name") === "") {
      otpForm.setValue("name", socialData.name);
      otpForm.setValue("email", socialData.email || "");
    }
    if (socialData.dob) {
      otpForm.setValue("dob", format(new Date(socialData.dob), "yyyy-MM-dd") || "");
      setDobValue(format(new Date(socialData.dob), "dd/MM/yyyy"));
    }
  }, [socialData]);

  // Adobe Analytics[14] - Page Load - Registration.
  useEffect(() => {
    if (props.isNewUser) {
      (window as any).digitalData = {
        common: {
          pageName: "web|order checkout|register|enter details",
          newPageName: "signup",
          subSection: "checkout step1",
          assetType: "",
          newAssetType: "registration",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.PageLoad();
    }
  }, []);

  return (
    <form onSubmit={otpForm.handleSubmit(onSubmit.register)}>
      <div className="flex flex-col mt-4 justify-center h-auto ">
        <div className="input-element-wrapper my-2 mt-6 relative w-full">
          <label className="left-2">
            {t("name")}
            <sup>* </sup>
          </label>
          <div className="mobile-input border-black ">
            <input
              {...otpForm.register("name", {
                required: isNewUser,
              })}
              type="text"
              className="inline-block  h-8 outline-none font-bold text-sm w-full"
            />
          </div>
        </div>
        {otpForm.formState.errors.name?.type === "required" && (
          <span role="alert" className="text-red-600 text-sm">
            {t("validationEnterName")}
          </span>
        )}
        <div className={`input-element-wrapper my-2 mt-6 ${socialData?.email && "input-disabled"} `}>
          <label className="left-2">
            {t("email")}
            <sup>* </sup>
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
              className="inline-block h-8  outline-none font-bold text-sm w-full"
            />
          </div>
        </div>
        {otpForm.formState.errors.email?.type === "required" && (
          <span role="alert" className="text-red-600 text-sm">
            {t("validationValidEmailId")}
          </span>
        )}

        <div className="input-element-wrapper my-2 mt-6">
          <label className="left-2">{t("referralCode")}</label>
          <div className="mobile-input border-black">
            <input
              {...otpForm.register("referralCode", { required: false })}
              type="text"
              className="inline-block h-8  outline-none font-bold text-sm uppercase w-full"
            />
          </div>
        </div>
        <div className="h-6">
          {otpForm.formState.errors.referralCode && (
            <span className="text-center text-red-600 text-sm">{otpForm.formState.errors.referralCode.message}</span>
          )}
          {referralValid && <span className="text-green-500 text-sm pt-1">Referral Code is Valid</span>}
        </div>

        <div className={`mx-auto input-element-wrapper my-2 mt-2 text-xs ${socialData.gender && "input-disabled"} `}>
          <p className="text-xs">{t("gender")}</p>
          <div className="flex mt-2 input-radio">
            <div className="flex items-center mr-4 mb-4">
              {" "}
              <input
                {...otpForm.register("gender")}
                id="radio5"
                type="radio"
                value="female"
                className="mr-1 w-4 h-4 outline-none"
              />
              <span className="flex items-center cursor-pointer text-sm font-bold"> {t("female")}</span>
            </div>

            <div className="flex items-center mr-4 mb-4">
              <input
                {...otpForm.register("gender")}
                id="radio2"
                type="radio"
                className="mr-1 w-4 h-4 outline-none"
                value="male"
              />
              <span className="flex items-center cursor-pointer text-sm font-bold">{t("male")}</span>
            </div>
          </div>
        </div>

        <div className={`input-element-wrapper my-2 mt-6 relative w-full ${socialData.dob && "input-disabled"}`}>
          <label className="left-2">{t("birthdate") || "BIRTHDATE"}</label>
          <div className="mobile-input border-black outline-none birthdate">
            <input
              type="tel"
              maxLength={10}
              value={dobValue}
              onKeyPress={isNumber}
              placeholder="dd/mm/yyyy"
              onChange={handleDateChange}
              className="inline-block h-8  outline-none font-bold text-sm w-full uppercase"
            />
          </div>
        </div>
        {!validDob && <span className=" text-red-600 text-sm">{t("invalidDob")}</span>}
        <button
          type="submit"
          className="uppercase my-6 w-full text-center text-sm bg-ctaImg text-white py-3 px-4 rounded-sm"
          disabled={
            otpForm.formState.isSubmitting ||
            !(otpForm.formState.isValid || (otpForm.getValues("name") && REGEX.EMAIL.test(otpForm.getValues("email") || ""))) ||
            !validDob
          }
        >
          {otpForm.formState.isSubmitting ? <Spinner className="relative w-4 mx-auto" /> : t("register")}
        </button>
        {/* )} */}
        <style jsx>
          {`
            input[type="radio"] {
              -webkit-appearance: none;
              -moz-appearance: none;
              // appearance: none;
              background-clip: content-box;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              margin: 0 5px 0 0;
              padding: 2px;
              border: solid 1px #000000;
              background-color: #ffffff;
            }

            input[type="radio"]:checked {
              background-color: #000000;
            }
            .adddress-form-wrapper {
              background-color: #fff;
              padding: 1rem;
            }
            .input-element-wrapper {
              width: 100%;
              position: relative;
            }
            .input-element-wrapper label {
              font-size: 12px;
              color: #000000;
              background: #fff;
              position: absolute;
              top: -9px;
              padding: 0 8px;
              text-transform: uppercase;
              // z-index: 2;
            }

            .mobile-input {
              width: 100%;
              padding: 0.375rem 0.875rem;
              line-height: 1.5;
              background-color: #fff;
              background-clip: padding-box;

              border-radius: 7px;
              transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
              outline: none;
              border: 1px solid #949494;
            }

            input:disabled {
              background-color: #e2e2e2;
            }
          `}
        </style>
      </div>
    </form>
  );
}

export default Registration;
