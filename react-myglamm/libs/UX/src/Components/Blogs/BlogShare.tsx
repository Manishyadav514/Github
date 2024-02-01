import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import useTranslation from "@libHooks/useTranslation";

import { GAShared } from "@libUtils/analytics/gtm";

import { ValtioStore } from "@typesLib/ValtioStore";

import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";

import { getVendorCode } from "@libUtils/getAPIParams";

import useAppRedirection from "@libHooks/useAppRedirection";

const BlogSharePlatforms = ({ blogName, shortUrl, shortUrlSlug }: any) => {
  const { t } = useTranslation();

  const router = useRouter();
  const consumerApi = new ConsumerAPI();

  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const [Text, setText] = useState("");

  const moreShareModal: any = isClient() && navigator;

  let referenceCode = "";

  if (userProfile && !router.asPath.includes("/refer")) {
    referenceCode = `?rc=${userProfile.referenceCode}`;

    if (userProfile.memberType?.typeName === "influencer") {
      referenceCode = referenceCode.concat("&utm_term=INF");
    }
  }
  const svgurl = "url(https://files.myglamm.com/site-images/original/share-sprite.png) no-repeat";

  const shareMessage = t("shareUtility")
    .blog?.shareMessage?.replace("{shareUrl}", `${shortUrl}${referenceCode}`)
    .replace("{name}", blogName);

  const { redirect } = useAppRedirection();

  /* Copy Share Link to Clipboard and trigger webview bride if WEBVIEW */
  const onCopyLink = () => {
    if (isWebview()) {
      redirect(`/copy?message=${shareMessage}`, true);
    } else {
      navigator.clipboard.writeText(shareMessage);
    }
    setText(t("linkCopied"));

    setTimeout(() => {
      setText("");
    }, 2000);
  };

  /* ADOBE ANALYTICS */
  const shareOptionClick = (sharingPlatform: any) => {
    const webengageDatalayer = {
      contactSync: false,
      numberOfContacts: 0,
      propertyName: blogName || "",
      propertyShared: "",
      sharingPlatform: sharingPlatform || "",
      userType: userProfile?.id ? "Member" : "Guest",
    };
    GAShared(webengageDatalayer);

    /* Give Glammpoints to User when shared on facebok */
    if (userProfile?.id) {
      consumerApi.freeGlammPoint({
        module: "page",
        type: "glammPoints",
        vendorCode: getVendorCode(),
        platform: "facebook",
        identifier: userProfile?.id,
        slug: shortUrlSlug,
      });
    }
  };

  /* Handle More Share Options - Incase not supported Alert */
  const moreOptions = () => {
    if (moreShareModal?.share) {
      moreShareModal
        .share({
          title: t("shareUtility").blog?.shareDialogTitle || "",
          text: shareMessage,
          url: shareMessage.match("https") ? "" : shortUrl,
        })
        .then(() => shareOptionClick("More Options"))
        .catch((error: any) => console.error("Error sharing", error));
    } else {
      alert("Share not Supported");
    }
  };

  return (
    <Fragment>
      <div className="flex  items-center  bg-white pb-10">
        <p className="px-6 font-bold text-sm uppercase">{t("share")}</p>
        <div className="text-center h-16 w-16 p-2 border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-whatsapp outline-none"
            href={`whatsapp://send?text=${encodeURIComponent(shareMessage)}`}
            onClick={() => shareOptionClick("WhatsApp")}
            data-action=""
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
        <div role="presentation" className="text-center h-16 w-16 p-2 border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-facebook outline-none"
            href={`https://www.facebook.com/sharer/sharer.php?u=${shortUrl}&quote=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => shareOptionClick("Facebook")}
            data-action=""
            aria-label={t("facebook")}
          >
            <div
              className="mx-auto"
              style={{
                background: svgurl,
                width: "35px",
                height: "35px",
                backgroundPosition: "-140px 2px",
                backgroundSize: " 744px",
              }}
            />
            <span className="font-semibold text-center text-xxs">{t("facebook")}</span>
          </a>
        </div>

        {/* Copy Share URL */}
        <div className="text-center h-16 w-16 p-2 capitalize border-gray-200">
          <a
            className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-msg outline-none"
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
          {/* Copied Text show for 2Secs */}
          <p className="mt-2 text-xxs right-11">{Text}</p>
        </div>

        {/* More Option */}
        {!isWebview() && (
          <div className="text-center h-16 w-20 p-2 border-gray-200">
            <a role="presentation" onClick={moreOptions} className="outline-none" aria-label={t("moreOptions")}>
              <div
                className="mx-auto mb-3 mt-2"
                style={{
                  background: svgurl,
                  width: "22px",
                  height: "22px",
                  backgroundPosition: "0px 0px",
                  backgroundSize: "cover",
                }}
              />
              <p className="font-semibold text-center text-xxs">{t("moreOptions")}</p>
            </a>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default BlogSharePlatforms;
