import React, { useState, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import SharePlatformsV2 from "@libComponents/Common/SharePlatformsV2";
import { sharePaths } from "@libConstants/SHARE_CONFIG_PATH.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

interface ShareModalProps {
  show: boolean;
  onRequestClose: () => any;
}

function ShareEarnNewModal({ show, onRequestClose }: ShareModalProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [shareData, setShareData] = useState<any>();
  const { shareModalConfig } = useSelector((store: ValtioStore) => store.configReducer);

  /**
   * Data from Config Based on the route(asPath) of the Page it opened
   */
  const { shareDialogTitle, shareDialogTitleImageUrlV2, shareDialogBannerImageUrl, shareDialogTitleV2 } =
    shareData || t("shareUtility")?.default || {};

  useEffect(() => {
    if (t("shareUtility")) {
      let shareIndex;
      if (shareModalConfig.overrideRouterPath) {
        shareIndex = sharePaths.findIndex((x: any) => `/${shareModalConfig.overrideRouterPath}` === x.key);
      } else {
        shareIndex = sharePaths.findIndex((x: any) => `/${router.asPath.split("?")[0].split("/")[1]}` === x.key);
      }

      const selectedShare = t("shareUtility")[sharePaths[shareIndex]?.name];
      if (selectedShare) {
        setShareData(selectedShare);
      } else {
        setShareData(t("shareUtility").default);
      }
    }
  }, [shareModalConfig]);

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <section className="p-4 pt-8 w-full relative rounded-t-3xl">
        <div
          style={{ top: "-50px" }}
          className="text-center inset-x-0 justify-center absolute flex w-32 h-32  rounded-full items-center mx-auto bg-white"
        >
          <img
            src={shareModalConfig.image ? shareModalConfig.image : DEFAULT_IMG_PATH()}
            alt="share"
            className="h-24 w-24 p-2 rounded-full object-contain"
          />
        </div>

        <div>
          <div className="pb-3 pt-2 relative ml-2 text-center text-lg leading-tight">
            {shareDialogTitleImageUrlV2 && (
              <img alt="loved this" className="mt-6 w-28 mx-auto" src={shareDialogTitleImageUrlV2} />
            )}
            <p className="text-sm tracking-wide mt-4">{shareDialogTitleV2 || shareDialogTitle}</p>
          </div>
          {shareDialogBannerImageUrl && <img alt="steps" className="mt-2 mx-auto w-56" src={shareDialogBannerImageUrl} />}
        </div>
        <p className="font-bold text-11 text-black text-center my-6">{t("shareNow") || "SHARE NOW"}</p>
        <SharePlatformsV2 shareData={shareData} />
      </section>
    </PopupModal>
  );
}

export default ShareEarnNewModal;
