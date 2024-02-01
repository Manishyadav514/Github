import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import parse from "html-react-parser";

import { useSelector } from "@libHooks/useValtioSelector";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import ErrorComponent from "@libPages/_error";

import { showSuccess } from "@libUtils/showToaster";
import { numFormatter } from "@libUtils/format/formatNumber";

import ContestApi from "@libAPI/apis/ContestAPI";

import { BASE_URL, DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { setContestVote } from "@libStore/actions/contestActions";

import { ValtioStore } from "@typesLib/ValtioStore";
import { CONTEST_REDUCER } from "@libStore/valtio/REDUX.store";
import BBCBlogHTMLCss from "@libComponents/CommonBBC/BBCBlogHTMLCss";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const ContestEntryDetail = ({ entries, isError }: any) => {
  const router = useRouter();
  const [contestEntry, setContestEntry] = useState(entries?.data?.[0]);
  const [contestData, setContestData] = useState(entries?.relationalData?.contest?.[contestEntry?.contestId]);
  const [loginModal, setLoginModal] = useState(false);
  const createdAt = new Date(contestEntry?.createdAt);
  const [userVoted, setUserVoted] = useState(false);
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: contestData?.contestName,
        item: `${BASE_URL()}/${contestData?.contestUrl}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Contest Entry",
        item: `${BASE_URL()}/${contestData?.contestUrl}/entries`,
      },
    ],
  };

  const handleVoteClick = useCallback(
    (entryId: string) => {
      if (userProfile?.id) {
        const contestApi = new ContestApi();
        contestApi
          .voteContest(entryId)
          .then(res => {
            if (!res.data.data.message.includes("already voted")) {
              const updatedData = contestEntry;
              updatedData.voteCount = (updatedData.voteCount || 0) + 1;
              setContestEntry(updatedData);
              setContestVote(entryId);
            }
            showSuccess(res?.data.data.message);
            setUserVoted(true);
          })
          .catch(err => console.error(err));
      } else {
        setLoginModal(true);
      }
    },
    [userProfile?.id]
  );

  const getContest = async () => {
    const contestApi = new ContestApi();
    try {
      const { data } = await contestApi.getContestEntryById(router?.query?.id as string);
      if (data.data) {
        setContestEntry(data?.data?.data[0]);
        setContestData(data.data.relationalData.contest[contestEntry?.contestId]);
        if (data.data.relationalData.userVotedContestEntries.length) setUserVoted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      getContest();
    }
  }, [userProfile?.id]);

  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }
  return (
    <main>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <title>{contestData?.contestName}</title>
        <meta name="title" key="title" content={`${contestData?.contestName}| Contest Entry By ${contestEntry?.name} `} />
        <meta name="description" key="description" content={`${contestData?.contestName} | Contest Entry `} />
        <meta property="og:description" key="og:description" content={`${contestData?.contestName} | Contest Entry `} />
        <meta
          property="og:title"
          key="og:title"
          content={`${contestData?.contestName}|  Contest Entry By ${contestEntry?.name} `}
        />
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/contest-entry/${contestEntry?.contestId}`}
        />
      </Head>
      <div className="flex px-3 w-full pb-2 pt-4">
        <div className="flex text-xs items-center w-11/12 truncate" role="list">
          <Link href="/" role="listitem" aria-label="home">
            <span>HOME</span>
          </Link>
          &nbsp;/&nbsp;
          <Link href={`/contest/${contestData?.contestUrl}`} role="listitem" aria-label={contestData?.contestName}>
            <span className="uppercase truncate">{contestData?.contestName}</span>
          </Link>
          &nbsp;/&nbsp;
          <Link href={`/contest/${contestData?.contestUrl}/entries`} role="listitem" aria-label="entry">
            <span className="uppercase">Entry</span>
          </Link>
        </div>
      </div>
      <div className="p-3 bg-white ">
        <p className="font-semibold text-lg">{contestData?.contestName}</p>
      </div>

      {contestEntry?.statusId === 1 ? (
        <div>
          <div>
            <div className="bg-white  backdrop-blur-md relative mb-6">
              <GoodGlammSlider slidesPerView={1} autoPlay dots="dots">
                {contestEntry?.image?.map((elem: string) => {
                  return (
                    <ImageComponent
                      alt={contestEntry?.name}
                      className=" h-80 w-full"
                      style={{ objectFit: "contain" }}
                      src={elem || DEFAULT_IMG_PATH()}
                    />
                  );
                })}
              </GoodGlammSlider>
              <p className="px-3 font-bold  text-lg">{contestEntry?.title}</p>
              <p
                className="text-slate-700 bg-white px-3 mt-2 mb-4"
                dangerouslySetInnerHTML={{ __html: contestEntry?.description1 as string }}
              />
              <p className="text-color1 text-xl font-bold px-3">{numFormatter(contestEntry?.voteCount)} Votes</p>
              {contestEntry?.videoLink ? (
                <>
                  <p className="px-3 mt-4 text-color1">{contestEntry?.videoLink}</p>
                  {contestEntry?.videoLink?.includes("youtu") ? (
                    <div className="p-3">
                      <iframe
                        width="100%"
                        src={
                          contestEntry?.videoLink?.includes("watch?v=")
                            ? contestEntry?.videoLink?.replace("watch?v=", "embed/")
                            : contestEntry?.videoLink?.replace("youtu.be/", "youtube.com/embed/")
                        }
                        frameBorder="0"
                        allow="autoplay;  encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${contestEntry?.videoLink}`}
                        className="h-72"
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
              <div className=" my-2 border-y p-3 ">
                <div className="flex space-x-1 items-center ">
                  <ImageComponent
                    alt="user"
                    src="https://files.babychakra.com/site-images/original/default-gender-2.png"
                    className="mx-2 rounded-full border"
                    height={40}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p>{contestEntry?.name || contestEntry?.participantsName}</p>
                    <p className="text-gray-500 text-xs">
                      {createdAt?.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className=" flex justify-between my-4">
                  <a
                    href={`whatsapp://send?text=${encodeURIComponent(
                      `${contestData?.socialShareMessage} ${BASE_URL()}${router.asPath}`
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
                    href={`http://www.facebook.com/sharer.php?u=${BASE_URL()}${router.asPath}&quote=${encodeURIComponent(
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
                        src="https://files.babychakra.com/site-images/original/facebook-white_1.png"
                        width={22}
                      />
                      <span>Share on Facebook</span>
                    </button>
                  </a>
                </div>
                <div className="">
                  {contestData?.voteEnabled && contestData?.statusId ? (
                    <div className="text-center my-4">
                      {userVoted ? (
                        <button
                          className="bg-white border border-color1 text-color1 font-bold w-full p-2 rounded-md mx-auto"
                          onClick={() => showSuccess("Already Voted")}
                        >
                          VOTED
                        </button>
                      ) : (
                        <button
                          className="bg-color1 text-white font-bold w-full p-2 rounded-md mx-auto"
                          onClick={() => handleVoteClick(contestEntry?.id)}
                        >
                          VOTE NOW
                        </button>
                      )}
                    </div>
                  ) : null}
                  <Link href={`/contest/${contestData?.contestUrl}/entries`} aria-label="Show all entries">
                    <span className="text-center  ">
                      <p className="bg-gray-200 p-2  text-base w-full mx-auto rounded-md text-gray-600">Show all entries</p>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 bg-white p-2 px-3">
            <img
              src={contestData?.bannerImage}
              alt={contestData?.contestName}
              loading="lazy"
              title={contestData?.contestName}
              className="mx-auto"
            />
            <p className="font-semibold py-2 text-lg">{contestData?.contestName}</p>
            <BBCBlogHTMLCss staticHtml={parse(contestData?.contestDescription)} />
          </div>
        </div>
      ) : (
        <div className="bg-white text-center font-semibold h-1/2 py-40">Oops loops like the entry has been removed</div>
      )}
      <LoginModal show={loginModal} onRequestClose={() => setLoginModal(false)} hasGuestCheckout={false} />
    </main>
  );
};

ContestEntryDetail.getInitialProps = async (ctx: any) => {
  const contestApi = new ContestApi();
  try {
    const { data } = await contestApi.getContestEntryById(ctx?.query?.id);
    if (data?.data) {
      return {
        entries: data?.data,
      };
    }
    return { isError: true };
  } catch (error: any) {
    return { currentContest: null, isError: true };
  }
};

export default ContestEntryDetail;
