import React, { useState, useEffect } from "react";
import Link from "next/link";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import Widgets from "@libComponents/HomeWidgets/Widgets";
import useTranslation from "@libHooks/useTranslation";

const EmptyWishlist = () => {
  const { t } = useTranslation();

  const widgetApi = new WidgetAPI();
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const wishlistWhere = {
      where: {
        slugOrId: "mobile-site-wishlist-widget",
      },
    };
    widgetApi.getWidgets(wishlistWhere).then(({ data: res }) => setWidgets(res?.data?.data?.widget));
  }, []);

  // Adobe Analytics[59] - Page Load - Empty Wishlist
  useEffect(() => {
    (window as any).digitalData = {
      common: {
        pageName: "web|wishlist summary page|empty wishlist",
        newPageName: `my ${ADOBE.ASSET_TYPE.WISHLIST}`,
        subSection: ADOBE.ASSET_TYPE.WISHLIST,
        assetType: ADOBE.ASSET_TYPE.WISHLIST,
        newAssetType: ADOBE.ASSET_TYPE.WISHLIST,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.PageLoad();
  }, []);

  return (
    <React.Fragment>
      <section className="px-8 pt-8 pb-20 mb-4">
        <img alt="empty" className=" mx-auto mb-8" src="https://files.myglamm.com/site-images/original/emptyWishlist.jpg" />
        <p className="font-semibold text-2xl text-gray-700 text-center">{t("wishListEmptyTitle")}</p>
        <p
          className="text-sm opacity-50 mt-2 mb-12 text-center"
          dangerouslySetInnerHTML={{ __html: t("wishListEmptyDesc")?.replace("\n", "<br/>") }}
        />
        <Link
          href="/"
          className="font-semibold text-white text-sm py-3 px-12 text-center rounded mx-auto table bg-ctaImg"
          aria-label={t("shopNow")}
        >
          {t("shopNow")}
        </Link>
      </section>
      <Widgets widgets={widgets} slugOrId="mobile-site-wishlist-widget" />
    </React.Fragment>
  );
};

export default EmptyWishlist;
