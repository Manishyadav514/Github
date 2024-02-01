import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import useAddress from "@libHooks/useAddress";
import useTranslation from "@libHooks/useTranslation";
import { useFetchCart } from "@libHooks/useFetchCart";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import { GiNextIco } from "@libComponents/GlammIcons";
import FormInput from "@libComponents/Form/FormInput";
import Spinner from "@libComponents/Common/LoadSpinner";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

import { isNumber } from "@libUtils/validation";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { REGEX } from "@libConstants/REGEX.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { DutyModalProps } from "@typesLib/Payment";

// @ts-ignore
import AddressStyles from "@libStyles/scss/address.module.scss";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { adobeAddressPageLoad } from "@checkoutLib/Address/AnalyticsHelperFunc";

import MEAddressForm from "./MEAddressForm";

const DutyChargesModal = dynamic(() => import("@libComponents/PopupModal/DutyChargesModal"), { ssr: false });

function AddressForm({ isAddAddress }: { isAddAddress: boolean }) {
  const { t } = useTranslation();
  useAttachCountryAddressFilter();
  const [overRideIsAddress, setOverRideIsAddress] = useState(isAddAddress);

  /* Exceptional Callback for Duty Popup and making the addAdress ---> EditAddress */
  const dutyCallback = (dutyProp: DutyModalProps) => {
    setOverRideIsAddress(false);
    setShowDutyModal(true);
    setDutyData(dutyProp);
  };

  const {
    addressForm,
    handleFormSubmit,
    isInternationalShipping,
    addressCountryData,
    setAddressCountryData,
    state: { isPageReady, SELECTED_COUNTRY },
  } = useAddress({ isAddAddress: overRideIsAddress, dutyCallback });

  const { formState, register, handleSubmit } = addressForm;
  const { errors, touchedFields } = formState;

  /* Get Cart Data if not Available */
  useFetchCart();

  const isLoggedIn = checkUserLoginStatus();

  const showEmailIdField = getLocalStorageValue(LOCALSTORAGE.PROFILE, true)?.email?.split("@").pop();

  /* On Mount Decide from localstorage where user has landed from - By Default Profile */
  const addAddressType = getLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM) || "chooseAddress";

  const [showDutyModal, setShowDutyModal] = useState(false);
  const [dutyData, setDutyData] = useState<DutyModalProps>();

  // Adobe Analytics[25] - Page Load - Add Address
  useEffect(() => {
    adobeAddressPageLoad(isAddAddress);
  }, []);

  if (!isPageReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="mb-7">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mt-1 pt-4 px-4 bg-white shadow">
          <h6 className="font-semibold mb-4 text-13">{t("contact")}</h6>

          <FormInput
            {...register("name", {
              required: t("validationEnterName") || "",
            })}
            name="name"
            errors={errors}
            touched={touchedFields}
            label={t("name") || "Name"}
            isRequired
          />

          <div className="pb-6">
            <CountryMobileInput
              loginForm={addressForm as any}
              inputNames={{ country: "countryCode", mobile: "phoneNumber" }}
              isInternationalShipping={isInternationalShipping}
              setAddressCountryData={setAddressCountryData}
            />
          </div>

          {/* Show only incase of dummy email id provided by backend */}
          {(showEmailIdField === "example.com" || !isLoggedIn) && (
            <FormInput
              {...register("email", {
                required: t("validationEnterEmailId") || "",
                validate: value => REGEX.EMAIL.test(value) || t("validationValidEmailId") || "",
              })}
              name="email"
              errors={errors}
              touched={touchedFields}
              label={t("email") || ""}
              isRequired
              inputMode="email"
              autoComplete="email"
            />
          )}
        </div>
        <div className={`${AddressStyles.addressFormWrapper} mt-1`}>
          <h6 className="font-semibold mb-4 text-13">{t("address")}</h6>
          {SELECTED_COUNTRY?.uiTemplate === "template_are" ? (
            <MEAddressForm addressForm={addressForm} />
          ) : (
            <Fragment>
              <FormInput
                {...register("zipcode", {
                  required: t("pincode"),
                  validate: value => {
                    if (value?.charAt(0) === "0" && !isInternationalShipping) {
                      return "Enter valid zipcode";
                    }

                    if (!isInternationalShipping && value && value.trim()?.length < 6) {
                      return t("sixpincodeValidation");
                    }

                    if (
                      isInternationalShipping &&
                      value &&
                      addressCountryData &&
                      !new RegExp(addressCountryData?.pinCodeRegex?.slice(1, -1)).test(value)
                    ) {
                      return "Enter valid zipcode";
                    }

                    return true;
                  },
                })}
                name="zipcode"
                errors={errors}
                touched={touchedFields}
                label={t("pincode") || ""}
                isRequired
                inputMode="numeric"
                maxLength={6}
                onKeyPress={isNumber}
                autoComplete="postal-code"
              />
              <div>
                <FormInput
                  {...register("location", {
                    required: t("requiredAddress") || "",
                  })}
                  errors={errors}
                  touched={touchedFields}
                  isRequired
                  label={t("address") || "Address"}
                  name="location"
                  autoComplete="street-address"
                />
              </div>

              <div className={AddressStyles["pincode-city-wrapper"]}>
                <FormInput
                  {...register("cityName")}
                  name="cityName"
                  errors={errors}
                  touched={touchedFields}
                  label={t("city") || ""}
                  disabled
                  isRequired
                />

                <FormInput
                  {...register("stateName")}
                  name="stateName"
                  errors={errors}
                  touched={touchedFields}
                  label={t("state") || ""}
                  isRequired
                  disabled
                />
              </div>
            </Fragment>
          )}

          {isLoggedIn && (
            <>
              <p className="text-xs text-gray-500 pb-2 font-bold">{t("typeOfAddress")}</p>

              <div className="flex">
                <React.Fragment>
                  <div className="user-address-type-container mr-4 relative flex w-24 h-8">
                    <input {...register("addressNickName")} id="Home" type="radio" value="Home" name="addressNickName" />
                    <label className="text-xs font-semibold" htmlFor="Home">
                      {t("home")}
                    </label>
                  </div>
                  <div className="user-address-type-container relative flex w-24 h-8">
                    <input id="Office" {...register("addressNickName")} type="radio" value="Office" name="addressNickName" />
                    <label className="text-xs font-semibold" htmlFor="Office">
                      {t("office") || "Office"}
                    </label>
                  </div>
                </React.Fragment>
              </div>

              <div className="mt-5 mb-10">
                <label htmlFor="defaultAddress" className="flex items-center">
                  <input {...register("defaultFlag")} type="checkbox" id="defaultAddress" name="defaultFlag" />
                  <span className="text-gray-500 ml-2"> {t("setAsDefaultAddress")} </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* SAVE BUTTON */}
        <div
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -4px 4px 0px" }}
          className="fixed bottom-0 inset-x-0 w-full z-50 flex justify-between bg-white items-center p-2 rounded-t"
        >
          <button
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting || Object.keys(errors).length !== 0}
            className="relative w-full text-sm flex justify-evenly items-center text-white font-semibold uppercase px-4 py-2 rounded bg-ctaImg"
          >
            {formState.isSubmitting ? (
              <Spinner className="relative w-6 mx-auto" />
            ) : (
              <>
                {((addAddressType === "chooseAddress" || addAddressType === "order-details") && isLoggedIn) || !isAddAddress
                  ? t("saveAndContinue")
                  : t("shipToThisAddress") || "Ship To This Address"}
                <span className="absolute right-4">
                  <GiNextIco
                    width="14"
                    height="21"
                    viewBox="10 400 500 50"
                    fill="#ffffff"
                    role="img"
                    aria-labelledby="ship to this address"
                  />
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Shown Only For Middle-East */}
      {dutyData && <DutyChargesModal show={showDutyModal} dutyData={dutyData} hide={() => setShowDutyModal(false)} />}

      <style>
        {`
          .input-element-wrapper input,
          .input-element-wrapper textarea,
          .input-element-wrapper select {
            width: 100%;
            padding: 0.4rem 0.75rem;
            line-height: 1.5;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 2px;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            outline: none;
          }
          .input-element-wrapper input:focus,
          .input-element-wrapper textarea:focus,
          .input-element-wrapper select:focus {
            border: 1px solid black;
          }
          .input-element-wrapper div,
          .input-element-wrapper span {
            color: red;
            font-size: 11px;
            margin: 4px 0 0;
          }
          .input-element-wrapper textarea {
            resize: none;
          }
          input-element-wrapper input[type=text]:disabled {
            background-color: #f5f5f5;
          }
          .${AddressStyles["pincode-city-wrapper"]} .input-element-wrapper {
            width: 155px;
          }

          .user-address-type-container label,
          .user-address-type-container input {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .user-address-type-container input[type="radio"] {
            opacity: 0.011;
          }

          .user-address-type-container input[type="radio"]:checked + label {
            background: var(--color2);
            border-radius: 4px;
            border:1px solid var(--color1);
            color:var(--color1);
          }

          .user-address-type-container label {
            cursor: pointer;
            line-height: 1.8em;
            border:1px solid #d2d4d9;
            color:#7d7d7d;
            border-radius: 4px;
          }

          input[type=text]:disabled {
            background: rgba(189, 189, 189, 0.2);
          }
          input[type=checkbox] {
            width: 18px;
            height: 18px;
            position: relative;
          }
          
          input[type=checkbox]:after {
            position: absolute;
            width: 20px;
            height: 20px;
            top: 0;
            content: " ";
            background-color: white;
            color: white;
            display: inline-block;
            visibility: visible;
            padding: 0px 3px;
            border-radius: 3px;
            border:1px solid #d2d4d9
          }
          
          input[type=checkbox]:checked:after {
            content: "✓";
            font-size: 13px;
            background-color: var(--color1);
              border:1px solid var(--color1);
            font-weight: 800;
          }
        `}
      </style>
    </main>
  );
}

export default AddressForm;
