import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Head from "next/head";

// @ts-ignore
import { createPopup } from "@typeform/embed";

import SurveyAPI from "@libAPI/apis/SurveyAPI";

import useAppRedirection from "@libHooks/useAppRedirection";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import SurveyListing from "@libComponents/MyGlammXO/SurveyListing";
import CustomSurvey from "@libComponents/CustomTypeFormSurvey/CustomSurvey";
import CustomSurveyV2 from "@libComponents/CustomTypeFormSurvey/CustomSurveyV2";
import { customSurveySubmit, getSurveyData } from "@libComponents/MyGlammXO/getSurveyData";

import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { SurveyState } from "@typesLib/Survey";

import Adobe from "@libUtils/analytics/adobe";
import { getVendorCode } from "@libUtils/getAPIParams";
import { GASurveyTypeFormLoaded } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { getClientQueryParam } from "@libUtils/_apputils";

import { SureveyStyles } from "@libStyles/TSStyles/surveyStyles";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { useSplit } from "@libHooks/useSplit";
import useTranslation from "@libHooks/useTranslation";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { ParseJSON } from "@libUtils/widgetUtils";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const buildThankYouURL = (pathname: any, query: any, version: any, loadCustomSurvey?: any) => {
  let queryParams = "";
  if (location.search.startsWith("?")) {
    queryParams =
      "&" +
      location.search
        .toLowerCase()
        .split("?")[1]
        .split("&")
        .filter(i => i.startsWith("utm_"))
        .join("&");
  }
  let _url = `${pathname}-thankyou`;
  _url +=
    `?doRedirect=true${version ? `&mb=${version}` : ""}${!!loadCustomSurvey ? `&customSurvey=${loadCustomSurvey}` : ""}` +
    queryParams;
  return _url;
};

