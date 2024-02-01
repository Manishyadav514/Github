import React, { useState } from "react";
import dynamic from "next/dynamic";

import { LazyLoadComponent, LazyLoadImage } from "react-lazy-load-image-component";

import { getStaticUrl } from "@libUtils/getStaticUrl";

const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "../Popupmodals/videoModal"), { ssr: false });

const STBBrandStory = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <LazyLoadComponent>
      <section className="text-center w-full relative overflow-hidden  max-w-screen-xl mx-auto">
        <video id="bg-video" autoPlay loop muted className="aspect-video w-full">
          <source src={getStaticUrl("/global/videos/STBBrandStory.webm")} type="video/webm" />
          <source src={getStaticUrl("/global/videos/STBBrandStory.mp4")} type="video/mp4" />
        </video>

        <div className="inset-0 m-auto absolute z-10 text-center text-white max-w-5xl translate-y-1/3">
          <LazyLoadImage
            alt="icon-play"
            className="mx-auto cursor-pointer"
            onClick={() => setShowVideo(true)}
            src="https://files.myglamm.com/site-images/original/ico-play.png"
          />
        </div>

        <VideoModal show={showVideo} hide={() => setShowVideo(false)} videoId="knn-Ux4GzLo" />
      </section>
    </LazyLoadComponent>
  );
};

export default STBBrandStory;
