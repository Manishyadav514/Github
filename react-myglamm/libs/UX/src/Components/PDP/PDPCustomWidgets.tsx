import React, { Fragment, useEffect, useState } from "react";

import dynamic from "next/dynamic";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";

import { PDPProd } from "@typesLib/PDP";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

const LookPopupModal = dynamic(() => import("@libComponents/PopupModal/LookPopupModal" /* webpackChunkName: "CBCarosuel1" */), {
  ssr: false,
});
const BannerPopupModal = dynamic(
  () => import("@libComponents/PopupModal/BannerPopupModal" /* webpackChunkName: "CBCarosuel2" */),
  { ssr: false }
);
const VideoContentModal = dynamic(
  () => import("@libComponents/PopupModal/VideoContentModal" /* webpackChunkName: "CBCarosuel3" */),
  { ssr: false }
);

const PDPCustomWidgets = ({ product }: { product: PDPProd }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [widgetsData, setWidgetsData] = useState([]);

  const hidePopup = () => setShowPopup(false);

  useEffect(() => {
    const widgetApi = new WidgetAPI();

    widgetApi
      .getHomeWidgets(
        { where: { slugOrId: SLUG().PDP_CUSTOM_BRANDING, name: "products", items: product.id } },
        1,
        0,
        !!checkUserLoginStatus()
      )
      .then(({ data }) => setWidgetsData(data.data.data?.widget));
  }, [product.id]);

  if (widgetsData?.length) {
    return (
      <Fragment>
        {widgetsData.map((widget: any) => {
          switch (widget.customParam) {
            case "multimedia-carousel-1":
              return <LookPopupModal show={showPopup} hide={hidePopup} widget={widget} />;

            case "multimedia-carousel-2":
              return <BannerPopupModal show={showPopup} hide={hidePopup} widget={widget} />;

            case "multimedia-carousel-3":
              return <VideoContentModal show={showPopup} hide={hidePopup} widget={widget} />;

            default:
              return null;
          }
        })}
      </Fragment>
    );
  }

  return null;
};

export default PDPCustomWidgets;
