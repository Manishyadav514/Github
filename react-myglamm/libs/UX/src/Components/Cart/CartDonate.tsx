import React from "react";
import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";
import CartDonateIcon from "../../../public/svg/icon-CartDonate.svg";

const CartDonate = () => {
  const { t } = useTranslation();

  if (SHOP.SITE_CODE === "srn" && t("cartDonation")) {
    return (
      <div className="flex flex-row h-auto w-full justify-center bg-white px-2 py-2">
        <div className="flex items-center justify-center px-2">
          <CartDonateIcon className="object-contain h-9 w-7" role="img" aria-labelledby="donate" />
        </div>
        <p className="text-11 leading-tight font-light flex pl-2 pr-5 text-black-700">{t("cartDonation")}</p>
      </div>
    );
  }

  return null;
};

export default CartDonate;
