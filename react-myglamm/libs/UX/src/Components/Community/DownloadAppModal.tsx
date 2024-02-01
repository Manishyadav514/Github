import React, { useEffect } from "react";
import { useRouter } from "next/router";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import PlayStore from "../../../public/svg/community-app-store.svg";
import AppStore from "../../../public/svg/community-play-store.svg";

import { getVendorCode } from "@libUtils/getAPIParams";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";

export type TCommunityPopup =
  | ""
  | "likePost"
  | "likeComment"
  | "postComment"
  | "followUser"
  | "viewAuthorProfile"
  | "votepoll"
  | "selectInterest";

interface DownloadAppModalProps {
  activeModal: string;
  setActiveModal: any;
}

const DownloadAppModal = (props: DownloadAppModalProps) => {
  const COMMUNITY_CONST: any = {
    downloadAppContent: {
      likePost: {
        title: "Love this Post?",
        imgPath: getStaticUrl("/images/community/love-this-post.png"),
      },
      likeComment: {
        title: "Love this Comment ?",
        imgPath: getStaticUrl("/images/community/love-this-post.png"),
      },
      postComment: {
        title: "Want to interact and talk?",
        imgPath: getStaticUrl("/images/community/interact-talk.png"),
      },
      followUser: {
        title: "Find members like you",
        imgPath: getStaticUrl("/images/community/find-member.png"),
      },
      viewAuthorProfile: {
        title: "Find members like you",
        imgPath: getStaticUrl("/images/community/find-member.png"),
      },
      votepoll: {
        title: "Want to vote?",
        imgPath: getStaticUrl("/images/community/vote-poll.png"),
      },
      selectInterest: {
        title: "Love our Community?",
        imgPath: getStaticUrl("/images/community/love-this-post.png"),
      },
    },
    mgp: {
      appStoreNavLink: "https://myglamm.in/",
      playStoreNavLink: "https://myglamm.in/",
    },
    srn: {
      appStoreNavLink: "https://sr-n.in",
      playStoreNavLink: "https://sr-n.in",
    },
    bbc: {
      appStoreNavLink: "https://djcvz.app.link/l6qnnobXwvb",
      playStoreNavLink: "https://djcvz.app.link/l6qnnobXwvb",
    },
    orh: {
      appStoreNavLink: "https://or-h.net/gfdQmVEBUvb",
      playStoreNavLink: "https://or-h.net/gfdQmVEBUvb",
    },
  };

  const { activeModal, setActiveModal } = props;
  const { appStoreNavLink, playStoreNavLink } = COMMUNITY_CONST[getVendorCode()] || {};
  const { downloadAppContent } = COMMUNITY_CONST;
  const router = useRouter();

  const getPage = () => {
    let path = router.pathname;
    let page = "";
    if (path.includes("/poll")) {
      page = "poll";
    } else if (path.includes("/feed")) {
      page = "feed";
    } else if (path.includes("/post")) {
      page = "post";
    } else if (path.includes("/questions")) {
      page = "question";
    } else if (path.includes("/topics")) {
      page = "topics";
    } else if (path.includes("/tags")) {
      page = "tags";
    }

    return page;
  };

  const getActiveTab = () => {
    if (router.pathname.includes("/community/tags")) {
      return `tags|${router.query.slug}`;
    }
    if (router.pathname.includes("/community/topics")) {
      return `topics|${router.query.type || "wall"}|${router.query.slug}`;
    }
    if (router.pathname.includes("/community/feed")) {
      return `feed|${router.query.type || "wall"}`;
    }
    return `${getPage()}|${router.query.slug}`;
  };

  const handleCTAClick = (cta: string) => {
    const details = getActiveTab();
    (window as any).digitalData = {
      common: {
        linkName: `web|community|${details}|app download`,
        linkPageName: `web|community|${details}|app download`,
        ctaName: `app download ${cta}`,
        newLinkPageName: `community ${getPage()}`,
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: ADOBE.PLATFORM,
      },
    };
    Adobe.Click();
    return true;
  };

  useEffect(() => {
    if (!activeModal) return;
    const details = getActiveTab();
    (window as any).digitalData = {
      common: {
        pageName: `web|community|${details}|app download`,
        newPageName: `community app download `,
        subSection: "app download",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community feed",
        platform: ADOBE.PLATFORM,
      },
    };

    Adobe.PageLoad();
  }, [activeModal]);

  return (
    <div>
      <PopupModal type="center-modal" show={activeModal ? true : false} onRequestClose={() => setActiveModal("")}>
        <div className="w-[280px] h-[481px] relative">
          <p className="text-lg font-bold text-center absolute z-10 top-5 left-1/2 w-full transform -translate-x-1/2 text-color1">
            {downloadAppContent?.[activeModal]?.title}
          </p>
          <img
            src={downloadAppContent?.[activeModal]?.imgPath}
            alt=""
            className="w-full h-full object-cover absolute top-0 left-0"
            loading="lazy"
          />
          <div className="absolute z-10 left-1/2 transform -translate-x-1/2 w-full bottom-[14px]">
            <p className="text-sm font-normal text-center mb-2">Download the app now!</p>
            <div className="flex items-center justify-center">
              <a
                href={appStoreNavLink}
                target="_blank"
                onClick={() => handleCTAClick("play store")}
                rel="noopener noreferrer"
                aria-label="play store"
              >
                <AppStore className="w-[84px] h-[24px] mr-1.5" role="img" aria-labelledby="app store" />
              </a>
              <a
                href={playStoreNavLink}
                target="_blank"
                onClick={() => handleCTAClick("app store")}
                rel="noopener noreferrer"
                aria-label="app store"
              >
                <PlayStore className="w-[84px] h-[24px]" role="img" aria-labelledby="play store" />
              </a>
            </div>
          </div>
        </div>
      </PopupModal>
    </div>
  );
};

export default DownloadAppModal;
