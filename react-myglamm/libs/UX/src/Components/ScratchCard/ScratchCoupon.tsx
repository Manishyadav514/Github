import React from "react";
import CopyScratchCode from "@libComponents/ScratchCard/CopyScratchCode";
import format from "date-fns/format";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import useTranslation from "@libHooks/useTranslation";

function ScratchCoupon({ data, pageName, showUpdatedStatus, fullScreen }: any) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="px-2 h-[150px] w-[190px] my-4 mx-auto py-4 text-center border-dashed border border-black">
        <p className="text-base text-center font-light">{t("couponCode") || "Coupon Code"}</p>
        <span className="text-2xl  mx-2 flex items-center justify-center mb-2 text-black font-bold">
          {data?.value?.discountCode.substring(0, 9)}
          {data?.value?.discountCode.length > 10 && "..."}
        </span>

        <div className="w-full px-4">
          <CopyScratchCode
            //  index={index}
            couponCode={data?.value?.discountCode}
            // apiShowMiniPDPFlag={showMiniPDPFlag}
            id={data.id}
            webURL=""
            t={t}
            couponPlaceholder="Copy"
            statusId={data.statusId}
            pageName={pageName}
            showUpdatedStatus={showUpdatedStatus}
            fullScreen={fullScreen}
          />
        </div>
      </div>
      <p className="text-xs flex  mx-auto mb-8 justify-center items-center w-36 text-center">
        {data?.value?.discountDescription}
      </p>
      <p className="text-center text-11 h-4 mb-6">
        {data.statusId === SCRATCHCARD_STATUS.ACTIVE_CARD && data.value?.expiryDate && (
          <span>
            {t("scratchAndWin")?.scratchCardExpiresOnPlaceHolder?.replace(
              "{{expiresDate}}",
              `${format(new Date(data.value.expiryDate), "do MMM, yyyy")}`
            )}
          </span>
        )}
      </p>
    </div>
  );
}

export default ScratchCoupon;
