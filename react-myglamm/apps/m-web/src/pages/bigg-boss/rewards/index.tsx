import BigBossAPI from "@libAPI/apis/BigBossAPI";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { GamificationConfig } from "@typesLib/Gamification";
import Header from "@components/BigBoss/Header";
import MiniPDPModal from "@libComponents/PopupModal/MiniPDPModal";
import { useRouter } from "next/router";
import { getGamificationRedirectionURL } from "@libComponents/Gamification/getGamificationRedirection";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { ADOBE } from "@libConstants/Analytics.constant";
import { isClient } from "@libUtils/isClient";
import Adobe from "@libUtils/analytics/adobe";
import BBHead from "@components/BigBoss/BBHead";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";

const Reward = ({ rewardList }: { rewardList: any[] }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [currentReward, setCurrentReward] = useState<any>();
  const [vote, setVote] = useState(null);
  const [dumpRecords, setDumpRecords] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userProfile) {
        const api = new BigBossAPI();
        const { data: voteData } = await api.isYourVote();
        if (voteData?.data?.count > 0) {
          setVote(voteData?.data?.count);
          const { data: dump } = await api.getRewardsDump(userProfile.id);
          setDumpRecords(dump?.data[0]?.value?.rewards);
        } else {
          router.push("/bigg-boss");
        }
      } else {
        router.push("/bigg-boss");
      }
    };

    fetchData().catch(e => {});
  }, []);

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|rewards`,
        newPageName: "bigg boss rewards",
        subSection: "bigg boss rewards",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    const currentRoute = isClient() ? location.href : "/";
    (window as any).digitalData = {
      common: {
        linkName: currentRoute,
        linkPageName: "bigg boss claim reward",
        ctaName: "Bigg Boss Claim Reward",
        newLinkPageName: "bigg boss rewards",
        subSection: "bigg boss rewards",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

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

  if (!vote) {
    return (
      <Fragment>
        <BBHead />
        <LoadSpinner className="absolute m-auto inset-0 w-8" />
      </Fragment>
    );
  }

  return (
    <section
      className="bg-no-repeat w-full min-h-screen flex flex-col justify-start items-center"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${t("imageUrls")?.bb13Background})`,
      }}
    >
      <BBHead />
      <Header label={t("rewards") || "Rewards"} />
      <div className="px-3 py-3 text-center w-full">
        {vote &&
          rewardList?.map((reward, index) => {
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

Reward.getLayout = (children: ReactElement) => children;

Reward.getInitialProps = async (ctx: any) => {
  const api = new BigBossAPI();

  try {
    const { data } = await api.getRewards();

    return {
      rewardList: data?.data,
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

export default Reward;
