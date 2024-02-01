import React, { Fragment, useEffect, useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";
import { PhoneNumberUtil } from "google-libphonenumber";

import useTranslation from "@libHooks/useTranslation";

import { LoginForm } from "@typesLib/Login";
import { ISDConfig } from "@typesLib/Redux";
import { ValtioStore } from "@typesLib/ValtioStore";

import { isNumber } from "@libUtils/validation";
import { getMobileOperatingSystem } from "@libUtils/getDeviceOS";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";

import { REGEX } from "@libConstants/REGEX.constant";

import DownArrow from "../../../public/svg/down-arrow.svg";

interface mobileValProps {
  loginForm: LoginForm;
  inputNames?: { country: "ISDCode" | "countryCode"; mobile: "mobile" | "phoneNumber" };
  isInternationalShipping?: boolean;
  setAddressCountryData?: (a: any) => void;
}

const CountryMobileInput = ({ loginForm, inputNames, isInternationalShipping, setAddressCountryData }: mobileValProps) => {
  const { t } = useTranslation();

  const phoneUtil = PhoneNumberUtil.getInstance();

  const { isdCodes: isdCode, addressCountryList } = useSelector((store: ValtioStore) => store.constantReducer);

  const isdCodes = isInternationalShipping ? addressCountryList : isdCode;

  // @ts-ignore
  const selectedCountry = isdCodes?.find(
    (x: any) => formatPlusCode(x.countryCode, true) === loginForm.watch(inputNames?.country || "ISDCode")
  );

  const [selectedISD, setSelectedISD] = useState<ISDConfig | undefined>(selectedCountry || isdCodes?.[0]);
  useEffect(() => {
    if (isdCodes) {
      loginForm.setValue(
        inputNames?.country || "ISDCode",
        formatPlusCode(selectedISD?.countryCode || isdCodes[0]?.countryCode, true)
      );
      setSelectedISD(selectedCountry || isdCodes[0]);
    }
  }, [isdCodes]);

  const phoneNumberLength = selectedISD?.phoneNoLength || 10;

  const mobileInputName = inputNames?.mobile || "mobile";

  return (
    <div className="flex items-center justify-between w-full">
      <style>
        {`
          select {
            -moz-appearance:none; /* Firefox */
            -webkit-appearance:none; /* Safari and Chrome */
            appearance:none;
          }
        `}
      </style>

      <div className="relative" style={{ width: "28%" }}>
        <span className="absolute left-2 -top-2 text-xs text-gray-400 bg-white px-1 z-10 capitalize">
          {t("country") || "Country"}*
        </span>

        {isdCodes &&
          (isdCodes?.length === 1 ? (
            <input
              type="text"
              {...loginForm.register(inputNames?.country || "ISDCode")}
              className="h-12 border border-gray-400 rounded w-full outline-none pl-4 tracking-widest text-sm text-center bg-white cursor-pointer font-bold"
              role="textbox"
              aria-label="country code"
              autoComplete="off"
            />
          ) : (
            <Fragment>
              <select
                {...loginForm.register(inputNames?.country || "ISDCode", {
                  onChange: (e: any) => {
                    // @ts-ignore
                    const selectIsd = isdCodes?.find(x => x.countryCode === e.target.value.replace("+", "")) as ISDConfig;
                    setSelectedISD(selectIsd);
                    setAddressCountryData && setAddressCountryData(selectIsd);
                  },
                })}
                // onChange={e => setSelectedISD(isdCodes.find(x => x.countryCode === e.target.value.replace("+", "")) as ISDConfig)}
                className="h-12 border border-gray-400 rounded w-full outline-none pl-8 tracking-widest text-sm bg-white relative"
              >
                {isdCodes?.map(isd => (
                  <option key={isd.countryCode}>{formatPlusCode(isd.countryCode, true)}</option>
                ))}
              </select>

              <DownArrow
                className={`z-10 absolute inset-y-0 my-auto ${selectedISD?.countryCode.length === 2 ? "right-3" : "right-2"}`}
              />
            </Fragment>
          ))}

        <img
          src={selectedISD?.countryFlag}
          alt={selectedISD?.countryLabel}
          className="w-5 h-5 rounded-full absolute inset-y-0 my-auto left-2 z-10"
        />
      </div>

      <div className="relative w-2/3">
        <span className="absolute left-4 -top-2 text-xs text-gray-400 bg-white capitalize px-1">{t("mobile")}*</span>

        <input
          {...loginForm.register(mobileInputName, {
            required: true,
            maxLength: phoneNumberLength,
            minLength: phoneNumberLength,
            // @ts-ignore
            pattern: isInternationalShipping ? selectedISD?.phoneNumberValidationRegex : REGEX.MOBILE_NUMBER,
            validate: value => {
              if (value?.length === phoneNumberLength && selectedISD?.isoCode2) {
                return phoneUtil.isValidNumberForRegion(phoneUtil.parse(value, selectedISD?.isoCode2), selectedISD?.isoCode2);
              }
              return false;
            },
          })}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          onKeyPress={isNumber}
          maxLength={phoneNumberLength}
          autoFocus={getMobileOperatingSystem() !== "iOS"}
          className="h-12 border border-gray-400 rounded w-full outline-none px-4 tracking-widest text-sm"
          role="textbox"
          aria-label="enter mobile number for login"
        />

        {loginForm.formState?.errors[mobileInputName]?.type === "validate" && (
          <span className="absolute -bottom-5 left-2 text-11 text-red-600">{t("enterValidNumber")}</span>
        )}
      </div>
    </div>
  );
};

export default CountryMobileInput;
