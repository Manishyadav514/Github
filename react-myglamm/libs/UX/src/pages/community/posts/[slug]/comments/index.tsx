import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import ErrorComponent from "@libPages/_error";
import { getConfig } from "@libUtils/getCommunityConfig";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { getCommentsListByPostSlug } from "community/api";
import { CommentsListing } from "community/components";

import useFeedPost from "@libComponents/Community/useFeedPost";
import useCommunitySession from "@libHooks/useCommunitySession";

import PopupModal from "@libComponents/PopupModal/PopupModal";
import DownloadAppModal from "@libComponents/Community/DownloadAppModal";
import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

const CommentsListingScreen = ({ post, comments, errorCode }: any) => {
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
  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <title key="title">{`${WEBSITE_NAME} Community Wall`}</title>
        <meta key="og:title" property="og:title" content={`${WEBSITE_NAME} Community Wall`} />
      </Head>
      {IS_DESKTOP ? (
        <div className="community-section">
          <div className="community-section">
            <div className="community-section__content justify-center !mx-auto my-auto">
              <div className="community-section__right w-[600px]">
                <div className="community-section__component">
                  <CommentsListing
                    post={post}
                    config={config}
                    initialComments={comments}
                    onUserActionTrigger={onUserActionTrigger}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CommentsListing post={post} config={config} initialComments={comments} onUserActionTrigger={onUserActionTrigger} />
      )}

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

CommentsListingScreen.getInitialProps = async (ctx: any) => {
  const { slug }: any = ctx.query;
  try {
    const res: any = await getCommentsListByPostSlug(getConfig(), slug);
    if (res?.success) {
      if (!res?.comments?.data?.length && ctx?.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return {
        post: res?.post || null,
        comments: res?.comments || null,
        errorCode: !res?.comments?.data?.length ? 404 : null,
      };
    }
  } catch (err) {
    if (ctx?.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
  }
  return {
    post: null,
    comments: null,
    errorCode: 500,
  };
};

export default CommentsListingScreen;
