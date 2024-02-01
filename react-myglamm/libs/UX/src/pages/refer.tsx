import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import useTranslation from "@libHooks/useTranslation";
import useAppRedirection from "@libHooks/useAppRedirection";

import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";
import { anonUserCheck } from "@libUtils/anonUserCheck";

import ErrorComponent from "./_error";

import CopyIcon from "../../public/svg/copy.svg";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const NameEamilPromptModal = dynamic(
  () => import(/* webpackChunkName: "NameEmailModal" */ "@libComponents/PopupModal/NameEamilPromptModal"),
  { ssr: false }
);

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

function ReferPage({ widgets, errorCode }: any) {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [Text, setText] = useState("");
  const [timer, settimer] = useState<any>();
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const [showNameEmailModal, setShowNameEmailModal] = useState<boolean | undefined>();

  const { t } = useTranslation();
  const { redirect } = useAppRedirection();

  const referNow = () => {
    clearTimeout(timer);
    if (profile) {
      CONFIG_REDUCER.shareModalConfig = {
        shareUrl: profile?.shareUrl,
        module: "page",
      };
    } else {
      setLoginModal(true);
    }
  };

  const onCopyCode = () => {
    if (isWebview()) {
      redirect(`/copy?message=${profile?.shareUrl}`);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = profile?.shareUrl as string;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      textArea.remove();
    }
    setText("Code Copied");

    const tx: any = setTimeout(() => {
      setText("");
    }, 2000);
    settimer(tx);
  };

  const refnEarn = "refer and earn";
  // #region // Adobe Analytics[39]-Page Load-refer and earn
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|rewards|refer and earn",
        newPageName: refnEarn,
        subSection: refnEarn,
        assetType: ADOBE.ASSET_TYPE.REFER,
        newAssetType: refnEarn,
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);
  // #endregion

  // #region // Adobe Analytics[71]-On Click-invite friend button on refer and earn
  const adobeClickInviteFriend = () => {
    (window as any).digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.REFER,
        ctaName: "invite friend",
        linkName: "web|rewards|refer and earn|invite friend",
        linkPageName: "web|rewards|refer and earn",
        newAssetType: ADOBE.ASSET_TYPE.REFER,
        newLinkPageName: refnEarn,
        platform: "mobile website",
        subSection: refnEarn,
        pageLocation: refnEarn,
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };
  // #endregion

  useEffect(() => {
    if (anonUserCheck(profile)) {
      setShowNameEmailModal(true);
    }
  }, [profile]);

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      <section className="referNearn">
        {profile && (
          <div className="flex items-center justify-evenly p-4">
            <h2 className="font-semibold border-b-3 mr-5 border-color1 rounded-sm text-sm pb-1">{t("referEarn")}</h2>

            {!SHOP.ENABLE_G3_LOYALTY_PROGRAM && (
              <Link href="/dashboard" legacyBehavior aria-label={t("dashboard")}>
                <h2 className="text-sm border-b-3 border-transparent mr-5 opacity-60">{t("dashboard")}</h2>
              </Link>
            )}
          </div>
        )}

        {widgets?.map((widget: any) => {
          /* Banner */
          if (widget.customParam === "single-banner" && widget.multimediaDetails.length > 0) {
            return (
              <div style={{ maxHeight: "220px" }}>
                <NextImage
                  priority
                  width={1000}
                  height={500}
                  // layout="intrinsic"
                  className="pb-4"
                  src={widget?.multimediaDetails[0]?.assetDetails?.url}
                  alt={widget?.multimediaDetails[0]?.assetDetails?.name}
                />
              </div>
            );
          }

          /* Content */
          if (widget.customParam === "share-invite") {
            return (
              <div key={widget.id}>
                {widget.multimediaDetails.length > 0 &&
                  widget.multimediaDetails.map((details: any) => (
                    <div className="flex items-center w-full p-6" key={details.sliderText}>
                      <ImageComponent
                        style={{ maxHeight: "58px", maxWidth: "60px" }}
                        src={details.assetDetails.url}
                        alt={details.assetDetails.name}
                      />
                      <span className="pl-6 pr-4 pt-2 leading-tight">{details.sliderText}</span>
                    </div>
                  ))}

                {/* Referral Code */}
                {profile && (
                  <>
                    <div className="flex justify-center items-center pt-4">
                      <div
                        className="flex justify-between items-center border-dashed border-pink font-bold rounded p-1"
                        style={{ borderWidth: "3px" }}
                      >
                        <h2 className="px-4">{profile?.referenceCode}</h2>
                        <div aria-hidden onClick={() => onCopyCode()}>
                          <CopyIcon width="15" height="15" fill="#f4f4f4" role="img" aria-labelledby="copy code" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center text-xs">{Text}</div>
                  </>
                )}

                {/* Refer Button */}
                <div className="flex p-8">
                  <button
                    type="button"
                    className="bg-black w-full text-white py-2 font-bold"
                    style={{ borderRadius: "3px" }}
                    onClick={() => {
                      referNow();
                      if (profile) {
                        adobeClickInviteFriend();
                      }
                    }}
                  >
                    {t("referFriend")}
                  </button>
                </div>
              </div>
            );
          }

          /* MyGlamm LeaderBoard */
          if (widget.customParam === "multiple-banner" && widget.multimediaDetails.length > 0) {
            return (
              <div key={widget.id} className="py-4">
                <h2 className="px-3 font-bold pt-2">{widget.commonDetails.title}</h2>
                {widget.multimediaDetails.map((images: any) => (
                  <ImageComponent
                    key={images.sliderText}
                    className="w-full"
                    style={{ maxHeight: "145px" }}
                    src={images.assetDetails.url}
                    alt={images.assetDetails.name}
                  />
                ))}
              </div>
            );
          }

          return null;
        })}
      </section>

      {/* Login Modal */}
      <LoginModal
        show={loginModal}
        onRequestClose={() => {
          setLoginModal(false);
        }}
        hasGuestCheckout={false}
        analyticsData={{
          adobe: {
            common: {
              pageName: "web|rewards|refer and earn|",
              subSection: "refer and earn",
              assetType: ADOBE.ASSET_TYPE.REFER,
            },
          },
        }}
      />

      {typeof showNameEmailModal === "boolean" && (
        <NameEamilPromptModal
          show={showNameEmailModal}
          hide={() => console.info("Required.....")}
          onSuccess={() => setShowNameEmailModal(false)}
        />
      )}
    </React.Fragment>
  );
}

ReferPage.getInitialProps = async (ctx: any) => {
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && process.env.NEXT_PUBLIC_ENABLE_HIT_LOGS === "true") {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }
  try {
    const widget = new WidgetAPI();
    const { data } = await widget.getWidgets({
      where: {
        slugOrId: "mobile-site-refer-n-earn",
      },
    });

    return {
      widgets: data?.data?.data?.widget,
    };
  } catch (error: any) {
    return {
      widgets: [],
    };
  }
};

export default ReferPage;
