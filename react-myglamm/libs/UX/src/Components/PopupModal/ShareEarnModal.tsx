import React, { useState, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import SharePlatforms from "@libComponents/Common/SharePlatforms";
import { sharePaths } from "@libConstants/SHARE_CONFIG_PATH.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";

interface ShareModalProps {
  show: boolean;
  onRequestClose: () => any;
}

function ShareEarnModal({ show, onRequestClose }: ShareModalProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [shareData, setShareData] = useState<any>();
  const { shareModalConfig } = useSelector((store: ValtioStore) => store.configReducer);

  /**
   * Data from Config Based on the route(asPath) of the Page it opened
   */
  const { designType, shareDialogTitle, shareDialogImageUrl, shareDialogMiddleImageUrl, shareDialogBackgroundImageUrl } =
    shareData || t("shareUtility")?.default || {};

  useEffect(() => {
    if (t("shareUtility")) {
      const shareIndex = sharePaths.findIndex((x: any) => `/${router.asPath.split("?")[0].split("/")[1]}` === x.key);

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
      <div
        className="p-4 pt-5 bg-white w-full relative rounded-t-2xl"
        style={{
          background: `url(${shareDialogBackgroundImageUrl}) no-repeat #FFF 0 1rem /64px `,
        }}
      >
        {shareDialogMiddleImageUrl ? (
          <img alt="steps" className="px-8 mb-4 mt-16" src={shareDialogMiddleImageUrl} />
        ) : (
          <div className="w-3/5 mb-3 mt-3 ml-2 text-left text-lg pb-5 leading-tight">
            {shareModalConfig.category === "myglamm-academy" ? t("shareCourse") : shareDialogTitle}
          </div>
        )}

        <img
          alt="shareImg"
          src={shareDialogImageUrl}
          style={{ maxHeight: "115px", maxWidth: "115px" }}
          className={`absolute -mt-12 top-0 right-0 ${designType === "center-design" ? "left-0 mx-auto" : ""}`}
        />

        <SharePlatforms shareData={shareData} />
      </div>
    </PopupModal>
  );
}

export default ShareEarnModal;
