import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import useAddress from "@libHooks/useAddress";
import useTranslation from "@libHooks/useTranslation";

import { DutyModalProps } from "@typesLib/Payment";
import { EditAddressPayload } from "@typesLib/MyGlammAPI";

import { getLocalStorageValue } from "@libUtils/localStorage";

import { REGEX } from "@libConstants/REGEX.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import FormInput from "@libComponents/Form/FormInput";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import CountryMobileInput from "@libComponents/Common/CountryMobileInput";

import { adobeAddressPageLoad } from "@checkoutLib/Address/AnalyticsHelperFunc";

import MEAddressForm from "./MEAddressForm";
import DefaultAddressForm from "./DefaultAddressForm";

const DutyChargesModalWeb = dynamic(() => import("../Popupmodals/DutyChargesModalWeb"), { ssr: false });

interface addressProps {
  onBack: () => void;
  isAddAddress?: boolean;
  initialState?: EditAddressPayload;
}

const ShippingAddress = ({ isAddAddress, initialState, onBack }: addressProps) => {
  const { t } = useTranslation();

  const PROFILE = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  const showEmailIdField = PROFILE?.email?.split("@").pop() === "example.com";

  const [overRideIsAddress, setOverRideIsAddress] = useState(isAddAddress);

  const [showDutyModal, setShowDutyModal] = useState(false);
  const [dutyData, setDutyData] = useState<DutyModalProps>();

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
  } = useAddress({ isAddAddress: overRideIsAddress as boolean, initialState, onBack, dutyCallback });

  const { formState, register, handleSubmit } = addressForm;
  const { errors, touchedFields } = formState;

  // Adobe Analytics[25] - Page Load - Add Address
  useEffect(() => {
    adobeAddressPageLoad(isAddAddress as boolean);
  }, []);

  if (!isPageReady) {
    return (
      <div className="w-screen h-96 relative">
        <LoadSpinner className="w-24 inset-0 absolute m-auto" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="border rounded-lg p-7 max-w-screen-xl mx-auto my-8 relative">
      <div className="font-bold uppercase tracking-wide pb-4 border-b mb-4 text-center">
        {isAddAddress ? t("addNew") || "Add New Address" : t("editAddress") || "Edit Address"}
      </div>

      <div className="text-sm font-semibold mb-4">{t("contact") || "Contact"}</div>

      <div className="flex justify-start">
        <div className="w-1/3 pr-10">
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
        </div>

        <div className="w-1/3 pr-10">
          <CountryMobileInput
            // addressPage
            loginForm={addressForm as any}
            inputNames={{ country: "countryCode", mobile: "phoneNumber" }}
            isInternationalShipping={isInternationalShipping}
            setAddressCountryData={setAddressCountryData}
          />
        </div>

        {/* Show only incase of dummy email id provided by backend */}
        {(showEmailIdField || !PROFILE) && (
          <div className="w-1/3">
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
          </div>
        )}
      </div>

      <hr className="h-2 bg-gray-100 my-8" />

      <div className="text-sm font-semibold mb-4">{t("address") || "Address"}</div>

      {(() => {
        switch (SELECTED_COUNTRY?.uiTemplate) {
          case "template_are":
            return <MEAddressForm addressForm={addressForm} />;

          default:
            return (
              <DefaultAddressForm
                addressForm={addressForm}
                isInternationalShipping={isInternationalShipping}
                addressCountryData={addressCountryData}
              />
            );
        }
      })()}

      {PROFILE && (
        <>
          <p className="text-xs text-gray-500 pb-2 font-bold mt-6">{t("typeOfAddress")}</p>

          <div className="flex">
            <div className="user-address-type-container mr-5">
              <input
                {...register("addressNickName")}
                id="Home"
                type="radio"
                value="Home"
                name="addressNickName"
                className="hidden"
              />
              <label className="h-10 w-32 flex items-center justify-center" htmlFor="Home">
                {t("home") || "Home"}
              </label>
            </div>
            <div className="user-address-type-container">
              <input
                {...register("addressNickName")}
                id="Office"
                type="radio"
                value="Office"
                name="addressNickName"
                className="hidden"
              />
              <label className="h-10 w-32 flex items-center justify-center" htmlFor="Office">
                {t("office") || "Office"}
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="defaultAddress" className="flex items-center cursor-pointer">
              <input {...register("defaultFlag")} type="checkbox" id="defaultAddress" name="defaultFlag" />
              <span className="text-gray-500 ml-2 font-normal capitalize">
                {t("setDefaultAddress") || "Set as default address"}
              </span>
            </label>
          </div>
        </>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="border border-color1 text-color1 border-solid rounded uppercase font-semibold h-12 w-28 hover:bg-color1 hover:text-white"
        >
          {t("back")}
        </button>

        <button
          type="submit"
          disabled={addressForm.formState.isSubmitting || !addressForm.formState.isValid}
          className="text-white font-semibold bg-color1 h-12 uppercase rounded w-52 relative"
        >
          {addressForm.formState.isSubmitting
            ? t("submitting") || "Submitting..."
            : isAddAddress
            ? t("shipToThisAddress") || "Ship To This Address"
            : t("saveAddress") || "save address"}
        </button>
      </div>

      {dutyData && <DutyChargesModalWeb show={showDutyModal} hide={() => setShowDutyModal(false)} dutyData={dutyData} />}
      <style>
        {`
          .user-address-type-container label {
            cursor: pointer;
            line-height: 1.8em;
            border:1px solid #d2d4d9;
            color:#7d7d7d;
            border-radius: 4px;
          }
          .user-address-type-container input[type="radio"]:checked + label {
            background: var(--color2);
            border-radius: 4px;
            border:1px solid var(--color1);
            color:var(--color1);
          }

          input[type=text]:disabled {
            opacity: 0;
            cursor: not-allowed;
          }
          input[type=checkbox] {
            width: 18px;
            height: 18px;
            margin: 0;
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
    </form>
  );
};

export default ShippingAddress;