function Survey({ widgets }: { widgets: any[] }) {
  const router = useRouter();
  const { redirect } = useAppRedirection();
  const profile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const [loading, setLoading] = useState(false);
  const [showCustomSurvey, setShowCustomSurvey] = useState(false);
  const SURVEY_INDEX = 0;

  const {
    url,
    module,
    platform,
    memberTag,
    phase,
    grantPoints,
    title,
    description,
    eventData,
    chatUI,
    skipSurvey,
    customSurveyId,
    launchNativeSurvey,
    splashScreenImage,
    skipSurveyLanding,
    skipSurveyLandingBanner,
    productInfo,
  }: SurveyState = ParseJSON(widgets[SURVEY_INDEX]?.meta.widgetMeta || "{}"); // Fallback to 0

  const loadCustomSurvey = router?.query?.layout === "true" || launchNativeSurvey === true;
  /* Attach version/name of survey to response id/thankyou url for distinguishing factor */
  const SURVEY_VERSION = router.query.mb;
  const SURVEY_RESPONSE_ID = `${LOCALSTORAGE.RESPONSE_SURVEY_ID}${SURVEY_VERSION ? `-${SURVEY_VERSION}` : ""}`;

  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const skipSurveyLandingVariant = useSplit({ experimentsList: [{ id: "skipSurveyLanding" }], deps: [] });

  const enableTypeFormFallback = FEATURES?.enableTypeFormFallback;
  const [showNativeSurveyError, setShowNativeSurveyError] = useState(false);

  const handleCloseButtonClick = () => {
    setShowCustomSurvey(false);
  };

  useEffect(() => {
    if (skipSurvey && getClientQueryParam("rc") && getClientQueryParam("utm_source") === "myrewards") {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (router?.isReady) {
      const rc = getClientQueryParam("rc");
      const utm_source = getClientQueryParam("utm_source");
      const startSurvey = getClientQueryParam("startSurvey");
      if (skipSurvey && rc && utm_source === "myrewards") {
        handleSubmitSurvey(url?.substring(url?.lastIndexOf("/") + 1), true);
      } else if (!productInfo) {
        // productInfo triggers product landing page so no survey needed here
        getSurveyData(phase, SURVEY_RESPONSE_ID, loadCustomSurvey, customSurveyId).then(surveyInfo => {
          if (surveyInfo) {
            /* Redirecting User on load if data present for survey completion */
            setLoading(true);
            redirect(buildThankYouURL(router.asPath?.split("?")[0], router.query, SURVEY_VERSION, loadCustomSurvey));
          } else if (startSurvey) {
            /* Open Survey Form if query params for StartSurvey Present */
            openTypeform();
          }
        });
      }

      // lazy prefetch the thank you page so that it loads quickly
      setTimeout(() => {
        router.prefetch(`${router.asPath?.split("?")[0]}-thankyou`);
      }, 7000);
    }
  }, [router?.isReady]);

  const r = React.useRef(null);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const adobeOnClickSurveyEvent = (ctaName?: string) => {
    // Adobe Analytics(112) - On Click - myglammxo survey - Take Survey and win More point.
    (window as any).digitalData = {
      common: {
        linkName: eventData?.linkName || `web|myglammxosurvey`,
        linkPageName: eventData?.linkPageName || `web|myglammxosurvey`,
        newLinkPageName: eventData?.newLinkPageName || ADOBE.ASSET_TYPE.MYGLAMMXO_SURVEY,
        assetType: eventData?.assetType || ADOBE.ASSET_TYPE.MYGLAMMXO_SURVEY,
        newAssetType: eventData?.newAssetType || "myglammxo",
        subSection: eventData?.subSection || ADOBE.ASSET_TYPE.MYGLAMMXO_SURVEY,
        platform: ADOBE.PLATFORM,
        ctaName: ctaName || eventData?.ctaName || "take survey & win points",
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /* Create and Open Typeform form. */
  const openTypeform = (ctaName?: string) => {
    let surveyURL = url;

    IS_DESKTOP && goToTop();

    /* In-Case of Registered User add UserInfo to Survey Url */
    if (profile) {
      surveyURL = surveyURL?.concat(`#id=${profile.id}&name=${profile.firstName}&email=${profile.email}`);
    }
    const formId = loadCustomSurvey && customSurveyId ? customSurveyId : surveyURL?.substring(surveyURL?.lastIndexOf("/") + 1);

    GASurveyTypeFormLoaded(
      {
        formName: module,
        formId,
      },
      1
    );

    !skipSurveyLanding && adobeOnClickSurveyEvent(ctaName);

    if (loadCustomSurvey && customSurveyId) {
      setShowCustomSurvey(true);
      return;
    }

    if (enableTypeFormFallback && formId) {
      const { open, close } = createPopup(formId, {
        hidden: {
          id: profile?.id,
          name: profile?.firstName,
          email: profile?.email,
        },
        mode: "popover",
        hideScrollbars: true,
        hideHeaders: false,
        hideFooter: false,
        autoClose: true,
        onReady: () => adobeTypeFormLoaded(),
        buttonText: "Let's Go",
        chat: !!chatUI, // new Chat UI enabled based on meta
        onSubmit: (e: { response_id: string; responseId: string }) => handleSubmitSurvey(e.response_id || e.responseId),
      });
      open();
      r.current = close;
    } else {
      setShowNativeSurveyError(true);
    }
  };

  /* Adobe page load event when typeform is loaded completly */
  const adobeTypeFormLoaded = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|mbtypeformloaded",
        newPageName: "mbtypeformloaded",
        subSection: "mbtypeformloaded",
        assetType: "typeform",
        newAssetType: "typeform",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  const handleCustomSurveySubmit = async (data: any, additionalParams: any) => {
    customSurveySubmit(data, customSurveyId as string, additionalParams, guestUserIdentifier =>
      handleSubmitSurvey(guestUserIdentifier, skipSurvey, data)
    );
  };

  const handleSubmitSurvey = async (responseSurveyId: string, surveySkipped = false, customSurveySubmittedData?: any) => {
    const survetApi = new SurveyAPI();
    setLoading(true);
    try {
      const dumpValue: any = {
        responseSurveyId,
        pointsEarned: 150,
        surveyStatus: { url, platform, module },
      };

      /* For STB an extra product call is made and the data is appended to dump */
      if (SHOP.SITE_CODE === "stb" && enableTypeFormFallback) {
        const { data: productData } = await survetApi.postSurveyForm({
          formId: url?.substring(url?.lastIndexOf("/") + 1),
          responseId: responseSurveyId,
          vendorCode: getVendorCode(),
          ENABLE_TYPEFORM_INTEGRATION: enableTypeFormFallback, // flag for backend to call the typeform API
        });

        dumpValue.product = productData.data;
      }

      /* POST Dump Call with the active survey data */
      const surveyPromise = [];
      /* post data in dump if we are not using our own custom survey form */
      if (!customSurveySubmittedData) {
        surveyPromise.push(
          survetApi.postDump([
            {
              key: phase,
              value: dumpValue,
              vendorCode: getVendorCode(),
              identifier: profile?.id || responseSurveyId,
            },
          ])
        );
      }

      /* Updating and Storing Data at session level - Mandatory for Apps Webview */
      sessionStorage.setItem(phase, JSON.stringify(dumpValue));
      sessionStorage.setItem(SURVEY_RESPONSE_ID, responseSurveyId);

      /* for checking survey version on login */
      SURVEY_VERSION && sessionStorage.setItem("surveyVersion", SURVEY_VERSION as string);

      /* Used when user logins to map this latest survey info with */
      sessionStorage.setItem(
        SESSIONSTORAGE.SURVEY_INFO,
        JSON.stringify(JSON.parse(widgets[SURVEY_INDEX]?.meta.widgetMeta) || "{}")
      );

      if (memberTag) {
        setLocalStorageValue(LOCALSTORAGE.SURVEY_MEMBERTAG, memberTag);
      }

      !surveySkipped &&
        GASurveyTypeFormLoaded(
          {
            formName: module,
            formId: loadCustomSurvey && customSurveyId ? customSurveyId : url?.substring(url?.lastIndexOf("/") + 1),
          },
          0
        );

      /* Hit Glammpoints Credit API only incase of registered users */
      if (profile && grantPoints && SHOP.ENABLE_GLAMMPOINTS) {
        surveyPromise.push(
          survetApi.freeGlammPoint({
            module,
            platform,
            slug: url || customSurveyId,
            type: "glammPoints",
            identifier: profile.id,
            vendorCode: getVendorCode(),
          })
        );
      }

      await Promise.allSettled(surveyPromise);

      if (!surveySkipped) {
        // @ts-ignore
        customSurveySubmittedData ? setShowCustomSurvey(false) : r?.current();
      }

      if (splashScreenImage) {
        setLoading(false);
        setShowSplashScreen(true);
        setTimeout(() => {
          redirect(buildThankYouURL(router.asPath?.split("?")[0], router.query, SURVEY_VERSION, loadCustomSurvey));
        }, glammClubConfig?.splashScreenDuration || 2000);
      } else {
        redirect(buildThankYouURL(router.asPath?.split("?")[0], router.query, SURVEY_VERSION, loadCustomSurvey));
      }
    } catch (err: any) {
      setLoading(false);
      console.error("In Survey - handleSubmitSurvey ", err.response?.data?.message || err);
    }
  };

  return (
    <main className="min-h-screen bg-color2">
      {/* SEO Data Comes from server based on where the page is called */}
      <Head>
        <title key="title">{title || "Survey"}</title>
        <meta key="og:title" property="og:title" content={title || "Survey"} />

        {description && (
          <>
            <meta key="description" name="description" content={description} />
            <meta key="og:description" property="og:description" content={description} />
          </>
        )}

        <meta key="og:site_name" property="og:site_name" content={`${WEBSITE_NAME || ""} Survey`} />
        <meta
          key="og:url"
          property="og:url"
          content={`${BASE_URL()}${router.pathname}${!!SURVEY_VERSION ? `?mb=${SURVEY_VERSION}` : ""}`}
        />

        {SureveyStyles}
      </Head>

      {(() => {
        if (loading) {
          return <LoadSpinner className="inset-0 absolute m-auto w-16" />;
        }

        if (showNativeSurveyError) {
          return (
            <div className="bg-white">
              <div className="min-h-screen flex flex-col justify-center items-center text-xl">
                <div className="text-center">
                  {t("surveyErrorText") || "Something is wrong with the native survey configuration, please check widget meta."}
                </div>
              </div>
            </div>
          );
        }

        if (showSplashScreen) {
          return (
            <Image
              priority
              quality={80}
              layout="fill"
              src={splashScreenImage || DEFAULT_IMG_PATH()}
              alt={glammClubConfig?.welcomeAltText || "Welcome to Glamm Club"}
            />
          );
        }

        if (skipSurveyLanding && skipSurveyLandingVariant?.skipSurveyLanding === "1") {
          return (
            <CustomSurveyV2
              customSurveyId={customSurveyId}
              skipSurveyLandingBanner={skipSurveyLandingBanner}
              handleSubmitCustomSurvey={handleCustomSurveySubmit}
            />
          );
        }

        if (loadCustomSurvey && showCustomSurvey) {
          return (
            <CustomSurvey
              type="embedded"
              customSurveyId={customSurveyId}
              handleCloseButtonClick={handleCloseButtonClick}
              handleSubmitCustomSurvey={(data: any, additionalParams: any) => handleCustomSurveySubmit(data, additionalParams)}
            />
          );
        }

        return (
          <SurveyListing
            widgets={widgets}
            eventData={eventData}
            openTypeform={openTypeform}
            skipSurveyLanding={skipSurveyLanding && skipSurveyLandingVariant?.skipSurveyLanding === "1"}
          />
        );
      })()}
    </main>
  );
}

export default Survey;
