import Header from "@components/BigBoss/Header";
import BigBossAPI from "@libAPI/apis/BigBossAPI";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import React, { ReactElement, useEffect, useState } from "react";
import GoldMedal from "../../../../../../libs/UX/public/svg/medal-gold.svg";
import SilverMedal from "../../../../../../libs/UX/public/svg/medal-silver.svg";
import BronzeMedal from "../../../../../../libs/UX/public/svg/medal-bronze.svg";
import { ADOBE } from "@libConstants/Analytics.constant";
import { isClient } from "@libUtils/isClient";
import Adobe from "@libUtils/analytics/adobe";
import BBHead from "@components/BigBoss/BBHead";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const Profile = ({ contestantDetail }) => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [showShare, setShowShare] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|profile|${contestantDetail?.slug}`,
        newPageName: "bigg boss profile",
        subSection: "bigg boss profile",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    if (!userProfile) return;
    const bbMessage = t("shareUtility")?.biggBossProfile?.shareMessage;
    if (bbMessage) {
      let updatedMsg = bbMessage
        .replaceAll("{contestantFirstName}", contestantDetail.firstName)
        .replaceAll("{contestantLastName}", contestantDetail.lastName)
        .replace("{contestantPosition}", contestantDetail.position)
        .replace("{contestantProfile}", GBC_ENV.NEXT_PUBLIC_BASE_URL + contestantDetail.slug);
      if (userProfile.referenceCode) {
        updatedMsg = updatedMsg.replace("{rc}", `${userProfile.referenceCode}`);
      } else {
        updatedMsg = updatedMsg.replace("{rc}", "");
      }
      setShareMessage(updatedMsg);
      setShowShare(true);
    }
  }, [userProfile]);

  const share = () => {
    const currentRoute = isClient() ? location.href : "/";

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|profile|${contestantDetail?.slug}|share`,
        newPageName: "bigg boss profile share",
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
        ctaName: "bigg boss profile share",
        newLinkPageName: "bigg boss profile share",
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
    <section className="min-h-screen">
      <BBHead />
      <Header
        label={t("contestContestantDetailTitle") || "Contestant Detail"}
        showShare={showShare}
        handleShare={() => share()}
      />
      {contestantDetail?.id && (
        <React.Fragment>
          <div className="flex flex-col justify-center items-center">
            {contestantDetail.thumbnail && (
              <img src={contestantDetail.thumbnail} className="w-36 h-36 rounded-full border-3 mt-8" loading="lazy" />
            )}
            <p className="text-black text-center text-3xl font-bold mt-2">
              {contestantDetail.firstName + " " + contestantDetail.lastName}
            </p>
            <div className="flex flex-row justify-center items-center bg-gray-200 px-1 mt-2 rounded-full">
              <div>
                {contestantDetail.position < 4 ? (
                  <div>
                    {contestantDetail.position === 1 ? (
                      <GoldMedal className="ml-auto w-6 h-6" />
                    ) : contestantDetail.position === 2 ? (
                      <SilverMedal className="ml-auto w-6 h-6" />
                    ) : contestantDetail.position === 3 ? (
                      <BronzeMedal className="ml-auto w-6 h-6" />
                    ) : null}
                  </div>
                ) : (
                  <div className="text-center rounded-full" style={{ backgroundColor: "#50A2D6" }}>
                    <p className="text-sm text-white font-bold w-6 h-6 pt-0.5">{contestantDetail.position}</p>
                  </div>
                )}
              </div>
              <div className="text-black-800 text-sm font-bold px-1 py-1">{t("position") || "POSITION"}</div>
            </div>
          </div>
          {contestantDetail.profile && (
            <div>
              <hr className="mt-10 text-gray-200" />
              {contestantDetail?.profile?.dob && (
                <>
                  <div className="flex flex-row justify-start items-center mx-5 mt-4">
                    <h2 className="font-bold text-lg w-2/5">{t("born") || "Born"}</h2>
                    <p className="w-3/5">{contestantDetail?.profile?.dob}</p>
                  </div>
                  <hr className="mt-6 text-gray-200" />{" "}
                </>
              )}
              {contestantDetail?.profile?.occupation && (
                <>
                  <div className="flex flex-row justify-start items-center mx-5 mt-4">
                    <h2 className="font-bold text-lg w-2/5">{t("occupation") || "Occupation"}</h2>
                    <p className="w-3/5">{contestantDetail?.profile?.occupation}</p>
                  </div>
                  <hr className="mt-6 text-gray-200" />
                </>
              )}
              {contestantDetail?.profile?.education && (
                <>
                  <div className="flex flex-row justify-start items-center mx-5 mt-4">
                    <h2 className="font-bold text-lg w-2/5">{t("education") || "Education"}</h2>
                    <p className="w-3/5">{contestantDetail?.profile?.education}</p>
                  </div>
                  <hr className="mt-6 text-gray-200" />
                </>
              )}
              {contestantDetail?.profile?.bio && (
                <div className="mx-5 mt-4">
                  <h2 className="font-bold text-lg">{t("bio") || "Bio"}</h2>
                  <p className="mt-5" dangerouslySetInnerHTML={{ __html: contestantDetail?.profile?.bio }} />
                </div>
              )}
            </div>
          )}
          {showShare && (
            <div className="text-center">
              <button
                type="button"
                style={{ backgroundColor: "#50A2D6" }}
                className="text-white w-11/12 h-12 shadow-lg rounded-md mb-8 font-bold tracking-wide uppercase mx-auto mt-10"
                onClick={() => share()}
              >
                {t("shareProfile") || "Share Profile"}
              </button>
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

Profile.getLayout = (children: ReactElement) => children;

Profile.getInitialProps = async (ctx: any) => {
  const api = new BigBossAPI();
  const { slug }: any = ctx.query;
  try {
    const { data } = await api.getContestantDetailBySlug(`/bigg-boss/profile/${slug}`);

    return {
      contestantDetail: data?.data?.data[0] || {},
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

export default Profile;
