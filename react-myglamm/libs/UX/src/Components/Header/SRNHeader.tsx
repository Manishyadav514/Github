import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import clsx from "clsx";
import LazyHydrate from "react-lazy-hydration";

import { SHOP } from "@libConstants/SHOP.constant";
import { REGEX } from "@libConstants/REGEX.constant";

import { useSelector } from "@libHooks/useValtioSelector";
import { useSplit } from "@libHooks/useSplit";

import BagButton from "@libComponents/Header/BagButton";
import SideMenu from "@libComponents/SideMenu/SideMenu";
import OffersIcon from "@libComponents/Header/OffersIcon";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import WishlistButton from "@libComponents/Header/WislistButton";
import WebsiteNameIcon from "@libComponents/Header/WebsiteNameIcon";
import SearchIconBtn from "@libComponents/Header/SearchIcon";
import GlammClubIcon from "@libComponents/Header/GlammClubIcon";

import { ValtioStore } from "@typesLib/ValtioStore";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import useTranslation from "@libHooks/useTranslation";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import HamIcon from "../../../../../apps/m-web/public/srn/svg/hamicon.svg";
import CartIcon from "../../../../../apps/m-web/public/srn/svg/carticon.svg";
import Offericon from "../../../../../apps/m-web/public/srn/svg/offersIcon.svg";
import SearchIcon from "../../../../../apps/m-web/public/srn/svg/searchicon.svg";
import WishListIcon from "../../../../../apps/m-web/public/srn/svg/wishlistIcon.svg";
import BackButtonIcon from "../../../../../apps/m-web/public/srn/svg/backButtonIcon.svg";

const HomeSearch = dynamic(() => import(/* webpackChunkName: "HomeSearch" */ "@libComponents/Search/HomeSearch"));

function SRNHeader() {
  const router = useRouter();
  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const hasBack = !!router.asPath.match(REGEX.SHOW_BACK);

  const { productCount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

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
      <header className="sticky w-full top-0 outline-none z-50">
        <div className="flex flex-row items-center h-12 justify-between" style={{ backgroundColor: "#ED184F" }}>
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

            <WebsiteNameIcon />
          </div>

          <div className="flex justify-end items-center">
            {glammClubConfig?.active && !FEATURES?.disableGlammClubIcon ? (
              <GlammClubIcon />
            ) : (
              <OffersIcon>
                <Offericon role="img" aria-labelledby="offer" title="offer" />
              </OffersIcon>
            )}

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
                <div
                  className="absolute w-5 h-5 text-xs font-bold flex justify-center items-center rounded-full  bg-white top-0 right-1"
                  style={{ color: "#ED184F" }}
                >
                  {productCount}
                </div>
              )}
            </BagButton>
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

SRNHeader.whyDidYouRender = true;

export default SRNHeader;
