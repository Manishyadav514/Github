import MyGlammAPI from "@libAPI/MyGlammAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { CountryLang } from "@typesLib/Redux";

import { getG3CountrySelections, initalServerCalls } from "./withReduxUtils";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { CONFIG_REDUCER, CONSTANT_REDUCER, NAV_REDUCER } from "@libStore/valtio/REDUX.store";

/* Intiating API and normal Logic to trigger Language Change */
export const handleLanguageChange = async (notSelectedLanguage: CountryLang) => {
  if (notSelectedLanguage) {
    MyGlammAPI.changeLanguage(notSelectedLanguage.code);
    MyGlammAPI.setLocale(notSelectedLanguage.urlLang);

    const countryConstants = await getG3CountrySelections(notSelectedLanguage.urlLang);

    /* Making Server on Client and changed dir if language is Arabic */
    const { configV3, footer, topBanner, headerMenu } = await initalServerCalls();
    NAV_REDUCER.footer = footer;
    NAV_REDUCER.topBanner = topBanner;
    NAV_REDUCER.headerMenu = headerMenu;
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
