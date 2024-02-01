import React from "react";

import ArticleDownloadAppModal from "@libComponents/BBCArticle/ArticleDownloadAppModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { useSelector } from "@libHooks/useValtioSelector";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import { ArticleDetailsContext } from "../../pages/learn/[slug]";

import { numFormatter } from "@libUtils/format/formatNumber";
import { getStaticUrl } from "@libUtils/getStaticUrl";

import { showSuccess } from "@libUtils/showToaster";

import decodeEntities from "@libUtils/helper";

interface PropTypes {
  authorDetails: any;
  likesCount: number;
  shareCount: number;
  bookmarkCount: number;
}

const ActionBar = (props: PropTypes) => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const consumerApi = new ConsumerAPI();

  const articleDetailsInfo = React.useContext<any>(ArticleDetailsContext);
  const { authorDetails, likesCount, shareCount, bookmarkCount } = props;
  const countClass = "text-sm font-bold mb-0";
  const labelClass = "text-xs font-normal text-gray-600 mb-0";
  const [activeModal, setActiveModal] = React.useState("");
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const settingsOption = [
    {
      id: "chat",
      name: "Chat",
    },
    {
      id: "copy_share_url",
      name: "Copy Share URL",
    },
  ];

  const { userData }: any = useSelector((store: any) => store.userReducer);

  const getUrl = () => {
    let url;
    url = articleDetailsInfo?.bbc_share_links?.Mweb2App_share_url;
    if (userData?.data?.my_referral_code) {
      url = `${url}?ref=${userData?.data?.my_referral_code}`;
    }
    return url;
  };
  const copyStringToClipboard = () => {
    GAgenericEvent("Content & Community", "BBC Copy Share Url Clicked", "");
    const text = decodeEntities(articleDetailsInfo?.title?.rendered);
    const url = getUrl();
    const footer = "Download BabyChakra, India's largest Parenting App.";
    const value = `${text}...\nRead more on ${url}\n${footer}\n`;
    navigator.clipboard.writeText(value);
    showSuccess("Copied!");
  };
  const callGoodGlammPointsAPI = async () => {
    if (userProfile?.id) {
      consumerApi.freeGlammPoint({
        module: "page",
        type: "glammPoints",
        platform: "facebook",
        identifier: userProfile?.id,
        vendorCode: "bbc",
        comment: "",
      });
    }
  };

  const shareContent = () => {
    const text = decodeEntities(articleDetailsInfo?.title.rendered);
    const SHARE_FOOTER = "Download BabyChakra, India's largest Parenting App.";
    const url = getUrl();
    GAgenericEvent("Content & Community", "BBC Share Clicked", "");
    if (navigator?.share) {
      navigator
        .share({
          title: text,
          text: `${text} \n${SHARE_FOOTER}`,
          url: `${url}`,
        })
        .catch(() => {
          copyStringToClipboard();
        });
    } else {
      copyStringToClipboard();
    }
    if (userProfile?.id) {
      callGoodGlammPointsAPI();
    }
  };

  const onSettingClick = (e: any, id: any) => {
    e.stopPropagation();
    if (id === "chat") {
      setShowSettingsModal(false);
      setActiveModal("chat");
    } else if (id === "copy_share_url") {
      copyStringToClipboard();
    }
  };

  return (
    <>
      <div className="flex justify-between mb-7">
        <div className="flex justify-between w-5/6">
          <div
            className="flex "
            // onClick={e => {
            //   e.preventDefault();
            //   setActiveModal("like");
            //   GoogleTagManager.BBCGAGenericEvent("engagement", "BBC Download Popup Viewed", "like");
            // }}
          >
            <ImageComponent src={getStaticUrl("/images/bbc-g3/big-heart.svg")} alt="like" width="23px" height="19px" />
            <div className="ml-3">
              <p className={countClass}>{numFormatter(likesCount)}</p>
              <p className={labelClass}>Like</p>
            </div>
          </div>
          <div
            className="flex "
            // onClick={e => {
            //   e.preventDefault();
            //   setActiveModal("bookmark");
            //   GoogleTagManager.BBCGAGenericEvent("engagement", "BBC Download Popup Viewed", "bookmark");
            // }}
          >
            <ImageComponent src={getStaticUrl("/images/bbc-g3/bookmark.svg")} alt="bookmark" width="18px" height="26px" />
            <div className="ml-3">
              <p className={countClass}>{numFormatter(bookmarkCount)}</p>
              <p className={labelClass}>Saves</p>
            </div>
          </div>
          <div className="flex cursor-pointer" onClick={() => shareContent()}>
            <ImageComponent
              src={getStaticUrl("/images/bbc-g3/whatsapp-logo.svg")}
              alt="whatsapp-logo"
              width="25px"
              height="25px"
            />
            <div className="ml-3">
              <p className={countClass}>{numFormatter(shareCount)}</p>
              <p className={labelClass}>Shares</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="flex items-center relative cursor-pointer p-1">
          <div
            onClick={e => {
              e.preventDefault();
              setShowSettingsModal(true);
            }}
          >
            <ImageComponent src={getStaticUrl("/images/bbc-g3/more-icon.svg")} alt="more-icon" width="4px" height="18px" />
          </div>
          {showSettingsModal ? (
            <>
              <div
                className="w-full h-full bg-transparent fixed top-0 left-0 z-[60]"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                onClick={() => {
                  setShowSettingsModal(false);
                }}
              />
              <div className="absolute right-6 py-3.5 px-4 rounded-md bg-white w-52 z-[70] shadow-3 tooltip-arrow-right-wrapper">
                {settingsOption?.map(setting => (
                  <div
                    key={`setting_${setting.id}`}
                    className="text text-sm font-medium py-3.5"
                    onClick={e => onSettingClick(e, setting.id)}
                  >
                    {setting.name}
                    {setting.id === "chat" ? (
                      <span>
                        {" "}
                        with <span className="capitalize">{authorDetails?.display_name}</span>
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {activeModal ? (
          <ArticleDownloadAppModal
            activeModal={activeModal}
            onCloseModal={() => setActiveModal("")}
            authorDetails={authorDetails}
          />
        ) : null}
      </div>
    </>
  );
};

export default React.memo(ActionBar);
