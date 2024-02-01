/* eslint-disable  */
import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import { PollDetail } from "community/components";
import { getPollList } from "community/api";

import ErrorComponent from "@libPages/_error";

import { ADOBE } from "@libConstants/Analytics.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { getConfig } from "@libUtils/getCommunityConfig";

import useFeedPost from "@libComponents/Community/useFeedPost";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import DownloadAppModal from "@libComponents/Community/DownloadAppModal";

import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";

import useCommunitySession from "@libHooks/useCommunitySession";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

const PollDetailScreen = ({ pollData, filter, errorCode }: any) => {
  const config = getConfig();

  const {
    onUserActionTrigger,
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

  const seoTitle = `${pollData?.posts?.[0]?.pollText} - ${pollData?.posts?.[0]?.topicDetails?.topicName} - ${WEBSITE_NAME}`;
  const seoDescription = `Vote for ${pollData?.posts?.[0]?.pollText} & view results - ${pollData?.posts?.[0]?.topicDetails?.topicName} - ${WEBSITE_NAME}`;

  if (errorCode) {
    return <ErrorComponent />;
  }

  React.useEffect(() => {
    const pollDetails = pollData?.posts?.[0];
    const topicName = pollDetails?.topicDetails?.topicName;

    const digitalData = {
      common: {
        pageName: `web|community|${topicName}|community poll|${pollDetails.id}`,
        newPageName: "community poll",
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: IS_DESKTOP ? "desktop website" : ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };
    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

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
          <div className="community-section">
            <div className="community-section__content justify-center !mx-auto my-auto">
              <div className="community-section__right w-[600px]">
                <div className="community-section__component">
                  <PollDetail
                    pollData={pollData}
                    config={config}
                    ErrorComponent={ErrorComponent}
                    onUserActionTrigger={onUserActionTrigger}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PollDetail
          pollData={pollData}
          config={config}
          ErrorComponent={ErrorComponent}
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
    </div>
  );
};

PollDetailScreen.getInitialProps = async (ctx: any) => {
  const { slug }: any = ctx.query;
  const filter = {
    slug: `/poll/${slug}`,
  };

  try {
    const res = await getPollList(getConfig(), filter);
    if (!res?.data?.posts?.length && ctx?.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }
    return {
      pollData: res.data,
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

export default PollDetailScreen;
