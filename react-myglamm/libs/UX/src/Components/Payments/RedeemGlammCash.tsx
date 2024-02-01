import React, { useEffect, useState } from "react";
import clsx from "clsx";

import CartOverlayLoader from "@libComponents/Cart/CartOverlayLoader";

import CartAPI from "@libAPI/apis/CartAPI";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { updateCart } from "@libStore/actions/cartActions";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import Checkbox from "../../../public/svg/checkbox.svg";
import InfoIcon from "../../../public/svg/info-icon.svg";

const RedeemGlammCash = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const { usersGlamPoints, applicableGlammPoints, appliedGlammPoints, firstOrder } = cart;

  // useEffect(() => {
  //   // if user has previously checked...
  //   const glammCoins = getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS, true);
  //   if (glammCoins) {
  //     setIsChecked(true);
  //   }
  // }, []);

  useEffect(() => {
    if (isChecked) {
      PAYMENT_REDUCER.userRedeemedGlammPoints = true;
    } else {
      PAYMENT_REDUCER.userRedeemedGlammPoints = undefined;
    }
  }, [isChecked]);

  const handleAddGlammCash = async (checked: boolean) => {
    setLoader(true);

    (window as any).digitalData = {
      common: {
        linkName: `web|Glammcoins|${checked ? "Add" : "Remove"} to checkout`,
        linkPageName: "web|checkout|Glammcoins",
        ctaName: "Glammcoins checkout",
        newLinkPageName: ADOBE.ASSET_TYPE.GLAMM_COINS,
        subSection: "checkout",
        assetType: ADOBE.ASSET_TYPE.GLAMM_COINS,
        newAssetType: ADOBE.ASSET_TYPE.GLAMM_COINS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    const cartApis = new CartAPI();

    return cartApis
      .updateCart(cart?.couponData?.couponCode, checked ? applicableGlammPoints : 0)
      .then(({ data }) => {
        updateCart(data);
        setIsChecked(!isChecked);
        // if (checked) {
        //   setLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS, applicableGlammPoints, true);
        // } else {
        //   removeLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);
        // }
      })
      .finally(() => setLoader(false));
  };

  return (
    <React.Fragment>
      <div
        className="bg-white  rounded mb-2"
        style={{
          margin: "0 0 9px",
          boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
        }}
      >
        <div className="flex items-center justify-between p-3">
          <div
            onClick={() => {
              if (!firstOrder && usersGlamPoints && usersGlamPoints > 0) handleAddGlammCash(!isChecked);
            }}
            className="flex items-center"
          >
            {isChecked ? (
              <Checkbox width="20" height="20" className="w-5 my-auto mr-4" />
            ) : (
              <button
                type="button"
                disabled={usersGlamPoints === 0 || firstOrder}
                aria-label="checkbox"
                className="border-2 border-darkpink rounded w-5 h-5 bg-white my-auto mr-4"
              />
            )}

            <div>
              <div className={clsx("font-bold", firstOrder && usersGlamPoints === 0 ? "text-gray-300" : "")}>
                {t("glammCoins") || "Glamm Coins"}
              </div>
              <div className={clsx("text-sm", firstOrder && usersGlamPoints === 0 ? "text-gray-300" : "")}>
                Remaining Balance: <span className="font-bold">{(usersGlamPoints || 0) - (appliedGlammPoints || 0)}</span>
              </div>
            </div>
          </div>

          {isChecked && (
            <div>
              <div className="text-gray-400">Coins Used</div>
              <div className="text-green-600 font-bold text-sm text-right">{`${applicableGlammPoints} coins`}</div>
            </div>
          )}
        </div>

        {firstOrder ? (
          <div className="bg-gray-100 p-1 text-sm flex item center">
            <InfoIcon className="mr-3 ml-3 mt-0.5" />
            {t("glammCashOnNextOrder") || "GlammCoins be redeemed from next order"}
          </div>
        ) : (
          <div className="bg-gray-100 p-1 text-sm flex item center">
            <InfoIcon className="mr-3 ml-3 mt-0.5" />
            {t("glammCoinsRedeem") || "Redeem 10% of the Glamm Coins"}
          </div>
        )}
      </div>
      <CartOverlayLoader show={loader} />
    </React.Fragment>
  );
};

export default RedeemGlammCash;
