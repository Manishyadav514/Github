import { PDPProd } from "@typesLib/PDP";
import React from "react";
import PDPBannerCarousel from "@libComponents/PDP/PDPBannerCarousel";
import PDPTopIcons from "./PDPWidgetComponents/PDPTopIcons";
import dynamic from "next/dynamic";
import PDPTitleDescription from "./PDPTitleDescription";
import PDPPriceAndRating from "./PDPPriceAndRating";
import PDPShadeGrid from "./PDPShadeGridV2";
import PDPKitShadeSelection from "./PDPKitShadeSelection-pdpwidget";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import PDPDynamicOfferPersonalisation from "./PDPDynamicOfferPersonalisation";
import useTranslation from "@libHooks/useTranslation";
import PaymentOffersListV2 from "./PaymentOfferListV2";
import PDPInsight from "./PDPInsight";
import DownloadTile from "./DownloadTile";
import { useSnapshot } from "valtio";
import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import PDPProductWidgetModal from "./PDPWidgetComponents/PDPProductWidgetModal";
import PDPAddOnProduct from "./PDPAddOnProduct";
import Widgets from "@libComponents/HomeWidgets/Widgets";
const PDPSearchTags = dynamic(() => import(/* webpackChunkName: "PDPSearchTags" */ "@libComponents/PDP/PDPSearchTagsV2"), {
  ssr: false,
});

const PDPTopSection = ({
  product,
  configPrice,
  showBestOffer,
  pdpOffers,
  addOnData,
}: {
  product: PDPProd;
  configPrice?: any;
  showBestOffer?: any;
  pdpOffers?: any;
  addOnData?: any;
}) => {
  const { t } = useTranslation();
  const { downloadCtaVariant } = useSnapshot(PDP_VARIANTS);

  return (
    <>
      <div className="border-b-4 border-themeGray pb-1 bg-white">
        <section className="relative pt-1 pb-3">
          <PDPBannerCarousel product={product} />
          <PDPTopIcons product={product} />
        </section>
        <PDPInsight product={product} />
        <PDPTitleDescription product={product} />
        <PDPPriceAndRating product={product} />
        <PDPSearchTags tags={product?.productMeta?.searchText || product?.cms[0]?.content?.searchText} />

        {product.shades.length > 0 && <PDPShadeGrid product={product} />}
        {product?.childProducts?.length > 0 && <PDPKitShadeSelection product={product} />}
        {/* AddON Gift Card or Product */}
        {addOnData?.addOnExp && (
          <div className="border-y border-themeGray">
            <PDPAddOnProduct addOnData={addOnData} />
          </div>
        )}
        {/* download cta exp */}
        {downloadCtaVariant === "1" && getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) && (
          <DownloadTile redirectionURL={product?.urlShortner?.shortUrl} />
        )}
        {/* product widget modal */}
        <PDPProductWidgetModal product={product} />

        {!t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase()) &&
          !getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) &&
          // @ts-ignore
          pdpOffers.couponList?.length > 0 &&
          showBestOffer &&
          // trial catalog price should be same as default otherwise hide it
          configPrice === product.offerPrice && <PDPDynamicOfferPersonalisation product={product} />}
        <PaymentOffersListV2 productPrice={product?.price} />
        <Widgets
          widgets={[]}
          slugOrId="mobile-site-ds-pd-page-top-banner"
          // expId={t("abTestExperimentIds")?.[0]?.["pdpWidget"]}
          abExp="pdpWidget"
        />
      </div>
    </>
  );
};

export default PDPTopSection;
