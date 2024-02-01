import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { addressInitialValues } from "@typesLib/Consumer";

import FormInput from "@libComponents/Form/FormInput";
import FormSelect from "@libComponents/Form/FormSelect";

const MEAddressForm = ({ addressForm }: { addressForm: UseFormReturn<addressInitialValues> }) => {
  const { t } = useTranslation();

  const { isdCodes, citiesConstants } = useSelector((store: ValtioStore) => store.constantReducer);

  const { formState, register } = addressForm;
  const { errors, touchedFields } = formState;

  const SINGLE_COUNTRY = isdCodes?.length === 1;

  useEffect(() => {
    if (SINGLE_COUNTRY) addressForm.setValue("countryName", isdCodes[0]?.countryLabel, { shouldValidate: true });
  }, [SINGLE_COUNTRY]);

  const UAE_SELECTED =
    (isdCodes?.find(x => x.countryLabel === addressForm.watch("countryName"))?.id || isdCodes?.[0]?.id) === 231;

  return (
    <div className="flex justify-between flex-wrap">
      {!SINGLE_COUNTRY && (
        <div className="w-1/3 pr-10 relative">
          <FormSelect
            {...register("countryName")}
            isRequired
            errors={errors}
            name="countryName"
            autoComplete="countryName"
            touched={touchedFields}
            label={t("country") || "Country"}
          >
            {isdCodes?.map(isd => (
              <option key={isd.countryCode}>{isd.countryLabel}</option>
            ))}
          </FormSelect>
        </div>
      )}

      <div className="w-1/3 pr-10 mb-8">
        <FormSelect
          {...register("cityName")}
          isRequired
          name="cityName"
          errors={errors}
          autoComplete="cityName"
          touched={touchedFields}
          label={UAE_SELECTED ? t("emirates") || "Emirates" : t("city") || "City"}
        >
          {citiesConstants?.map(city => (
            <option key={city.cityName}>{city.cityName}</option>
          ))}
        </FormSelect>
      </div>

      <div className={`w-1/3 ${SINGLE_COUNTRY ? "pr-10" : ""}`}>
        <FormInput
          {...register("apartment", {
            required: t("requiredApartment") || "",
          })}
          name="apartment"
          errors={errors}
          touched={touchedFields}
          isRequired
          label={t("apartment") || "Apartment"}
          autoComplete="faltNumber"
        />
      </div>

      <div className={`w-1/3 ${SINGLE_COUNTRY ? "" : "pr-10"}`}>
        <FormInput
          {...register("area", {
            required: t("requiredArea") || "",
          })}
          name="area"
          errors={errors}
          touched={touchedFields}
          isRequired
          label={t("area") || "Area"}
          autoComplete="area"
        />
      </div>

      <div className={`w-2/3 ${SINGLE_COUNTRY ? "pr-10" : ""}`}>
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
    </div>
  );
};

export default MEAddressForm;
