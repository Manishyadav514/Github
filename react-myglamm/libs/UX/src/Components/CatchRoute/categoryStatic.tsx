import React, { useEffect, useState, useCallback } from "react";

import Head from "next/head";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { NextPageContext } from "next";

import { useSelector } from "@libHooks/useValtioSelector";

import PageAPI from "@libAPI/apis/PageAPI";

import { logURI } from "@libUtils/debug";
import { decodeHtml } from "@libUtils/decodeHtml";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { GALandingPageViewed } from "@libUtils/analytics/gtm";

import { ADOBE } from "@libConstants/Analytics.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import ErrorComponent from "@libPages/_error";

const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "@libComponents/PopupModal/VideoModal"), {
  ssr: false,
});

const BirthdayModal = dynamic(() => import(/* webpackChunkName: "BirthDayModal" */ "@libComponents/PopupModal/BirthdayPopup"), {
  ssr: false,
});

function CategoryStatic(props: any) {
  const { cat, errorCode } = props;

  const { asPath } = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [birthdayPopup, setBirthdayPopup] = useState(false);

  const [videoId, setVideoId] = useState<null | string>(null);
  const [isOpen, setIsOpen] = useState<boolean | undefined>();

  const description = decodeHtml(cat?.cms[0]?.content?.longDescription);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("profile", JSON.stringify(userProfile));
    }

    const shareModal = document?.querySelector(".referFriend");
    if (shareModal) {
      shareModal.addEventListener("click", () => {
        if (userProfile) {
          CONFIG_REDUCER.shareModalConfig = { shareUrl: userProfile?.shareUrl, module: "page" };
        }
      });
    }
    if ("fire" in window) {
      (window as any).fire();
    }
  }, [userProfile, cat]);

  const onLitVideo = useCallback((data: any) => {
    const video = data.detail.split("v=")[1];
    setVideoId(video);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener("show-lit-popup-video", onLitVideo);
    return () => {
      document.removeEventListener("show-lit-popup-video", () => console.info(`Cleaned`));
    };
  }, []);

  /* Birthday Modal - Handle Open and Close */
  useEffect(() => {
    if (asPath.includes("/glamm-insider") && asPath.includes("#birthday-popup")) {
      setBirthdayPopup(true);
    }
  }, [asPath]);

  useEffect(() => {
    if (asPath.includes("/glamm-insider") && !birthdayPopup) {
      window.location.hash = "";
    }
  }, [birthdayPopup]);

  // Adobe Analytics[40] - Page Load - glamminsider
  useEffect(() => {
    const common = {
      pageName: `web|rewards|${cat?.cms[0]?.content.name}`,
      newPageName: `${cat?.cms[0]?.content.name}`,
      subSection: `${cat?.cms[0]?.content.name}`,
      assetType: `${cat?.cms[0]?.content.name}`,
      newAssetType: "reward and referral",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    };

    ADOBE_REDUCER.adobePageLoadData = { common };
    // #region  // *Webengage [9] - Landing Page Viewed : function call
    prepareWebengageLandingPageDatalayer(cat?.cms[0]?.content?.name);
    // #endregion  // Webengage [9] - Landing Page Viewed : function call
  }, [cat, userProfile]);

  // #region  // *Webengage [9] - Landing Page Viewed : Page Load
  const prepareWebengageLandingPageDatalayer = (landingPage: string) => {
    const webengageDataLayer: any = {
      landingPageName: `${landingPage || ""}`,
      userType: userProfile?.id ? "Member" : "Guest",
    };
    GALandingPageViewed(webengageDataLayer);
  };
  // #endregion // Webengage [9] - Landing Page Viewed : Page Load

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }
  return (
    <React.Fragment>
      <Head>
        <title key="title">{cat?.cms[0]?.content?.title || cat?.cms[0]?.metadata?.title}</title>
        <meta key="description" name="description" content={cat?.cms[0]?.metadata?.description} />
        <meta key="keywords" name="keywords" content={cat?.cms[0]?.metadata?.keywords} />
        <meta key="og:title" property="og:title" content={cat?.cms[0]?.metadata?.ogTitle || cat?.cms[0]?.metadata?.title} />
        <meta
          key="og:description"
          property="og:description"
          content={cat?.cms[0]?.metadata?.ogDescription || cat?.cms[0]?.metadata?.description}
        />

        <link rel="canonical" key="canonical" href={cat?.cms[0]?.metadata?.canonicalTag} />
        <link rel="stylesheet" href="https://use.typekit.net/gzr8bhp.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.1/css/swiper.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.1/js/swiper.min.js" type="text/javascript" />
        <link rel="stylesheet" href={getStaticUrl(`/global/css/static${IS_DESKTOP ? "-web" : ""}.css`)} />
        {process.env.PRODUCT_ENV === "ALPHA" && (
          <link rel="stylesheet" href="https://files.myglamm.com/myglamm-alpha/static-css/style.css" />
        )}
        {process.env.PRODUCT_ENV === "PROD" && <link rel="stylesheet" href="/style.css" />}
        {IS_DESKTOP ? (
          <>
            <link type="text/css" rel="stylesheet" href={getStaticUrl(`/global/css/main.css`)} />
            <link type="text/css" rel="stylesheet" href={getStaticUrl(`/global/css/static-web.css`)} />

            {/* CSS for Slick and Slider */}
            <link
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
          </>
        ) : (
          <>
            <link rel="stylesheet" href={getStaticUrl("/global/css/bs41iso.min.css")} />
            <link type="text/css" rel="stylesheet" href={getStaticUrl(`/global/css/static.css`)} />

            <script src={getStaticUrl("/global/scripts/sp.js")} defer type="text/javascript" />
            <script
              type="text/javascript"
              defer
              dangerouslySetInnerHTML={{
                __html: `
                  (function(){
                    var staticInterval = setInterval(function(){
                      if(window.fire){
                        window.fire();
                        clearInterval(staticInterval);
                      }
                    }, 200);
                  })()
                  `,
              }}
            />
          </>
        )}
      </Head>

      {IS_DESKTOP && (
        <Script
          strategy="beforeInteractive"
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          onReady={() => {
            const SCRIPTS = [
              "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
              "https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js",
              "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
              getStaticUrl("/global/scripts/sp-web.js"),
            ];

            SCRIPTS.forEach(script => {
              const scriptEle = document.createElement("script");
              scriptEle.src = script;
              scriptEle.async = true;
              scriptEle.type = "text/javascript";
              document.body.appendChild(scriptEle);
            });
          }}
        />
      )}

      <main>
        {/* DYNAMICALLY ADDS URL SLUG AS CLASS, INORDER TO APPLY STYLES AND AVOID MERGE */}
        {/* Video Modal */}
        {typeof isOpen === "boolean" && (
          <VideoModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} videoId={videoId} />
        )}
        <div className="swrapper bootstrapiso w-full flex bg-white py-3 max-w-screen-xl mx-auto px-2" id="swrapper">
          <div
            className={`${cat?.urlShortner?.slug}-wrapper w-full overflow-hidden`}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>

        {/* BIRTHDAY MODAL */}
        {asPath.includes("/glamm-insider") && <BirthdayModal view={birthdayPopup} hide={() => setBirthdayPopup(false)} />}
      </main>
    </React.Fragment>
  );
}

