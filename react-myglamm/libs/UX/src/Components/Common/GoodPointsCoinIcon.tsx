import React from "react";

import { g3Config } from "@typesLib/Survey";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import useTranslation from "@libHooks/useTranslation";

interface IcnProps {
  className?: string;
  style?: React.CSSProperties;
}

const GoodPointsCoinIcon = ({ className, style }: IcnProps) => {
  const { t } = useTranslation();

  const G3_CONFIG: g3Config = t("g3Config");

  if (G3_CONFIG?.coinIcon) {
    return (
      <img
        alt="GoodPoints"
        style={style || {}}
        className={className || ""}
        src={IS_DUMMY_VENDOR_CODE() ? G3_CONFIG?.[`${SHOP.SITE_CODE}CoinIcon`] : G3_CONFIG?.coinIcon}
      />
    );
  }

  return null;
};

export default GoodPointsCoinIcon;
