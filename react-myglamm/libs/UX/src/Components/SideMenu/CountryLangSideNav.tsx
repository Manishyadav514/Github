import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import MyGlammAPI from "@libAPI/MyGlammAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { getG3CountrySelections, initalServerCalls } from "@libUtils/withReduxUtils";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { CONFIG_REDUCER, CONSTANT_REDUCER, NAV_REDUCER } from "@libStore/valtio/REDUX.store";

const CountryLangSideNav = ({ url }: { url: string }) => {
  const { t } = useTranslation();

  const { asPath } = useRouter();

  const { countryConstants } = useSelector((store: ValtioStore) => store.constantReducer);

  const SelectedCountry = countryConstants?.find(x => x.isSelected);

  /* First Language after the selected language */
  const notSelectedLanguage = SelectedCountry?.languages.find(x => !x.isSelected);

  const handleLanguageChange = async () => {
    if (notSelectedLanguage) {
      MyGlammAPI.changeLanguage(notSelectedLanguage.code);
      MyGlammAPI.setLocale(notSelectedLanguage.urlLang);

      const countryConstants = await getG3CountrySelections(notSelectedLanguage.urlLang);

      /* Making Server on Client and changed dir if language is Arabic */
      const { configV3, footer, topBanner } = await initalServerCalls();
      NAV_REDUCER.footer = footer;
      NAV_REDUCER.topBanner = topBanner;
      CONFIG_REDUCER.configV3 = configV3;
      CONSTANT_REDUCER.countryConstants = countryConstants;

      if (notSelectedLanguage.code === "AR") document.dir = "rtl";
      else document.dir = "ltr";

      /* Update User preference in backend and hit a call in background */
      if (checkUserLoginStatus()) {
        const consumerApi = new ConsumerAPI();
        consumerApi.updateUserLangPreference(notSelectedLanguage.code);
      }
    }
  };

  return (
    <div className="px-4 py-3 border-t border-b">
      {url?.includes("country") && (
        <Link
          href="/select-country"
          prefetch={false}
          className="text-sm h-10 flex items-center justify-between"
          aria-label={t("country") || "Country"}
        >
          {t("country") || "Country"}
          <div className="flex items-center justify-between">
            <img src={SelectedCountry?.countryFlag} alt={SelectedCountry?.selectionLabel} className="w-5 h-5 rounded-full" />
            <div className="border-r border-t rotate-45 border-black h-2.5 w-2.5 ml-3 mr-2" />
          </div>
        </Link>
      )}

      {url?.includes("language") && notSelectedLanguage && (
        <div className="text-sm h-10 flex items-center justify-between mt-1" onClick={e => e.stopPropagation()}>
          {t("language") || "Language"}
          <Link
            href={asPath}
            prefetch={false}
            locale={notSelectedLanguage.urlLang}
            className="flex items-center justify-between"
            onClick={handleLanguageChange}
            aria-label={notSelectedLanguage.translatedLabel}
          >
            <span className="font-semibold text-sm">{notSelectedLanguage.translatedLabel}</span>
            <div className="border-r border-t rotate-45 border-black h-2.5 w-2.5 ml-3 mr-2" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CountryLangSideNav;
