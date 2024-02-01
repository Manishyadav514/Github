import React, { useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

import { isWebview } from "@libUtils/isWebview";

const svgurl = "url(https://files.myglamm.com/site-images/original/share-sprite.png) no-repeat";
const moreShareModal: any = typeof window !== "undefined" && navigator;

const CommunitySharePlatforms = ({ shareData, shareContent, config }: any) => {
  const { t } = useTranslation();

  const [Text, setText] = useState("");

  const onCopyLink = () => {
    if (isWebview()) {
      (window as any).MobileApp.redirect(`${window.location.origin}/copy?message=${encodeURIComponent(shareContent?.message)}`);
    } else {
      navigator.clipboard.writeText(shareContent?.message);
    }
    setText(t("linkCopied"));

    setTimeout(() => {
      setText("");
    }, 2000);
  };

  const moreOptions = () => {
    if (moreShareModal?.share) {
      moreShareModal
        .share({
          title: shareData.shareDialogTitle || "",
          text: shareContent.message,
          url: shareContent?.url,
        })
        .then(() => shareOptionClick("More Options"))
        .catch((error: any) => console.error("Error sharing", error));
    } else {
      alert("Share not Supported");
    }
  };

  const shareOptionClick = (sharingPlatform: any) => {
    const { postDetails, path } = shareContent;

    // sharing event to library
    let event = new Event("share_event", { bubbles: true });
    const elem: any = document.getElementById(`share_${postDetails.id}`);
    if (!elem?.classList?.contains("shared")) {
      elem.dispatchEvent(event);
    }

    let page;
    const cta = path.includes("/poll") || shareContent.type === "poll" ? "poll share" : "post share";
    if (path.includes("/poll") || shareContent.type === "poll") {
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
        linkName: `web|community|community ${page}|${postDetails?.topicDetails?.topicName}|${page} share|${sharingPlatform}`,
        linkPageName: `web|community|community ${page}|${postDetails?.topicDetails?.topicName}|`,
        ctaName: cta,
        newLinkPageName: `community ${page}`,
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        pageLocation: "community",
        platform: ADOBE.PLATFORM,
      },
    };
    Adobe.Click();
  };

  return (
    <>
      <section className="p-4 pt-8 w-full relative rounded-t-3xl">
        <p className="font-bold text-11 text-black text-center my-6">{t("shareNow") || "SHARE NOW"}</p>
        <div className="flex mt-6 mb-1 flex-wrap justify-between">
          {/* WhatsApp */}
          <div className="text-center h-20 w-20 p-2">
            <a
              className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-whatsapp outline-none"
              href={`whatsapp://send?text=${encodeURIComponent(shareContent.message)}`}
              onClick={() => shareOptionClick("WhatsApp")}
              aria-label={t("whatsApp")}
            >
              <div
                className="mx-auto"
                style={{
                  background: svgurl,
                  width: "35px",
                  height: "35px",
                  backgroundPosition: " -211px 2px",
                  backgroundSize: " 825px",
                }}
              />
              <span className="font-semibold text-center text-xxs">{t("whatsApp")}</span>
            </a>
          </div>

          {/* Facebook */}
          <div role="presentation" className="text-center h-16 w-20 p-2 relative">
            <span className="absolute" style={{ top: "-15px", color: "#ff7775" }}>
              &#9679;
            </span>
            <a
              className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-facebook outline-none"
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareContent.url}&quote=${encodeURIComponent(
                shareContent.message
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => shareOptionClick("Facebook")}
              aria-label={t("facebook")}
            >
              <div
                className="mx-auto"
                style={{
                  background: svgurl,
                  width: "35px",
                  height: "35px",
                  backgroundPosition: " -140px 2px",
                  backgroundSize: " 744px",
                }}
              />
              <span className="font-semibold text-center text-xxs">{t("facebook")}</span>
            </a>
          </div>

          {/* Message */}
          <div className="text-center h-16 w-20 p-2">
            <a
              className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-msg outline-none"
              href={`sms:?&body=${encodeURIComponent(shareContent.message)}`}
              onClick={() => shareOptionClick("Message")}
              aria-label={t("message")}
            >
              <div
                className="mx-auto"
                style={{
                  background: svgurl,
                  width: "35px",
                  height: "35px",
                  backgroundPosition: " -92px 2px",
                }}
              />
              <span className="font-semibold text-center text-xxs">{t("message")}</span>
            </a>
          </div>

          {/* Copy Share URL */}

          <div className="text-center h-16 w-20 p-2 capitalize">
            <a
              className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-link outline-none"
              role="presentation"
              onClick={() => {
                onCopyLink();
                shareOptionClick("Copy");
              }}
              data-action=""
              aria-label={t("copy")?.toLowerCase()}
            >
              <img
                alt="COPY"
                className="w-6 mx-auto mb-2 mt-1"
                src="https://files.myglamm.com/site-images/original/vector-smart-object@3x.png"
              />
              <p className="font-semibold text-center tracking text-xxs">{t("copy")?.toLowerCase()}</p>
            </a>
          </div>

          {/* More Option */}
          {!isWebview() && (
            <div className={`text-center w-20 mx-auto mt-2"`}>
              <a role="presentation" onClick={moreOptions} className="outline-none" aria-label={t("moreOptions")}>
                <div
                  className="mx-auto mb-2 mt-2"
                  style={{
                    background: svgurl,
                    width: "21px",
                    height: "21px",
                    backgroundPosition: "0px 0px",
                    backgroundSize: "cover",
                  }}
                />
                <p className="font-semibold text-center text-xxs">{t("moreOptions")}</p>
              </a>
            </div>
          )}
        </div>

        {/* Copied Text show for 2Secs */}
        <p className="absolute text-xxs right-11 bottom-16">{Text}</p>
      </section>
    </>
  );
};

export default CommunitySharePlatforms;
