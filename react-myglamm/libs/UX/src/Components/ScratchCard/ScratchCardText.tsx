import React from "react";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";

function ScratchCardText({ scratchCardData }: any) {
  const { t } = useTranslation();
  return (
    <>
      {scratchCardData.statusId === SCRATCHCARD_STATUS.LOCKED_CARD ? (
        <span
          className="absolute flex py-1 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center text-center font-bold w-full text-xs"
          style={{
            top: "50%",
            left: "50%",
            backgroundColor: "#fce1e0",
          }}
        >
          {scratchCardData?.value?.unlocksAt && (
            <>
              {t("scratchAndWin")?.scratchCardUnlocksOnPlaceHolder?.replace(
                "{{unlocksDate}}",
                `${format(new Date(scratchCardData.value.unlocksAt), "do MMM, yyyy")}`
              )}
            </>
          )}
        </span>
      ) : (
        <>
          <span
            className="absolute flex py-1 text-xxs transform -translate-x-1/2 -translate-y-1/2 justify-center items-center text-center font-bold w-full"
            style={{
              top: "27px",
              left: "50%",
            }}
          >
            {t("scratchAndWin")?.tapToScratch || "Tap to Scratch"}
          </span>
          <span
            className="absolute flex py-1 text-xxs transform -translate-x-1/2 -translate-y-1/2 justify-center items-center text-center font-bold w-full"
            style={{
              bottom: "4px",
              left: "50%",
            }}
          >
            {scratchCardData.statusId === SCRATCHCARD_STATUS.UNSCRATCHED_CARD &&
              (scratchCardData.value?.expiryDate || scratchCardData?.expiryDate) && (
                <span className="text-center text-xxs mb-2">
                  {t("scratchAndWin")?.scratchCardExpiresOnPlaceHolder?.replace(
                    "{{expiresDate}}",
                    `${format(new Date(scratchCardData.value.expiryDate || scratchCardData?.expiryDate), "do MMM, yyyy")}`
                  )}
                </span>
              )}
          </span>
        </>
      )}
    </>
  );
}

export default ScratchCardText;
