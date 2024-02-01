import React, { ReactElement, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useSnapshot } from "valtio";
import LazyHydrate from "react-lazy-hydration";

import useTranslation from "@libHooks/useTranslation";

import { PDP_ICID } from "@productLib/pdp/PDP.constant";
import { getPDPIntialProps } from "@productLib/pdp/HelperFunc";
import { removeKeyFromObject } from "@productLib/pdp/pdpUtils";
import { useVariants } from "@productLib/pdp/hooks/useVariants";
import { usePDPOnMount } from "@productLib/pdp/hooks/usePDPOnMount";
import { usePDPAnalytics } from "@productLib/pdp/hooks/usePDPAnalytics";

/* Components */
import Layout from "@libLayouts/Layout";
import PDPHead from "@libComponents/PDP/PDPHead";
import PDPTryon from "@libComponents/PDP/PDPTryon";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import PDPTitleDesc from "@libComponents/PDP/PDPTitleDesc";
import PDPATCBottom from "@libComponents/PDP/PDPATCBottom";
import PDPOffers from "@libComponents/PDP/Offers-pdpwidget";
import DynamicRenderer from "@libComponents/Common/DynamicRenderer";
import PartnershipCoupon from "@libComponents/PDP/PartnershipCoupon";
import PDPBannerCarousel from "@libComponents/PDP/PDPBannerCarousel";
import PDPAccordion from "@libComponents/PDP/PDPAccordion-pdpwidget";
import PDPRatingsandShare from "@libComponents/PDP/PDPRatingsandShare";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeHorizontal-pdpwidget";
import SimilarProductButton from "@libComponents/PDP/SimilarProductButton";

import { DecoySubscription, PDPBundleProd, PDPPage, SelectedSubscription } from "@typesLib/PDP";

import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { PDP_STATES, PDP_VARIANTS, RESET_PDP_STATES } from "@libStore/valtio/PDP.store";