// CategoryStatic.getInitialProps = async (ctx: NextPageContext) => {
//   const slug = ctx.query.category;

//   const where = {
//     "urlShortner.slug": encodeURIComponent(`/${slug}`),
//   };

//   const pageApi = new PageAPI();

//   try {
//     const cat = await pageApi.getPage(0, where);
//     if (cat.data.data.count === 0) {
//       // log URI for help with debugging using cloudwatch logs
//       // not able to get source-maps to work with console.log on the server
//       // ideally we should we using something like Sentry
//       // or use newrelic to log with proper tracebacks etc.
//       logURI(ctx.asPath);
//       if (ctx.res) {
//         ctx.res.statusCode = 404;
//         return ctx.res.end("Not Found");
//       }
//       return { errorCode: 404 };
//     }

//     return { cat: cat.data.data.data[0] };
//   } catch (error: any) {
//     // log URI for help with debugging using cloudwatch logs
//     // not able to get source-maps to work with console.log on the server
//     // ideally we should we using something like Sentry
//     // or use newrelic to log with proper tracebacks etc.
//     logURI(ctx.asPath);
//     if (ctx.res) {
//       ctx.res.statusCode = 500;
//       return ctx.res.end("Server Error");
//     }
//     return {
//       errorCode: 404,
//     };
//   }
// };

export default CategoryStatic;
