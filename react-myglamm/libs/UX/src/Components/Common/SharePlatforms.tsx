import React, { Fragment, useEffect, useState } from "react";
import { getVendorCode } from "@libUtils/getAPIParams";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import useTranslation from "@libHooks/useTranslation";

import { GAShared } from "@libUtils/analytics/gtm";

import Adobe from "@libUtils/analytics/adobe";
import { isWebview } from "@libUtils/isWebview";

import { ValtioStore } from "@typesLib/ValtioStore";

import { ADOBE } from "@libConstants/Analytics.constant";
import { GAMIFICATION_URL } from "@libConstants/SURVEY.constant";

interface ShareProps {
  shareData: { [char: string]: string };
}

const SharePlatforms = ({ shareData }: ShareProps) => {
  const { t } = useTranslation();

  const router = useRouter();
  const consumerApi = new ConsumerAPI();

  const { userProfile, shareConfig } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
    shareConfig: store.configReducer.shareModalConfig,
  }));

  const [Text, setText] = useState("");
  const [shareMessage, setShareMessage] = useState(shareConfig.shareMessage || "");

  // ShareData contians the required slug and shareUrl if we are directly showing Share Menu
  const { slug, shareUrl, productName } = shareConfig || {};

  const svgurl = "url(https://files.myglamm.com/site-images/original/share-sprite.png) no-repeat";
  const moreShareModal: any = typeof window !== "undefined" && navigator;
  let referenceCode = "";

  if (userProfile && !router.asPath.includes("/refer")) {
    referenceCode = `?rc=${userProfile.referenceCode}`;

    if (userProfile.memberType?.typeName === "influencer") {
      referenceCode = referenceCode.concat("&utm_term=INF");
    }
  }

  // Getting user details
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  // Adobe Analytics(133) - On Click - Invite friends.
  const gamificationAdobeClick = (sharingPlatform: any) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|Gamification|invite friend`,
        linkPageName: `web|Gamification|invite friend`,
        newLinkPageName: "MyGlammXOGamification",
        assetType: "Gamification",
        newAssetType: "Gamification",
        subSection: "MyGlammXOGamification",
        platform: ADOBE.PLATFORM,
        ctaName: sharingPlatform,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /* When ShareData changes, change the share message and title */
  useEffect(() => {
    //If we have sharemessage then we don't need to mutate it
    if (t("shareUtility") && shareData && !shareMessage) {
      const message = shareData.shareMessage
        ?.replace("{shareUrl}", `${shareUrl}${referenceCode}`)
        .replace("{name}", productName);
      setShareMessage(message);
    }
  }, [shareData]);

  /* Copy Share Link to Clipboard and trigger webview bride if WEBVIEW */
  const onCopyLink = () => {
    if (isWebview()) {
      (window as any).MobileApp.redirect(
        `${window.location.origin}/copy?message=${shareMessage.replace("{sharingPlatform}", "link")}`
      );
    } else {
      navigator.clipboard.writeText(shareMessage.replace("{sharingPlatform}", "link"));
    }
    setText(t("linkCopied"));

    setTimeout(() => {
      setText("");
    }, 2000);
  };

  /* Handle More Share Options - Incase not supported Alert */
  const moreOptions = () => {
    if (moreShareModal?.share) {
      moreShareModal
        .share({
          title: shareData.shareDialogTitle || "",
          text: shareMessage.replace("{sharingPlatform}", "more"),
          url: shareMessage.match("https") ? "" : shareUrl,
        })
        .then(() => redirectOnGamificationOrderSummary("More Options"))
        .catch((error: any) => console.error("Error sharing", error));
    } else {
      alert("Share not Supported");
    }
  };

  /* Give Glammpoints to User when shared on facebok */
  const earnGlammPoint = () => {
    if (userProfile?.id) {
      consumerApi.freeGlammPoint({
        module: shareConfig.module || "product",
        type: "glammPoints",
        vendorCode: getVendorCode(),
        platform: shareConfig.platform || "facebook",
        identifier: userProfile?.id,
        slug,
      });
    }
  };

  /* ADOBE ANALYTICS */
  const shareOptionClick = (sharingPlatform: string) => {
    const webengageDatalayer = {
      contactSync: false,
      numberOfContacts: 0,
      propertyName: productName || "",
      propertyShared: "",
      sharingPlatform: sharingPlatform || "",
      userType: userProfile?.id ? "Member" : "Guest",
    };
    GAShared(webengageDatalayer);
    redirectOnGamificationOrderSummary(sharingPlatform);

    if (router.asPath.includes("/order-summary")) {
    }
  };

  const redirectOnGamificationOrderSummary = (sharingPlatform: string) => {
    if (router.asPath.includes("/order-summary")) {
      gamificationAdobeClick(sharingPlatform);
      router.push(GAMIFICATION_URL);
    }
  };

  return (
    <Fragment>
      <div className="flex mt-6 mb-1 flex-wrap justify-between">
        {/* WhatsApp */}
        <div className="border text-center h-20 w-20 p-2 border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-whatsapp outline-none"
            href={`whatsapp://send?text=${encodeURIComponent(shareMessage.replace("{sharingPlatform}", "whatsapp"))}`}
            onClick={() => shareOptionClick("WhatsApp")}
            data-action=""
            adobe-channelsource=""
            adobe-sharingproperty=""
            adobe-propertyname=""
            adobe-sharingplatform="whatsapp"
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

        {/* FacebOok */}
        <div role="presentation" className="border text-center h-20 w-20 p-2 border-gray-200" onClick={earnGlammPoint}>
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-facebook outline-none"
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(
              shareMessage.replace("{sharingPlatform}", "facebook")
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => shareOptionClick("Facebook")}
            data-action=""
            adobe-channelsource=""
            adobe-sharingproperty=""
            adobe-propertyname=""
            adobe-sharingplatform="facebook"
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
        <div className="border text-center h-20 w-20 p-2 border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-msg outline-none"
            href={`sms:?&body=${encodeURIComponent(shareMessage.replace("{sharingPlatform}", "sms"))}`}
            onClick={() => shareOptionClick("Message")}
            data-action=""
            adobe-channelsource=""
            adobe-sharingproperty=""
            adobe-propertyname=""
            adobe-sharingplatform="message"
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
        <div className="border text-center h-20 w-20 p-2 capitalize border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-link outline-none"
            role="presentation"
            onClick={() => {
              onCopyLink();
              shareOptionClick("Copy");
            }}
            data-action=""
            adobe-channelsource=""
            adobe-sharingproperty=""
            adobe-propertyname=""
            adobe-sharingplatform="copylink"
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
          <div className="text-center border-gray-200 w-20 mx-auto mt-4">
            <a role="presentation" onClick={moreOptions} className="outline-none" aria-label={t("moreOptions")}>
              <div
                className="mx-auto mb-3 mt-2"
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
    </Fragment>
  );
};

export default SharePlatforms;
