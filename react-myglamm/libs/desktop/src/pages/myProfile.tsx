import React, { ReactElement, useState } from "react";
import dynamic from "next/dynamic";

import { ValtioStore } from "@typesLib/ValtioStore";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { getUserNameEmail } from "@libUtils/getUserNameEmail";

import MyProfileHead from "@libComponents/MyProfile/MyProfileHead";

import UserLayout from "../Components/layout/UserLayout";
import { SHARE_URLS, USER_TABS } from "../Constants/User.constant";
import ProfileAddressList from "../Components/address/ProfileAddressList";

const ProfileUserInfo = dynamic(() => import("../Components/user/ProfileUserInfo"), { ssr: false });

const ProfileNotificationSett = dynamic(() => import("../Components/user/ProfileNotificationSett"), { ssr: false });

const myProfile = () => {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [selectedTab, setSelectedTab] = useState(USER_TABS[0].fallback);

  const USER_REWARD_DETAILS = [
    {
      icon: "https://files.myglamm.com/site-images/original/speedometer.png",
      label: t("rewardLevel") || "reward level",
      value: userProfile?.memberType.levelName,
    },
    {
      icon: "https://files.myglamm.com/site-images/original/diamond.png",
      label: t("rewardPoints"),
      value: userProfile?.currentBalance,
    },
    {
      icon: "https://files.myglamm.com/site-images/original/user.png",
      label: t("myNetwork"),
      // @ts-ignore
      value: userProfile?.circle?.total || 0,
    },
  ];

  if (userProfile) {
    return (
      <section className="w-3/4 py-8 relative">
        <MyProfileHead />

        <div className="flex items-center justify-between p-5">
          <div className="flex items-center justify-between">
            <img
              width={67}
              height={67}
              className="rounded-full aspect-square"
              src={
                userProfile?.meta.profileImage?.original || "https://files.myglamm.com/site-images/original/no-user-yellow.png"
              }
            />
            <p className="ml-4">{getUserNameEmail(userProfile)}</p>
          </div>

          <ul className="list-none flex items-center">
            {USER_REWARD_DETAILS.map((reward, index) => (
              <>
                <li className="text-center px-4" key={reward.label}>
                  <img width={25} height={25} src={reward.icon} className="mx-auto" />
                  <p className="text-themeGolden mt-2 mb-1">{reward.value}</p>
                  <p className="capitalize">{reward.label}</p>
                </li>

                {index !== USER_REWARD_DETAILS.length - 1 && <li className="h-14 border-r border-gray-300" />}
              </>
            ))}
          </ul>
        </div>

        <div className="bg-themeGray w-full py-3 rounded-sm px-4 flex items-center justify-between mb-4">
          <div className="text-sm flex items-center w-1/2">
            <p className="border-r border-black pr-4 mr-4">{userProfile.phoneNumber}</p>
            <p>{getUserNameEmail(userProfile, true)}</p>
          </div>

          <div className="flex items-center">
            <p className="pr-6 border-r border-black mr-3 uppercase text-xs">{t("shareYourLink") || "share your link"}</p>

            <ul className="list-none flex">
              {SHARE_URLS.map(share => (
                <li key={share.name}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    title={share.name}
                    className="flex items-center justify-center mr-3"
                    href={share.url.replace("{shareURL}", encodeURIComponent(userProfile.shareUrl))}
                  >
                    <img src={share.icon} width={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="flex list-none border-b border-gray-300 mb-4">
          {USER_TABS.map(tab => (
            <li key={tab.fallback}>
              <button
                onClick={() => setSelectedTab(tab.fallback)}
                className={`font-bold text-sm uppercase tracking-wider border-b-4 px-4 pb-2.5 mr-4 ${
                  tab.fallback === selectedTab ? "border-black" : "border-transparent"
                }`}
              >
                {t(tab.label) || tab.fallback}
              </button>
            </li>
          ))}
        </ul>

        {(() => {
          switch (selectedTab) {
            case "my addresses":
              return <ProfileAddressList />;

            case "personal info":
              return <ProfileUserInfo />;

            case "notification settings":
              return <ProfileNotificationSett />;

            default:
              return null;
          }
        })()}
      </section>
    );
  }

  return null;
};

myProfile.getLayout = (page: ReactElement) => (
  <UserLayout header={CONFIG_REDUCER.configV3.myProfile || "my profile"}>{page}</UserLayout>
);

export default myProfile;
