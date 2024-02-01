/* eslint-disable arrow-body-style */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import debounce from "lodash.debounce";

// import clsx from "clsx";
import ProgressiveImage from "react-progressive-graceful-image";
import { check_webp_feature } from "@libUtils/webp";
import LazyHydrate from "react-lazy-hydration";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ZoomModal = dynamic(() => import(/* webpackChunkName: "ProductZoomModal" */ "@libComponents/PopupModal/ZoomModal"), {
  ssr: false,
});
const VideoModal = dynamic(() => import(/* webpackChunkName: "VideoModal" */ "@libComponents/PopupModal/VideoModal"), {
  ssr: false,
});

const CarouselImage = (props: any) => {
  const [zoomModal, setZoomModal] = useState<boolean | undefined>();
  return (
    <>
      <Image
        priority={props.priority}
        lazyBoundary="0px"
        unoptimized={props.disableImageComponent}
        width={props.width}
        height={props.height}
        src={props.src}
        alt={props.alt}
        onClick={() => setZoomModal(true)}
      />
      {typeof zoomModal === "boolean" && (
        <ZoomModal
          index={props.index}
          title={props.title}
          isOpen={zoomModal}
          onRequestClose={() => setZoomModal(false)}
          assets={props.carouselSlides.map((img: any) => img.item)}
          category={props.categoryDetails?.childCategoryName}
          subCategory={props.categoryDetails?.subChildCategoryName}
        />
      )}
    </>
  );
};

interface SnapCarouselProps {
  title: string;
  carouselSlides: any;
  categoryDetails: any;
  videoStyle?: React.CSSProperties;
  carouselStyle?: string;
  dimension?: number;
  onScrollCallback?: any;
}

const SnapCarousel = ({
  title,
  carouselSlides,
  categoryDetails,
  videoStyle,
  carouselStyle,
  dimension = 300,
  onScrollCallback,
}: SnapCarouselProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<null | string>(null);

  const [disableImageComponent, setDisableImageComponent] = useState(false);
  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  const handleModal = (vidId?: string) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (vidId) {
      setVideoId(vidId);
    }
  };

  const defaultCarouselStyle = `
  .carousel {
    height: 300px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
  }

  .carousel__item {
    height: 300px;
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

  return (
    <section className="PDPBanner" aria-roledescription="carousel" aria-label="PDP Carousel">
      <style>{carouselStyle || defaultCarouselStyle}</style>
      <GoodGlammSlider
        dots="dots"
        className="pt-4 pb-2"
        slideChanged={debounce((index: number) => onScrollCallback?.(index), 300)}
      >
        {carouselSlides.map((asset: any, index: number) => {
          return (
            <div
              key={index}
              className="carousel__item flex justify-center w-full"
              id={`carousel-item-${index + 1}`}
              role="tabpanel"
              aria-roledescription="slide"
            >
              {asset.type === "image" && (
                <LazyHydrate whenVisible>
                  <CarouselImage
                    index={index}
                    disableImageComponent={disableImageComponent}
                    carouselSlides={carouselSlides}
                    categoryDetails={categoryDetails}
                    priority={index === 0}
                    width={dimension}
                    height={dimension}
                    src={asset.src}
                    title={title}
                    alt={asset?.item?.properties?.altText || asset?.item?.name}
                  />
                </LazyHydrate>
              )}
              {asset.type === "video" && (
                <>
                  <div
                    role="presentation"
                    className="relative"
                    onClick={() => {
                      handleModal(asset.item?.properties.videoId);
                    }}
                  >
                    <LazyHydrate whenVisible>
                      {/* @ts-ignore TODO */}
                      <ProgressiveImage
                        placeholder={DEFAULT_IMG_PATH()}
                        src={asset.item?.properties?.thumbnailUrl}
                        rootMargin="0% 0% 0%"
                        threshold={[0.1]}
                      >
                        {(imgsrc: string) => (
                          <img src={imgsrc} alt={asset?.item?.name} className="h-auto videoCarouselHeight object-contain" />
                        )}
                      </ProgressiveImage>
                    </LazyHydrate>
                    <div className="flex justify-center videoCarouselHeight items-center h-full w-full absolute top-0 left-0">
                      <div style={videoStyle} />
                    </div>
                    {videoId && <VideoModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} videoId={videoId} />}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </GoodGlammSlider>
    </section>
  );
};
SnapCarousel.whyDidYouRender = true;
export default SnapCarousel;
