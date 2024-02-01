import React from "react";
import Link from "next/link";

import { SHOP } from "@libConstants/SHOP.constant";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import GlammClubMembershipSticker from "./GlammClubMembershipSticker";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const WebsiteNameIcon = ({ imgClass = "" }) => {
  return (
    <>
      <Link
        href="/"
        prefetch={false}
        className="min-w-min text-gray-700 text-lg focus-visible:outline shrink-0"
        aria-label="home page"
      >
        <img title={WEBSITE_NAME} className={imgClass || "h-8"} alt={WEBSITE_NAME} src={SHOP.LOGO} />
      </Link>
      {FEATURES?.enableGlammClubMembershipSticker && (
        <LazyLoadComponent>
          <GlammClubMembershipSticker />
        </LazyLoadComponent>
      )}
    </>
  );
};

export default WebsiteNameIcon;
