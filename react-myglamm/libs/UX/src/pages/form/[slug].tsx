import SurveyAPI from "@libAPI/apis/SurveyAPI";
import CustomSurvey from "@libComponents/CustomTypeFormSurvey/CustomSurvey";
import Layout from "@libLayouts/Layout";
import React, { ReactElement, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getVendorCode } from "@libUtils/getAPIParams";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { useState } from "react";
import { useRouter } from "next/router";
import { ADOBE } from "@libConstants/Analytics.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import Adobe from "@libUtils/analytics/adobe";
import { logURI } from "@libUtils/debug";
import { customSurveySubmit } from "@libComponents/MyGlammXO/getSurveyData";

interface NativeSurveyFormPropTypes {
  surveyForm: any;
  hasError?: boolean;
}

const NativeSurveyForm = ({ surveyForm, hasError }: NativeSurveyFormPropTypes) => {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleCloseButtonClick = () => {
    router.push("/");
  };

  /* Adobe onLoad event */
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|native survey|${surveyForm?.name}`,
        newPageName: "native survey form",
        subSection: "native survey",
        assetType: "native survey",
        newAssetType: "native survey",
        platform: ADOBE.PLATFORM,
        pageLocation: "form",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong, please try again.</h1>;
  }
  const profile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  const handleCustomSurveySubmit = async (data: any, additionalParams: any) => {
    customSurveySubmit(data, surveyForm?.id, additionalParams, () => {
      setSubmitted(true); /* Adobe onClick event (126 & 127) on form submission */
      (window as any).digitalData = {
        common: {
          linkName: `web|native survey|${surveyForm?.name}`,
          linkPageName: "native survey form",
          newLinkPageName: "native survey",
          assetType: "native survey",
          newAssetType: "native survey",
          subSection: "native survey",
          platform: ADOBE.PLATFORM,
          ctaName: "native survey submit",
          pageLocation: "form",
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.Click();
    });

    // const survetApi = new SurveyAPI();
    // try {
    //   /* make post call to save user response */
    //   if (data) {
    //     /* Guest user identifier */
    //     const guestUserIdentifier = uuidv4().replaceAll("-", "");
    //     const { data: customSurveyResponseData } = await survetApi.postCustomSurveyData({
    //       value: { customSurveyData: data },
    //       surveyId: surveyForm?.id,
    //       vendorCode: getVendorCode(),
    //       identifier: profile?.id || guestUserIdentifier,
    //       additionalParams: additionalParams || {},
    //     });
    //     if (customSurveyResponseData?.code === 200 && customSurveyResponseData?.data?.surveyResponseIds?.length > 0) {
    //       setSubmitted(true);
    //     }
    //   }
    // } catch (error: any) {
    //   console.error(error);
    //   /* set error in evar35 */
    //   (window as any).evars.evar35 = error?.response?.data?.error?.message.concat(" ", "native survey");
    // }

    // /* Adobe onClick event (126 & 127) on form submission */
    // (window as any).digitalData = {
    //   common: {
    //     linkName: `web|native survey|${surveyForm?.name}`,
    //     linkPageName: "native survey form",
    //     newLinkPageName: "native survey",
    //     assetType: "native survey",
    //     newAssetType: "native survey",
    //     subSection: "native survey",
    //     platform: ADOBE.PLATFORM,
    //     ctaName: "native survey submit",
    //     pageLocation: "form",
    //   },
    //   user: Adobe.getUserDetails(),
    // };
    // Adobe.Click();
  };

  return submitted ? (
    <div
      style={{
        background: `${surveyForm?.meta?.backgroundUrl ? `url(${surveyForm?.meta?.backgroundUrl})` : "white"}`,
      }}
      className="bg-center bg-top bg-repeat"
    >
      <div className="min-h-screen flex flex-col justify-center items-center text-2xl">{`${
        surveyForm?.meta?.thankYouMessage || "All done! Thanks for your time."
      }`}</div>
    </div>
  ) : (
    <CustomSurvey
      customSurveyId={surveyForm?.id}
      handleCloseButtonClick={handleCloseButtonClick}
      handleSubmitCustomSurvey={(data: any, additionalParams: any) => handleCustomSurveySubmit(data, additionalParams)}
      type="standalone"
    />
  );
};

NativeSurveyForm.getInitialProps = async (ctx: any) => {
  try {
    const surveyAPI = new SurveyAPI();
    const { data } = await surveyAPI.getCustomSurveyFormBySlug(ctx?.query?.slug, "slug");
    if (data?.data?.questionnaires?.length > 0) {
      return { surveyForm: data?.data, hasError: false };
    } else {
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return {
        errorCode: 404,
      };
    }
  } catch (error: any) {
    logURI(ctx.asPath);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
    return {
      errorCode: 404,
      hasError: true,
    };
  }
};

NativeSurveyForm.getLayout = (children: ReactElement) => (
  <Layout footer={false} header={false} topBanner={false}>
    {children}
  </Layout>
);

export default NativeSurveyForm;
