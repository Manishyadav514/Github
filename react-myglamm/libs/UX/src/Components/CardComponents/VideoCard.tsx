import React, { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import ShareIcon from "../../../public/svg/shareandearn.svg";

const DynamicVideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "@libComponents/PopupModal/VideoModal"), {
  ssr: false,
});

function VideoCard({ video, isSingleVideo }: any) {
  const [isVideoOpen, setVideoOpen] = useState<boolean>(false);

  const toggleShareModal = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: video.assetDetails?.url,
      productName: video.assetDetails?.name,
      module: "page",
      image: video.assetDetails?.properties?.thumbnailUrl || DEFAULT_IMG_PATH(),
      overrideRouterPath: "glammstudio",
    };
  };

  const toggleVideoModal = () => {
    setVideoOpen(prevState => !prevState);
  };
  return (
    <React.Fragment>
      <div className={clsx("relative", !isSingleVideo && "mr-2")}>
        {/* Share And Earn Icon */}
        <div className="absolute flex w-full justify-end p-2 pt-3 pr-5 z-10">
          <ShareIcon onClick={toggleShareModal} role="img" aria-labelledby="share & earn" title="share & earn" />
        </div>
        <div className="absolute flex w-full justify-end p-2 pr-3">
          <div
            style={{
              width: "58px",
              height: "33px",
              opacity: "0.16",
              borderRadius: "6px",
              backgroundColor: "#3d3c3c",
            }}
          />
        </div>
        <button
          type="button"
          onClick={toggleVideoModal}
          className="outline-none"
          style={{
            width: isSingleVideo ? "100%" : "340px",
            height: isSingleVideo ? "100%" : "280px",
          }}
        >
          <ImageComponent
            src={video.assetDetails?.properties?.thumbnailUrl}
            alt={video.assetDetails?.properties?.title}
            className="rounded-lg"
          />
          <div className="relative flex bg-white z-10 -mt-8" style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.06)" }}>
            <div className="px-3 py-2 w-4/5">
              <p className="text-smfont-thin text-left">{video.assetDetails?.properties?.title}</p>
            </div>

            <img
              style={{
                width: "57px",
                padding: "10px",
                position: "absolute",
                right: "12px",
                top: "-16px",
                borderRadius: "30px",
              }}
              alt="playbutton"
              className="bg-white"
              src="https://files.myglamm.com/site-images/original/ico-play-with-curve.png"
            />
          </div>
        </button>
      </div>

      <DynamicVideoModal
        isOpen={isVideoOpen}
        onRequestClose={toggleVideoModal}
        videoId={video.assetDetails.properties.videoId}
      />
    </React.Fragment>
  );
}

export default VideoCard;
