import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import clsx from "clsx";
import LazyHydrate from "react-lazy-hydration";

import { SHOP } from "@libConstants/SHOP.constant";
import { REGEX } from "@libConstants/REGEX.constant";

import { useOptimize } from "@libHooks/useOptimize";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import BagButton from "@libComponents/Header/BagButton";
import SideMenu from "@libComponents/SideMenu/SideMenu";
// import OffersIcon from "@libComponents/Header/OffersIcon";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import WishlistButton from "@libComponents/Header/WislistButton";
import WebsiteNameIcon from "@libComponents/Header/WebsiteNameIcon";
import SearchIconBtn from "@libComponents/Header/SearchIcon";

import { ValtioStore } from "@typesLib/ValtioStore";
// import { FEATURES } from "@libStore/valtio/FEATURES.store";

import HamIcon from "../../../public/svg/hamicontheme.svg";
// import Offericon from "../../../public/svg/offertheme.svg";
import CartIcon from "../../../public/svg/carticontheme.svg";
import SearchIcon from "../../../public/svg/searchicontheme.svg";
import WishListIcon from "../../../public/svg/wishlistIcontheme.svg";
import BackButtonIcon from "../../../public/svg/backButtonIcontheme.svg";
// import GlammClubIcon from "@libComponents/Header/GlammClubIcon";

const HomeSearch = dynamic(() => import(/* webpackChunkName: "HomeSearch" */ "@libComponents/Search/HomeSearch"));

function ThemeHeader() {
  const router = useRouter();

  const hasBack = !!router.asPath.match(REGEX.SHOW_BACK);

  const { productCount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean | undefined>();

  const { t } = useTranslation();
  const experimentIds = t("abTestExperimentIds");
  const [variantNo, setVariantNo] = useState<string | string[]>("");
  const { variant } = useOptimize(experimentIds[0]?.["collectionSearchHeader"]);
  // const glammClubConfig = t("glammClubConfig");

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
      <header className="sticky w-full top-0 outline-none z-50 bg-color1">
        <div className="flex flex-row items-center h-12 justify-between">
          <div className="flex items-center">
            {/* Show Either Back Btn or Ham(Menu) Btn */}
            {hasBack ? (
              <BackBtn>{<BackButtonIcon role="img" aria-labelledby="back" title="back button" />} </BackBtn>
            ) : (
              <button
                type="button"
                id="sideMenu"
                onClick={() => setIsSideNavOpen(true)}
                className={clsx("p-2 flex font-bold text-2xl border-0 outline-none", !isSideNavOpen && "z-20")}
                aria-label="hamburger menu"
              >
                <HamIcon role="img" aria-labelledby="hamburger menu" title="hamburger menu" />
              </button>
            )}

            <WebsiteNameIcon imgClass="h-10" />
          </div>

          <div className="flex justify-end items-center">
            {/* {glammClubConfig?.active && !FEATURES?.disableGlammClubIcon ? (
              <GlammClubIcon />
            ) : (
              <OffersIcon>
                <Offericon role="img" height={25} width={25} aria-labelledby="offer" title="offer" />
              </OffersIcon>
            )} */}

            <WishlistButton>
              <WishListIcon role="img" aria-labelledby="wishlist" title="wishlist" />
            </WishlistButton>

            {!searchBarExp && (
              <SearchIconBtn>
                <SearchIcon role="img" aria-labelledby="search" title="search" />
              </SearchIconBtn>
            )}

            <BagButton>
              {<CartIcon role="img" aria-labelledby="cart" title="cart" />}
              {productCount > 0 && (
                <div className="absolute w-4 h-4 bg-color2 text-xs font-bold flex justify-center items-center rounded-full top-0 right-1">
                  {productCount}
                </div>
              )}
            </BagButton>
          </div>
        </div>

        {!searchBarExp ? (
          <>{SHOP.ENABLE_SEARCH && router.pathname === "/" && <HomeSearch themed />}</>
        ) : (
          <>{SHOP.ENABLE_SEARCH && <HomeSearch themed />}</>
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

export default ThemeHeader;
