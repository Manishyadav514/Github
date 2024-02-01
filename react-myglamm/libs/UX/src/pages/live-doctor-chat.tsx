import React from "react";
import { format } from "date-fns";
import Head from "next/head";
import Link from "next/link";

import PrimaryBtn from "@libComponents/CommonBBC/PrimaryBtn";

import BBCCommunityAPI from "@libAPI/apis/BBCCommunityAPI";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import { DEFAULT_IMG_PATH, IS_DESKTOP } from "@libConstants/COMMON.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LiveVideoModal = ({ activeTopicId, onLiveVideoClick, topics, loadTopics }: any) => {
  React.useEffect(() => {
    if (topics?.data?.length) {
      const id = `topics_${topics.data.length - 1}`;
      const elem: HTMLElement | null = document.getElementById(id);
      if (elem) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              loadTopics();
              observer.unobserve(elem);
            }
          },
          {
            rootMargin: "0px",
          }
        );

        if (elem) {
          observer.observe(elem);
        }

        return () => {
          observer.unobserve(elem);
        };
      }
    }
    return () => {
      // no-op
    };
  }, [topics]);

  return (
    <div className="bg-white py-5 px-3">
      <h2 className="text-center mb-2 font-bold">Filter by Topics</h2>
      <div className="flex flex-wrap  items-center h-[300px] overflow-auto">
        <button
          className={` text-grey4 text-sm font-normal border-solid border px-2 py-1 m-1.5 cursor-pointer rounded-sm ${
            activeTopicId === "" ? "border-color1 bg-color1 text-white" : "border-color2 bg-white"
          }`}
          onClick={() => onLiveVideoClick("")}
        >
          All
        </button>
        {topics?.data?.map((topic: any, topicIndex: number) => {
          return (
            <button
              key={topic.id}
              id={`topics_${topicIndex}`}
              className={` text-grey4 text-sm font-normal border-solid border px-2 py-1 m-1.5 cursor-pointer rounded-sm ${
                activeTopicId === topic.id ? "border-color1 bg-color1 text-white" : "border-color2 bg-white"
              }`}
              onClick={() => onLiveVideoClick(topic.id)}
            >
              {topic.topicName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
const UpcomingLiveVideoCard = ({ post }: any) => {
  const startDate = new Date(post.liveVideo.startTime);
  const endDate = new Date(post.liveVideo.endTime);

  return (
    <div className="pr-4">
      <Link href={`/community/posts/${post.slug}`} legacyBehavior aria-label={post?.title || post.text}>
        <div className="rounded border-gray-200 border-solid border ">
          <div className="relative">
            <img
              width="100%"
              src={post?.meta?.youtube?.thumbnailUrl || post?.meta?.youtube?.thumbnailURL}
              className="image carousel video-thumbnail"
              alt=""
            />
          </div>
          <div className="p-3">
            <div className="line-clamp-2 h-[40px]">{post?.title || post.text}</div>
            <div className="mt-2 mb-1 flex">
              <img src="https://files.babychakra.com/site-images/original/icons8-calendar-32.png" alt="lazyload" />
              <span className="text-zinc-500">{format(new Date(startDate), "dd MMM yyyy")}</span>
            </div>
            <div className="date flex mb-5">
              <img src="https://files.babychakra.com/site-images/original/icons8-alarm-clock-52.png" alt="lazyload" />
              <span className="text-zinc-500">
                {format(new Date(startDate), "hh:mm aaaaa'm'")} - {format(new Date(endDate), "hh:mm aaaaa'm'")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CurrentLiveVideoCard = ({ post }: any) => {
  let imgUrl = DEFAULT_IMG_PATH();
  if (post?.meta?.youtube?.thumbnailUrl || post?.meta?.youtube?.thumbnailURL) {
    imgUrl = post?.meta?.youtube?.thumbnailUrl || post?.meta?.youtube?.thumbnailURL;
  } else if (post?.media?.[0]?.type === "image") {
    imgUrl = post?.media?.[0]?.url;
  }
  return (
    <div className="pr-4">
      <Link href={`/community/posts/${post.slug}`} legacyBehavior aria-label={post?.title || post.text}>
        <div className="rounded border-gray-200 border-solid border ">
          <div className="relative">
            <img
              width="100%"
              src={imgUrl}
              className="image carousel video-thumbnail"
              alt=""
              style={{
                height: "167px",
              }}
            />
          </div>
          <div className="p-3">
            <div className="line-clamp-2 h-[40px]">{post?.title || post.text}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PastLiveVideoCard = ({ post }: any) => {
  let imgUrl = DEFAULT_IMG_PATH();
  if (post?.meta?.youtube?.thumbnailUrl || post?.meta?.youtube?.thumbnailURL) {
    imgUrl = post?.meta?.youtube?.thumbnailUrl || post?.meta?.youtube?.thumbnailURL;
  } else if (post?.media?.[0]?.type === "image") {
    imgUrl = post?.media?.[0]?.url;
  }
  return (
    <div className="pr-4">
      <Link href={`/community/posts/${post.slug}`} legacyBehavior aria-label={post?.title || post.text}>
        <div className="rounded border-gray-200 border-solid border ">
          <a href={`https://www.youtube.com/watch?v=${post?.meta?.youtube?.videoId}`} target="_blank">
            <div className="relative">
              <img
                width="100%"
                src={imgUrl}
                className="image carousel video-thumbnail"
                alt=""
                style={{
                  height: "167px",
                }}
              />

              <img
                src="https://files.babychakra.com/site-images/original/video-play.png"
                alt=""
                className=" w-[40px] h-[40px] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
              />
            </div>
          </a>
          <div className="p-3">
            <div className="line-clamp-2 h-[40px]">{post?.title || post.text}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};
const LiveDoctorChat = ({ pastLiveVideos, upcomingLiveVideos, currentVideos }: any) => {
  const [showLiveVideoModal, setShowLiveVideos] = React.useState(false);
  const [pastLiveVideosState, setPastLiveVideosState] = React.useState(pastLiveVideos);
  const [activeTopicId, setActiveTopicId] = React.useState("");
  const [topics, dispatchTopics] = React.useReducer(
    (
      state: {
        data: any[];
        skip: number;
        limit: number;
      },
      action: {
        data: any[];
        skip: number;
        limit: number;
      }
    ) => {
      const returnData = {
        data: [...state.data, ...action.data],
        skip: action.skip,
        limit: action.limit,
      };
      return returnData;
    },
    {
      data: [],
      skip: 0,
      limit: 8,
    }
  );
  const getPastLiveVideos = async (selectedTopicId = "") => {
    try {
      const bbcCommunityAPI = new BBCCommunityAPI();
      const response = await bbcCommunityAPI.getPastLiveVideos(selectedTopicId);
      setPastLiveVideosState(response.data.data.data || []);
    } catch (err) {
      console.error("error ", err);
      setPastLiveVideosState([]);
    }
  };

  const loadTopics = async () => {
    try {
      const bbcCommunityAPI = new BBCCommunityAPI();
      const res: any = await bbcCommunityAPI.fetchTopics(topics.limit, topics.skip);
      if (res?.data?.status && res?.data?.data?.data?.length) {
        dispatchTopics({
          data: res?.data?.data?.data || [],
          limit: topics.limit,
          skip: topics.skip + 8,
        });
      }
    } catch (error: any) {
      if (error?.error?.code) {
        console.log("Error code ", error?.error?.code);
      }
      if (error?.error?.message) {
        console.log("Error Messsage ", error?.error?.message);
      }
    }
  };

  const onLiveVideoClick = (selectedTopicId: any) => {
    setActiveTopicId(selectedTopicId);
    setShowLiveVideos(false);
    getPastLiveVideos(selectedTopicId);
  };

  React.useEffect(() => {
    loadTopics();
  }, []);

  return (
    <>
      <Head>
        <title>Live Doctor Video Q&A with Chat Online for Free - Babychakra</title>
        <meta name="title" key="title" content="Live Doctor Video Q&A with Chat Online for Free - Babychakra" />
        <meta
          name="description"
          key="description"
          content="Free Live doctor video Q&A & Chat online with verified specialists only on Babychakra. Doctors host a webinar with a live chat session to address your concerns"
        />
        <meta
          name="keywords"
          key="keywords"
          content="Live Doctor Video & Chat,Pregnancy help, verified specialists, best pregnancy websites, BabyChakra, India"
        />
        <link rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}/live-doctor-chat`} />
      </Head>
      <div className="bg-white">
        <div className={IS_DESKTOP ? "w-9/12 mx-auto" : ""}>
          {currentVideos?.length ? (
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="mb-2 font-bold text-base">Streaming Now</h3>
              </div>
              <GoodGlammSlider slidesPerView={IS_DESKTOP ? 3.5 : 1.4} dots="dots">
                {currentVideos?.map((post: any) => (
                  <CurrentLiveVideoCard post={post} />
                ))}
              </GoodGlammSlider>
            </div>
          ) : null}

          {upcomingLiveVideos?.length ? (
            <div className="p-3">
              <h3 className="mb-2 font-bold text-base">Upcoming Live Chats</h3>
              <GoodGlammSlider slidesPerView={IS_DESKTOP ? 3.5 : 1.4} dots="dots">
                {upcomingLiveVideos?.map((post: any) => (
                  <UpcomingLiveVideoCard post={post} />
                ))}
              </GoodGlammSlider>
            </div>
          ) : null}

          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="mb-2 font-bold text-base">Past Videos</h3>
              <PrimaryBtn
                buttonName="Filter"
                buttonOnClick={() => {
                  setShowLiveVideos(true);
                }}
              />
            </div>
            <GoodGlammSlider slidesPerView={IS_DESKTOP ? 3.5 : 1.4} dots="dots">
              {pastLiveVideosState?.length ? (
                pastLiveVideosState?.map((post: any) => <PastLiveVideoCard post={post} />)
              ) : (
                <h3 className="text-base">No videos available</h3>
              )}
            </GoodGlammSlider>
          </div>
        </div>

        <PopupModal show={showLiveVideoModal} onRequestClose={() => setShowLiveVideos(false)}>
          <LiveVideoModal
            activeTopicId={activeTopicId}
            onLiveVideoClick={onLiveVideoClick}
            topics={topics}
            loadTopics={loadTopics}
          />
        </PopupModal>
      </div>
    </>
  );
};

LiveDoctorChat.getInitialProps = async (ctx: any) => {
  try {
    const bbcCommunityAPI = new BBCCommunityAPI();
    const promises = [
      bbcCommunityAPI.getPastLiveVideos(""),
      bbcCommunityAPI.getUpcomingLiveVideos(),
      bbcCommunityAPI.getCurrentLiveVideos(),
    ];
    let pastLiveVideos = [];
    let upcomingLiveVideos = [];
    let currentVideos = [];

    const results = await Promise.allSettled(promises);

    if (results[0].status === "fulfilled") {
      pastLiveVideos = results?.[0]?.value?.data?.data.data;
    }
    if (results[1].status === "fulfilled") {
      upcomingLiveVideos = results?.[1]?.value?.data?.data.data;
    }
    if (results[2].status === "fulfilled") {
      currentVideos = results?.[2]?.value?.data?.data.data;
    }
    return {
      pastLiveVideos,
      upcomingLiveVideos,
      currentVideos,
    };
  } catch {
    //
  }
};

export default LiveDoctorChat;
