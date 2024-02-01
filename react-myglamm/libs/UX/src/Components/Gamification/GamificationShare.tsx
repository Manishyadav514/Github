import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";
import Adobe from "@libUtils/analytics/adobe";
import { GAShared, GAreferralInvite } from "@libUtils/analytics/gtm";
import useTranslation from "@libHooks/useTranslation";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GAMIFICATION_URL, SURVEY_URL } from "@libConstants/SURVEY.constant";
import { ValtioStore } from "@typesLib/ValtioStore";
import { GamificationConfig } from "@typesLib/Gamification";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";
import { SHOP } from "@libConstants/SHOP.constant";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { isWebview } from "@libUtils/isWebview";
import { bbcActionCallback } from "@libUtils/bbcWVCallbacks";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

const GamificationShare = ({ variant }: { variant?: string }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const GAMIFICATION_DATA: GamificationConfig = t("gamificationConfig");

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const shareUrl =
    t("shareUtility")?.gamification?.shareUrl || (SURVEY_URL?.includes("http") ? SURVEY_URL : `${BASE_URL()}${SURVEY_URL}`);

  const bountyShareUrl =
    t("shareUtility")?.gamification?.bountyShareUrl ||
    (SURVEY_URL?.includes("http") ? SURVEY_URL : `${BASE_URL()}${SURVEY_URL}`);

  const getShareUtilityMessage = (sharingPlatform: string) => {
    if (FEATURES?.newShareMessage && sharingPlatform === "whatsapp") {
      if (variant === "1") return t("shareUtility")?.gamification?.newBountyShareMessage;

      return t("shareUtility")?.gamification?.newShareMessage;
    } else if (variant === "1") return t("shareUtility")?.gamification?.bountyShareMessage;

    return t("shareUtility")?.gamification?.shareMessage;
  };

  const getShareMessage = (sharingPlatform: string) => {
    const shareUtility = getShareUtilityMessage(sharingPlatform);

    const _shareUrl = variant === "1" ? bountyShareUrl : shareUrl;

    const url = `${_shareUrl}?rc=${userProfile?.referenceCode || ""}`.concat(variant === "0" ? `&utm_campaign=web|invite` : "");

    let shareMessage = "";

    // encode the url for whats App and if new share message feature is ON
    if (FEATURES.newShareMessage && sharingPlatform === "whatsapp") {
      shareMessage = shareUtility
        ?.replace("{shareUrl}", encodeURIComponent(url))
        .replace("{sharingPlatform}", sharingPlatform.toLocaleLowerCase());
    } else {
      shareMessage = shareUtility?.replace("{shareUrl}", url).replace("{sharingPlatform}", sharingPlatform.toLocaleLowerCase());
    }

    return shareMessage;
  };

  /* Handle More Share Options - Incase not supported Alert */
  const moreOptions = () => {
    if (userProfile) {
      if (isWebview()) {
        return bbcActionCallback("shareAMsg", { msg: getShareMessage("more") });
      }

      try {
        navigator
          .share({
            url: "",
            text: getShareMessage("more"),
            title: t("shareUtility")?.gamification?.shareDialogTitle || "",
          })
          .then(() => shareOptionClick("more"));
      } catch {
        alert("Share not Supported");
      }
    } else {
      setLocalStorageValue("shareOption", "more");
      handleUserClick(new Event("click"));
    }
  };

  /* Sync Contacts Prompt - IF Supported */
  const inviteFriends = () => {
    if (userProfile) {
      shareOptionClick("multiple_invite");
      if (GAMIFICATION_DATA.installApp) {
        window.location.href = getAppStoreRedirectionUrl(GAMIFICATION_DATA.myRewardsBranchUrl);
      } else {
        CONFIG_REDUCER.shareModalConfig = {
          shareUrl,
          slug: SURVEY_URL,
          module: "page",
        };
      }
    } else {
      setLocalStorageValue("shareOption", "Invite Friends");
      handleUserClick(new Event("click"));
    }
  };

  const getScreenVariantName = () => {
    if (router.pathname === "/order-summary") {
      if (variant === "1") {
        return "bounty order confirmation";
      }
      return "my rewards order confirmation";
    } else {
      if (variant === "1") {
        return "my rewards variant 1";
      }
      return "my rewards variant 0";
    }
  };

  /* ANALYTICS - Adobe and Webengage - OnClick */
  const shareOptionClick = (sharingPlatform: string) => {
    setLocalStorageValue("shareOption", sharingPlatform);
    router.push(GAMIFICATION_URL);

    const webengageDatalayer = {
      contactSync: false,
      numberOfContacts: 0,
      propertyName: "",
      propertyShared: "",
      sharingPlatform: sharingPlatform || "",
      userType: userProfile?.id ? "Member" : "Guest",
      screenVariantName: getScreenVariantName(),
    };
    GAShared(webengageDatalayer);
    GAreferralInvite(webengageDatalayer);

    (window as any).digitalData = {
      common: {
        linkName: variant === "0" ? "web|invite" : `web|Gamification|invite friend`,
        linkPageName: variant === "0" ? "web|invite" : `web|Gamification|invite friend`,
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

  const openShareOption = () => {
    const shareOption = getLocalStorageValue("shareOption");
    if (shareOption !== null) {
      let clickEvent = new MouseEvent("click");
      const button = document.getElementById(shareOption);
      if (button != null) {
        button.dispatchEvent(clickEvent);
        if (shareOption !== "more") {
          shareOptionClick(shareOption);
        } else {
          setTimeout(() => {
            try {
              navigator
                .share({
                  url: "",
                  text: getShareMessage("more"),
                  title: t("shareUtility")?.gamification?.shareDialogTitle || "",
                })
                .then(() => shareOptionClick("more"));
            } catch {
              alert("Share not Supported");
            }
          }, 1500);
        }
      }
      removeLocalStorageValue("shareOption");
    }
  };

  const handleUserClick = (e: any) => {
    if (!userProfile) {
      SHOW_LOGIN_MODAL({
        show: true,
        hasGuestCheckout: false,
        type: "onlyMobile",
        onSuccess: () => {
          openShareOption();
        },
      });
      e.preventDefault();
    }
  };

  const InviteUserViaWhatsApp = () => {
    return (
      <div
        style={{ backgroundColor: "#4BCA5A" }}
        className="font-semibold text-white rounded-md uppercase w-full text-sm mb-4 shimmer"
      >
        <a
          className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-whatsapp"
          href={`whatsapp://send?text=${getShareMessage("whatsapp")}`}
          onClick={() => shareOptionClick("WhatsApp")}
          data-action=""
          adobe-channelsource=""
          adobe-sharingproperty=""
          adobe-propertyname=""
          adobe-sharingplatform="whatsapp"
          id="WhatsApp"
          aria-label={t("inviteViaWhatsapp") || "INVITE VIA WHATSAPP"}
        >
          <div className="flex justify-center items-center" style={{ height: "42px" }}>
            <div className="pr-3">
              <img
                src="https://files.myglamm.com/site-images/original/whatsapp.png"
                width={30}
                height={30}
                alt="whatsapp"
                className="mx-auto"
              />
            </div>
            <div>{t("inviteViaWhatsapp") || "INVITE VIA WHATSAPP"}</div>
          </div>
        </a>
      </div>
    );
  };

  const DisplayGamificationCTA = () => {
    if (variant === "1") {
      return <InviteUserViaWhatsApp />;
    }

    if (GAMIFICATION_DATA.installApp) {
      return (
        <button
          type="button"
          onClick={inviteFriends}
          className={`bg-themePink font-semibold text-white rounded-full w-full h-10 text-sm mb-4 shimmer`}
        >
          {t("inviteFriends")}
        </button>
      );
    }
    return <InviteUserViaWhatsApp />;
  };

  return (
    <React.Fragment>
      <div className="pb-4" onClick={handleUserClick}>
        {router.pathname === "/order-summary" && <DisplayGamificationCTA />}

        {router.pathname !== "/order-summary" && (
          <>
            <DisplayGamificationCTA />

            <div className="px-4 flex justify-evenly w-full items-center pt-3">
              <a
                className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-facebook outline-none"
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${getShareMessage("facebook")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => shareOptionClick("Facebook")}
                data-action=""
                adobe-channelsource=""
                adobe-sharingproperty=""
                adobe-propertyname=""
                adobe-sharingplatform="facebook"
                id="Facebook"
                aria-label={t("facebook")}
              >
                <img src="https://files.myglamm.com/site-images/original/fb_2.png" width={50} height={50} alt="facebook" />
                <p className="font-semibold text-center text-11" style={{ marginTop: "-2px" }}>
                  {t("facebook")}
                </p>
              </a>

              <a
                className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-msg outline-none"
                href={`sms:?&body=${getShareMessage("sms")}`}
                onClick={() => shareOptionClick("sms")}
                data-action=""
                adobe-channelsource=""
                adobe-sharingproperty=""
                adobe-propertyname=""
                adobe-sharingplatform="sms"
                id="sms"
                aria-label={t("message")}
              >
                <img src="https://files.myglamm.com/site-images/original/message_1.png" width={50} height={50} alt="message" />
                <p className="font-semibold text-center text-11" style={{ marginTop: "-3px" }}>
                  {t("message")}
                </p>
              </a>

              <a
                role="presentation"
                id="more"
                onClick={moreOptions}
                className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-more outline-none"
                aria-label={t("more")}
              >
                <img
                  src="https://files.myglamm.com/site-images/original/more.png"
                  width={45}
                  height={45}
                  alt="moreOptions"
                  className="m-auto mb-2"
                />
                <p className="font-semibold text-center text-11" style={{ marginTop: "-8px" }}>
                  {t("more")}
                </p>
              </a>
            </div>
          </>
        )}
      </div>
      <style>
        {`
          .shimmer {
            background: linear-gradient(119deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.538486341802346) 32%, rgba(255,255,255,0.4) 32%, rgba(255,255,255,0.4) 33%, rgba(255,255,255,0.4) 42%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 56%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.4) 73%, rgba(255,255,255,0.4) 78%, rgba(255,255,255,0) 79%), ${
              SHOP.SITE_CODE === "mgp" ? "rgb(247, 6, 101)" : "var(--color1)"
            };
            background-size: 70px 100%;
            background-repeat: repeat-y;
            background-position: 0 0;
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            to {
              background-position: 100% 0;
            }
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default GamificationShare;
