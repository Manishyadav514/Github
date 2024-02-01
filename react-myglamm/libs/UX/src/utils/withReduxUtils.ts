import MyGlammAPI from "@libAPI/MyGlammAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import { SLUG } from "@libConstants/Slug.constant";
import { setSHOP } from "@libConstants/SHOP.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { CountryConfig } from "@typesLib/Redux";
import { VendorCodes, langLocale } from "@typesLib/APIFilters";

import { valtioReduxStore } from "@libStore/valtio/REDUX.store";
import { INIT_FEATURES } from "@libStore/valtio/FEATURES.store";

import { setENV } from "@libConstants/GBC_ENV.constant";
import { DUMMY_VENDOR_CODES } from "@libConstants/DUMMY_VENDOR.constant";
import { GLOBAL_SHOP, SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

import { isServer } from "./isClient";
import { decodeHtml } from "./decodeHtml";
import { initValtioStates } from "./_apputils";
import { getLocalStorageValue } from "./localStorage";

import API_KEYS from "../../../../apikeys.json";

function processBannerData(widget: any) {
  if (widget?.length) {
    return widget
      .filter((x: any) => x.statusId === 1)
      .map((bannerData: any) => decodeHtml(bannerData.commonDetails?.description || ""));
  }

  return null;
}

const arrayToMatrix = (array: Array<any>, columns: number) =>
  Array(Math.ceil(array.length / columns))
    .fill("")
    .reduce((acc, cur, index) => [...acc, [...array].splice(index * columns, columns)], []);

export async function initalServerCalls(glammClubProductCatalogCacheData?: any, activeWidgetsCachedData?: any) {
  let configV3, headerMenu: any, footer: any, topBanner: any;
  let glammTrailCatalog: any;
  let activeWidgetGroups: any;

  try {
    const widgetAPI = new WidgetAPI();
    const constantsApi = new ConstantsAPI();

    const PromiseArray = [
      widgetAPI.getWidgets({
        where: { slugOrId: SLUG().HEADER_OFFER },
      }),
      constantsApi.getNavigation(SLUG().HEADER ? [SLUG().HEADER, SLUG().FOOTER] : SLUG().FOOTER),
      constantsApi.getConfig(),
    ];

    // call only when no product catalog cache present
    if (!glammClubProductCatalogCacheData) {
      PromiseArray.push(constantsApi.getConfig("glammTrailCatalog"));
    } else {
      PromiseArray.push(Promise.resolve({ data: {} })); // to maintain order for all settled
    }

    // to-do: call only when no active widget cache present or on config timeout
    PromiseArray.push(constantsApi.getActiveWidgetGroupSlugs(process.env.NEXT_PUBLIC_ROOT as string));

    const [offerData, navData, configData, trialCatalogueData, activeWidgetGroupSlugsData]: any = await Promise.allSettled(
      PromiseArray
    );

    topBanner = IS_DESKTOP
      ? offerData?.value?.data?.data?.data?.widget?.[0]
      : processBannerData(offerData?.value?.data?.data?.data?.widget);
    const tempFooter = navData?.value?.data?.data?.find((x: any) => x.slug.includes("footer"))?.details;
    headerMenu = navData?.value?.data?.data?.find((x: any) => x.slug.includes("header"))?.details;

    footer = SITE_CODE() === "bbc" ? arrayToMatrix(tempFooter, 2) : tempFooter;

    configV3 = {
      ...configData?.value?.data?.data,
      ...(activeWidgetGroupSlugsData
        ? {
            activeWidgetGroupSlugs: {
              timestamp: Date.now(),
              activeWidgetGroups: activeWidgetGroupSlugsData?.value?.data?.data,
            },
          }
        : { activeWidgetGroupSlugs: activeWidgetsCachedData }),
    };

    if (
      glammClubProductCatalogCacheData &&
      (configV3?.productCatalogVersion || 0.1) !== glammClubProductCatalogCacheData?.version
    ) {
      // call only when version mismatch
      glammTrailCatalog = await constantsApi.getConfig("glammTrailCatalog");
    }
    glammTrailCatalog =
      trialCatalogueData?.value?.data?.data || glammTrailCatalog?.data?.data || glammClubProductCatalogCacheData;

    activeWidgetGroups = activeWidgetGroupSlugsData?.value?.data?.data || activeWidgetsCachedData?.activeWidgetGroups;
  } catch (err) {
    console.error("With Redux", err);
  }

  if (!configV3) throw Error();
  return { topBanner, footer, configV3, headerMenu, glammTrailCatalog, activeWidgetGroups };
}

export async function getG3CountrySelections(locale: langLocale, isServer?: boolean) {
  const constantsApi = new ConstantsAPI();

  /* Calling Country Config API and constants to decide at server what API params should be(LANG / VENDOR / COUNTRY) */
  let countryConstants: any = await constantsApi.getCountrySelections();
  countryConstants = (countryConstants?.data?.data as CountryConfig[])?.map(country => ({
    ...country,
    languages: country.languages.map(lang => ({ ...lang, isSelected: locale === lang.urlLang })),
    isSelected: !!country?.languages?.find(x => x.urlLang === locale),
    isServer,
  }));

  return countryConstants;
}

export function getOrCreateStore(serverData: any) {
  const DEFAULT_STATE = valtioReduxStore;

  if (isServer()) {
    const { configV3, topBanner, footer, headerMenu, countryConstants } = serverData || {};
    return {
      ...DEFAULT_STATE,
      vendor: SITE_CODE(), // used on server
      configReducer: { ...DEFAULT_STATE.configReducer, configV3 },
      constantReducer: { ...DEFAULT_STATE.constantReducer, countryConstants },
      navReducer: { ...DEFAULT_STATE.navReducer, topBanner, footer, headerMenu },
    };
  }

  // client
  return {
    ...DEFAULT_STATE,
    vendor: SITE_CODE(), // used on client
    userReducer: {
      ...(DEFAULT_STATE.userReducer || {}),
      userProfile: getLocalStorageValue(LOCALSTORAGE.PROFILE, true),
    },
  };
}

export function setVendorAPI(vendor = process.env.NEXT_PUBLIC_VENDOR_CODE as VendorCodes) {
  const VENDOR = DUMMY_VENDOR_CODES.includes(vendor) ? "mgp" : vendor;

  GLOBAL_SHOP.SITE_CODE = vendor;
  GLOBAL_SHOP.VENDOR_CODE = VENDOR;

  MyGlammAPI.changeVendor(VENDOR);

  // @ts-ignore
  MyGlammAPI.changeAPIKey(API_KEYS[process.env.NEXT_PUBLIC_ROOT][process.env.NEXT_PUBLIC_PRODUCT_ENV][VENDOR]);
}

export function setInitConstants(store: any, headers?: any) {
  const { gbcENV, featureFlags } = store.configReducer?.configV3 || {};
  INIT_FEATURES(featureFlags);

  initValtioStates(store);

  setENV(gbcENV);

  const vendor = headers?.vendor || store.vendor;

  gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS.REGION = process.env.NEXT_PUBLIC_REGION || "INDIA"; // Declaring Region
  gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS.SITE_CODE = vendor;

  if (DUMMY_VENDOR_CODES.includes(vendor)) {
    gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS.LOGO = gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS[`LOGO_${vendor?.toUpperCase()}`];
    gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS.FAVICON = gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS[`FAVICON_${vendor?.toUpperCase()}`];
  }

  setSHOP(gbcENV.NEXT_PUBLIC_SHOP_CONSTANTS);
}
