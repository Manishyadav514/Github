import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";

import { FeedPostByTopics, DesktopCommunityTab } from "community/components";
import { getPostsByTab } from "community/api";

import PopupModal from "@libComponents/PopupModal/PopupModal";
import DownloadAppModal from "@libComponents/Community/DownloadAppModal";
import useFeedPost from "@libComponents/Community/useFeedPost";

import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import ErrorComponent from "@libPages/_error";

import { commonData, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { useSelector } from "@libHooks/useValtioSelector";
import useCommunitySession from "@libHooks/useCommunitySession";

import { getConfig, transformCommunityData } from "@libUtils/getCommunityConfig";

import {
  setTopicsLiveVideoPosts,
  setTopicsPolls,
  setTopicsQuestionPosts,
  setTopicsWallPosts,
} from "@libStore/actions/communityActions";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

type Ttabs = "wall" | "questions" | "live_videos" | "polls";

function stringTitleCase(_string: string) {
  const newStr = _string.split("-").join(" ");
  let capitalizeLetterFunc = (match: string) => match.toUpperCase();
  return newStr.replace(/(^\w{1})|(\s{1}\w{1})/g, capitalizeLetterFunc);
}

const PostsByTopic = ({ postData: postState, topicSlug, filter }: any) => {
  const config = getConfig();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Ttabs>((router?.query?.type as Ttabs) || "wall");
  const { feedByTopics } = useSelector((store: any) => ({
    feedByTopics: store.communityReducer.feedByTopics,
  }));
  const transformedData = transformCommunityData((router?.query?.type as Ttabs) || "wall", postState);

  const topicName = postState?.posts?.[0]?.topicDetails?.topicName || stringTitleCase(topicSlug);
  const seoTitle = `${topicName} - ${WEBSITE_NAME}`;
  const seoDescription = `Read & Express your views about ${topicName} - ${WEBSITE_NAME}`;
  useCommunitySession();

  const {
    onUserActionTrigger,
    onPageNavigate,
    activeModal,
    setActiveModal,
    showShareModal,
    setShowShareModal,
    referenceCode,
    shareContent,
    shareData,
    showCopiedSuccessMsg,
  } = useFeedPost();

  React.useEffect(() => {
    const digitalData = {
      common: {
        pageName: `web|community|community ${topicName}`,
        newPageName: `community ${topicName}`,
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: IS_DESKTOP ? "desktop website" : ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };
    ADOBE_REDUCER.adobePageLoadData = digitalData;

    const data = { ...postState };
    data.isFreshReload = true;
    data.skip = postState?.posts?.length;
    data.topic = router.query.slug;
    if (postState?.posts?.length) {
      if (activeTab === "wall" && (!feedByTopics.wallPosts?.posts?.length || router.query.slug !== feedByTopics.topic)) {
        setTopicsWallPosts(data);
        setTopicsQuestionPosts(commonData.questionPosts);
        setTopicsLiveVideoPosts(commonData.liveVideoPosts);
        setTopicsPolls(commonData.polls);
      } else if (
        activeTab === "questions" &&
        (!feedByTopics.questionPosts?.posts?.length || router.query.slug !== feedByTopics.topic)
      ) {
        setTopicsQuestionPosts(data);
        setTopicsWallPosts(commonData.wallPosts);
        setTopicsLiveVideoPosts(commonData.liveVideoPosts);
        setTopicsPolls(commonData.polls);
      } else if (
        activeTab === "live_videos" &&
        (!feedByTopics.liveVideoPosts?.posts?.length || router.query.slug !== feedByTopics.topic)
      ) {
        setTopicsLiveVideoPosts(data);
        setTopicsQuestionPosts(commonData.questionPosts);
        setTopicsWallPosts(commonData.wallPosts);
        setTopicsPolls(commonData.polls);
      } else if (activeTab === "polls" && (!feedByTopics.polls?.posts?.length || router.query.slug !== feedByTopics.topic)) {
        setTopicsPolls(data);
        setTopicsLiveVideoPosts(commonData.liveVideoPosts);
        setTopicsQuestionPosts(commonData.questionPosts);
        setTopicsWallPosts(commonData.wallPosts);
      }
    }

    if (feedByTopics) {
      const scrollPos = sessionStorage.getItem(SESSIONSTORAGE.TOPICS_SCROLL_POS_Y);
      if (scrollPos) {
        window.scrollTo(0, Number(scrollPos));
        sessionStorage.removeItem(SESSIONSTORAGE.TOPICS_SCROLL_POS_Y);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const onSetActiveTab = (activeTabParam: any) => {
    const pathname = router?.pathname?.replace("[slug]", topicSlug);
    router.push({ pathname, query: { type: activeTabParam } }, undefined, { shallow: true });
    setActiveTab(activeTabParam);
  };

  const dispatchHandler = (type: Ttabs, data: any) => {
    if (type === "wall") {
      setTopicsWallPosts(data);
    } else if (type === "questions") {
      setTopicsQuestionPosts(data);
    } else if (type === "live_videos") {
      setTopicsLiveVideoPosts(data);
    } else if (type === "polls") {
      setTopicsPolls(data);
    }
  };

  useEffect(() => {
    if (
      (router.query.path !== activeTab &&
        ["wall", "polls", "questions", "live_videos"].includes(router.query.type as string)) ||
      (!router.query.path && activeTab !== "wall")
    ) {
      setActiveTab((router.query.type as Ttabs) || "wall");
    }
  }, [router]);

  return (
    <div>
      <Head>
        <title key="title">{seoTitle}</title>
        <meta key="og:title" property="og:title" content={seoTitle} />
        <meta key="description" name="description" content={seoDescription} />
        <meta key="og:description" property="og:description" content={seoDescription} />
      </Head>
      {IS_DESKTOP ? (
        <div className="community-section">
          <div className="community-section__content">
            <div className={`community-section__left w-[280px] `}>
              <div className={`community-section__left-sub w-[280px]`}>
                <DesktopCommunityTab
                  config={config}
                  className="mr-5 w-full"
                  setActiveTab={onSetActiveTab}
                  activeTab={activeTab}
                  showEventsTab={false}
                />
              </div>
            </div>
            <div className={`community-section__right w-[500px]`}>
              <div className="community-section__component">
                <FeedPostByTopics
                  filter={filter}
                  prevState={
                    feedByTopics.wallPosts.posts.length ||
                    feedByTopics.questionPosts.posts.length ||
                    feedByTopics.polls.posts.length ||
                    feedByTopics.liveVideoPosts.posts.length
                      ? feedByTopics
                      : transformedData
                  }
                  onPageNavigate={onPageNavigate}
                  config={config}
                  feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
                  tabClassName=""
                  ErrorComponent={ErrorComponent}
                  onUserActionTrigger={onUserActionTrigger}
                  showDesktopTabView
                  activeTab={activeTab}
                  onSetActiveTabCallback={onSetActiveTab}
                  dispatchHandler={dispatchHandler}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FeedPostByTopics
          filter={filter}
          prevState={
            feedByTopics.wallPosts.posts.length ||
            feedByTopics.questionPosts.posts.length ||
            feedByTopics.polls.posts.length ||
            feedByTopics.liveVideoPosts.posts.length
              ? feedByTopics
              : transformedData
          }
          onPageNavigate={onPageNavigate}
          config={config}
          feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
          tabClassName="sticky top-12 w-full z-30"
          ErrorComponent={ErrorComponent}
          onUserActionTrigger={onUserActionTrigger}
          activeTab={activeTab}
          onSetActiveTabCallback={onSetActiveTab}
          dispatchHandler={dispatchHandler}
        />
      )}

      <DownloadAppModal activeModal={activeModal} setActiveModal={setActiveModal} />
      {IS_DESKTOP ? (
        <SuccessNotification showNotification={showCopiedSuccessMsg} />
      ) : (
        <PopupModal
          show={showShareModal}
          onRequestClose={() => {
            setShowShareModal(prevState => !prevState);
          }}
        >
          <CommunitySharePlatforms
            referenceCode={referenceCode}
            shareData={shareData}
            shareContent={shareContent}
            config={config}
          />
        </PopupModal>
      )}
    </div>
  );
};

PostsByTopic.getInitialProps = async (ctx: any) => {
  try {
    const { slug }: any = ctx?.query;
    const filter = { topicSlug: slug };
    const res = await getPostsByTab(getConfig(), ctx?.query?.type, filter);
    if (res?.success) {
      return {
        postData: res.data,
        filter,
        topicSlug: slug,
      };
    } else {
      throw res;
    }
  } catch {
    //
  }
  if (ctx?.res) {
    ctx.res.statusCode = 500;
    return ctx.res.end("Something Went Wrong");
  }
  return {
    postData: null,
    errorCode: 500,
  };
};

export default PostsByTopic;
