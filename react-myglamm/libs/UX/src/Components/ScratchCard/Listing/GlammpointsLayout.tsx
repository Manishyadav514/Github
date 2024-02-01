import React from "react";
import useTranslation from "@libHooks/useTranslation";
import GoodPoints from "../../../../public/svg/GPBlack.svg";
import { IS_POPXO } from "@libConstants/COMMON.constant";

function GlammpointsLayout({ data, id }: any) {
  const { t } = useTranslation();
  const { imgSrc, popxoImgSrc }: any = t("floaterConfig");

  return (
    <div className="px-2 my-6 mx-auto text-center">
      <div className="mx-auto">
        <img src={IS_POPXO() ? popxoImgSrc || imgSrc : imgSrc} alt="coin" className="w-9 h-9 mb-2 mx-auto" />
        <span className="text-4xl mx-auto font-semibold mb-1">{data.value.amount}</span>
        <GoodPoints className="mx-auto -mt-2 h-12 w-24" />
      </div>
    </div>
  );
}

export default GlammpointsLayout;
