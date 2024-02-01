import React, { useEffect, useState, useRef } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";

import { ValtioStore } from "@typesLib/ValtioStore";

const MultimediaCarousel5 = ({ item }: any) => {
  const isPlayerReady = useRef(false);
  const [playVideo, setPlayVideo] = useState(false);
  const player = useRef<any>();

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  const videoAdobeEvent = () => {
    (window as any).digitalData = {
      common: {
        pageName: "web|ShraddhaKapoor|video",
        newPageName: "Shraddha Kapoor Video",
        subSection: ADOBE.ASSET_TYPE.TVC_SK_VIDEO,
        assetType: ADOBE.ASSET_TYPE.TVC_SK_VIDEO,
        newAssetType: ADOBE.ASSET_TYPE.TVC_SK_VIDEO,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.PageLoad();
  };

  useEffect(() => {
    if (!window?.YT) {
      // If not, load the script asynchronously

      const tag = document.createElement("script");
      tag.src = "//www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      // @ts-ignore
      firstScriptTag?.parentNode.insertBefore(tag, firstScriptTag);
      /* 
         Youtube API fires 'onYouTubeIframeAPIReady' when API 
         is loaded
      */

      window.onYouTubeIframeAPIReady = loadVideo;
    } else {
      // If script is already there, load the video directly
      loadVideo();
    }
  }, [playVideo]);

  const loadVideo = () => {
    // the Player object is created uniquely based on the id in props
    /* create a Youtube player and attach it to a div with 
         ID, apply player parameters and callback events
      */
    player.current = new window.YT.Player("player", {
      events: {
        onReady: onPlayerReady,
      },
    });
  };

  // this function is fired when player is ready for playing
  const onPlayerReady = (event: any) => {
    // if (isPlayerReady && !!isPlayerReady.current) {
    //   return;
    // }
    /* 
       It's important to mute the video before playing 
       since the browser does not allow autoplay with 
       sound on
    */
    if (player.current) {
      //player.current?.mute();
      //player.current?.playVideo();
      isPlayerReady.current = true;
    }
    videoAdobeEvent();
  };

  return (
    <ErrorBoundary>
      <section className="SquareVideoBanner my-5 px-3" role="banner">
        <div className="w-full outline-none relative">
          {playVideo && item?.multimediaDetails[0].assetDetails?.properties?.videoId ? (
            <iframe
              className="w-full h-[340px]"
              id="player"
              src={`https://www.youtube.com/embed/${item?.multimediaDetails[0].assetDetails?.properties?.videoId}?showinfo=0&enablejsapi=1`}
              frameBorder="0"
              allowFullScreen
              title="youtube video"
            />
          ) : (
            <img
              className="w-full rounded-md"
              alt={
                item?.multimediaDetails[0].imageAltTitle ||
                item?.multimediaDetails[0].assetDetails?.name ||
                item?.multimediaDetails[0].sliderText
              }
              src={item?.multimediaDetails[0].assetDetails?.properties?.thumbnailUrl}
            />
          )}
          {/* Play Button - VIDEO */}
          {!playVideo && item?.multimediaDetails[0].assetDetails?.properties?.videoId && (
            <img
              alt="Play Button"
              role="presentation"
              onClick={() => {
                setPlayVideo(true);
                //  loadVideo();
              }}
              className="absolute inset-0 m-auto w-16 h-16"
              src="https://files.myglamm.com/site-images/original/videoPlay.png"
            />
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default MultimediaCarousel5;
