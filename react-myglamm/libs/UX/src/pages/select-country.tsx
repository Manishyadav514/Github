import React, { ReactElement, useEffect, useState } from "react";

import Head from "next/head";
import Router from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";

import { CountryConfig } from "@typesLib/Redux";
import { langLocale } from "@typesLib/APIFilters";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";

import CustomLayout from "@libLayouts/CustomLayout";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { getG3CountrySelections } from "@libUtils/withReduxUtils";

import { CONSTANT_REDUCER } from "@libStore/valtio/REDUX.store";

import SelectedIcon from "../../public/svg/selectedIcon.svg";

const SelectCountry = () => {
  const { t } = useTranslation();

  const { countryConstants } = useSelector((store: ValtioStore) => store.constantReducer);

  const [loader, setLoader] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(
    countryConstants?.find(x => x.isSelected) as CountryConfig
  );

  const SELECTED_LANGUAGE = (countryConstants?.find(x => x.isSelected) as CountryConfig).languages.find(x => x.isSelected);

  useEffect(() => {
    /* ONLY IN CASE OF ENGLISH FROM SERVER THIS API DOESN'T NEEDS TO BE CALLED AGAIN */
    if (countryConstants?.[0]?.isServer && SELECTED_LANGUAGE?.code !== "EN") {
      getG3CountrySelections(Router.locale as langLocale).then(data => (CONSTANT_REDUCER.countryConstants = data));
    }
  }, []);

  const handleApplyCountry = () => {
    if (selectedCountry && selectedCountry !== countryConstants?.find(x => x.isSelected)) {
      setLoader(true);

      location.href = `/${selectedCountry.languages.find(x => x.default)?.urlLang?.replace("en-in", "")}`;
    } else {
      alert("Please Select Some Other Country");
    }
  };

  return (
    <main className="bg-white" style={{ minHeight: "calc(100vh - 3rem)" }}>
      <Head>
        <title>{t("onboardingChangeCountry") || "Select Country"}</title>
      </Head>

      {/* Load in case selected language is english or content is from client */}
      {!countryConstants?.[0].isServer || SELECTED_LANGUAGE?.code === "EN" ? (
        <section>
          <ul>
            {countryConstants?.map(country => (
              <li
                key={country.selectionLabel}
                onClick={() => setSelectedCountry(country)}
                className="flex justify-between items-center h-20 border-b border-gray-200 px-6"
              >
                <img src={country.countryFlag} className="w-7 h-7 rounded-full" alt={country.selectionLabel} />
                <p className="px-4 text-sm font-semibold text-left grow">{country.selectionLabel}</p>
                {selectedCountry?.isoCode2 === country.isoCode2 ? (
                  <SelectedIcon id="noRotate" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-color1" />
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={loader}
            onClick={handleApplyCountry}
            className="w-11/12 bg-ctaImg text-white font-semibold uppercase h-9 text-sm tracking-wider fixed bottom-8 mx-auto inset-x-0 rounded-sm"
          >
            {loader ? <LoadSpinner className="absolute inset-0 m-auto w-8" /> : t("apply")}
          </button>
        </section>
      ) : (
        <LoadSpinner className="w-16 absolute inset-0 m-auto" />
      )}
    </main>
  );
};

SelectCountry.getLayout = (children: ReactElement) => (
  <CustomLayout header="onboardingChangeCountry" fallback="Select Country">
    {children}
  </CustomLayout>
);

export default SelectCountry;
