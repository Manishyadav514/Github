import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import { SLUG } from "@libConstants/Slug.constant";
import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import Adobe from "@libUtils/analytics/adobe";
import { getUserNameEmail } from "@libUtils/getUserNameEmail";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ValtioStore } from "@typesLib/ValtioStore";

import MyRewardsTab from "./MyRewardsTab";
import AccordianPanel from "./SideNavAccordion";
import SideMenuWidgets from "./SideMenuWidgets";

import CountryLangSideNav from "./CountryLangSideNav";

import UserIcon from "../../../public/svg/user-icon.svg";
import { NAV_REDUCER } from "@libStore/valtio/REDUX.store";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const LifeStageModal = dynamic(() => import(/* webpackChunkName: "LifeStageModal" */ "@libComponents/Common/LifestageModal"), {
  ssr: false,
});

const SideNavContent = () => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const widgetApi = new WidgetAPI();

  const { profile, sideMenu } = useSelector((store: ValtioStore) => ({
    sideMenu: store.navReducer.sideMenu,
    profile: store.userReducer.userProfile,
  }));

  const [name, setName] = useState("Guest");
  const [widgets, setWidgets] = useState([]);
  const [showLifestageModal, setShowLifeStageModal] = useState<Boolean>(false);

  const isBBC = SHOP.SITE_CODE === "bbc";

  /* Side Menu API CALL */
  useEffect(() => {
    const constantApi = new ConstantsAPI();
    constantApi
      .getNavigation(IS_DUMMY_VENDOR_CODE() ? SLUG().DUMMY_SIDE_MENU : SLUG().SIDE_MENU)
      .then(({ data: res }) => (NAV_REDUCER.sideMenu = res.data[0]?.details));
  }, [locale]);

  useEffect(() => {
    try {
      const getMenuWidgets = {
        where: {
          slugOrId: IS_DUMMY_VENDOR_CODE() ? SLUG().DUMMY_SIDE_MENU_WIDGETS : SLUG().SIDE_MENU_WIDGETS,
        },
      };
      widgetApi.getWidgets(getMenuWidgets).then(({ data: res }) => setWidgets(res?.data?.data?.widget));
    } catch (error: any) {
      console.log(error);
    }
  }, [locale]);

  useEffect(() => {
    if (profile) {
      setName(getUserNameEmail(profile));
    }
  }, [profile]);

  /* Change Language Redirection */

  // Delete scratch and win from menu if user is not ambassador
  if (profile?.memberType.typeName !== "ambassador") {
    const index = sideMenu?.findIndex((a: any) => a.label.toLowerCase() === "scratch & win");
    if (index > -1) {
      sideMenu?.splice(index, 1);
    }
  }

  // Adobe.send('click') Event
  const adobeClick = (menuItem: string) => {
    const strLinkName = `web|hamburger|${menuItem.toLocaleLowerCase()}`;
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
  if (sideMenu) {
    return (
      <Fragment>
        {/* header */}
        <div className="sticky top-0 z-50 rounded-b-xl">
          <div className="flex justify-start py-4 w-full relative rounded-b-xl bg-color2" style={{ zIndex: 1 }}>
            <figure className="relative px-4 flex items-center">
              {profile?.meta.profileImage?.original ? (
                <ImageComponent
                  alt="user avatar"
                  className="object-cover rounded-full h-14 w-14"
                  src={profile?.meta.profileImage?.original}
                />
              ) : (
                <UserIcon
                  className="bg-white rounded-full h-14 w-14"
                  role="img"
                  aria-labelledby="user profile image"
                  title="user profile"
                />
              )}

              {name !== "Guest" && (
                <span className="mt-3 right-4 bottom-0  absolute">
                  <Link href="/my-profile" prefetch={false} legacyBehavior aria-label="my profile">
                    <img className="h-7 w-7" src="https://files.myglamm.com/site-images/original/edit-ico.png" alt="edit" />
                  </Link>
                </span>
              )}
            </figure>

            <div className="flex flex-col pt-2 justify-center">
              <p className="capitalize flex justify-start items-center italic px-1 leading-none opacity-40 pb-0 text-10">
                {t("welcome")}
              </p>
              <div className="text-black-700 justify-center px-1 flex flex-col">
                {name === "Guest" && (
                  <Link href="/login" prefetch={false} className="font-extrabold" aria-labelledby="login/signup">
                    {t("loginOrSignup")}
                  </Link>
                )}
                {name !== "Guest" && <strong className="pr-1 font-bold truncate">{name}</strong>}
              </div>
            </div>
          </div>

          {/* My Rewards Section*/}
          {SHOP.ENABLE_GAMIFICATION && <MyRewardsTab />}
        </div>
        {isBBC && (
          <div>
            <div className="flex items-center justify-between px-4 py-3 ">
              <div className="flex space-x-4 items-center">
                <ImageComponent alt="icon" src={getStaticUrl("/svg/lifestage-4.svg")} className="" width="30" height="30" />
                <div className="">
                  {profile?.meta?.babyDetails?.lifestage?.name ? (
                    <p className=" capitalize">{profile?.meta?.babyDetails?.lifestage?.name}</p>
                  ) : (
                    <p className="text-sm text-gray-600"> Select LifeStage</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="text-blue-500 uppercase text-sm font-medium"
                onClick={() => {
                  setShowLifeStageModal(true);
                }}
              >
                Change
              </button>
            </div>
            <div className="flex items-center space-x-2 justify-between px-6 py-3 border-y border-gray-200 text-sm">
              <Image
                alt="icon"
                src={getStaticUrl("/svg/doctor.svg")}
                className="pr-1"
                objectFit="contain"
                width="20"
                height="25"
              />
              <p className="text-sm"> Are you a Doctor</p>
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdBNUF4N0nOvyoS5oE7sEoIImkiZO8z4-gaXviaYMxHH3GNpQ/viewform"
                title="doctor registration form"
                className="uppercase text-blue-500 text-sm"
                aria-label="Register"
              >
                Register
              </Link>
            </div>
          </div>
        )}
        {/* Sidemenu List */}
        <div className="side-menu-content overflow-y-scroll">
          <ul className="list-none" role="menu" aria-labelledby="menubutton">
            {sideMenu?.map((item: any) => {
              if ((item?.visibility === "loggedIn" && profile) || item?.visibility === "both") {
                return (
                  <li className={`border-gray-300  ${item.class || ""}`} key={item.label} role="presentation">
                    {(() => {
                      if (item.url.match(/select-country|select-language|select-country-language|select-language-country/)) {
                        return <CountryLangSideNav url={item.url} />;
                      }

                      /* 1 & 2 level Accordion */
                      if (item?.child?.length > 0) {
                        return (
                          <AccordianPanel header={item.label} subitem={item.child} adobeClick={adobeClick} profile={profile} />
                        );
                      }

                      /* Server Hit Redirections for Cross Domain sites */
                      if (item.url.match(/\/blog\/|\/good-points/)) {
                        return (
                          <a
                            aria-hidden
                            href={item.url}
                            className="text-sm inline-block py-3 px-4 w-full"
                            onClick={() => {
                              adobeClick(item.label);
                            }}
                            role="menuitem"
                            aria-label={item.label}
                          >
                            {item.label}
                          </a>
                        );
                      }

                      /* Without Child Menu items */
                      return (
                        <Link
                          href={item.url}
                          prefetch={false}
                          aria-hidden
                          className="text-sm inline-block py-3 px-4 w-full"
                          onClick={() => {
                            adobeClick(item.label);
                          }}
                          role="menuitem"
                          aria-label={item.label}
                        >
                          {item.label}
                        </Link>
                      );
                    })()}
                  </li>
                );
              }
            })}
          </ul>
        </div>
        {/* Side Menu Widgets with visibilty scope for banner widgets*/}
        {widgets?.map((widget: any, index: number) => (
          <SideMenuWidgets index={index} key={widget.id} widget={widget} profile={profile} />
        ))}

        <LifeStageModal show={showLifestageModal} hide={setShowLifeStageModal} />
      </Fragment>
    );
  }

  return <LoadSpinner />;
};

export default SideNavContent;
