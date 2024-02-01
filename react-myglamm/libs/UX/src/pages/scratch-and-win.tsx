import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { useSelector } from "@libHooks/useValtioSelector";
import InfiniteScroll from "react-infinite-scroll-component";

import ScratchCardAPI from "@libAPI/apis/ScratchCardAPI";

import useTranslation from "@libHooks/useTranslation";

import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ScratchCardText from "@libComponents/ScratchCard/ScratchCardText";
import ActiveScratchCard from "@libComponents/ScratchCard/ActiveScratchCard";
import EmptyScratchCardList from "@libComponents/ScratchCard/Listing/EmptyScratchCardList";

import CustomLayout from "@libLayouts/CustomLayout";

import { ValtioStore } from "@typesLib/ValtioStore";

import OfferIcon from "../../public/svg/offersIcon.svg";
import dynamic from "next/dynamic";

const ScratchCardModal = dynamic(
  () => import(/* webpackChunkName: "ScratchCardModal" */ "@libComponents/ScratchCard/ScratchCardModal"),
  { ssr: false }
);

const ScratchCardsList = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const scratchCardAPI = new ScratchCardAPI();

  const memberId = typeof window !== "undefined" && localStorage.getItem("memberId");
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const [scratchCards, setScratchCards] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showScratchCardModal, setShowScratchCardModal] = useState<boolean | undefined>();
  const [scratchCardData, setScratchCardData] = useState<any>({});
  const [scratchIndex, setScratchIndex] = useState<any>();

  const scratchCardStatus: any = {
    0: {
      status: "locked",
      src: t("scratchAndWin")?.lockedCard || "https://files.myglamm.com/site-images/original/locked.png",
    },

    1: {
      status: "unscratched",
      src: t("scratchAndWin")?.unScratchedImage || "https://files.myglamm.com/site-images/original/locked.png",
    },

    2: {
      status: "active",
      src:
        t("scratchAndWin")?.scratchCardScratchedBG ||
        "https://files.myglamm.com/site-images/original/scratchedBackground_1.png",
    },
    3: {
      status: "expired",
      src: t("scratchAndWin")?.expiredScratchCardImage || "https://files.myglamm.com/site-images/original/expired.png",
    },
    4: {
      status: "redeemed",
      src: t("scratchAndWin").redeemedScratchCardImage || "https://files.myglamm.com/site-images/original/redeemed.png",
    },
  };

  useEffect(() => {
    if (!profile && !localStorage.getItem("memberId") && router.push) {
      router.push("/login");
    } else {
      getScratchCardlist();
    }
  }, []);

  const getScratchCardlist = () => {
    if (memberId) {
      scratchCardAPI
        .getScratchCards(memberId)
        .then(({ data: res }) => {
          if (res.data.data) {
            setScratchCards(res.data.data);
          } else {
            setScratchCards(undefined);
          }
        })
        .catch(() => setScratchCards([]));
    }
  };

  const fetchMore = () => {
    if (memberId) {
      scratchCardAPI.getScratchCards(memberId, 10, scratchCards.length).then(({ data: res }) => {
        if (res.data.data.length) {
          setScratchCards([...scratchCards, ...res.data.data]);

          setScratchCards([...scratchCards, ...res.data.data]);
        } else {
          setHasMore(false);
        }
      });
    }
  };

  const getScratchCardData = (data: any, index: number) => {
    setScratchCardData(data);
    setShowScratchCardModal(true);
    setScratchIndex(index);
  };

  return (
    <div className="bg-white py-4 mt-1 min-h-screen">
      <Head>
        <title key="title">{t("scratchAndWin")?.scratchAndWinText || "Scratch & Win"}</title>
      </Head>
      {profile && (
        <>
          <ImageComponent
            src={
              t("scratchAndWin")?.scratchAndWinImage ||
              "https://files.myglamm.com/site-images/original/scratch-win-banner@2x.png"
            }
            alt="scratch banner"
            className="mb-2"
          />
          {scratchCards && scratchCards?.length > 0 && (
            <div className="">
              <InfiniteScroll
                dataLength={scratchCards.length || 0}
                next={fetchMore}
                hasMore={hasMore}
                loader
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>{t("yayYouHaveSeenItAll")}</b>
                  </p>
                }
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-3 p-4">
                  {scratchCards?.map((data: any, key: number) => {
                    switch (data.statusId) {
                      case SCRATCHCARD_STATUS.LOCKED_CARD:
                      case SCRATCHCARD_STATUS.UNSCRATCHED_CARD: {
                        return (
                          <div
                            key={data.id}
                            aria-hidden
                            className="bg-white relative"
                            onClick={() => getScratchCardData(data, key)}
                            style={{ minHeight: "200px" }}
                          >
                            <img src={scratchCardStatus[data.statusId]?.src} alt="scratch-card" className="w-full" />
                            <ScratchCardText scratchCardData={data} />
                          </div>
                        );
                      }

                      case SCRATCHCARD_STATUS.ACTIVE_CARD: {
                        return (
                          <ActiveScratchCard
                            data={data}
                            getScratchCardData={getScratchCardData}
                            index={key}
                            pageName="Listing Page"
                            key={data.id}
                          />
                        );
                      }
                      case SCRATCHCARD_STATUS.EXPIRED_CARD:
                      case SCRATCHCARD_STATUS.REDEEMED_CARD: {
                        return (
                          <div className="bg-white relative" key={data.id}>
                            <img src={scratchCardStatus[data.statusId]?.src} alt="scratch-card" className="w-full" />
                          </div>
                        );
                      }
                      default: {
                        return null;
                      }
                    }
                  })}
                </div>
              </InfiniteScroll>
            </div>
          )}
          {scratchCards?.length === 0 && <EmptyScratchCardList t={t} />}
        </>
      )}
      {showScratchCardModal && (
        <ScratchCardModal
          show={showScratchCardModal}
          onRequestClose={() => {
            setShowScratchCardModal(false);
          }}
          scratchCardData={scratchCardData}
          scratchIndex={scratchIndex}
          setScratchCards={setScratchCards}
          scratchCards={scratchCards}
          pageName="Listing Page"
        />
      )}
    </div>
  );
};

export default ScratchCardsList;

ScratchCardsList.getLayout = (page: ReactElement) => (
  <CustomLayout
    fallback={
      <p className="flex items-center">
        Scratch &amp; Win <OfferIcon className="ml-2" />
      </p>
    }
  >
    {page}
  </CustomLayout>
);
