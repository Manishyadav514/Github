import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import HomeWidgetLabel from "./HomeWidgetLabel";

import VideoModal from "../Popupmodals/videoModal";

import ViewVideo from "../../../public/svg/viewVideo.svg";
import VideoCurve from "../../../public/svg/videoCurve.svg";

const VideoCarousel = ({ data }: any) => {
  const [videoId, setVideoId] = useState("");
  const [showVideoModal, setVideoModal] = useState(false);

  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full homeWidget">
      <HomeWidgetLabel title={data.commonDetails.title} />

      <GoodGlammSlider slidesPerView={3} arrowClass={{ left: "-left-8", right: "-right-8" }}>
        {data.multimediaDetails.map((video: any) => (
          <figure className="hover:scale-105 px-6 relative" key={video.headerText}>
            <LazyLoadImage
              className="cursor-pointer"
              src={video.assetDetails.properties.thumbnailUrl}
              alt={video.headerText}
              onClick={() => {
                setVideoId(video.assetDetails.properties.videoId);
                setVideoModal(true);
              }}
            />
            <div className="relative">
              <div className="bg-white h-14 absolute bottom-0 w-full p-2 line-clamp-2">{video.sliderText}</div>
              <VideoCurve className="absolute -top-16 right-4" />
              <ViewVideo className="absolute -top-16 right-7" />
            </div>
          </figure>
        ))}
      </GoodGlammSlider>

      <VideoModal videoId={videoId} show={showVideoModal} hide={() => setVideoModal(false)} />
    </section>
  );
};

export default VideoCarousel;
