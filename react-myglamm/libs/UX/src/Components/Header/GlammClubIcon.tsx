import React from "react";
import Link from "next/link";
import GlammClubSVGIcon from "../../../public/svg/glammClubIcon.svg";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

const GlammClubIcon = () => {
  const glammClubIconAdobeOnClick = () => {
    // Adobe Analytics - On Click - Glamm Club Header Top Nav Icon onClick
    (window as any).digitalData = {
      common: {
        linkName: `web|Homepage|Glammclub Top Nav`,
        linkPageName: `web|Homepage|Glammclub Top Nav`,
        newLinkPageName: "Homepage",
        assetType: "Glammclub",
        newAssetType: "Glammclub",
        subSection: "Homepage",
        platform: ADOBE.PLATFORM,
        ctaName: "Glammclub Top Nav",
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <Link
      href="/glammclub"
      prefetch={false}
      role="presentation"
      aria-label="glamm club"
      className="p-2 ml-1"
      onClick={glammClubIconAdobeOnClick}
    >
      <GlammClubSVGIcon role="img" aria-labelledby="glamm club" title="glamm club" />
    </Link>
  );
};

export default GlammClubIcon;