import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import OfflineStoreLayout from "@libLayouts/OfflineStoreLayout";
import { getTrialProductPricing, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import DownloadTile from "@libComponents/PDP/DownloadTile";
import { useSplit } from "@libHooks/useSplit";
import PDPShimmer from "@libComponents/PDP/PDPShimmer";
import PDPv2 from "@libComponents/PDP/PDPv2";
import { isShadeUIv2 } from "@libUtils/pdpUtils";
import { evarValueGenerator } from "@productLib/pdp/AnalyticsHelper";
import PDPProductWidgetModal from "@libComponents/PDP/PDPWidgetComponents/PDPProductWidgetModal";
const PDPPopupVideoModal = dynamic(
  () => import(/* webpackChunkName: "PDPPopupVideoModal" */ "@libComponents/PDP/PDPWidgetComponents/PDPPopupVideoModal"),
  { ssr: false }
);

const PDPCustomWidgets = dynamic(() => import("@libComponents/PDP/PDPCustomWidgets"), { ssr: false });
const ErrorComponent = dynamic(() => import("../../_error"));
const PDPKitShadeSelection = dynamic(
  () => import(/* webpackChunkName: "PDPKitsCombo" */ "@libComponents/PDP/PDPKitShadeSelection-pdpwidget")
);
const PDPPreOrderInfo = dynamic(
  () => import(/* webpackChunkName: "PreOrderInfo" */ "@libComponents/PDP/PDPPreOrderInfo-pdpwidget")
);
const ReviewAndQuestion = dynamic(
  () => import(/* webpackChunkName: "ReviewAndQuestion" */ "@libComponents/PDP/Reviews/ReviewAndQuestions-pdpwidget")
);
const PDPFooter = dynamic(() => import(/* webpackChunkName: "PDPFooter" */ "@libComponents/PDP/PDPFooter"));
const ExchangeOffer = dynamic(
  () => import(/* webpackChunkName: "ExchangeOffer-pdpwidget" */ "@libComponents/PDP/ExchangeOffer-pdpwidget")
);
const PDPLookBook = dynamic(() => import(/* webpackChunkName: "PDPLookBook" */ "@libComponents/PDP/PDPLookBook"));
const WatchAndLearn = dynamic(() => import(/* webpackChunkName: "WatchAndLearn" */ "@libComponents/PDP/WatchAndLearn"));
const PDPAddOnProduct = dynamic(() => import(/* webpackChunkName: "PDPAddOnProduct" */ "@libComponents/PDP/PDPAddOnProduct"));
const PDPOutOfStockBottom = dynamic(
  () => import(/* webpackChunkName: "WatchAndLearn" */ "@libComponents/PDP/PDPOutOfStockBottom")
);

// ---- CLIENT CHUNKS -----

const FlashSaleTicker = dynamic(() => import(/* webpackChunkName: "FlashSaleTickerChunk" */ "@libComponents/FlashSaleTicker"), {
  ssr: false,
});
const PDPBundleProduct = dynamic(
  () => import(/* webpackChunkName: "PDPBundleProduct" */ "@libComponents/PDP/PDPBundleProduct-pdpwidget"),
  { ssr: true }
);
const PDPRecentlyViewedCarousel = dynamic(
  () => import(/* webpackChunkName: "PDPRecentlyViewedCarousel" */ "@libComponents/PDP/PDPRecentlyViewedCarousel"),
  {
    ssr: false,
  }
);
const PDPRecommendedProduct = dynamic(
  () => import(/* webpackChunkName: "PDPRecommendedProduct" */ "@libComponents/PDP/PDPRecommendedProduct"),
  {
    ssr: false,
  }
);
const PDPPhotoslurp = dynamic(() => import(/* webpackChunkName: "pdpphotoslurp" */ "@libComponents/PDP/PDPPhotoslurp"), {
  ssr: false,
});
const PDPRountineBundling = dynamic(
  () => import(/* webpackChunkName: "PDPRountineBundling" */ "@libComponents/PDP/PDPRountineBundling"),
  {
    ssr: false,
  }
);

const PaymentOffersList = dynamic(
  () => import(/*webpackChunkName: "Payment offers"  */ "@libComponents/PDP/PaymentOffersList"),
  { ssr: false }
);

const SubmitReviewForm = dynamic(
  () => import(/* webpackChunkName: "SubmitReviewForm" */ "@libComponents/PDP/Reviews/SubmitReview"),
  {
    ssr: false,
  }
);
const PDPCTPTitle = dynamic(() => import(/* webpackChunkName: "CTPTitle" */ "@libComponents/PDP/PDPCTPTitle"), { ssr: false });
const PDPSubscriptions = dynamic(
  () => import(/* webpackChunkName: "PDPSubscription" */ "@libComponents/PDP/PDPSubscriptions"),
  { ssr: false }
);
const PDPDynamicOfferPersonalisation = dynamic(
  () => import(/* webpackChunkName: "PDPCouponPersonalisation" */ "@libComponents/PDP/PDPDynamicOfferPersonalisation"),
  { ssr: false }
);

const PDPConcernAndIngredients = dynamic(
  () => import(/* webpackChunkName: "PDPConcernAndIngredients" */ "@libComponents/PDP/PDPConcernAndIngredients"),
  {
    ssr: false,
  }
);
const PDPCupSizeSelector = dynamic(
  () => import(/* webpackChunkName: "PDPCupSizeSelector" */ "@libComponents/PDP/PDPCupSizeSelector"),
  { ssr: false }
);
const PDPCustomerViewBought = dynamic(
  () => import(/* webpackChunkName: "PDPCustomViewBought" */ "@libComponents/PDP/PDPCustomerViewBought"),
  { ssr: false }
);
const PDPFrequentlyBroughtV2 = dynamic(
  () => import(/* webpackChunkName: "PDPFrequentlyBoughtV2" */ "@libComponents/PDP/PDPFrequentlyBroughtV2"),
  { ssr: false }
);
const CutThePriceCongratsModal = dynamic(
  () => import(/* webpackChunkName: "CTPCongratsModal" */ "@libComponents/PopupModal/CutThePriceCongratsModal"),
  { ssr: false }
);

const ShadeSectionModal = dynamic(
  () => import(/* webpackChunkName: "ShadeSectionModal" */ "@libComponents/PopupModal/ShadeSectionModal")
);

function ProductPage({ PDPProduct, PDPWidgets, isBot, errorCode, enableNewPDP = false }: PDPPage) {
  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  const [showNewPDP, setShowNewPDP] = useState<"0" | "1" | "loading" | "no-variant">(
    enableNewPDP && !isBot ? "loading" : "no-variant"
  );

  const variant =
    useSplit({
      experimentsList: [{ id: "pdpRevamp", condition: !isBot && enableNewPDP }],
      deps: [PDPProduct.id],
    }) || {};

  useEffect(() => {
    if (enableNewPDP && !isBot && variant?.pdpRevamp && variant?.pdpRevamp !== "no-variant") {
      (window as any).evars.evar185 = evarValueGenerator(PDPProduct, variant?.pdpRevamp);
      setShowNewPDP(variant?.pdpRevamp);
      PDP_VARIANTS.newPDPRevamp = variant?.pdpRevamp;
    } else {
      setShowNewPDP("no-variant");
      (window as any).evars.evar185 = "no-variant";
    }
  }, [variant]);

  useEffect(() => {
    return () => {
      RESET_PDP_STATES();
    };
  }, [PDPProduct.id]);

  const { t } = useTranslation();
  const { query, replace, pathname } = useRouter();

  useVariants(PDPProduct);

  usePDPOnMount(PDPProduct);

  usePDPAnalytics(PDPProduct);

  useEffect(() => {
    if (getClientQueryParam("intiateCTP") && checkUserLoginStatus()) {
      PDP_STATES.modalStates.CTPCongratsModal = true;
      setTimeout(() => {
        PDP_STATES.modalStates.CTPCongratsModal = false; // autoClose if not closed
      }, 6000);

      replace({ pathname, query: removeKeyFromObject(query as any, ["intiateCTP"]) }, undefined, { shallow: true });
    }
  }, [PDPProduct.productTag]);

  const { PDPConcernIngredientVariant, customerAlsoViewedVariant, downloadCtaVariant } = useSnapshot(PDP_VARIANTS);
  const {
    modalStates,
    selectedRecurringSubscription,
    pdpOffers,
    CTP,
    showBestOffer,
    frequentlyBoughtData,
    bundleProductData,
    selectedChildProducts,
    frequentlyBoughtDataV2,
    addOnData,
  } = useSnapshot(PDP_STATES);

  const { assets, productMeta, productTag, inStock } = PDPProduct;

  const isProductsOOS =
    !inStock &&
    FEATURES.enableRecommendForOOSProductTag &&
    (PDPProduct.type === 2 && FEATURES.enableComboV2
      ? Array.isArray(selectedChildProducts) && selectedChildProducts?.find((shade: any) => !shade?.inStock)
      : PDPProduct.shades.every((shade: any) => !shade?.inStock && !shade?.productMeta?.isPreOrder));

  /* Hide Best Price in case of trial product pricing */
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );
  const isCrossBrandTrial = getClientQueryParam("isCrossBrandTrial") === "true";

  const configPrice = getTrialProductPricing(
    PDPProduct,
    userProfile,
    glammClubConfig,
    membershipLevelIndex,
    true,
    isCrossBrandTrial
  ) as number;
  const showCupSizeGuide = FEATURES.enableCupSizeGuide && isShadeUIv2(PDPProduct?.productTag, t("shadesUIv2") || []);

  return (
    <>
      <PDPHead product={PDPProduct} />

      <main className="PDPPage relative">
        <PDPShimmer visible={showNewPDP === "loading"} />
        {showNewPDP === "1" ? (
          <PDPv2
            product={PDPProduct}
            PDPWidgets={PDPWidgets}
            addOnData={addOnData}
            configPrice={configPrice}
            isBot={isBot}
            isProductsOOS={isProductsOOS}
            pdpOffers={pdpOffers}
            showBestOffer={showBestOffer}
          />
        ) : (
          <>
            {PDPWidgets.flashSale && <FlashSaleTicker item={PDPWidgets.flashSale} source="product" />}

            <PDPBannerCarousel product={PDPProduct} />

            <LazyHydrate whenIdle>
              <>
                <div className="relative">
                  {FEATURES.enableViewSimilar && <SimilarProductButton PDPProduct={PDPProduct} />}

                  {PDPProduct.inStock && PDPProduct.productMeta?.tryItOn && (
                    <PDPTryon product={PDPProduct} disableWishlist flashSaleWidgetData={PDPWidgets.flashSale} />
                  )}

                  <PDPRatingsandShare product={PDPProduct} />
                </div>

                <PDPTitleDesc product={PDPProduct} flashSaleWidgetData={PDPWidgets.flashSale} />

                {CTP.ctpProductData &&
                  CTP.ctpProductData.statusId > 0 &&
                  CTP.ctpProductData.statusId < 4 &&
                  (CTP.userLogs as any[])?.length > 0 && <PDPCTPTitle product={PDPProduct} />}

                {!t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase()) &&
                  !getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) &&
                  FEATURES.fetchPdpCustomBranding && <PDPCustomWidgets product={PDPProduct} />}
              </>
            </LazyHydrate>
            {PDPProduct.type !== 2 && showCupSizeGuide && PDPProduct.shades?.length && (
              <PDPCupSizeSelector product={PDPProduct} />
            )}

            {selectedRecurringSubscription && (
              <PDPSubscriptions
                data={pdpOffers.decoyPricing as DecoySubscription[]}
                defaultSelectedPack={selectedRecurringSubscription.quantity}
                defaultSelectedFrequency={selectedRecurringSubscription.frequency}
                setSelectedSubscription={(selected: SelectedSubscription) => {
                  PDP_STATES.selectedRecurringSubscription = selected;
                }}
              />
            )}

            {PDPProduct.shades.length > 0 && !showCupSizeGuide && <PDPShadeGrid product={PDPProduct} />}
            {/* AddON Gift Card or Product */}
            {addOnData?.addOnExp && (
              <div className="my-2">
                <PDPAddOnProduct addOnData={addOnData} />
              </div>
            )}
            {/* download CTA exp */}
            {downloadCtaVariant === "1" && getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) && (
              <DownloadTile redirectionURL={PDPProduct.urlShortner.shortUrl} />
            )}

            {!t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase()) &&
              !getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) &&
              // @ts-ignore
              pdpOffers.couponList?.length > 0 &&
              showBestOffer &&
              // trial catalog price should be same as default otherwise hide it
              configPrice === PDPProduct.offerPrice && <PDPDynamicOfferPersonalisation product={PDPProduct} />}

            {/* <PaymentOffersList /> */}

            <DynamicRenderer isBot={isBot}>
              {PDPProduct?.childProducts?.length > 0 && <PDPKitShadeSelection product={PDPProduct} />}
              {/* <PDPSocialProofing product={PDPPRoduct} /> not in use */}

              {PDPConcernIngredientVariant && PDPConcernIngredientVariant !== "no-variant" && (
                <PDPConcernAndIngredients product={PDPProduct} variant={PDPConcernIngredientVariant} />
              )}

              <Widgets
                widgets={[]}
                slugOrId="mobile-site-ds-pd-page-top-banner"
                // expId={t("abTestExperimentIds")?.[0]?.["pdpWidget"]}
                abExp="pdpWidget"
              />
              {FEATURES.enablePDPOffers && <PDPOffers Offers={PDPWidgets.offers} product={PDPProduct} />}
              {productMeta?.isPreOrder && productMeta?.preOrderDetails?.shortDescription && (
                <PDPPreOrderInfo product={PDPProduct} />
              )}
            </DynamicRenderer>

            <PDPAccordion product={PDPProduct} />

            <DynamicRenderer isBot={isBot}>
              {frequentlyBoughtDataV2?.length > 0 && (
                <PDPFrequentlyBroughtV2 product={PDPProduct} widget={frequentlyBoughtDataV2} />
              )}

              {(t("returnProductConfig")?.returnProductTag?.includes(productTag) ||
                t("returnProductConfig")?.returnAllProductFlag) && <ExchangeOffer />}

              <ReviewAndQuestion product={PDPProduct} />

              {bundleProductData?.productData?.inStock && (
                <PDPRountineBundling bundleData={bundleProductData as PDPBundleProd} />
              )}
            </DynamicRenderer>

            {isProductsOOS ? (
              <PDPOutOfStockBottom product={PDPProduct} />
            ) : (
              <PDPATCBottom product={PDPProduct} flashSaleWidgetData={PDPWidgets.flashSale} addOnData={addOnData} />
            )}

            <DynamicRenderer isBot={isBot}>
              {assets.find(x => x.type === "video") && <WatchAndLearn product={PDPProduct} />}

              <PDPLookBook id={PDPProduct.id} icid={PDP_ICID} />

              <PDPPhotoslurp product={PDPProduct} />

              {!SHOP.SITE_CODE.startsWith("tmc") && frequentlyBoughtData?.data?.length > 0 && (
                <PDPBundleProduct product={PDPProduct} bundleProducts={frequentlyBoughtData} />
              )}

              <PDPRecommendedProduct icid={PDP_ICID} product={PDPProduct} />

              <PDPRecentlyViewedCarousel icid={PDP_ICID} productId={PDPProduct.id} />

              {+(customerAlsoViewedVariant as string) > 0 && <PDPCustomerViewBought product={PDPProduct} />}

              {glammClubConfig?.active && <Widgets slugOrId="mobile-site-pdp-glammclub" />}

              {PDPWidgets.footerBanners?.length > 0 && <PDPFooter footerBanners={PDPWidgets.footerBanners} icid={PDP_ICID} />}
            </DynamicRenderer>
            {typeof modalStates.SubmitReviewModal === "boolean" && (
              <SubmitReviewForm reviewFormModal={modalStates.SubmitReviewModal} product={PDPProduct} />
            )}
          </>
        )}

        {typeof modalStates.partnerShipModal === "boolean" && (
          <PartnershipCoupon productIds={PDPProduct.id} partnerShipModal={modalStates.partnerShipModal} />
        )}

        {typeof modalStates.CTPCongratsModal === "boolean" && CTP.ctpProductData?.point && (
          <CutThePriceCongratsModal
            show={modalStates.CTPCongratsModal}
            price={PDPProduct.price - CTP.ctpProductData?.point}
            onRequestClose={() => (PDP_STATES.modalStates.CTPCongratsModal = false)}
          />
        )}
        {typeof modalStates.videoPopupModal === "boolean" && <PDPPopupVideoModal />}
        {/* PDP widget Modal */}
        <PDPProductWidgetModal product={PDPProduct} />

        {typeof modalStates.shadeSelectionModal === "boolean" && (
          <ShadeSectionModal productRes={PDPProduct} PDPWidgets={PDPWidgets} />
        )}
      </main>
    </>
  );
}

const GetLayout = ({ children }: { children: ReactElement }) => {
  const offlineStoreName = isClient() ? sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME) : false;
  if (offlineStoreName) {
    return <OfflineStoreLayout>{children}</OfflineStoreLayout>;
  }
  return <Layout>{children}</Layout>;
};

ProductPage.getLayout = (children: ReactElement) => <GetLayout children={children} />;
ProductPage.getInitialProps = getPDPIntialProps;

export default ProductPage;
