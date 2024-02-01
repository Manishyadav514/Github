import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import clsx from "clsx";
import LazyHydrate from "react-lazy-hydration";

import { SHOP } from "@libConstants/SHOP.constant";
import { REGEX } from "@libConstants/REGEX.constant";

import BagButton from "@libComponents/Header/BagButton";
import SideMenu from "@libComponents/SideMenu/SideMenu";
import OffersIcon from "@libComponents/Header/OffersIcon";

import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import WishlistButton from "@libComponents/Header/WislistButton";
import GlammClubIcon from "@libComponents/Header/GlammClubIcon";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { useSplit } from "@libHooks/useSplit";
import HamIcon from "../../../public/svg/hamicon.svg";
import SearchIconBtn from "./SearchIcon";
import WebsiteNameIcon from "./WebsiteNameIcon";
import useTranslation from "@libHooks/useTranslation";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

const HomeSearch = dynamic(() => import(/* webpackChunkName: "HomeSearch" */ "@libComponents/Search/HomeSearch"));

function Header() {
  const router = useRouter();
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const hasBack = !!router.asPath.match(REGEX.SHOW_BACK);

  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean | undefined>();

  const [variantNo, setVariantNo] = useState<string | string[]>("");
  const { collectionSearchHeader: variant } =
    useSplit({
      experimentsList: [{ id: "collectionSearchHeader" }],
      deps: [],
    }) || {};
  useEffect(() => {
    if (variant && variant !== "no-variant") {
      (window as any).evars.evar128 = variant;
      setVariantNo(variant);
    }
  }, [variant]);

  let currentPath = router.pathname;
  const searchBarExp =
    variantNo === "1" && (currentPath.startsWith("/collection/[collection]") || currentPath.startsWith("/buy/[...Slug]"));

  return (
    <React.Fragment>
      <header className="sticky w-full top-0 outline-0 z-50">
        <div className="flex flex-row items-center h-12 bg-white justify-between">
          <div className="flex items-center">
            {/* Show Either Back Btn or Ham(Menu) Btn */}
            {hasBack ? (
              <BackBtn />
            ) : (
              <button
                type="button"
                id="sideMenu"
                onClick={() => setIsSideNavOpen(true)}
                className={clsx(
                  "p-2 flex font-bold text-2xl border-0 outline-none focus-visible:outline",
                  !isSideNavOpen && "z-20"
                )}
                aria-label="hamburger menu"
              >
                <HamIcon role="img" aria-labelledby="hamburger menu" title="hamburger menu" />
              </button>
            )}

            <WebsiteNameIcon />
          </div>

          <div className="flex justify-end items-center">
            {glammClubConfig?.active && !FEATURES?.disableGlammClubIcon ? <GlammClubIcon /> : <OffersIcon />}
            <WishlistButton />
            {!searchBarExp && <SearchIconBtn />}
            <BagButton />
          </div>
        </div>

        {!searchBarExp ? (
          <>{SHOP.ENABLE_SEARCH && router.pathname === "/" && <HomeSearch />}</>
        ) : (
          <>{SHOP.ENABLE_SEARCH && <HomeSearch />}</>
        )}
      </header>

      {!hasBack && (
        <LazyHydrate whenIdle>
          <SideMenu CLOSE_SIDEMENU={() => setIsSideNavOpen(false)} isSideNavOpen={isSideNavOpen} />
        </LazyHydrate>
      )}
    </React.Fragment>
  );
}

Header.whyDidYouRender = true;

export default Header;
