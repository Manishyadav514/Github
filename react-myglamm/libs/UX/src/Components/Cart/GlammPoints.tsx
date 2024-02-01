import React, { useState } from "react";
import dynamic from "next/dynamic";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { SHOP } from "@libConstants/SHOP.constant";

import { eventInfo } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";

import Info from "../../../public/svg/info.svg";
import Coin from "../../../public/svg/coin-copy.svg";
import Checkbox from "../../../public/svg/checkbox.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

const GlammInfoModal = dynamic(
  () => import(/* webpackChunkName: "GlammInfoModal" */ "@libComponents/PopupModal/GlammInfoModal"),
  {
    ssr: false,
  }
);

interface glammPointprops {
  showLoginModal: () => void;
  updateCheckout: (initiateLoader: boolean, eventInfo: eventInfo) => void;
}

const GlammPoints = ({ updateCheckout, showLoginModal }: glammPointprops) => {
  const { t } = useTranslation();

  const {
    usersGlamPoints,
    appliedGlammPoints,
    applicableGlammPoints,
    redeemPointsOnFirstOrderInfoMsg,
    couponData,
    firstOrder,
  } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [glammInfoModal, setGlammInfoModal] = useState<boolean | undefined>();

  const isLoggedIn = checkUserLoginStatus();

  /* Handle Apply/Removal of Glammpoints */
  const handleGlammpoints = () => {
    let status: eventInfo;
    const points = parseInt(getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS) || "0", 10);

    if (points) {
      status = "remove glammpoints";
      removeLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);
    } else {
      status = "apply glammpoints";
      setLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS, applicableGlammPoints, true);
    }

    updateCheckout(true, status);
  };

  /* Early Return Nothing - in case coupon is applied for guest user */
  if ((!isLoggedIn && couponData?.couponCode) || !SHOP.ENABLE_GLAMMPOINTS) {
    return null;
  }

  /* Guest User */
  if (!isLoggedIn) {
    return (
      <div className="text-sm bg-white py-3 px-3 mb-2 rounded w-full flex">
        <style>
          {`
          #pointer:after {
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-right: 10px solid white;
            border-top: 11px solid transparent;
            border-bottom: 11px solid transparent;
          }
        `}
        </style>

        {/* PROMP FOR LOGIN */}
        <button type="button" onClick={showLoginModal} className="flex w-2/3 border-r border-gray-400 outline-none">
          <Coin className="w-10 my-auto mr-2" />
          <p className="py-1 my-auto inline text-left">{t("redeemGlammPoints")}</p>
        </button>

        {/* SHOW GLAMMINFO MODAL */}
        <button type="button" onClick={() => setGlammInfoModal(true)} className="w-1/3 pl-4 relative outline-none">
          <div className="flex">
            <span
              id="pointer"
              className="font-semibold text-white text-xs relative inline-block py-0.5 pr-3.5 pl-1.5 bg-red-400"
            >
              {formatPrice(150, true)}
            </span>
            <strong className="text-xs text-left w-full h-2 pl-1">{t("off")}</strong>
          </div>
          <p className="text-xs text-left">{t("onFirstOrder")}</p>
          <Info className="absolute right-0 inset-y-0 my-auto" />
        </button>

        {typeof glammInfoModal === "boolean" && (
          <GlammInfoModal show={glammInfoModal} onRequestClose={() => setGlammInfoModal(false)} />
        )}
      </div>
    );
  }

  /* Registered User with some Err Msg with glammpoints */
  if (redeemPointsOnFirstOrderInfoMsg?.trim()) {
    return (
      <div className="flex p-3 rounded bg-white mb-2">
        <ImageComponent
          alt="info"
          src="https://files.myglamm.com/site-images/original/info-red.png"
          className="my-auto ml-2 mr-4 w-6 h-6"
        />

        <div className="flex flex-col justify-around text-xs">
          <p className="mb-1">{redeemPointsOnFirstOrderInfoMsg}</p>
          <p className="opacity-50">
            {t("cartGlammPointsBalance", [""])}: {usersGlamPoints} <b>{t("myglammPoints")}</b>
          </p>
        </div>
      </div>
    );
  }

  /* Registered User with Glammpoints */
  if (usersGlamPoints) {
    return (
      <div className="text-xs bg-white py-3 px-3 mb-2 rounded">
        <div className="w-full flex">
          {appliedGlammPoints ? (
            <Checkbox width="20" height="20" onClick={handleGlammpoints} className="w-12 my-auto pr-2" />
          ) : (
            <button
              type="button"
              aria-label="checkbox"
              onClick={handleGlammpoints}
              disabled={!applicableGlammPoints}
              className="border rounded w-5 h-5 bg-white my-auto ml-2 outline-none mr-5"
            />
          )}

          {/* APPLICABLE POINTS */}
          <div className="capitalize">
            <h5 className="text-sm leading-relaxed">
              {appliedGlammPoints ? (
                <>
                  {t("redeemedTitle")?.toLowerCase() || "Redeemed"}&nbsp;
                  <strong>
                    {formatPrice(appliedGlammPoints, true)}&nbsp;
                    {t("myglammPoints")}
                  </strong>
                </>
              ) : (
                <>
                  {t("claimedTitle")?.toLowerCase() || "Redeem"}
                  <strong> {formatPrice(applicableGlammPoints || 0, true)}</strong> in&nbsp;
                  <strong>{t("myglammPoints")}</strong>
                </>
              )}
            </h5>

            {/* BALANCE LEFT AND MAX APPLICABLE POINTS */}
            <span className="opacity-50">
              {t("cartGlammPointsBalance", [""])}
              {appliedGlammPoints ? usersGlamPoints - appliedGlammPoints : usersGlamPoints}
              &nbsp;|&nbsp;{t("cartMaxApplicableGlammPoints", [""])} {applicableGlammPoints}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* Registered User without Glammpoints */
  return (
    <div className="text-sm bg-white py-3 px-3 mb-2 rounded font-semibold text-center">
      You have {formatPrice(0, true)} {t("myglammPoints")}
    </div>
  );
};

export default GlammPoints;
