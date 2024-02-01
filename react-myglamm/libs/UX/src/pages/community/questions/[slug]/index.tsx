import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import ErrorComponent from "@libPages/_error";

import { ADOBE } from "@libConstants/Analytics.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { getConfig } from "@libUtils/getCommunityConfig";

import { getFilteredFeedPost } from "community/api";
import { FeedPostBySlug } from "community/components";

import useFeedPost from "@libComponents/Community/useFeedPost";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import DownloadAppModal from "@libComponents/Community/DownloadAppModal";
import useCommunitySession from "@libHooks/useCommunitySession";

import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { getVendorCode } from "@libUtils/getAPIParams";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

const QuestionDetails = ({ postData, filter, errorCode }: any) => {
  const config = getConfig();
  const seoTitle = `${postData?.posts?.[0]?.text} - ${postData?.posts?.[0]?.topicDetails?.topicName} - ${WEBSITE_NAME}`;
  const seoDescription = `Get answers to ${postData?.posts?.[0]?.text} - ${postData?.posts?.[0]?.topicDetails?.topicName} - ${WEBSITE_NAME}`;
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

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  React.useEffect(() => {
    const postDetails = postData?.posts?.[0];
    const topicName = postDetails?.topicDetails?.topicName;
    const digitalData = {
      common: {
        pageName: `web|community|${topicName}|community question|${postDetails.id}`,
        newPageName: "community question",
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: IS_DESKTOP ? "desktop website" : ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };

    if (postDetails.postType === "liveVideo" && getVendorCode() === "bbc") {
      GAgenericEvent("engagement", "BBC Live Video Page User Visit", postDetails?.slug);
    }
    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

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
                  <FeedPostBySlug
                    filter={filter}
                    feedPostData={postData}
                    onPageNavigate={onPageNavigate}
                    config={config}
                    feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
                    onUserActionTrigger={onUserActionTrigger}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FeedPostBySlug
          filter={filter}
          feedPostData={postData}
          onPageNavigate={onPageNavigate}
          config={config}
          feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
          onUserActionTrigger={onUserActionTrigger}
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

QuestionDetails.getInitialProps = async (ctx: any) => {
  const { slug }: any = ctx.query;
  const filter = { slug };

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
    };
  } catch {
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

export default QuestionDetails;
