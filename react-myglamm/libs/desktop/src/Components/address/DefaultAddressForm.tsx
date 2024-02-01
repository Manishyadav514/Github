import React from "react";
import { UseFormReturn } from "react-hook-form";

import useTranslation from "@libHooks/useTranslation";

import { isNumber } from "@libUtils/validation";

import FormInput from "@libComponents/Form/FormInput";

import { addressInitialValues } from "@typesLib/Consumer";

const DefaultAddressForm = ({
  addressForm,
  isInternationalShipping,
  addressCountryData,
}: {
  addressForm: UseFormReturn<addressInitialValues>;
  isInternationalShipping: boolean | undefined;
  addressCountryData: any;
}) => {
  const { t } = useTranslation();

  const { formState, register } = addressForm;
  const { errors, touchedFields } = formState;

  return (
    <>
      <div className="flex justify-between mb-10">
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
          label={t("pincode") || true}
          isRequired
          type="tel"
          maxLength={7}
          onKeyPress={isNumber}
          autoComplete="postal-code"
        />

        <div className="px-6" />

        <FormInput
          {...register("cityName")}
          disabled
          isRequired
          name="cityName"
          errors={errors}
          label={t("city") || ""}
          touched={touchedFields}
        />

        <div className="px-6" />

        <FormInput
          {...register("stateName")}
          disabled
          isRequired
          errors={errors}
          name="stateName"
          label={t("state") || ""}
          touched={touchedFields}
        />
      </div>

      <div className="w-2/3 pr-4">
        <FormInput
          {...register("location", {
            required: t("requiredAddress") || "Please Enter Address",
          })}
          errors={errors}
          touched={touchedFields}
          isRequired
          label={t("address") || "Address"}
          name="location"
          autoComplete="street-address"
        />
      </div>
    </>
  );
};

export default DefaultAddressForm;
