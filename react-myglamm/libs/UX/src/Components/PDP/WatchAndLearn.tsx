import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

import { PDPProd } from "@typesLib/PDP";

import PDPLabel from "@libComponents/PDP/PDPLabel";
import PDPVideoCard from "@libComponents/PDP/PDPVideoCard";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "@libComponents/PopupModal/VideoModal"), {
  ssr: false,
});

const WatchAndLearn = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const videoSlides = product.assets?.filter(x => x.type === "video");
  const videoSlider = useRef<HTMLDivElement>(null);

  const [activeVideoModalId, setActiveVideoModalId] = useState<string>();

  const handleModal = (vidId: string) => {
    setActiveVideoModalId(vidId);
  };

  // Commenting this code as this feature is not used currently.
  // useEffect(() => {
  //   /* By default, we have to click the video from watch and learn section to play the video. When the URL contains the #videoid and once the watch and learn section is in the viewport, then video modal will be automatically opened and video will be played. */

  //   if (videoSlider.current) {
  //     const hashVideoID = window.location.hash.substring(1);
  //     const observer = new IntersectionObserver(
  //       entries => {
  //         entries.forEach(entry => {
  //           if (entry.intersectionRatio > 0) {
  //             setIsOpen(true);
  //             setVideoId(hashVideoID);

  //             // Cleanup
  //             if (videoSlider.current) {
  //               observer.unobserve(videoSlider.current);
  //             }
  //           }
  //         });
  //       },
  //       {
  //         threshold: 0.1, // Only trigger when Element is 10% in viewPort
  //       }
  //     );

  //     if (hashVideoID && !hashVideoID?.includes("modal")) {
  //       observer.observe(videoSlider.current);
  //       setTimeout(() => {
  //         if (videoSlider.current) {
  //           videoSlider.current.scrollIntoView({
  //             behavior: "smooth",
  //             block: "end",
  //           });
  //         }
  //       }, 2000);
  //     }
  //   }
  // }, [videoSlider]);

  return (
    <div className="WatchAndLearn bg-white" ref={videoSlider}>
      {videoSlides.length > 0 && (
        <div className="my-5 px-3 py-2 pt-3">
          <PDPLabel label={t("watchAndLearn")} />
          <GoodGlammSlider dots="dots">
            {videoSlides.map((vidSlider: any) => (
              <PDPVideoCard key={vidSlider.url} content={vidSlider} handleModal={handleModal} />
            ))}
          </GoodGlammSlider>
        </div>
      )}

      {typeof activeVideoModalId === "string" && (
        <VideoModal isOpen={activeVideoModalId} onRequestClose={() => setActiveVideoModalId("")} videoId={activeVideoModalId} />
      )}
    </div>
  );
};
export default WatchAndLearn;
