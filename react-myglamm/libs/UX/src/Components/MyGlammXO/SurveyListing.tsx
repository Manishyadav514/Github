import React, { useEffect, useState } from "react";
import Router from "next/router";
import LazyHydrate from "react-lazy-hydration";

import useTranslation from "@libHooks/useTranslation";
import { useSurveyAddToBag } from "@libHooks/useSurveyAddToBag";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { SURVEYLANDING_ANALYTICS } from "@libConstants/SurveyAnalytics.Constant";

import { gaEventFunc } from "@libUtils/analytics/gtm";
import { getClientQueryParam } from "@libUtils/_apputils";
import { setLocalStorageValue } from "@libUtils/localStorage";

import { SurveyProduct, SurveyState } from "@typesLib/Survey";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PDPModalSwitch from "@libComponents/PopupModal/PDPModalSwitch";

import MyglammXOWidgets from "./MyglammXOWidgets";
import SurveyListingWeb from "./SurveyListingWeb";
import { ParseJSON } from "@libUtils/widgetUtils";

export interface SurveyList {
  widgets: any;
  openTypeform: any;
  eventData: any;
  skipSurveyLanding?: any;
}

const SurveyListing = ({ widgets, openTypeform, eventData, skipSurveyLanding }: SurveyList) => {
  const { t } = useTranslation();

  const [utmMedium, setUtmMedium] = useState("");
  const [showMiniPDP, setMiniPDP] = useState<boolean | undefined>();

  const { CTA, glammClub, autoSurveyStart, CTAStyle, productInfo }: SurveyState = ParseJSON(
    widgets[0]?.meta.widgetMeta || "{}"
  );

  const startSurvey = (e: any, ctaName?: string) => {
    if (productInfo) return handleProductOnSurvey();

    openTypeform(ctaName);
    // ga
    const eventObject: any = {};
    eventObject.eventname = "myglammxo-survey-init";
    gaEventFunc(eventObject);
  };

  /* -------- Function for starting the progress animation and calling the survey form after --------*/
  const startAnimation = () => {
    var element: any = document.getElementById("filledBar");
    if (element) {
      element.style.animation = "animate 4s linear";
      element.addEventListener("animationend", onAnimationEnd);

      function onAnimationEnd() {
        element.style.width = "100%";
        startSurvey(null);
      }
    }
  };

  /* Survey Landing Page With Direct Product Addition Logic */
  const { addProductToBag } = useSurveyAddToBag();

  const handleProductOnSurvey = () => {
    if (productInfo?.coupon) setLocalStorageValue(LOCALSTORAGE.COUPON, productInfo.coupon);

    addProductToBag(productInfo as SurveyProduct, () => setMiniPDP(true));
  };

  useEffect(() => {
    if (autoSurveyStart && utmMedium === "paid_social") {
      setTimeout(startAnimation, 0);
    }
  }, [utmMedium]);

  useEffect(() => {
    try {
      const topCTA = document.getElementById("surveyTopCTA");
      const bottomCTA = document.getElementById("surveyBottomCTA");
      let options = {
        root: document.body,
        rootMargin: "0px",
        threshold: 1.0,
      };

      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            bottomCTA?.classList.remove("hidden");
          } else {
            bottomCTA?.classList.add("hidden");
          }
        });
      }, options);
      // @ts-ignore
      observer.observe(topCTA);
    } catch (e) {
      // no-op
    }
  }, []);

  useEffect(() => {
    // utm setup for paid social
    const _utmMedium = getClientQueryParam("utm_medium");
    if (_utmMedium) setUtmMedium(_utmMedium);

    /* event trigger for custome survey if data present */
    if (eventData) {
      ADOBE_REDUCER.adobePageLoadData = {
        common: { ...eventData },
      };
      return;
    }
    // @ts-ignore
    const DIGITAL_DATA: any = { common: SURVEYLANDING_ANALYTICS[Router.query.mb] || SURVEYLANDING_ANALYTICS.default };
    ADOBE_REDUCER.adobePageLoadData = DIGITAL_DATA;
  }, []);

  if (IS_DESKTOP)
    return <SurveyListingWeb eventData={eventData} widgets={widgets} openTypeform={openTypeform} CTA={CTA as string} />;

  useEffect(() => {
    /* show survey first question in case of skip survey landing */
    skipSurveyLanding && startSurvey(null);
  }, [skipSurveyLanding]);

  if (skipSurveyLanding) return null;

  return (
    <>
      <div className="m-auto">
        {/* Get Free Lipstick Banner */}
        <form role="presentation" className="bg-white text-center relative">
          <div>
            {widgets[0] && (
              <div>
                <LazyHydrate whenIdle>
                  <MyglammXOWidgets widget={widgets[0]} type="survey" />
                </LazyHydrate>
              </div>
            )}
          </div>

          <div className="sticky -bottom-4">
            {/* ----- showing the button or the auto start button for the survey form -------- */}
            {autoSurveyStart && utmMedium === "paid_social" ? (
              <div onClick={startSurvey} className="relative pointer">
                <div className="absolute z-10 inset-x-0 bottom-8 px-4">
                  <div id="filledBar" className="shadow bg-themePink h-12 w-0 rounded-md"></div>
                </div>
                <p className="absolute font-bold z-10  tracking-wide text-white uppercase bottom-8 startText">
                  {CTA || t("startSurvey")}
                </p>
                <div className="absolute z-0 inset-x-0 bottom-8 px-4">
                  <div id="backgroundBar" className="shadow bg-gray-200 h-12 rounded-md"></div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                id="surveyTopCTA"
                onClick={startSurvey}
                disabled={showMiniPDP}
                style={CTAStyle || {}}
                className={`text-white w-11/12 h-12 shadow-lg rounded-md absolute inset-x-0 bottom-8 font-bold tracking-wide uppercase mx-auto ${
                  glammClub ? "shimmer" : "bg-themePink"
                } `}
              >
                {CTA || t("startSurvey")}

                {showMiniPDP && <LoadSpinner className="absolute w-9 m-auto inset-0" />}
              </button>
            )}
          </div>
          <p className="text-10 opacity-80 italic absolute bottom-2 inset-x-0 mx-auto">{t("startSuveyMsg")}</p>
        </form>

        {widgets?.[1] && widgets?.[1]?.customParam !== "multimedia-carousel-6" && (
          <>
            <LazyHydrate whenIdle>
              <MyglammXOWidgets widget={widgets[1]} />
            </LazyHydrate>
            <form role="presentation" className="text-center">
              <button
                type="button"
                id="surveyBottomCTA"
                onClick={startSurvey}
                disabled={showMiniPDP}
                style={CTAStyle || {}}
                className="hidden text-white w-11/12 h-12 shadow-lg rounded-md inset-x-0 bottom-8 font-bold tracking-wide uppercase mx-auto bg-themePink mb-4"
              >
                {CTA || t("startSurvey")}
                {showMiniPDP && <LoadSpinner className="absolute w-9 m-auto inset-0" />}
              </button>
            </form>
          </>
        )}

        {typeof showMiniPDP === "boolean" && (
          <PDPModalSwitch
            slug={productInfo?.slug || ""}
            modalProps={{
              show: showMiniPDP,
              hide: () => setMiniPDP(false),
              discount: productInfo?.discount,
              productSlug: {
                slug: productInfo?.slug || "",
                discountedPriceLabel: productInfo?.offerPrice,
                CTA: productInfo?.CTA,
              },
            }}
          />
        )}
      </div>

      <style>
        {`
          .startText{
            transform: translate(-50%,-50%);
            left: 50%;
          }

          #filledBar {
            animation-name: animate;
          }

          @keyframes animate{
            0% {width: 0%;}
            40% {width: 20%}
            100% {width: 100%;}
          }
    
          `}
      </style>

      <style>
        {`
          .shimmer {
            background: linear-gradient(113deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.538486341802346) 32%, rgba(255,255,255,0.4) 32%, rgba(255,255,255,0.4) 33%, rgba(255,255,255,0.4) 42%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 56%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.4) 73%, rgba(255,255,255,0.4) 78%, rgba(255,255,255,0) 79%), ${
              glammClub ? "rgb(17, 17, 17)" : "var(--color1)"
            };
            background-size: 70px 100%;
            background-repeat: repeat-y;
            background-position: 0 0;
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            to {
              background-position: 100% 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default SurveyListing;
