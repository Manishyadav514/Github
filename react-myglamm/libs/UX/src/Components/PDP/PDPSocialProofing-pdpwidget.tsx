import React, { useState, useEffect } from "react";
import { SLUG } from "@libConstants/Slug.constant";
import dynamic from "next/dynamic";
import useTranslation from "@libHooks/useTranslation";
import WidgetAPI from "@libAPI/apis/WidgetAPI";

const ExchangeOfferModal = dynamic(() => import("@libComponents/PopupModal/ExchangeOfferModal"), {
  ssr: false,
});

const PDPSocialProofing = ({ item, product }: any) => {
  console.log("PDPSocialProofing");
  const [socialStatsBanner, setSocialStatsBanner] = useState<any>();

  /*
  TODO: why is this disabled
  useEffect(() => {
    const pSowhere: any = {
      where: {
        slugOrId: SLUG().PDP_SOCIAL_PROOFING,
        name: "products",
        items: product.id,
      },
    };
    const widgetApi = new WidgetAPI();
    const proofingRes = async () => {
      const { data } = await widgetApi.getWidgets(pSowhere, 5, 0);
      setSocialStatsBanner(data?.data?.data?.widget);
    };

    //window.requestIdleCallback(proofingRes);
  }, [product.id]);
  */

  if (!(socialStatsBanner && socialStatsBanner.length > 0)) {
    return null;
  }

  return (
    <div className="exclusiveBenefits mt-2 bg-white">
      {item[0].multimediaDetails?.map((media: any) => (
        <div className="relative text-center" key={media.assetDetails.url}>
          <img src={media.assetDetails?.url} alt={media.assetDetails?.name} className="w-full" />

          <div className="bottom-right absolute" style={{ bottom: "8px", right: "16px" }}>
            <img
              alt="info"
              role="presentation"
              src="https://files.myglamm.com/site-images/original/info_1.png"
              className="info-icon ml-2"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDPSocialProofing;
