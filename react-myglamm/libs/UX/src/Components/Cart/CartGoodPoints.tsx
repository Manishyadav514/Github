import React, { useEffect, useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { g3Config } from "@typesLib/Survey";
import { ValtioStore } from "@typesLib/ValtioStore";

import OrderAPI from "@libAPI/apis/OrderAPI";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { getLocalStorageValue } from "@libUtils/localStorage";

import useTranslation from "@libHooks/useTranslation";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

const CartGoodPoints = () => {
  const { t } = useTranslation();

  const G3_CONFIG: g3Config = t("g3Config");

  const [earnedPoints, setEarnedPoints] = useState<number>();

  const { payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  useEffect(() => {
    if (typeof payableAmount === "number" && checkUserLoginStatus()) {
      const orderApi = new OrderAPI();
      orderApi
        .getEarnedPoints(getLocalStorageValue(LOCALSTORAGE.MEMBER_ID), payableAmount)
        .then(({ data }: any) => setEarnedPoints(Math.floor(data.data.commissionEarnings)));
    }
  }, [payableAmount]);

  if (typeof earnedPoints === "number") {
    return (
      <section
        className="text-center text-xs flex items-center justify-center h-12 mb-4"
        dangerouslySetInnerHTML={{
          __html: t("willEarnGlammPoints", [
            "",
            `<img
            alt="GOOD POINTs"
            class="w-4 h-4 mx-1"
            src=${IS_DUMMY_VENDOR_CODE() ? G3_CONFIG?.[`${SHOP.SITE_CODE}CoinIcon`] : G3_CONFIG?.coinIcon}
          />
       <strong class="mr-1">${earnedPoints}</strong>`,
          ]),
        }}
      />
    );
  }

  return null;
};

export default CartGoodPoints;
