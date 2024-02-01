import React, { useCallback, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";

import InfiniteScroll from "react-infinite-scroll-component";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import useTranslation from "@libHooks/useTranslation";

import { numFormatter } from "@libUtils/format/formatNumber";
import { showSuccess } from "@libUtils/showToaster";

import ContestApi from "@libAPI/apis/ContestAPI";

import { IContestData, IContestRelationalData } from "@typesLib/Contest";
import { ValtioStore } from "@typesLib/ValtioStore";

import { BASE_URL } from "@libConstants/COMMON.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { resetContestFeed, setContestFeed, setContestVote } from "@libStore/actions/contestActions";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

interface IContestEntryCard {
  entry: IContestData;
  contestData: IContestRelationalData;
  handleVoteClick: (id: string) => void;
  userVoted: boolean;
}

const ContestCard = ({ entry, contestData, handleVoteClick, userVoted }: IContestEntryCard) => {
  const router = useRouter();
  const createdAt = new Date(entry?.createdAt);

  const handleClick = useCallback(() => {
    if (typeof window !== undefined) {
      sessionStorage.setItem(SESSIONSTORAGE.CONTEST_SCROLL_POS_Y, window.scrollY.toString());
    }
  }, []);

  return (
    <div className="bg-white  backdrop-blur-md relative mb-6" key={entry?.id}>
      {entry?.videoLink?.includes("youtu") ? (
        <iframe
          width="100%"
          src={
            entry?.videoLink?.includes("watch?v=")
              ? entry?.videoLink?.replace("watch?v=", "embed/")
              : entry?.videoLink?.replace("youtu.be/", "youtube.com/embed/")
          }
          frameBorder="0"
          allow="autoplay;  encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${entry?.videoLink}`}
          className="h-80"
        />
      ) : entry?.image?.length ? (
        <span onClick={() => handleClick()}>
          <GoodGlammSlider slidesPerView={1} autoPlay dots="dots">
            {entry?.image?.map((elem: string) => {
              return (
                <Link href={`/contest/contest-entry/${entry?.id}`} passHref aria-label={entry?.participantsName}>
                  <ImageComponent
                    alt={entry?.participantsName}
                    className=" h-80 w-full"
                    style={{ objectFit: "contain" }}
                    src={elem}
                  />
                </Link>
              );
            })}
          </GoodGlammSlider>
        </span>
      ) : (
        <div className="h-80 w-full bg-white mx-auto text-center py-40">No Images Uploaded</div>
      )}

      <div className="px-2 flex justify-between my-4">
        <a
          href={`whatsapp://send?text=${encodeURIComponent(
            `${contestData?.socialShareMessage} ${BASE_URL()}${router.asPath}/${entry.id}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          <button className="bg-green-400 space-x-2 p-2.5 rounded-lg text-white uppercase font-semibold text-10 flex items-center">
            <ImageComponent
              alt="whatsapp"
              className="object-contain h-5"
              src="https://files.babychakra.com/site-images/original/icons8-whatsapp-144.png"
              width={20}
            />
            <span>Share on Whatsapp</span>
          </button>
        </a>
        <a
          href={`http://www.facebook.com/sharer.php?u=${BASE_URL()}${router.asPath}/${entry?.id}&quote=${encodeURIComponent(
            contestData?.socialShareMessage
          )}&caption=BabyChakra`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{ backgroundColor: "#365899" }}
            className="space-x-2 p-2 rounded-lg text-white uppercase font-semibold text-10 flex items-center"
          >
            <ImageComponent
              alt="facebook"
              className="object-contain h-6"
              src="https://files.babychakra.com/site-images/original/facebook-white.png"
              width={22}
            />
            <span>Share on Facebook</span>
          </button>
        </a>
      </div>

      <Link href={`/contest/contest-entry/${entry?.id}`} passHref aria-label={entry?.title}>
        <span onClick={() => handleClick()}>
          <p className="font-bold  text-blue-400 px-2 text-lg line-clamp-2 h-14"> {entry?.title}</p>
          <p
            className="line-clamp-3 text-slate-700 text-sm bg-white px-2 mt-2 mb-4 h-16"
            dangerouslySetInnerHTML={{ __html: entry?.description1 }}
          />
        </span>
      </Link>
      <div className=" flex justify-between my-2 border-y items-center">
        <Link href={`/contest/contest-entry/${entry?.id}`} passHref aria-label={entry?.participantsName}>
          <div className="flex space-x-1 items-center" onClick={() => handleClick()}>
            <ImageComponent
              alt="user"
              src="https://files.babychakra.com/site-images/original/default-gender-2.png"
              className="mx-2 rounded-full border"
              height={40}
              width={40}
            />
            <div className="flex flex-col">
              <p>By {entry?.participantsName}</p>
              <p className="text-gray-500 text-xs">
                {createdAt.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </Link>
        <div
          className="bg-color1 px-4 py-2"
          onClick={() => {
            if (!userVoted) handleVoteClick(entry?.id);
          }}
        >
          <div>
            <div className="flex space-x-2 items-center">
              <ImageComponent
                alt="heart logo"
                className="object-contain h-5"
                src="https://files.babychakra.com/site-images/original/image-2.png"
                width={20}
              />
              <p className="text-white font-semibold text-2xl"> {numFormatter(entry?.voteCount)}</p>
            </div>
            <p className="text-white text-base text-center">{userVoted ? "Voted" : "Votes"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IContestEntryCards {
  entries: {
    data: IContestData[];
    hasMore: boolean;
    count: number;
    filter: string;
    relationalData: {
      userVotedContestEntries: [];
    };
  };
  contestData: IContestRelationalData;
}

const ContestEntryCards = ({ entries, contestData }: IContestEntryCards) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sortCriteria, setSortCriteria] = useState<string>(entries.filter || "popularity");
  const [loginModal, setLoginModal] = useState(false);
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const handleVoteClick = useCallback(
    (entryId: string) => {
      if (userProfile?.id) {
        if (!contestData.voteEnabled || !contestData.statusId) return;
        const contestApi = new ContestApi();
        contestApi
          .voteContest(entryId)
          .then(res => {
            if (!res?.data?.data?.message?.includes("already voted")) {
              setContestVote(entryId);
            }
            showSuccess(res?.data.data.message);
          })
          .catch(err => console.error(err));
      } else {
        setLoginModal(true);
      }
    },
    [userProfile?.id]
  );

  const fetchMore = async () => {
    const contestApi = new ContestApi();
    const { data } = await contestApi.getContestEntries(
      10,
      entries?.data?.length,
      sortCriteria === "date" ? "createdAt desc" : "voteCount desc",
      router?.query?.slug as string
    );
    const updatedData = data.data;
    updatedData.hasMore = entries?.data?.length + updatedData?.data?.length < updatedData.count;
    setContestFeed(updatedData);
  };

  const handleSorting = async (type: string) => {
    const contestApi = new ContestApi();
    const { data } = await contestApi.getContestEntries(
      10,
      0,
      type === "date" ? "createdAt desc" : "voteCount desc",
      router?.query?.slug as string
    );
    const updatedData = data.data;
    updatedData.hasMore = updatedData?.data?.length < updatedData.count;
    updatedData.filter = type;
    resetContestFeed(updatedData);
    setSortCriteria(type);
  };

  return (
    <div className="">
      <div className="flex items-center mx-3 mb-4 bg-white p-3 space-x-3 rounded-sm">
        <p className="font-semibold">Sort By:</p>
        <button
          className={`${sortCriteria === "popularity" ? "text-color1 font-semibold" : ""}`}
          onClick={() => handleSorting("popularity")}
        >
          Popularity
        </button>
        <button
          className={`${sortCriteria === "date" ? "text-color1 font-semibold" : ""}`}
          onClick={() => handleSorting("date")}
        >
          Date Posted
        </button>
      </div>
      <div className="px-3">
        <InfiniteScroll
          dataLength={entries?.data?.length}
          next={fetchMore}
          hasMore={entries?.hasMore}
          loader={<LoadSpinner className="block mx-auto w-10 my-2" />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>{t("yayYouHaveSeenItAll")}</b>
            </p>
          }
        >
          {entries?.data?.map((entry: IContestData) => {
            if (entry.statusId === 1) {
              return (
                <ContestCard
                  entry={entry}
                  // @ts-ignore
                  userVoted={entries?.relationalData?.userVotedContestEntries?.includes(entry?.id)}
                  contestData={contestData}
                  key={entry.id}
                  handleVoteClick={handleVoteClick}
                />
              );
            }
            return null;
          })}
        </InfiniteScroll>
      </div>
      <LoginModal show={loginModal} onRequestClose={() => setLoginModal(false)} hasGuestCheckout={false} />
    </div>
  );
};

export default ContestEntryCards;
