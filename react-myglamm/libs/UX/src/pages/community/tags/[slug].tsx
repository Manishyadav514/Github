import React, { useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

import { useSelector } from "@libHooks/useValtioSelector";

import { FeedPostByTags } from "community/components";

import { getFilteredFeedPost } from "community/api";

import useFeedPost from "@libComponents/Community/useFeedPost";
import DownloadAppModal from "@libComponents/Community/DownloadAppModal";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import useCommunitySession from "@libHooks/useCommunitySession";

import ErrorComponent from "@libPages/_error";

import { getConfig } from "@libUtils/getCommunityConfig";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";

import { setFeedByTagsData } from "@libStore/actions/communityActions";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

const PostDetails = ({ postData, filter, errorCode, tagName }: any) => {
  const config = getConfig();
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
  useCommunitySession();
  const seoTitle = `${tagName} - ${WEBSITE_NAME}`;
  const seoDescription = `Read & Express your views about ${tagName} - ${WEBSITE_NAME}`;
  const { feedByTags } = useSelector((store: any) => ({
    feedByTags: store.communityReducer.feedByTags,
  }));
  const router = useRouter();

  useEffect(() => {
    const data = {
      ...postData,
      skip: postData?.posts?.length,
      isFreshReload: true,
      tag: router.query.slug,
    };
    if (postData?.posts?.length) {
      if (!feedByTags?.posts?.length || router.query.slug !== feedByTags.tag) {
        setFeedByTagsData(data);
      }
    }

    if (feedByTags) {
      const scrollPos = sessionStorage.getItem(SESSIONSTORAGE.TAGS_SCROLL_POST_Y);
      if (scrollPos) {
        window.scrollTo(0, Number(scrollPos));
        sessionStorage.removeItem(SESSIONSTORAGE.TAGS_SCROLL_POST_Y);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const dispatchHandler = (data: any) => {
    setFeedByTagsData(data);
  };

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <title key="title">{seoTitle}</title>
        <meta key="og:title" property="og:title" content={seoTitle} />
        <meta key="description" name="description" content={seoDescription} />
        <meta key="og:description" property="og:description" content={seoDescription} />
      </Head>
      {IS_DESKTOP ? (
        <div className="community-section">
          <div className="community-section">
            <div className="community-section__content justify-center !mx-auto my-auto">
              <div className="community-section__right w-[600px]">
                <div className="community-section__component">
                  <FeedPostByTags
                    prevState={feedByTags}
                    filter={filter}
                    feedPostData={postData}
                    onPageNavigate={onPageNavigate}
                    config={config}
                    feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
                    onUserActionTrigger={onUserActionTrigger}
                    dispatchHandler={dispatchHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FeedPostByTags
          prevState={feedByTags}
          filter={filter}
          feedPostData={postData}
          onPageNavigate={onPageNavigate}
          config={config}
          feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
          onUserActionTrigger={onUserActionTrigger}
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
    </>
  );
};

PostDetails.getInitialProps = async (ctx: any) => {
  const { slug }: any = ctx.query;
  const filter = { tagName: slug };

  try {
    const res = await getFilteredFeedPost(getConfig(), filter);
    if (!res?.data?.posts?.length && ctx?.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }
    return {
      postData: res.data,
      filter,
      errorCode: !res?.data?.posts?.length ? 404 : null,
      tagName: slug,
    };
  } catch (err) {
    console.error(err);
    if (ctx?.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
  }
  return {
    postData: null,
    errorCode: 500,
  };
};

export default PostDetails;
