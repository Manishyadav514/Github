import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import useAppRedirection from "@libHooks/useAppRedirection";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { isWebview } from "@libUtils/isWebview";

const MiniPDPModal = dynamic(() => import("@libComponents/PopupModal/MiniPDPModal"), { ssr: false });

const FilmfareSurveyThankyou = ({ hideSurveyThankyou }: { hideSurveyThankyou: () => void }) => {
  const { redirect } = useAppRedirection();

  const [showMiniPDP, setShowMiniPDP] = useState<boolean | undefined>();
  const [surveyThankyouWidget, setSurveyThankyouWidget] = useState<any>();

  const [loading, setLoading] = useState(true);

  const metaData = JSON.parse(surveyThankyouWidget?.meta.widgetMeta || "{}");

  useEffect(() => {
    setLoading(true);

    const widgetApi = new WidgetAPI();
    widgetApi.getWidgets({ where: { slugOrId: "mobile-site-filmfare-survey-thankyou" } }).then(({ data }) => {
      const widgetData = data?.data?.data?.widget;

      /* Only for Registered User Check if order placed with coupons or not based on that show UX */
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
      const fallbackWidget = () => setSurveyThankyouWidget(widgetData[0] || []);

      if (memberId) {
        const consumerApi = new ConsumerAPI();
        /* First Coupon Check */
        consumerApi
          .checkCouponUsed(memberId, JSON.parse(widgetData?.[0]?.meta.widgetMeta || "{}").couponCode)
          .then(({ data: firstCpn }) => {
            if (firstCpn?.data?.count) {
              /* Second Coupon Check */
              consumerApi
                .checkCouponUsed(memberId, JSON.parse(widgetData?.[1]?.meta.widgetMeta || "{}").couponCode)
                .then(({ data: secondCpn }) => {
                  if (secondCpn?.data?.count) {
                    setSurveyThankyouWidget(widgetData[2]);
                  } else {
                    setSurveyThankyouWidget(widgetData[1]);
                  }
                  setLoading(false);
                })
                .catch(fallbackWidget);
            } else {
              fallbackWidget();
              setLoading(false);
            }
          })
          .catch(fallbackWidget);
      } else {
        setLoading(false);
        fallbackWidget();
      }
    });
  }, []);

  const handleCTAClick = () => {
    if (!metaData.voteMore) {
      return hideSurveyThankyou();
    }

    /* Webview */
    if (isWebview()) {
      /**
       * In-Case "responseSurveyId" present in sessionStorage add it as a param
       * while giving callback
       */
      const responseSurveyId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
      let url = `${metaData.productSlug}?clickAction=add-to-bag&showMiniPdp=true&uiType=Free&discountCode=${metaData.couponCode}&shouldCheckForPromo=true&surveyMemberTag=${metaData.memberTag}`;
      if (responseSurveyId) {
        url = url.concat(`&responseSurveyId=${responseSurveyId}`);
      }

      return redirect(url, true);
    }

    setLocalStorageValue("coupon", metaData.couponCode);
    setLocalStorageValue(LOCALSTORAGE.SURVEY_MEMBERTAG, metaData.memberTag);

    return setShowMiniPDP(true);
  };

  useEffect(() => {
    // Adobe Analytics [82] - Page Load - filmfare survey - On load of Thankyou Page.
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|filmfareOTTThankyoupage`,
        newPageName: "filmfareOTT Thank You Page",
        subSection: ADOBE.ASSET_TYPE.FILMFARE,
        assetType: ADOBE.ASSET_TYPE.FILMFARE,
        newAssetType: ADOBE.ASSET_TYPE.FILMFARE,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  /* Loading - For Widget and User Coupon used Response */
  if (loading) {
    return (
      <div className="fixed w-full flex items-center h-screen bg-pink-50 inset-0">
        <LoadSpinner className="inset-x-0 w-16 mx-auto absolute" />
      </div>
    );
  }

  if (surveyThankyouWidget.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-no-repeat w-full min-h-screen"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${surveyThankyouWidget?.multimediaDetails[0]?.assetDetails.url})`,
      }}
    >
      <button
        type="button"
        onClick={handleCTAClick}
        className="bg-ctaImg h-10 font-semibold text-sm text-white rounded uppercase absolute bottom-20 inset-x-0 w-5/6 mx-auto"
      >
        {metaData.ctaText}
      </button>

      {metaData.voteMore && (
        <p
          role="presentation"
          onClick={hideSurveyThankyou}
          className="font-semibold text-sm text-center absolute bottom-10 inset-x-0 mx-auto uppercase tracking-wider border-b border-black w-max"
        >
          Vote More
        </p>
      )}

      {typeof showMiniPDP === "boolean" && (
        <MiniPDPModal
          show={showMiniPDP}
          hide={() => setShowMiniPDP(false)}
          productSlug={{ slug: metaData.productSlug, couponCode: metaData.couponCode }}
        />
      )}
    </section>
  );
};

export default FilmfareSurveyThankyou;
