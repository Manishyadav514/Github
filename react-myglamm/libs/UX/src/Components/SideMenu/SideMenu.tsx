import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import clsx from "clsx";
import { disableBodyScroll, enableBodyScroll } from "@libUtils/bodyScroll";

import { ADOBE } from "@libConstants/Analytics.constant";

import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const SideNavContent = dynamic(() => import(/* webpackChunkName: "SideNavContent" */ "./SideNavContent"), { ssr: false });
const SideMenuContentV2 = dynamic(() => import(/* webpackChunkName: "SideMenuContentV2" */ "./SideMenuContentV2"), {
  ssr: false,
});

interface SideMenuProps {
  CLOSE_SIDEMENU: () => void;
  isSideNavOpen: boolean | undefined;
}

function SideMenu({ CLOSE_SIDEMENU, isSideNavOpen }: SideMenuProps) {
  const router = useRouter();
  const sideNavRef = React.useRef<HTMLDivElement>(null);
  const enableSideNavMenuV2 = FEATURES?.enableSideNavMenuV2;

  const handleSideNav = (e: any) => {
    if (sideNavRef.current?.contains(e.target)) {
      return true;
    }

    return CLOSE_SIDEMENU();
  };

  useEffect(() => {
    if (isSideNavOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    return enableBodyScroll;
  }, [isSideNavOpen]);

  // Adobe Open Hamburger Menu - Page Load
  useEffect(() => {
    if (isSideNavOpen) {
      (window as any).digitalData = {
        common: {
          pageName: `web|${ADOBE.ASSET_TYPE.HAMBURGER}`,
          newPageName: ADOBE.ASSET_TYPE.HAMBURGER,
          subSection: ADOBE.ASSET_TYPE.HAMBURGER,
          assetType: ADOBE.ASSET_TYPE.MENU,
          newAssetType: ADOBE.ASSET_TYPE.MENU,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
      };
      ADOBE_REDUCER.adobePageLoadData = (window as any).digitalData;
    }
  }, [isSideNavOpen]);

  /**
   * Close Sidemenu when tapping outside
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleSideNav);
    return () => {
      document.removeEventListener("mousedown", handleSideNav);
    };
  }, []);

  /**
   * Close Sidemenu when route changes
   */
  useEffect(() => {
    router.events.on("routeChangeStart", CLOSE_SIDEMENU);

    return () => router.events.off("routeChangeStart", CLOSE_SIDEMENU);
  }, []);

  return (
    <Fragment>
      <nav
        className={`nav fixed left-0 top-0 h-full w-full overflow-hidden z-50 ${
          isSideNavOpen ? "--open pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          ref={sideNavRef}
          style={{ willChange: "transform" }}
          className={clsx(
            `sidenav relative h-full bg-white z-50 overflow-y-scroll duration-300 ease-in-out ${
              enableSideNavMenuV2 ? "w-full" : "w-[280px]"
            }`,
            !isSideNavOpen && "transform ltr:translate-x-[-100%] rtl:translate-x-[100%]"
          )}
        >
          {typeof isSideNavOpen === "boolean" && (enableSideNavMenuV2 ? <SideMenuContentV2 /> : <SideNavContent />)}
        </div>
      </nav>
    </Fragment>
  );
}

export default SideMenu;
