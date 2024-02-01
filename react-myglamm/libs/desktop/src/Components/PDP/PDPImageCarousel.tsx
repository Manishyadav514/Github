import React, { useState } from "react";
import dynamic from "next/dynamic";

import { PDPProd } from "@typesLib/PDP";

import { patchCarouselImages } from "@productLib/pdp/pdpUtils";

import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { SHOP } from "@libConstants/SHOP.constant";

import ImageMagnifier from "./ImageMagnifier";
import { SHARE_URLS } from "../../Constants/User.constant";
import GoodGlammVerticalSlider from "../GoodGlammVerticalSlider";

const ZoomedImgModal = dynamic(() => import(/* webpackChunkName: "ZoomedImageModalWeb" */ "../Popupmodals/ZoomedImgModal"), {
  ssr: false,
});

const PDPImageCarousel = ({ product }: { product: PDPProd }) => {
  const { assets } = product;

  const carouselSlides = patchCarouselImages(assets);

  const [activeSlide, setActiveSlide] = useState(carouselSlides?.[0]);
  const [zoomedImgModal, setZoomedImgModal] = useState<undefined | boolean>();

  useEffectAfterRender(() => {
    setActiveSlide(carouselSlides?.[0]);
  }, [product.id]);

  return (
    <figure className="pb-7 px-4 sticky top-40 flex w-2/5 z-10 h-max">
      <div className="pt-4 pr-2">
        <GoodGlammVerticalSlider slidesPerView={4}>
          {carouselSlides?.map(slide => (
            <button
              type="button"
              style={{ height: "80px" }}
              key={slide.item.id || slide.item.url}
              onClick={() => setActiveSlide(slide)}
              className="p-1 flex items-center justify-center"
            >
              <ImageComponent width={72} height={72} alt={slide.alt} src={slide.src || slide.item.properties.thumbnailUrl} />
            </button>
          ))}
        </GoodGlammVerticalSlider>
      </div>

      <div className="relative">
        {activeSlide?.type === "video" ? (
          <iframe
            title="video"
            id="pro-video"
            allow="autoplay"
            allowFullScreen
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${activeSlide.item.properties.videoId}?autoplay=1`}
          />
        ) : (
          <ImageMagnifier
            callback={() => setZoomedImgModal(true)}
            src={activeSlide?.item.imageUrl?.["800x800"] || (activeSlide?.src as string)}
          />
        )}

        {typeof zoomedImgModal === "boolean" && (
          <ZoomedImgModal
            show={zoomedImgModal}
            activeImg={activeSlide}
            carouselSlides={carouselSlides}
            hide={() => setZoomedImgModal(false)}
          />
        )}

        {SHOP.IS_MYGLAMM && (
          <ul className="list-none flex justify-center absolute -bottom-6 inset-x-0 mx-auto">
            {SHARE_URLS.map(share => (
              <li key={share.name}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  title={share.name}
                  className="flex items-center justify-center mx-3"
                  href={share.url.replace("{shareURL}", encodeURIComponent(product?.urlShortner?.shortUrl))}
                >
                  <img src={share.icon} width={22} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  );
};

export default PDPImageCarousel;
