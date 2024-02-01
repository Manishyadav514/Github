import React from "react";
import useTranslation from "@libHooks/useTranslation";
import GoodPoints from "../../../public/svg/GPBlack.svg";
import { IS_POPXO } from "@libConstants/COMMON.constant";

function ScratchGlammPoints({ data }: any) {
  const { t } = useTranslation();
  const { imgSrc, popxoImgSrc }: any = t("floaterConfig");
  return (
    <div>
      <div className="px-2 my-8 py-4 mx-auto">
        <div className="mx-auto flex flex-col justify-center items-center">
          <img src={IS_POPXO() ? popxoImgSrc || imgSrc : imgSrc} alt="coin" className="w-16 h-16  mx-auto" />
          <span className="text-7xl mx-auto font-bold">{data.value?.amount}</span>
          <GoodPoints className="-mt-2" />
        </div>
      </div>
    </div>
  );
}

export default ScratchGlammPoints;
