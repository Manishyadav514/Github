import React, { useEffect, useState, ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import format from "date-fns/format";
import { useSelector } from "@libHooks/useValtioSelector";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import GamificationAPI from "@libAPI/apis/GamificationAPI";

import useTranslation from "@libHooks/useTranslation";

import Layout from "@libLayouts/Layout";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { ValtioStore } from "@typesLib/ValtioStore";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { GAMIFICATION_URL, SURVEY_URL } from "@libConstants/SURVEY.constant";

import { FriendClaimed, GamificationConfig, ReferralData } from "@typesLib/Gamification";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const DATEFORMAT = "do MMMM yyyy";

const TrackMyRewards = () => {
  const router = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [referralData, setReferralData] = useState<ReferralData>();
  const [friendsClaimed, setFriendsClaimed] = useState<FriendClaimed[]>([]);

  const [showTab, setShowTab] = useState(1);

  const { t } = useTranslation();

  const handleShareNEarn = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: `${BASE_URL()}${SURVEY_URL}`,
      slug: SURVEY_URL,
      module: "page",
    };
  };

  useEffect(() => {
    const { memberId } = checkUserLoginStatus() || {};

    if (memberId) {
      const consumerApi = new ConsumerAPI();
      const gamificationApi = new GamificationAPI();

      consumerApi.getConsumerDashBoard(memberId, true).then(({ data: data }) => setReferralData(data?.data));
      gamificationApi.getFriendsClaimedGamification().then(({ data: data }) => setFriendsClaimed(data?.data?.data));
    } else {
      router.replace(GAMIFICATION_URL);
    }
  }, []);

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  if (referralData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-color2 to-white">
        <Head>
          <title>Track - MyRewards</title>
        </Head>

        <div className="px-6 pt-4 pb-2">
          <p className="font-semibold text-4xl mb-1">{referralData?.purchased}</p>
          <p className="font-semibold">{GAMIFICATION_DATA?.trackHeaderText}</p>
        </div>

        <div className="m-2 p-2 rounded-lg shadow bg-white mb-5">
          <div className="flex justify-around pb-3 pt-2 ">
            <button
              type="button"
              onClick={() => setShowTab(1)}
              className={`flex w-1/2 justify-center outline-none capitalize font-semibold text-sm items-center text-center pb-3 border-b-3 ${
                showTab === 1 ? "border-color1" : "border-themeGray opacity-50"
              }`}
            >
              {GAMIFICATION_DATA?.friendsNotYetClaimed}
            </button>
            <button
              type="button"
              onClick={() => setShowTab(2)}
              className={`flex w-1/2 justify-center text-sm items-center text-center pb-3 border-b-3 outline-none capitalize font-semibold ${
                showTab === 2 ? "border-color1" : "border-themeGray opacity-50"
              }`}
            >
              {GAMIFICATION_DATA?.friendsClaimed}
            </button>
          </div>

          {showTab === 1 && (
            <div>
              {referralData?.onlyRegisteredConsumers.map((refer: any) => (
                <div className="w-full py-2 px-3 flex relative items-center">
                  <div className="w-3/4 relative">
                    <h4 className="font-semibold text-sm mb-2">
                      {refer.firstName} {refer.lastName}
                    </h4>
                    <div className="flex mb-4 items-center">
                      <span
                        className="w-4 h-4 mr-2"
                        style={{
                          background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 3px 1px no-repeat",
                        }}
                      />
                      <span className="text-xs font-semibold opacity-50 text-xxs">
                        {t("registeredOn")} {refer.createdAt && format(new Date(refer.createdAt), DATEFORMAT)}
                      </span>
                    </div>
                    <div
                      style={{ left: "8px", top: "40px" }}
                      className="h-6 border-l border-gray-400 border-dashed absolute top-0"
                    />
                    <div className="flex items-center">
                      <span className="border border-color1 ml-1 mr-2 h-2 w-2 rounded-full relative">
                        <strong className="m-auto absolute bg-color1 inset-0 h-1 w-1" />
                      </span>
                      <span className="text-xs opacity-50">{t("purchasePending")}</span>
                    </div>
                  </div>

                  <a
                    className="uppercase text-sm font-semibold text-color1 w-1/4 text-right flex items-center h-6 pl-5"
                    style={{
                      background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 0px -86px no-repeat",
                    }}
                    href={`https://api.whatsapp.com/send?phone=+91${
                      refer.phoneNumber || refer.mobileNumber || ""
                    }&text=${encodeURI(
                      t("shareUtility")?.gamification.shareMessage?.replace(
                        "{shareUrl}",
                        `${BASE_URL()}${SURVEY_URL}?rc${userProfile?.referenceCode}`
                      )
                    )}`}
                    aria-label={t("remind")}
                  >
                    {t("remind")}
                  </a>
                </div>
              ))}
            </div>
          )}

          {showTab === 2 &&
            friendsClaimed?.map(friend => (
              <div className="w-full pb-2 mb-2 px-3 relative border-b border-themeGray" key={friend.createdAt}>
                <h4 className="font-semibold text-sm mb-1">
                  {friend.firstName}&nbsp;{friend.lastName}
                </h4>

                <p className="flex items-center pb-2">
                  <span
                    className="w-4 h-4 mr-1"
                    style={{
                      background: "url(https://files.myglamm.com/site-images/original/refer-sprite.png) 0 -60px no-repeat",
                    }}
                  />
                  <span className="text-xxs">
                    {t("puchaseOn")} <strong>{format(new Date(friend.createdAt.split("T")[0]), DATEFORMAT)}</strong>
                  </span>
                </p>
              </div>
            ))}
        </div>

        <div className="p-2">
          <button
            type="button"
            onClick={handleShareNEarn}
            className="uppercase bg-ctaImg text-white p-3 w-full text-sm rounded"
          >
            {t("inviteFriends")}
          </button>
        </div>
      </div>
    );
  }

  return <LoadSpinner className="h-screen inset-0 m-auto w-16" />;
};

TrackMyRewards.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default TrackMyRewards;
