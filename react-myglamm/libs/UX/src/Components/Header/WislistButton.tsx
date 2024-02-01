import React from "react";
import Link from "next/link";
import Ripples from "@libUtils/Ripples";

import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

import Heart from "../../../public/svg/headerHeart.svg";

const WishlistButton = ({ children }: { children?: any }) => {
  const wishlistAdobeOnClick = () => {
    // Adobe Analytics(74) - On Click - Wishlisht Button click on Header.
    (window as any).digitalData = {
      common: {
        linkName: `web|${(window as any)?.digitalData?.common?.newPageName || ""}|${ADOBE.ASSET_TYPE.WISHLIST}`,
        linkPageName: `web|${(window as any)?.digitalData?.common?.newPageName || ""}`,
        newLinkPageName: (window as any)?.digitalData?.common?.newPageName || "",
        assetType: ADOBE.ASSET_TYPE.WISHLIST,
        newAssetType: ADOBE.ASSET_TYPE.WISHLIST,
        subSection: (window as any)?.digitalData?.common?.newPageName || "",
        platform: ADOBE.PLATFORM,
        ctaName: `my wishlist`,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <Ripples className="p-2 ml-auto">
      <Link
        href="/my-wishlist"
        prefetch={false}
        role="presentation"
        className="focus-visible:outline"
        onClick={wishlistAdobeOnClick}
        aria-label="my wishlist"
      >
        {children || <Heart role="img" aria-labelledby="wishlist" title="wishlist" />}
      </Link>
    </Ripples>
  );
};

export default WishlistButton;
