import Header from "@components/BigBoss/Header";
import BigBossAPI from "@libAPI/apis/BigBossAPI";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import React, { ReactElement, useEffect, useState } from "react";
import GoldMedal from "../../../../../../libs/UX/public/svg/medal-gold.svg";
import SilverMedal from "../../../../../../libs/UX/public/svg/medal-silver.svg";
import BronzeMedal from "../../../../../../libs/UX/public/svg/medal-bronze.svg";
import RightIcon from "../../../../../../libs/UX/public/svg/right-icon.svg";
import CrossIcon from "../../../../../../libs/UX/public/svg/cross-icon.svg";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { isClient } from "@libUtils/isClient";
import Link from "next/link";
import BBHead from "@components/BigBoss/BBHead";
import { useRouter } from "next/router";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LeaderBoard = ({ leaderBoard }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [vote, setVote] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [apiCalled, setApiCalled] = useState(false);
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const voteLine1 = t("voteLine1") || "{{votePercent}}%";
  const voteLine2 = t("voteLine2") || "({{voteCount}} votes)";

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|leaderboard`,
        newPageName: "bigg boss leaderboard",
        subSection: "bigg boss leaderboard",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
    router.push("/bigg-boss");

    // const api = new BigBossAPI();
    // api
    //   .getContestantsLeaderBoard()
    //   .then(data => {
    //     setLeaderBoardData(data?.data?.data?.data);
    //     setApiCalled(true);
    //   })
    //   .catch(e => {});
  }, []);

  useEffect(() => {
    if (userProfile) {
      const api = new BigBossAPI();
      api.isYourVote().then(data => {
        setVote(Object.keys(data?.data?.data?.data)[0]);
        const voteData = getLocalStorageValue(LOCALSTORAGE.BIGG_BOSS_UPDATED, true);
        if (voteData?.id) {
          const bbMessage = t("shareUtility")?.biggBossVoting?.shareMessage;
          if (bbMessage) {
            let updatedMsg = bbMessage
              .replaceAll("{userVoteFirstName}", voteData.firstName)
              .replaceAll("{userVoteLastName}", voteData.lastName)
              .replace("{userVotePosition}", voteData.position)
              .replace("{userVoteProfile}", GBC_ENV.NEXT_PUBLIC_BASE_URL + voteData.slug);
            if (userProfile.referenceCode) {
              updatedMsg = updatedMsg.replace("{rc}", `${userProfile.referenceCode}`);
            } else {
              updatedMsg = updatedMsg.replace("{rc}", "");
            }
            setShareMessage(updatedMsg);
            setShowShare(true);
          }
        }
      });
    }
  }, [userProfile]);

  const share = () => {
    const currentRoute = isClient() ? location.href : "/";

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|leaderboard|share`,
        newPageName: "bigg boss leaderboard share",
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
        ctaName: "bigg boss leaderboard share",
        newLinkPageName: "bigg boss leaderboard share",
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

  return (
    <section
      className="bg-no-repeat w-full min-h-screen flex flex-col justify-start items-center"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${t("imageUrls")?.bb13Background})`,
      }}
    >
      <BBHead />
      <Header label={t("contestLeaderboardTitle") || "Leaderboard"} showShare={showShare} handleShare={() => share()} />
      {/* {t("imageUrls")?.bb13FaceMeter && <img src={t("imageUrls")?.bb13FaceMeter} className="w-48 h-44 mt-8" loading="lazy" />} */}
      <div className="w-full">
        {leaderBoardData
          ?.sort((a, b) => a?.position - b?.position)
          ?.map((leader, index) => {
            return (
              <Link href={leader.slug} key={index} className="w-full" legacyBehavior aria-label="Leader Board">
                <div className="flex flex-row items-center mb-4 mx-3">
                  <div>
                    {leader.position < 4 ? (
                      <div>
                        {leader.position === 1 ? (
                          <GoldMedal className="w-6 h-7" />
                        ) : leader.position === 2 ? (
                          <SilverMedal className="w-6 h-7" />
                        ) : leader.position === 3 ? (
                          <BronzeMedal className="w-6 h-7" />
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 rounded-full">
                        <p className="text-sm text-gray-500 font-bold w-6 h-6 pt-0.5">{index + 1}</p>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-row items-center rounded-lg w-full ml-2"
                    style={
                      leader.isEliminated
                        ? {
                            backgroundColor: "#A6214E",
                            boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.32)",
                            opacity: 0.7,
                          }
                        : { backgroundColor: "#DD4780", boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.32)" }
                    }
                  >
                    <img
                      src={leader.thumbnail}
                      className="mx-2 rounded-full border-2 border-rose-200 h-14 w-14"
                      loading="lazy"
                    />
                    <div className="flex flex-row my-4 mx-2 w-full">
                      <div className="flex flex-col mr-1 w-full">
                        <div className="flex flex-row justify-between">
                          <p className="text-white text-sm font-bold tracking-wide">
                            {leader.firstName + " " + leader.lastName}
                          </p>
                          {apiCalled && (
                            <span className="flex flex-row flex-wrap justify-end">
                              {voteLine1 && (
                                <p className="text-white text-sm font-bold">
                                  {voteLine1.replace("{{votePercent}}", leader.percentage)}
                                </p>
                              )}
                              {voteLine2 && (
                                <p className="text-white text-sm ml-1">
                                  {voteLine2.replace("{{voteCount}}", leader.voteCount)}
                                </p>
                              )}
                            </span>
                          )}
                        </div>
                        {apiCalled && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-white-700 mt-2">
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${leader.percentage || 0}%`, backgroundColor: "#50A2D6" }}
                            ></div>
                          </div>
                        )}
                        <div className="flex flex-row items-center">
                          {vote == leader.id && (
                            <>
                              <RightIcon className="w-4 h-5 mt-1 mr-1" />
                              <p className="text-white text-xs mt-1 mr-2">{t("yourVote") || "Your vote"}</p>
                            </>
                          )}
                          {leader.isEliminated && (
                            <div className="flex flex-row items-center">
                              <>
                                <CrossIcon className="w-4 h-3.5 mt-1 mr-1" />
                                <p className="text-white text-xs mt-1">{t("eliminated") || "Eliminated"}</p>
                              </>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

LeaderBoard.getLayout = (children: ReactElement) => children;

LeaderBoard.getInitialProps = async (ctx: any) => {
  const api = new BigBossAPI();

  try {
    const { data } = await api.getContestantsLeaderBoard();

    return {
      leaderBoard: data?.data?.data,
    };
  } catch (error) {
    logURI(ctx.asPath);
    console.error(error);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end(error);
    }
  }
};

export default LeaderBoard;
