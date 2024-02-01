import React, { ReactElement } from "react";
import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { showSuccess } from "@libUtils/showToaster";

import { SHARE_URLS } from "../../Constants/User.constant";

const UserSideLayout = ({ children }: { children: ReactElement }) => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const shareURL = encodeURIComponent(userProfile?.shareUrl || "");

  const userNavList = [
    { title: t("profile") || "my profile", url: "/my-profile" },
    { title: t("myOrders"), url: "/my-orders" },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(userProfile?.shareUrl || "");
    showSuccess("Copied !!!");
  };

  return (
    <div className="flex justify-between">
      <div className="w-1/4 pr-8">
        <div className="flex items-center border-b border-gray-300 my-6 pb-4 px-4">
          <img
            width={43}
            height={43}
            className="rounded-full aspect-square"
            src={
              userProfile?.meta?.profileImage?.original || "https://files.myglamm.com/site-images/original/no-user-yellow.png"
            }
          />

          <p className="text-18 ml-4">
            {userProfile?.firstName}&nbsp;{userProfile?.lastName}
          </p>
        </div>

        <ul className="list-none">
          {userNavList.map(nav => (
            <li key={nav.url} className="font-bold capitalize pb-4 mt-1">
              <Link href={nav.url}>{nav.title}</Link>
            </li>
          ))}
        </ul>

        <div className="pb-4 mt-2 border-t border-gray-300">
          <h3 className="text-xl mt-5 mb-2.5">{t("growAndEarn")}</h3>
          <h6 className="text-gray-600 pr-8 leading-5 text-18 mb-2.5">{t("referandReward")}</h6>

          <div className="flex items-center mb-4 mt-6">
            {SHARE_URLS.map(share => (
              <a
                target="_blank"
                rel="noreferrer"
                key={share.name}
                title={share.name}
                href={share.url.replace("{shareURL}", shareURL)}
                className="flex items-center justify-center h-8 w-8 mr-4"
              >
                <img src={share.icon} className="h-8" />
              </a>
            ))}
          </div>

          <h6 className="text-gray-600 pr-8 leading-5 text-18 mb-2.5">{t("copyShare")}</h6>
          <p>{t("experienceText")}</p>
          <p className="text-themeGolden mb-2.5 mt-2">{userProfile?.shareUrl}</p>

          <button onClick={handleCopy} className="h-10 capitalize text-sm bg-ctaImg text-white font-bold rounded-sm px-4">
            {t("copyText") || "copy text"}
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

export default UserSideLayout;
