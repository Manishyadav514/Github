import React, { useState } from "react";

import { GlobalAsset, PDPCarouselSlides } from "@typesLib/PDP";

import PopupModal from "@libComponents/PopupModal/PopupModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import GoodGlammVerticalSlider from "../GoodGlammVerticalSlider";

interface ZoomedImgProps {
  show: boolean;
  hide: () => void;
  carouselSlides: PDPCarouselSlides;
  activeImg: { src?: string; alt?: string; item: GlobalAsset; type: string };
}

const ZoomedImgModal = ({ show, carouselSlides, activeImg, hide }: ZoomedImgProps) => {
  const [selectedImg, setSelectedImg] = useState(activeImg);

  useEffectAfterRender(() => {
    if (show) setSelectedImg(activeImg);
  }, [show]);

  return (
    <PopupModal type="center-modal" show={show} onRequestClose={hide}>
      <section className="rounded-md bg-white px-8 py-16 flex relative items-center">
        <button
          type="button"
          onClick={hide}
          style={{ boxShadow: "0 1px 0 #fff" }}
          className="text-5xl font-bold absolute right-4 top-2 opacity-20 text-black hover:opacity-50"
        >
          ×
        </button>

        <GoodGlammVerticalSlider slidesPerView={6}>
          {carouselSlides.map(banner => (
            <button
              type="button"
              style={{ height: "94px" }}
              key={banner.item.id || banner.item.url}
              onClick={() => setSelectedImg(banner)}
              className="py-0.5 flex items-center justify-center"
            >
              <ImageComponent src={banner.src || banner.item.properties.thumbnailUrl} alt={banner.alt} height={90} width={90} />
            </button>
          ))}
        </GoodGlammVerticalSlider>

        <figure className="px-16">
          {selectedImg.type === "video" ? (
            <iframe
              title="video"
              id="pro-video"
              allow="autoplay"
              allowFullScreen
              width={600}
              className="aspect-video"
              src={`https://www.youtube.com/embed/${selectedImg.item.properties.videoId}?autoplay=1`}
            />
          ) : (
            <ImageComponent
              forceLoad
              width={600}
              height={600}
              alt={selectedImg.alt}
              src={selectedImg.item.imageUrl["1200x1200"] || selectedImg.src}
            />
          )}
        </figure>
      </section>
    </PopupModal>
  );
};

export default ZoomedImgModal;
