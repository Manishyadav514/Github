import React, { useState, useEffect } from "react";
import LazyHydrate from "react-lazy-hydration";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Head from "next/head";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import useAppRedirection from "@libHooks/useAppRedirection";
import { useSurveyAddToBag } from "@libHooks/useSurveyAddToBag";

import Adobe from "@libUtils/analytics/adobe";
import { isWebview } from "@libUtils/isWebview";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getIntialPropsSurveyThankyou } from "@libUtils/catchRouteUtils";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { SURVEYTHANKYOU_ANALYTICS } from "@libConstants/SurveyAnalytics.Constant";

import SkipThankYou from "@libComponents/PDPSkipThankYou";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import MiniPDPModal from "@libComponents/PopupModal/MiniPDPModal";
import { getSurveyData } from "@libComponents/MyGlammXO/getSurveyData";
import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";
import SurveyThankyouWeb from "@libComponents/MyGlammXO/SurveyThankyouWeb";
import MultiOptionSurveyThankyou from "@libComponents/Survey/MultiOptionSurveyThankyou";

import { SurveyThankyouState } from "@typesLib/Survey";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

const SurveyThankYou = ({ widgets, products, ratings }: { widgets: any[]; products: any; ratings: any }) => {
  const router = useRouter();
  const { redirect } = useAppRedirection();
  const { addProductToBag } = useSurveyAddToBag();

  const [surveyMemberType, setSurveyMemberType] = useState<number>();

  const SURVEY_VERSION = router.query.mb;
  const ACTIVE_WIDGET = widgets[0];
  SOURCE_STATE.addToBagSource = "survey";
  const isLoggedIn = checkUserLoginStatus();

  const {
    platform,
    phase,
    coupon,
    productIds,
    slug,
    CTA,
    eventData,
    openMiniPDP,
    discount,
    autoApply,
    priceLabel,
    slotMachine,
    backgroundColor,
    bestSelling,
    productsUnavailableMessage,
    customSurveyId,
    glammClub,
    showCongratsV2,
  }: SurveyThankyouState = JSON.parse(ACTIVE_WIDGET?.meta.widgetMeta || "{}");
  const [showMiniPDPModal, setShowMiniPDPModal] = useState<boolean | undefined>();

  const [currentProduct, setCurrentProduct] = useState({ urlManager: { url: undefined } });

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    router.prefetch("/shopping-bag");
  }, []);
  /* On Load Call for Survey Member Type */
  useEffect(() => {
    if (phase && router?.isReady) {
      const SURVEY_RESPONSE_ID = `${slotMachine ? LOCALSTORAGE.SLOT_MACHINE_RESPONSE_ID : LOCALSTORAGE.RESPONSE_SURVEY_ID}${
        SURVEY_VERSION ? `-${SURVEY_VERSION}` : ""
      }`;
      const loadCustomSurvey = getClientQueryParam("customSurvey") === "true";
      getSurveyData(phase, SURVEY_RESPONSE_ID, loadCustomSurvey, customSurveyId).then(surveyData => {
        if (surveyData) {
          /* For Registered Users Get Survey Member Type Data */
          const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
          if (memberId && platform) {
            const consumerApi = new ConsumerAPI();

            consumerApi
              .getSurveyMemberType(platform, memberId)
              .then(({ data: res }) => setSurveyMemberType(res.data.surveyMemberType - 1));
          } else {
            setSurveyMemberType(0);
          }
          /* Adobe Analytics [82] - Page Load - myglammxo survey - On load of Thankyou Page. */
          ADOBE_REDUCER.adobePageLoadData = {
            // @ts-ignore
            common: SURVEYTHANKYOU_ANALYTICS[SURVEY_VERSION] || SURVEYTHANKYOU_ANALYTICS.default,
          };
        } else {
          /* Redirect Users back to Survey Landing Page in case no surveyData present */
          router.replace(`${router.asPath.split("-thankyou")[0]}${SURVEY_VERSION ? `?mb=${SURVEY_VERSION}` : ""}`);
        }
      });
    }
  }, [router?.isReady]);

  const adobeOnClickCTAEvent = (ctaName: string) => {
    // Adobe Analytics(115) - On Click - myglammxo survey - Copy Coupon Code.
    (window as any).digitalData = {
      common: {
        linkName: eventData?.linkName || `web|${ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE]}|surveythankyoupage`,
        linkPageName: eventData?.linkPageName || `web|${ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE]}|surveythankyoupage`,
        ctaName: ctaName,
        newLinkPageName: eventData?.newLinkPageName || "survey thank you page",
        subSection: eventData?.subSection || ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
        assetType: eventData?.assetType || "surveythankyou",
        newAssetType: eventData?.newAssetType || ADOBE.ASSET_TYPE.SURVEY[SHOP.SITE_CODE],
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const copyCoupon = () => {
    if (coupon) {
      if (autoApply) setLocalStorageValue(LOCALSTORAGE.COUPON, coupon);

      try {
        const textArea = document.createElement("textarea");
        textArea.value = coupon;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
      } catch {
        /**
         * For avoiding Write Permission Denied Errors on Data-Dog
         */
        navigator.clipboard.writeText(coupon);
      }
      adobeOnClickCTAEvent("copy code");
    }
  };

  useEffect(() => {
    window.dataLayer?.push({ event: "optimize.activate" });
  }, []);

  useEffect(() => {
    if (typeof surveyMemberType === "number" && (openMiniPDP || SESSIONSTORAGE.FREE_XO_PRODUCT in sessionStorage)) {
      claimFreeProduct();
    }
  }, [surveyMemberType]);

  //End

  const claimFreeProduct = async (event?: any, productIndex: number = 0) => {
    event?.preventDefault();

    setLoader(true);
    copyCoupon();

    const slugValue = products?.data[productIndex]?.urlManager?.url || slug;

    slugValue?.includes("/glammclub/") && adobeOnClickCTAEvent("claim your exclusive trial");

    addProductToBag(
      {
        platform,
        discount,
        slug: slugValue,
        coupon: (autoApply && coupon) || "",
        productIds: products?.data[productIndex] ? [products.data[productIndex].id] : productIds,
      },
      () => setShowMiniPDPModal(true)
    );
  };

  const choosePDPProduct = (event?: any, product?: any, position?: any, openModal?: boolean) => {
    if (isWebview()) {
      /**
       * In-Case "responseSurveyId" present in sessionStorage add it as a param
       * while giving callback
       */
      const responseSurveyId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
      let url = `${product?.urlManager?.url}?clickAction=add-to-bag&showMiniPdp=true${discount ? "" : "&uiType=Free"}`;
      if (responseSurveyId) {
        url = url.concat(`&responseSurveyId=${responseSurveyId}&surveyName=survey${platform || ""}`);
      }
      /* append survey version */
      if (SURVEY_VERSION) {
        url = url.concat(`&mb=${SURVEY_VERSION}`);
      }
      /* add flow for app to distinguish survey flow */
      url = url.concat(`&flow=survey`);

      redirect(url, true);
    } else {
      setCurrentProduct(product);
      if (openModal) {
        setShowMiniPDPModal(true);
      } else {
        claimFreeProduct(event, position);
      }
    }
  };

  if (typeof surveyMemberType === "number") {
    const slugValue = currentProduct?.urlManager?.url || slug;

    if (IS_DESKTOP) {
      return (
        <main className="bg-color2 py-8">
          <Head>
            <title key="title">Thankyou | {WEBSITE_NAME || ""}</title>
          </Head>

          <SurveyThankyouWeb widget={ACTIVE_WIDGET} claimFreeProduct={claimFreeProduct} CTA={CTA} loader={loader} />
        </main>
      );
    }

    return (
      <section className="min-h-screen bg-white">
        <Head>
          <title key="title">Thankyou | {WEBSITE_NAME || ""}</title>
        </Head>

        {/* && productIds === undefined */}
        {slotMachine && slugValue?.includes("/product/") ? (
          <SkipThankYou
            discount={discount}
            productSlug={{ couponCode: coupon, slug: slugValue }}
            widgetMeta={ACTIVE_WIDGET?.meta.widgetMeta}
            bannerImage={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.url}
          />
        ) : (
          <>
            {productIds && productIds?.length > 1 ? (
              <>
                {products?.data && products?.count > 1 ? (
                  <MultiOptionSurveyThankyou
                    products={products}
                    ratings={ratings}
                    priceLabel={priceLabel}
                    backgroundColor={backgroundColor}
                    choosePDPProduct={choosePDPProduct}
                    headerImage={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.url}
                  />
                ) : (
                  <div
                    className="min-h-screen flex flex-col items-center"
                    style={{
                      backgroundSize: "100% 100%",
                      backgroundColor: backgroundColor ? backgroundColor : "#e3e3e9",
                    }}
                  >
                    <div className="w-full flex justify-center items-center bg-cover bg-center bg-no-repeat">
                      <ImageComponent
                        className="img-responsive text-center"
                        src={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.url}
                      />
                    </div>
                    <Image
                      width={200}
                      height={200}
                      alt="Free Lipstick Banner"
                      src={
                        productsUnavailableMessage ||
                        "https://files.myglamm.com/site-images/original/productsUnavailableImage.png"
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full text-center">
                <form onSubmit={e => claimFreeProduct(e, 0)} className="relative">
                  {isLoggedIn && showCongratsV2 && widgets[3] && widgets?.[3]?.customParam === "html-content" ? (
                    <div>
                      <LazyHydrate whenIdle>
                        <MyglammXOWidgets widget={widgets[3]} />
                      </LazyHydrate>
                    </div>
                  ) : (
                    <Image
                      priority
                      width={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.properties?.width || 360}
                      height={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.properties?.height || 640}
                      layout="responsive"
                      alt="Free Lipstick Banner"
                      src={ACTIVE_WIDGET?.multimediaDetails?.[0]?.assetDetails?.url}
                    />
                  )}

                  {isLoggedIn && showCongratsV2 && widgets[2] && widgets?.[2]?.customParam === "module-carousel-12" ? (
                    <div className="absolute m-auto bottom-5 left-0 right-0">
                      <div>
                        <LazyHydrate whenIdle>
                          <MyglammXOWidgets widget={widgets[2]} />
                        </LazyHydrate>
                      </div>
                    </div>
                  ) : (
                    <div className="sticky -bottom-4">
                      <button
                        type="submit"
                        disabled={loader}
                        className={`text-sm text-white w-5/6 h-10 shadow-lg rounded-sm absolute inset-x-0 bottom-9 font-semibold mx-auto uppercase ${
                          glammClub ? "bg-gray-900" : "bg-themePink"
                        }`}
                      >
                        {/* {variant === "1" ? appInstallCTA : CTA} */}
                        {CTA}
                        {loader && <LoadSpinner className="w-8 m-auto absolute inset-0" />}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            {typeof showMiniPDPModal === "boolean" && slugValue && (
              <MiniPDPModal
                discount={discount}
                show={showMiniPDPModal}
                productSlug={{ couponCode: coupon, slug: slugValue }}
                hide={() => {
                  setShowMiniPDPModal(false);
                  setLoader(false);
                }}
                bestSelling={bestSelling}
              />
            )}
          </>
        )}
      </section>
    );
  }

  return (
    <div className="h-screen w-full">
      <LoadSpinner className="inset-0 absolute m-auto w-16" />
    </div>
  );
};

SurveyThankYou.getInitialProps = getIntialPropsSurveyThankyou;

export default SurveyThankYou;
