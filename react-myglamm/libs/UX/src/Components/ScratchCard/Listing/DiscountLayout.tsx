import React from "react";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import CopyScratchCode from "@libComponents/ScratchCard/CopyScratchCode";

function DiscountLayout({ data, pageName }: any) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mx-auto  my-6 text-center">
        <span className="text-xs flex justify-content tracking-wider mb-4 mx-4 text-black font-bold">
          {data.value?.discountDescription}
        </span>

        <div className="w-full px-2 mx-auto flex justify-content items-center">
          <CopyScratchCode
            //  index={index}
            couponCode={data.value?.discountCode}
            // apiShowMiniPDPFlag={showMiniPDPFlag}
            id={data.id}
            statusId={data.statusId}
            webURL=""
            t={t}
            pageName={pageName}
          />
        </div>
      </div>

      <p className="text-center text-xxs mb-2">
        {data.statusId === SCRATCHCARD_STATUS.ACTIVE_CARD && data.value?.expiryDate && (
          <span>
            {/* Expires on {format(new Date(data.value.expiryDate), "do MMM, yyyy")} */}
            {/* scratchCardExpiresOnPlaceHolder */}
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

export default DiscountLayout;
