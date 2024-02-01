import React from "react";
import useTranslation from "@libHooks/useTranslation";
import { SURVEY_URL, GAMIFICATION_URL } from "@libConstants/SURVEY.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { useRouter } from "next/router";
import { GAShared } from "@libUtils/analytics/gtm";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

const OrderSuccessGamificatonV2 = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const orderSuccessGamificationV2 = t("orderSuccessGamificationV2");

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const shareUrl = SURVEY_URL?.includes("http") ? SURVEY_URL : `${BASE_URL()}${SURVEY_URL}`;

  const getShareMessage = (sharingPlatform: string, product: any) => {
    const url = `${shareUrl}?rc=${userProfile?.referenceCode || ""}`;

    const shareMessage = product.shareMessage
      ?.replace("{shareUrl}", url)
      .replace("{sharingPlatform}", sharingPlatform.toLocaleLowerCase());

    return `${shareMessage}&utm_campaign=${product.utmCampaignId}`;
  };

  /* ANALYTICS - Adobe and Webengage - OnClick */
  const shareOptionClick = (sharingPlatform: string, product: any) => {
    setLocalStorageValue("shareOption", sharingPlatform);
    router.push(GAMIFICATION_URL);

    const webengageDatalayer = {
      contactSync: false,
      numberOfContacts: 0,
      propertyName: "",
      propertyShared: "",
      sharingPlatform: sharingPlatform || "",
      userType: userProfile?.id ? "Member" : "Guest",
    };
    GAShared(webengageDatalayer);

    (window as any).digitalData = {
      common: {
        linkName: `web|Gamification|${product.ctaTitle.toLowerCase()}`,
        linkPageName: `web|Gamification|${product.ctaTitle.toLowerCase()}`,
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
  return (
    <React.Fragment>
      <div className="p-4 mt-3">
        <img src={orderSuccessGamificationV2.rewardImage} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3 p-4">
        {orderSuccessGamificationV2.products.map((product: any) => (
          <div className="bg-white p-3 relative">
            <img src={product.getFreeImage} className="w-16 absolute top-0 left-0" />
            <img src={product.image} className="border mx-auto" />
            <p className="text-sm text-left mt-5">{product.title}</p>
            <p className="text-sm font-semibold text-left">{product.price}</p>
            <div
              style={{ backgroundColor: "#4BCA5A" }}
              className="font-semibold text-white rounded-md uppercase w-full text-xs mb-4 shimmer"
            >
              <a
                className="js-adobe-shareandearn _analytics-adobe-shareandearn ga-shared-whatsapp"
                href={`whatsapp://send?text=${encodeURIComponent(getShareMessage("whatsapp", product))}`}
                onClick={() => shareOptionClick("WhatsApp", product)}
                data-action=""
                adobe-channelsource=""
                adobe-sharingproperty=""
                adobe-propertyname=""
                adobe-sharingplatform="whatsapp"
                id="WhatsApp"
                aria-label={product.ctaTitle}
              >
                <div className="flex justify-center items-center py-2 mt-3">
                  <div>
                    <img
                      src="https://files.myglamm.com/site-images/original/whatsapp.png"
                      width={15}
                      height={15}
                      alt="whatsapp"
                      className="mx-auto"
                    />
                  </div>
                  <div className="ml-2">{product.ctaTitle}</div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default OrderSuccessGamificatonV2;
