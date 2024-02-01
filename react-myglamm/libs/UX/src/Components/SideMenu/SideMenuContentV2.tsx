import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import Link from "next/link";
import { ValtioStore } from "@typesLib/ValtioStore";
import { getUserNameEmail } from "@libUtils/getUserNameEmail";
import { SLUG } from "@libConstants/Slug.constant";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";
import { NAV_REDUCER } from "@libStore/valtio/REDUX.store";
import { useRouter } from "next/router";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import BackIcon from "../../../../../libs/UX/public/svg/backicon.svg";
import useTranslation from "@libHooks/useTranslation";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const SideMenuContentV2 = () => {
  const router = useRouter();
  const [name, setName] = useState("Guest");
  const { locale } = useRouter();
  const { profile, sideMenu } = useSelector((store: ValtioStore) => ({
    sideMenu: store.navReducer.sideMenu,
    profile: store.userReducer.userProfile,
  }));

  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const glammClubMenuIconStatic = glammClubConfig?.glammClubMenuIconStatic;

  const personalizedMenuIcon = glammClubMenuIconStatic && glammClubMenuIconStatic[profile?.memberType?.levelName as string];

  /* Side Menu API CALL */
  useEffect(() => {
    const constantApi = new ConstantsAPI();
    constantApi.getNavigation(SLUG().SIDE_MENU_V2).then(({ data: res }) => (NAV_REDUCER.sideMenu = res.data[0]?.details));
  }, [locale]);

  useEffect(() => {
    if (profile) {
      setName(getUserNameEmail(profile));
    }
  }, [profile]);

  // Adobe Click Event
  const adobeClick = (parentItem: string, childItem: string) => {
    const strLinkName = `web|hamburger|${parentItem.toLocaleLowerCase()}|${childItem.toLocaleLowerCase()}`;
    const arrMenuItems = strLinkName.split("|");
    const strCTA = arrMenuItems[arrMenuItems.length - 1];
    (window as any).digitalData = {
      common: {
        linkName: strLinkName,
        linkPageName: strLinkName,
        assetType: ADOBE.ASSET_TYPE.MENU,
        newAssetType: ADOBE.ASSET_TYPE.MENU,
        newLinkPageName: ADOBE.ASSET_TYPE.HAMBURGER,
        subSection: ADOBE.ASSET_TYPE.HAMBURGER,
        platform: ADOBE.PLATFORM,
        ctaName: strCTA,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /** SWIPE LEFT TO CLOSE THE NAVIGATION LOGIC */
  let startingX = 0;
  let startingY = 0;
  let endingX = 0;
  let endingY = 0;
  let moving = false;

  function touchStart(e: any) {
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
  }
  function touchMove(e: any) {
    moving = true;
    endingX = e.touches[0].clientX;
    endingY = e.touches[0].clientY;
  }
  function touchEnd() {
    if (!moving) return;
    if (Math.abs(endingX - startingX) > Math.abs(endingY - startingY)) {
      if (endingX < startingX) router.push("/");
      moving = false;
    }
  }

  return (
    <div onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>
      <div className="flex items-center sticky top-0 z-50 h-14 bg-white">
        <div>
          <button
            type="button"
            aria-label="Previous Page"
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-12 outline-none"
          >
            <BackIcon role="img" aria-labelledby="back" />
          </button>
        </div>
        <p className="font-semibold">Menu</p>
      </div>
      {sideMenu?.map((item: any) => {
        if (item?.class && item?.child?.length > 0) {
          const isBorder = JSON.parse(item?.class)?.type === 1;
          return (
            <div className={`${isBorder && "border shadow-md rounded-3xl"} mb-3 mx-3`}>
              <div className="flex items-center">
                {JSON.parse(item?.class)?.isImageHeading && item?.selectedImage && (
                  <div className="ml-4 mt-4 h-6 flex items-center">
                    <img src={item?.selectedImage} alt={item?.label} className="h-6" />
                  </div>
                )}
                {JSON.parse(item?.class)?.isHeading && (
                  <div className="ml-4 mt-4 h-6 flex items-center">
                    <p className="font-semibold">{item?.label}</p>
                  </div>
                )}
                {JSON.parse(item?.class)?.isCategoryCount && item?.child?.length > 0 && (
                  <div className="ml-4 mt-4 h-6 flex items-center">
                    <p className="text-xs font-semibold mt-0.5 tracking-widest">{item?.child?.length} CATEGORIES</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 pt-2.5 pb-0.5">
                {item.child?.map((child: any) => {
                  if (child?.selectedImage) {
                    return (
                      <Link
                        className="w-full flex justify-center items-center h-24 mb-2"
                        href={name === "Guest" && child?.visibility === "loggedIn" ? "/login" : child?.url}
                        aria-label={child?.label}
                        onClick={() => adobeClick(item?.label, child?.label)}
                      >
                        {personalizedMenuIcon && child?.url === "/glammclub" ? (
                          <img className="z-20 mt-2 h-24 w-16" src={personalizedMenuIcon} alt={item?.label} />
                        ) : (
                          <img className="z-20 mt-2 h-24 w-16" src={child?.selectedImage} alt={item?.label} />
                        )}
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default SideMenuContentV2;
