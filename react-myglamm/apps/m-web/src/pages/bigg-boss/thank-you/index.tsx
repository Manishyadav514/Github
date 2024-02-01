import useTranslation from "@libHooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useState } from "react";
import GoldMedal from "../../../../../../libs/UX/public/svg/medal-gold.svg";
import ShareIcon from "../../../../../../libs/UX/public/svg/Share.svg";
import SilverMedal from "../../../../../../libs/UX/public/svg/medal-silver.svg";
import BronzeMedal from "../../../../../../libs/UX/public/svg/medal-bronze.svg";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { isClient } from "@libUtils/isClient";
import BBHead from "@components/BigBoss/BBHead";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { BASE_URL } from "@libConstants/COMMON.constant";

const ThankYou = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [vote, setVote] = useState(null);
  const [contestantDetail, setContestantDetail] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|thank you`,
        newPageName: "bigg boss thank you",
        subSection: "bigg boss thank you",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userProfile) {
        const voteData = getLocalStorageValue(LOCALSTORAGE.BIGG_BOSS_UPDATED, true);
        if (voteData?.id) {
          setVote(voteData);
          setContestantDetail(voteData);
          const bbMessage = t("shareUtility")?.biggBossThankYou?.shareMessage;
          if (bbMessage) {
            let updatedMsg = bbMessage
              .replaceAll("{userVoteFirstName}", voteData.firstName)
              .replaceAll("{userVoteLastName}", voteData.lastName)
              .replace("{userVotePosition}", voteData.position)
              .replace("{userVoteProfile}", BASE_URL() + "/bigg-boss/profile" + voteData.slug);
            if (userProfile.referenceCode) {
              updatedMsg = updatedMsg.replace("{rc}", `${userProfile.referenceCode}`);
            } else {
              updatedMsg = updatedMsg.replace("{rc}", "");
            }
            setShareMessage(updatedMsg);
          }
        } else {
          router.push("/bigg-boss");
        }
      } else {
        router.push("/bigg-boss");
      }
    };

    fetchData().catch(e => {});
  }, [userProfile]);

  const share = () => {
    const currentRoute = isClient() ? location.href : "/";

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|thank you|share`,
        newPageName: "bigg boss thank you share",
        subSection: "bigg boss share",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    (window as any).digitalData = {
      common: {
        linkName: currentRoute,
        linkPageName: "bigg boss share",
        ctaName: "bigg boss thank you share",
        newLinkPageName: "bigg boss thank you share",
        subSection: "bigg boss share",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: "",
      module: "page",
      slug: "",
      shareMessage: shareMessage,
    };
  };

  if (!vote || !contestantDetail) {
    return (
      <Fragment>
        <BBHead />
        <LoadSpinner className="absolute m-auto inset-0 w-8" />
      </Fragment>
    );
  }

  return (
    <section
      className="bg-no-repeat min-h-screen flex flex-col justify-between"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${t("imageUrls")?.bb13Background})`,
      }}
    >
      <BBHead />
      <div className="flex flex-col justify-center items-center mb-[30%]">
        {t("imageUrls")?.bb13ContestThankYou && (
          <img src={t("imageUrls")?.bb13ContestThankYou} className="w-full" loading="lazy" />
        )}
        {t("imageUrls")?.bb13ContestThankYouText && (
          <img src={t("imageUrls")?.bb13ContestThankYouText} className="w-42 h-18 mt-2" loading="lazy" />
        )}
        <p className="text-white tracking-wide">{t("contestThankYouForVote") || "for your vote"}</p>
        <div>
          <div className="flex justify-center">
            <div className="flex justify-center items-center absolute bg-white rounded-full w-7 h-7 my-40">
              {contestantDetail.position < 4 ? (
                <>
                  {contestantDetail.position === 1 ? (
                    <GoldMedal className="absolute w-6 h-5" />
                  ) : contestantDetail.position === 2 ? (
                    <SilverMedal className="absolute w-6 h-5" />
                  ) : contestantDetail.position === 3 ? (
                    <BronzeMedal className="absolute w-6 h-5" />
                  ) : null}
                </>
              ) : (
                <div className="text-center rounded-full" style={{ backgroundColor: "#50A2D6" }}>
                  <p className="text-sm text-white font-bold w-6 h-6 pt-0.5">{contestantDetail.position}</p>
                </div>
              )}
            </div>
          </div>
          <img src={contestantDetail?.thumbnail} className="w-36 h-36 rounded-full border-3 mt-8" loading="lazy" />
          <p className="text-white text-center font-bold mt-4 tracking-wide">
            {contestantDetail?.firstName + " " + contestantDetail?.lastName}
          </p>
        </div>
        <div className="flex flex-row" onClick={() => share()}>
          <p className="text-white text-xs mt-2 tracking-wide">{t("share")}</p>
          <ShareIcon className="w-3 h-6 mx-1 my-1" />
        </div>
      </div>
      <div className="flex flex-col justify-center fixed bottom-4 w-full">
        <Link href="/bigg-boss/rewards" legacyBehavior>
          <button
            type="button"
            style={{ backgroundColor: "#50A2D6" }}
            className="text-white w-11/12 h-12 shadow-lg rounded-md font-bold tracking-wide uppercase mx-auto mt-4"
          >
            {t("bbClaimYourReward") || "CLAIM YOUR REWARD"}
          </button>
        </Link>
        <div className="flex flex-row justify-around items-center mt-4 mx-10">
          <Link
            href="/bigg-boss/leaderboard"
            className="underline text-white text-sm"
            aria-label={t("contestViewLeaderBoard") || "View Leaderboard"}
          >
            {t("contestViewLeaderBoard") || "View Leaderboard"}
          </Link>
          <p className="text-white text-sm">|</p>
          <Link href="/" className="underline text-white text-sm" aria-label={t("contestGoToHomepage") || "Go To Homepage"}>
            {t("contestGoToHomepage") || "Go To Homepage"}
          </Link>
        </div>
      </div>
    </section>
  );
};

ThankYou.getLayout = (children: ReactElement) => children;

export default ThankYou;
