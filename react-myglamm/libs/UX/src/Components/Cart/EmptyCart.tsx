import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE } from "@libConstants/Analytics.constant";

import ProductGrid from "@libComponents/ProductGrid/ProductGrid";
import Widgets from "@libComponents/HomeWidgets/Widgets";

const EmptyCart = () => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (router.pathname === "/shopping-bag") {
      const pageType = "Empty Cart";
      const pageName = "cart summary page";

      (window as any).digitalData = {
        common: {
          pageName: `web|${pageName}|${pageType}`,
          newPageName: pageType,
          subSection: pageName,
          assetType: pageType,
          newAssetType: pageType,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(),
      };
    } else if (router.pathname === "my-orders") {
      const pageName = "my orders";

      (window as any).digitalData = {
        common: {
          pageName: `web|${pageName}|empty my orders page`,
          newPageName: pageName,
          subSection: pageName,
          assetType: pageName,
          newAssetType: pageName,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
      };
    }

    Adobe.PageLoad();
  }, []);

  return (
    <React.Fragment>
      <div className="bg-white flex flex-col justify-center" style={{ minHeight: "calc(100vh - 18rem)" }}>
        <div className="relative mx-auto my-1">
          <figure>
            <img
              className="p-12"
              alt="Empty Shopping Cart"
              src="https://files.myglamm.com/site-images/original/empty-bag.jpg"
            />
          </figure>
        </div>
        <h1 className="text-center text-18 font-bold">{t("oopsBagIsEmpty")}</h1>
        <span className="text-center text-sm opacity-70">{t("emptyCartMsg")}</span>
        <Link
          href="/"
          className="mx-auto my-4 rounded-sm p-2 px-1 bg-ctaImg text-white text-sm w-32 text-center"
          aria-label={t("shopNow")}
        >
          {t("shopNow")}
        </Link>
      </div>
      <Widgets slugOrId="mobile-site-empty-cart-widgets" />
    </React.Fragment>
  );
};

export default EmptyCart;
