import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { makePopup } from "@typeform/embed";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { getVendorCode } from "@libUtils/getAPIParams";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { GASurveyTypeFormLoaded } from "@libUtils/analytics/gtm";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { getSurveyData } from "@libComponents/MyGlammXO/getSurveyData";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

const MultimediaGridBanners = ({ item }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }
  const enableTypeFormFallback = FEATURES?.enableTypeFormFallback;

  /* Based on the category(query) in URL search for it in widget and open typeform */
  useEffect(() => {
    const categoryParam = getClientQueryParam("category");
    if (typeof categoryParam === "string") {
      const category = getFormCategoryName(categoryParam);

      item.multimediaDetails.forEach((banner: any) => {
        if (getFormCategoryName(banner.headerText) === category) {
          openTypeForm(banner.url, banner.headerText);
        }
      });
    }
  }, []);

  const getFormCategoryName = (cat: string) => typeof cat === "string" && cat.trim().replace(" ", "").toLocaleLowerCase();

  const openTypeForm = (URL: string, category: string) => {
    if (enableTypeFormFallback && URL?.includes("typeform")) {
      makePopup(URL, {
        mode: "popover",
        hideScrollbars: true,
        hideHeaders: false,
        hideFooter: false,
        opacity: 1,
        buttonText: "Let's Go",
        autoOpen: false,
        autoClose: 0,
        onSubmit: (e: { response_id: string }) => onSubmitTypeform(e.response_id, URL, category),
      }).open();
    } else {
      window.open(URL, "_blank");
    }

    /* GA Webengage Typeform Load */
    GASurveyTypeFormLoaded({ formName: getFormCategoryName(category), formId: URL }, 1);
  };

  const onSubmitTypeform = (response_id: string, typeformURL: string, category: string) => {
    getSurveyData("filmfareSurvey").then(data => {
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

      /* Retrieve SurveyData and filter if user has already filled it once */
      const surveyData = (((data as any)?.filmfareSuveys || []) as Array<any>).filter(x => x.typeformURL !== typeformURL);

      /* Store response_id only for guest */
      if (!memberId) sessionStorage.setItem(LOCALSTORAGE.RESPONSE_SURVEY_ID, response_id);

      /* Post Updated Survey Data in Dump */
      const consumerApi = new ConsumerAPI();
      consumerApi.postDump([
        {
          key: "filmfareSurvey",
          vendorCode: getVendorCode(),
          identifier: memberId || response_id,
          value: { filmFareSurveys: [...surveyData, { response_id, typeformURL }] },
        },
      ]);

      /* GA Webengage Typeform Load */
      GASurveyTypeFormLoaded(
        { formName: getFormCategoryName(category), formId: typeformURL, responseSurveyId: response_id },
        0
      );
    });

    window.dispatchEvent(new Event("ThankyouPage"));
  };

  return (
    <div className="Multimedia Grid px-2 pb-4 flex flex-wrap">
      {item.multimediaDetails?.map((banner: any) => {
        /* Typeform Banners */
        if (banner.url.includes("typeform")) {
          return (
            <div
              key={banner.url}
              className="w-1/2 px-2 pb-2"
              role="presentation"
              onClick={() => openTypeForm(banner.url, banner.headerText)}
            >
              <ImageComponent alt={banner.headerText} src={banner.assetDetails.url} className="w-full rounded-md" />
            </div>
          );
        }

        /* Normal Images with Redirection */
        return (
          <Link href={banner.url} aria-label={banner.headerText}>
            <ImageComponent alt={banner.headerText} src={banner.assetDetails.url} className="w-full" />
          </Link>
        );
      })}
    </div>
  );
};

export default MultimediaGridBanners;
