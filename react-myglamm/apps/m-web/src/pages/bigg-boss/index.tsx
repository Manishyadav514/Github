import Header from "@components/BigBoss/Header";
import BigBossAPI from "@libAPI/apis/BigBossAPI";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import { GamificationConfig } from "@typesLib/Gamification";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import Star from "../../../../m-web/public/mgp/svg/starWhite.svg";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";
import { useRouter } from "next/router";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import MiniPDPModal from "@libComponents/PopupModal/MiniPDPModal";
import { getGamificationRedirectionURL } from "@libComponents/Gamification/getGamificationRedirection";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import BBHead from "@components/BigBoss/BBHead";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";

const BigBoss = ({ leaderBoard, widgets, rewardList }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [vote, setVote] = useState(null);
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [dumpRecords, setDumpRecords] = useState(null);
  const [currentReward, setCurrentReward] = useState<any>();
  const [apiCalled, setApiCalled] = useState(false);
  const [leaderBoardData, setLeaderBoardData] = useState(leaderBoard);
  const landingImageWidget = widgets?.filter(dt => dt.label === "Landing Image")[0];
  const landingImageWidgetMeta = landingImageWidget?.meta?.widgetMeta ? JSON.parse(landingImageWidget?.meta?.widgetMeta) : "";
  const faqWidget = widgets?.filter(dt => dt.label === "FAQ")[0];

  useEffect(() => {
    const fetchData = async () => {
      const api = new BigBossAPI();
      if (userProfile) {
        const { data: voteData } = await api.isYourVote();
        if (voteData?.data?.count > 0) {
          setVote(Object.keys(voteData?.data?.data)[0]);
          const { data: dump } = await api.getRewardsDump(userProfile.id);
          setDumpRecords(dump?.data[0]?.value?.rewards);
        }
      }
      const { data: leaderData } = await api.getContestantsLeaderBoard();
      setLeaderBoardData(leaderData?.data?.data);
      setApiCalled(true);
    };

    fetchData().catch(e => {});
  }, []);

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: userProfile ? `web|bigg boss|landing repeat user` : `web|bigg boss|landing new user`,
        newPageName: userProfile ? "bigg boss landing page repeat user" : "bigg boss landing page new user",
        subSection: "bigg boss landing",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const voteNow = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|bigg boss|landing",
        linkPageName: "bigg boss landing",
        ctaName: "Bigg Boss Vote Now",
        newLinkPageName: "bigg boss landing",
        subSection: "bigg boss landing",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    if (!userProfile) {
      SHOW_LOGIN_MODAL({
        show: true,
        hasGuestCheckout: false,
        memberTag: "bigg_boss",
        type: "onlyMobile",
        analyticsData: {
          adobe: {
            common: {
              pageName: "web|bigg boss|",
              subSection: "bigg boss login",
              assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
            },
          },
        },
        onSuccess: () => {
          router.push("/bigg-boss/contestants");
        },
      });
    } else {
      router.push("/bigg-boss/contestants");
    }
  };

  useEffect(() => {
    if (currentReward) {
      const url = getGamificationRedirectionURL(JSON.stringify(currentReward));
      if (url.startsWith("/collection")) {
        router.push(url);
      } else if (currentReward?.showMiniPDP === "false") {
        router.push(`/product/${currentReward.slug}.html`);
      } else {
        setShowMiniPDPModal(true);
      }
    }
  }, [currentReward]);

  const claimAward = reward => {
    setCurrentReward(JSON.parse(reward.cta));
  };

  const getButtonName = status => {
    switch (status) {
      case 0:
        return t("bbLockedStatus") || "Locked";
      case 1:
        return t("bbClaimStatus") || "Claim";
      case 2:
        return t("bbRedeemedStatus") || "Redeemed";
      case 3:
        return t("bbExpiredStatus") || "Expired";
      default:
        return t("bbExpiredStatus") || "Expired";
    }
  };

  const getDaysLabel = (status, noOfDays) => {
    if (!noOfDays) return "";

    switch (status) {
      case 0:
        const msg =
          noOfDays > 1 ? t("unlockInDays") || "Unlock in {{days}} days" : t("unlockInDay") || "Unlock in {{days}} day";
        return msg.replace("{{days}}", noOfDays);
      case 1:
        const expMsg =
          noOfDays > 1 ? t("daysToExpire") || "{{days}} Days to Expire" : t("dayToExpire") || "{{days}} day to Expire";
        return expMsg.replace("{{days}}", noOfDays);
      case 2:
      case 3:
        return "";
      default:
        return "";
    }
  };

  const getWinner = () => {
    if (leaderBoardData?.length > 0) {
      return leaderBoardData?.sort((a, b) => a?.position - b?.position)[0];
    } else {
      return null;
    }
  };

  const winner = getWinner();

  return (
    <section
      className="bg-no-repeat w-full min-h-screen flex flex-col justify-between"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${t("imageUrls")?.bb13Background})`,
      }}
    >
      <BBHead />
      <div>
        <Header label={t("contestContestantListTitle") || "Bigg Boss Voting"} />
        <div className="flex flex-col justify-center items-center">
          {landingImageWidgetMeta?.landingImage && (
            <a href={landingImageWidgetMeta?.redirectURL || "/bigg-boss"} aria-label="bigg boss">
              <img src={landingImageWidgetMeta?.landingImage} className="w-full" loading="lazy" />
            </a>
          )}
          {t("isBigBossSeasonOver") && (
            <p className="text-white text-4xl font-bold leading-8	tracking-tighter">{t("winner") || "WINNER"}</p>
          )}
        </div>

        {t("isBigBossSeasonOver") && (
          <div className="mx-4">
            <div className="flex flex-col items-center justify-center">
              <img
                src={winner?.thumbnail}
                className="mx-2 mt-5 rounded-full border-2 border-rose-200 h-32 w-32"
                loading="lazy"
              />
              <p className="flex flex-row items-center justify-center text-white text-2xl font-bold tracking-wider mt-2">
                <Star className="w-3 h-3 mr-2" />
                {winner.firstName + " " + winner.lastName}
                <Star className="w-3 h-3 ml-2" />
              </p>
              <Link href="/bigg-boss/leaderboard">
                <button type="button" className="mt-2 underline text-white text-sm tracking-wide">
                  {t("viewLeaderboard") || "View Leaderboard "}
                </button>
              </Link>
            </div>
          </div>
        )}

        {userProfile && (
          <div className="mx-4">
            <div className="flex flex-row justify-between mt-8 mb-4">
              <p className="text-white font-bold text-xl tracking-wide">{t("contestRewardsTitle") || "Rewards"}</p>
              <Link href="/bigg-boss/rewards" legacyBehavior>
                <button
                  type="button"
                  style={{ backgroundColor: "#50A2D6" }}
                  className="text-white w-20 h-8 shadow-lg rounded-md text-xs	font-bold tracking-wide uppercase"
                >
                  {t("viewAll") || "VIEW ALL"}
                </button>
              </Link>
            </div>
            {rewardList?.map((reward, index) => {
              if (index > 2) return null;
              let status = -1;
              if (dumpRecords?.hasOwnProperty(reward.eventName)) {
                status = dumpRecords[reward.eventName]["status"];
              }
              return (
                <div
                  className="rounded-md bg-no-repeat bg-center flex justify-between items-center p-4 pl-3 text-left mt-1"
                  style={{
                    backgroundSize: "100% 100%",
                    backgroundImage: `url(${GAMIFICATION_DATA?.prizeBackgroundImg})`,
                  }}
                  key={index}
                >
                  <div className="w-2/3 flex flex-col justify-between">
                    <p className="font-semibold text-xxs uppercase h-2 tracking-wide">{t("week") || "WEEK"}</p>
                    <p className="text-4xl mb-1 font-semibold">{index + 1}</p>
                    <p className="font-semibold text-xs leading-relaxed uppercase tracking-wide">{reward.title}</p>
                    <p className="text-xs tracking-wide">{reward.subtitle}</p>
                  </div>
                  {status >= 0 && (
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-black text-xs font-normal text-center leading-relaxed tracking-wide uppercase pb-1">
                        {getDaysLabel(status, reward.noOfDays)}
                      </p>
                      <button
                        type="button"
                        style={{ opacity: "1" }}
                        className={`h-7 font-semibold tracking-widest text-xs uppercase w-20 rounded-sm ${
                          status === 1 ? "bg-black text-white" : "bg-white text-gray-500"
                        }`}
                        disabled={status !== 1}
                        onClick={() => claimAward(reward)}
                      >
                        {getButtonName(status)}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* WIDGETS */}
        {faqWidget ? (
          <div className="bigg-boss mb-8">
            <MyglammXOWidgets key={faqWidget.id} widget={faqWidget} />
          </div>
        ) : (
          <div className="pb-16"></div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          style={{ backgroundColor: "#50A2D6" }}
          className="text-white fixed bottom-4 w-11/12 h-12 shadow-lg rounded-md font-bold tracking-wide uppercase mt-4"
          onClick={() => voteNow()}
          disabled
        >
          {t("bbVoteNow") || "VOTE NOW"}
        </button>
      </div>
      {showMiniPDPModal && currentReward?.slug && (
        <MiniPDPModal
          show={showMiniPDPModal}
          hide={() => {
            setShowMiniPDPModal(false);
            setCurrentReward(null);
          }}
          productSlug={{
            slug: `/product/${currentReward.slug}.html`,
            couponCode: currentReward.discountCode,
            discountedPriceLabel: currentReward.discountedPriceLabel,
            ctaName: currentReward.ctaName,
          }}
          isSurvey={false}
        />
      )}
    </section>
  );
};

BigBoss.getLayout = (children: ReactElement) => children;

BigBoss.getInitialProps = async (ctx: any) => {
  const api = new BigBossAPI();
  const widgetApi = new WidgetAPI();

  try {
    const { data } = await api.getContestantsLeaderBoard();
    const { data: widgets } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-bigboss-landing-page" } });
    const { data: rewardList } = await api.getRewards();

    return {
      leaderBoard: data?.data?.data,
      widgets: widgets?.data?.data?.widget,
      rewardList: rewardList?.data,
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

export default BigBoss;
