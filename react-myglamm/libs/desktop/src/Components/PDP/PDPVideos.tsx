import React, { useState } from "react";

import { GlobalAsset } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

const PDPVideos = ({ videos }: { videos: GlobalAsset[] }) => {
  const { t } = useTranslation();

  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  const handleSelectVideo = (video: GlobalAsset) => {
    const tempVideo = video;
    tempVideo.properties.videoId = `${tempVideo.properties.videoId}?autoplay=1`;
    setSelectedVideo(tempVideo);
  };

  useEffectAfterRender(() => {
    setSelectedVideo(videos[0]);
  }, []);

  return (
    <section className="px-8">
      <h2 className="font-bold text-3xl text-center pb-6 pt-8">{t("watchAndLearn")}</h2>

      <div className="flex justify-between pb-2 gap-10">
        <iframe
          title="video"
          allow="autoplay"
          allowFullScreen
          id="vid_container"
          className="iframe-video aspect-video w-1/2 h-min"
          src={`https://www.youtube.com/embed/${selectedVideo.properties.videoId}`}
        />

        <div className="w-1/2">
          <h2 className="font-bold mt-2 mb-3 text-2xl">{selectedVideo?.properties.title}</h2>
          <div
            id="vid_description"
            className="text-18"
            dangerouslySetInnerHTML={{ __html: selectedVideo?.properties.description }}
          />
        </div>
      </div>

      {videos.length > 1 && (
        <GoodGlammSlider slidesPerView={3}>
          {videos.map(video => {
            const { videoId, title, thumbnailUrl } = video.properties;

            return (
              <button onClick={() => handleSelectVideo(video)} key={videoId} type="button" className="px-4 my-4">
                <ImageComponent
                  alt={title}
                  src={thumbnailUrl}
                  className={`border-4 border-transparent hover:border-black ${
                    videoId === selectedVideo.properties.videoId ? "border-black" : ""
                  }`}
                />
              </button>
            );
          })}
        </GoodGlammSlider>
      )}
    </section>
  );
};

export default PDPVideos;
