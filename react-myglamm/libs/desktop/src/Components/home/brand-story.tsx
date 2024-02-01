import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { LazyLoadComponent, LazyLoadImage } from "react-lazy-load-image-component";

import useTranslation from "@libHooks/useTranslation";

import { getStaticUrl } from "@libUtils/getStaticUrl";

const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "../Popupmodals/videoModal"), { ssr: false });

const BrandStory = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { t } = useTranslation();

  return (
    <LazyLoadComponent>
      <section className="text-center w-full relative overflow-hidden  max-w-screen-xl mx-auto">
        <video id="bg-video" autoPlay loop muted className="aspect-video w-full">
          <source src={getStaticUrl("/global/videos/TellMyGlammWhatYouWant.webm")} type="video/webm" />
          <source src={getStaticUrl("/global/videos/TellMyGlammWhatYouWant.mp4")} type="video/mp4" />
        </video>

        <div className="inset-0 m-auto absolute z-10 text-center text-white max-w-5xl translate-y-1/3">
          <h2 className="text-5xl mb-12">{t("brandStory")}</h2>
          <p>
            {t("brandDescription")}
            <br />
            <Link href="/about-us" prefetch={false} className="text-themeGolden hover:text-themeGolden">
              {t("knowMore")}
            </Link>
          </p>
          <LazyLoadImage
            alt="icon-play"
            className="mx-auto cursor-pointer"
            onClick={() => setShowVideo(true)}
            src="https://files.myglamm.com/site-images/original/ico-play.png"
          />
        </div>

        <VideoModal show={showVideo} hide={() => setShowVideo(false)} videoId="GdcxfyKNiDg" />
      </section>
    </LazyLoadComponent>
  );
};

export default BrandStory;
