import React from "react";

import GlammpointsLayout from "@libComponents/ScratchCard/Listing/GlammpointsLayout";
import DiscountLayout from "@libComponents/ScratchCard/Listing/DiscountLayout";
import RefundLayout from "@libComponents/ScratchCard/Listing/RefundLayout";

import useTranslation from "@libHooks/useTranslation";

function ActiveScratchCard({ data, getScratchCardData, index, pageName }: any) {
  const { t } = useTranslation();

  return (
    <div aria-hidden className="relative w-full" style={{ minHeight: "200px" }} onClick={() => getScratchCardData(data, index)}>
      <img
        src={
          t("scratchAndWin")?.scratchCardScratchedBG ||
          "https://files.myglamm.com/site-images/original/scratchedBackground_1.png"
        }
        alt="coupon card"
        className="w-full"
        //   style={{ maxHeight: "220px" }}
      />
      {data?.value?.type && (
        <div
          className="absolute mx-auto text-center w-full"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        >
          {data.value?.type === "glammPoints" && <GlammpointsLayout data={data} />}
          {data.value?.type === "discount" && <DiscountLayout data={data} pageName={pageName} />}
          {data.value?.type === "refund" && <RefundLayout data={data} pageName={pageName} />}
        </div>
      )}
    </div>
  );
}

export default ActiveScratchCard;
