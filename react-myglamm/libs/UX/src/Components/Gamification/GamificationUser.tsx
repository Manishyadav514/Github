import React from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { getLocalStorageValue } from "@libUtils/localStorage";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { ValtioStore } from "@typesLib/ValtioStore";

const GamificationUser = () => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const profile = userProfile || getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  const handleUserClick = () => {
    if (!checkUserLoginStatus()) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false });
    }
  };

  return (
    <figure className="flex justify-center items-center mb-3" onClick={handleUserClick}>
      <div className="mr-2">
        {profile?.meta.profileImage?.original && (
          <ImageComponent
            forceLoad
            alt="user avatar"
            className="rounded-full h-14 w-14"
            src={profile.meta.profileImage?.original}
          />
        )}
      </div>

      <div className="text-left">
        {profile?.meta.profileImage?.original ? (
          <React.Fragment>
            <p className="text-sm block leading-tight" style={{ fontFamily: "cursive" }}>
              {t("hello")}!
            </p>
            <p className="text-sm leading-tight font-semibold">
              {profile ? `${profile.firstName} ${profile.lastName}` : "Guest"}
            </p>
          </React.Fragment>
        ) : (
          <p className="text-sm block leading-tight font-semibold">
            {t("hello")}! {profile ? `${profile.firstName} ${profile.lastName}` : t("guest") || "Guest"}
          </p>
        )}
      </div>
    </figure>
  );
};

export default GamificationUser;
