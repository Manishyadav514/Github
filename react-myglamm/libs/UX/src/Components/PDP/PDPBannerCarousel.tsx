import React from "react";

import SnapCarousel from "@libComponents/PDP/SnapCarousel";

import { PDPProd } from "@typesLib/PDP";

import { patchCarouselImages, patchCarouselImagesV2 } from "@productLib/pdp/pdpUtils";

import useTranslation from "@libHooks/useTranslation";

import { adobeCarouselEvent } from "@productLib/pdp/AnalyticsHelper";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";

function PDPCarouselSection({ product }: { product: PDPProd }) {
  const { cms, assets, categories } = product;

  const { t } = useTranslation();

  const newPDP = PDP_VARIANTS?.newPDPRevamp === "1" ? true : false;

  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const imgSrc = t("tagFlagColors")?.[product.productMeta?.tags?.[0]?.name]?.imgSrc;

  const videoStyle = {
    backgroundImage: `url("https://files.myglamm.com/site-images/original/playbutton.png")`,
    backgroundRepeat: "no-repeat",
    height: "35px",
    width: "35px",
    position: "absolute",
    top: "45%",
  } as React.CSSProperties;

  return (
    <div className="relative">
      {!t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase()) &&
      !getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) &&
      product?.productMeta?.isTrial &&
      glammClubConfig?.PDPTrialIconV2 ? (
        <img src={glammClubConfig?.PDPTrialIconV2} className="absolute left-4 top-4 z-10" width={64} />
      ) : imgSrc && newPDP ? (
        <span className="absolute left-4 top-3 z-10">
          <img src={imgSrc} alt={product.productMeta?.tags?.[0]?.name} className="w-auto h-4" />
        </span>
      ) : (
        <></>
      )}

      {/* lazy hydrate used inside snapcarousel */}
      <SnapCarousel
        categoryDetails={categories}
        title={cms[0]?.content?.name}
        carouselSlides={newPDP ? patchCarouselImagesV2(assets) : patchCarouselImages(assets)}
        onScrollCallback={() => adobeCarouselEvent(product)}
        videoStyle={videoStyle}
      />
    </div>
  );
}

export default PDPCarouselSection;
