import GamificationShare from "@libComponents/Gamification/GamificationShare";
import { ADOBE } from "@libConstants/Analytics.constant";
import useTranslation from "@libHooks/useTranslation";
import Adobe from "@libUtils/analytics/adobe";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";
import { GamificationConfig } from "@typesLib/Gamification";
import { useRouter } from "next/router";
import React from "react";

const BountyReward = ({ variant }: { variant: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const orderSuccessObj = t("orderSuccessGamificationObj");
  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const isPaymentPending = router.query.paymentStatus;

  const handleAppRedirection = () => {
    adobeOnClickEvent();
    window.location.href = getAppStoreRedirectionUrl(GAMIFICATION_DATA.bountyRewardsBranchUrl);
  };

  const adobeOnClickEvent = () => {
    const orderStatus = isPaymentPending === "inPending" ? "order placed payment pending" : ADOBE.ASSET_TYPE.PAYMENT_SUCCESS;
    (window as any).digitalData = {
      common: {
        linkName: `web|order checkout|${orderStatus}`,
        linkPageName: `web|order checkout|${orderStatus}`,
        ctaName: "bounty play now",
        newLinkPageName: ADOBE.ASSET_TYPE.PAYMENT_SUCCESS,
        subSection: ADOBE.ASSET_TYPE.ORDER_CHECKOUT_STEP_5,
        assetType: ADOBE.ASSET_TYPE.PAYMENT_SUCCESS,
        newAssetType: ADOBE.ASSET_TYPE.ORDER_SUMMARY,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <div>
      <img alt="mgxo background" className="mx-auto my-2 p-4" src={orderSuccessObj?.bountyRewardImage} />

      <div className="w-10/12 mx-auto">
        <div className="px-4">
          <GamificationShare variant={variant} />
        </div>
      </div>
    </div>
  );
};

export default BountyReward;
