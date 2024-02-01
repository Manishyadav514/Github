import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import Heart from "../../../public/svg/pinkHeart.svg";

const WishlistCartButton = () => {
  const { t } = useTranslation();

  const wishlistAdobeOnClick = React.useCallback(() => {
    // Adobe Analytics(75) - On Click - Wishlisht Button click on ShoppingBag.
    (window as any).digitalData = {
      common: {
        linkName: `web|cart summary page|${ADOBE.ASSET_TYPE.WISHLIST}`,
        linkPageName: `web|cart summary page|shopping bag`,
        newLinkPageName: "shopping bag",
        assetType: ADOBE.ASSET_TYPE.WISHLIST,
        newAssetType: ADOBE.ASSET_TYPE.WISHLIST,
        subSection: "cart summary page",
        platform: ADOBE.PLATFORM,
        ctaName: `my wishlist`,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  }, []);

  return (
    <Link
      href="/my-wishlist"
      prefetch={false}
      role="presentation"
      onClick={wishlistAdobeOnClick}
      className="rounded text-sm flex justify-between py-2 px-3 mr-3 items-center text-color1 border border-color1"
      aria-label={t("wishlist")}
    >
      {t("wishlist")} <Heart className="ml-1 shrink-0" role="img" aria-labelledby="wishlist" />
    </Link>
  );
};

export default WishlistCartButton;
