/* eslint-disable */
import React from "react";
import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";

import useTranslation from "@libHooks/useTranslation";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { showSuccess } from "@libUtils/showToaster";

import { ValtioStore } from "@typesLib/ValtioStore";
import { getVendorCode } from "@libUtils/getAPIParams";
import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { TCommunityPopup } from "./DownloadAppModal";
import { BASE_URL } from "@libConstants/COMMON.constant";

export const listingPageSEOTitle: any = {
  bbc: "BabyChakra Community Wall - Questions, Polls & Live Videos With Experts",
  mgp: "MyGlamm Beauty Community - Questions & Polls Answered by Beauty Experts",
  orh: "Organic Harvest Personal Care Community - Questions & Polls With Experts",
};

export const listingPageSEOdescription: any = {
  bbc: "Browse BabyChakra's community feed to connect with other parents & experts. Watch our Live videos & participate in polls to get advice & solutions on different parenthood topics.",
  mgp: "Browse MyGlamm beauty forum and Ask & answer beauty questions & participate in polls to get advice & solutions from beauty experts. Join this makeup community today.",
  orh: "Join our Personal Care community to ask & help answer questions on hair and skin care & participate in polls & get advice from personal care experts.",
};

const useFeedPost = () => {
  const { t } = useTranslation();
  const shareData = t("shareUtility").community;
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const router = useRouter();
  const [showCopiedSuccessMsg, setShowCopiedSuccessMsg] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState<TCommunityPopup>("");
  const [showShareModal, setShowShareModal] = React.useState<boolean>(false);
  const [shareContent, setShareContent] = React.useState({
    url: "",
    message: "",
  });
  let referenceCode = "";
  if (userProfile && !router.asPath.includes("/refer")) {
    referenceCode = `?rc=${userProfile.referenceCode}`;
    if (userProfile.memberType?.typeName === "influencer") {
      referenceCode = referenceCode.concat("&utm_term=INF");
    }
  }

  const copyStringToClipboard = (message: any) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(message);
      showSuccess("Copied!");
    }
  };

  const getPollSlug = (post: any) => {
    const url = post?.urlManager?.url;
    const matchedWrd = url.match(/poll\/(.*)/);
    return matchedWrd?.[1] || "";
  };

  const adobeCallForProductClick = (relativeData: any) => {
    const topicName = relativeData?.post?.topicDetails?.topicName;
    (window as any).digitalData = {
      common: {
        linkName: `web|community|community feed|${topicName}|post|${relativeData?.post?.id}`,
        linkPageName: `web|community|community feed|${topicName}|post|${relativeData?.post?.id}`,
        ctaName: "product tag",
        newLinkPageName: `Community Feed|${topicName}|Post|${relativeData?.post?.id}`,
        subSection: "Post",
        assetType: "Post",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: ADOBE.PLATFORM,
      },
    };
    Adobe.Click();
  };

  const adobeCallForVideoClick = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|Community|Community Feed",
        linkPageName: ``,
        ctaName: "video play",
        newLinkPageName: "community feed",
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
    };
    Adobe.Click();
  };

  const setScrollPos = () => {
    let key;
    if (router.route.includes("/feed")) {
      key = SESSIONSTORAGE.COMMUNITY_SCROLL_POS_Y;
    } else if (router.route.includes("/topics")) {
      key = SESSIONSTORAGE.TOPICS_SCROLL_POS_Y;
    } else {
      key = SESSIONSTORAGE.TAGS_SCROLL_POST_Y;
    }
    if (typeof window !== undefined) {
      sessionStorage.setItem(key, window.scrollY.toString());
    }
  };

  const onPageNavigate = async (navigateTo: string, { post, poll, allData, product }: any) => {
    if (
      navigateTo === "FEED_DETAILS" &&
      !router.route.includes("/posts/[slug]") &&
      !router.route.includes("/questions/[slug]")
    ) {
      setScrollPos();
      if (getVendorCode() === "bbc") {
        GAgenericEvent("engagement", "BBC Clicked Feed Details", `Type: ${post.postType}, Slug: ${post.slug}`);
      }
      if (post.postType === "post" || post.postType === "liveVideo") {
        router.push({ pathname: `/community/posts/${post.slug}` });
      }
      if (post.postType === "question") {
        router.push({ pathname: `/community/questions/${post.slug}` });
      }
    }
    if (navigateTo === "COMMENTS_LISTING") {
      if (post.postType === "post" || post.postType === "liveVideo") {
        router.push({ pathname: `/community/posts/${post.slug}/comments` });
      }
      if (post.postType === "question") {
        router.push({ pathname: `/community/questions/${post.slug}/answers` });
      }
    }
    if (navigateTo === "FEED_BY_TOPIC" && post?.topicDetails?.slug) {
      router.push({ pathname: `/community/topics/${post?.topicDetails?.slug}` });
    }
    if (navigateTo === "POLL_DETAILS" && poll?.urlManager?.url) {
      setScrollPos();
      const slug = getPollSlug(poll);
      router.push({ pathname: `/community/polls/${slug}` });
    }
    if (navigateTo === "PRODUCT_NAVIGATION") {
      adobeCallForProductClick(post);
      try {
        const productApi = new ProductAPI();
        const { data } = await productApi.getProduct(
          {
            id: product?.id,
          },
          0,
          ["urlManager.url"]
        );
        if (data?.data?.data?.[0]) {
          const res = data?.data?.data?.[0];
          router.push({ pathname: res.urlManager.url });
        }
      } catch (error: any) {
        console.log(`Failed to Fetch Product`, error.message);
      }
    }
  };

  const onShareFeedPost = (postDetails: any, type: string, copyUrl: boolean) => {
    if ("desktop") {
      // sharing event to library
      let event = new Event("share_event", { bubbles: true });
      const elem: any = document.getElementById(`share_${postDetails.id}`);
      if (!elem?.classList?.contains("shared")) {
        elem.dispatchEvent(event);
      }
      let message = `${BASE_URL()}/community`;
      if (type === "post") {
        message = message + "/posts/" + postDetails?.slug;
      } else {
        const slug = getPollSlug(postDetails);
        message = message + "/polls/" + slug;
      }
      navigator.clipboard.writeText(message);
      const path = router?.pathname;
      let page;
      const cta = path.includes("/poll") || type === "poll" ? "poll share" : "post share";
      if (path.includes("/poll") || type === "poll") {
        page = "poll";
      } else if (path.includes("/feed")) {
        page = "feed";
      } else if (path.includes("/post")) {
        page = "post";
      } else if (path.includes("/questions")) {
        page = "question";
      } else if (path.includes("/topics")) {
        page = "topics";
      }
      (window as any).digitalData = {
        common: {
          linkName: `web|community|community ${page}|${postDetails?.topicDetails?.topicName}|${page} share|copy`,
          linkPageName: `web|community|community ${page}|${postDetails?.topicDetails?.topicName}|`,
          ctaName: cta,
          newLinkPageName: `community ${page}`,
          subSection: "community",
          assetType: "community",
          newAssetType: "community",
          pageLocation: "community",
          platform: "desktop website",
        },
      };
      Adobe.Click();
      setShowCopiedSuccessMsg(true);
      setTimeout(() => {
        setShowCopiedSuccessMsg(false);
      }, 2000);
    } else {
      let shareUrlTemp = `${BASE_URL()}/community`;
      if (type === "post") {
        shareUrlTemp = shareUrlTemp + "/posts/" + postDetails.slug;
      } else {
        const slug = getPollSlug(postDetails);
        shareUrlTemp = shareUrlTemp + "/polls/" + slug;
      }
      let shareMessage = shareData?.shareMessageV2 || shareData?.shareMessage;
      shareMessage = shareMessage?.replace("{brand}", WEBSITE_NAME);
      shareMessage = shareMessage?.replace("{shareUrl}", `${shareUrlTemp}${referenceCode}`);
      const shareContentTemp = {
        url: shareUrlTemp,
        message: shareMessage,
        postDetails,
        type,
        path: router.asPath,
      };
      setShareContent(shareContentTemp);
      if (copyUrl) {
        copyStringToClipboard(shareMessage);
      } else {
        setShowShareModal(true);
      }
    }
  };

  const onUserActionTrigger = (action: string, meta: any = null) => {
    if (action === "like_feed_post") {
      setActiveModal("likePost");
    } else if (action === "like_comments") {
      setActiveModal("likeComment");
    } else if (action === "poll_vote") {
      setActiveModal("votepoll");
    } else if (action === "user_profile_click") {
      setActiveModal("viewAuthorProfile");
    } else if (action === "follow_user") {
      setActiveModal("followUser");
    } else if (action === "feed_post_chat") {
      setActiveModal("postComment");
    } else if (action === "share_post") {
      onShareFeedPost(meta.postObject, meta.type, meta.copyUrl);
    } else if (action === "post_video_click") {
      adobeCallForVideoClick();
    }
  };

  return {
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
  };
};

export default useFeedPost;
