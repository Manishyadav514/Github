import React from "react";
import CopyScratchCode from "@libComponents/ScratchCard/CopyScratchCode";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";

function ScratchRefund({ data, pageName, showUpdatedStatus }: any) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="px-2  w-[220px]  my-6 py-6 mx-auto  text-center  border-black">
        <span className="text-3xl  mx-auto w-32 flex items-center justify-center mb-6 text-black font-bold">
          {data?.value?.discountDescription}
        </span>

        <div
          className="w-full  mx-auto flex justify-content items-center mb-2"
          // style={{ padding: "0 24px 15px" }}
        >
          <CopyScratchCode
            //  index={index}
            couponCode={data?.value?.discountCode}
            // apiShowMiniPDPFlag={showMiniPDPFlag}
            id={data.id}
            webURL=""
            t={t}
            statusId={data.statusId}
            pageName={pageName}
          />
        </div>
      </div>

      <p className="text-center text-11 h-6 mb-6">
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

export default ScratchRefund;
