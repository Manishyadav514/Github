import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import ImageComponent from "./LazyLoadImage";

import LeftArrow from "../../../public/svg/slickArrowLeft.svg";
import RightArrow from "../../../public/svg/slickArrowRight.svg";

interface SliderProps {
  children: any;
  autoPlay?: boolean;
  dots?: "dots" | "full" | any[];
  autoPlayDelay?: number;
  className?: string;
  initSlide?: number;
  slidesPerView?: number;
  slidesToScroll?: number;
  widgetName?: string;
  slideChanged?: (index: number) => void;
  arrowClass?: { left: string; right?: string };
  enableBannerUIv2?: boolean;
}

const SNAP_STYLE = { scrollBehavior: "smooth", scrollSnapType: "x mandatory" } as React.CSSProperties;

const GoodGlammSlider = ({
  children,
  autoPlay,
  autoPlayDelay,
  dots,
  className,
  initSlide,
  slidesPerView = 1,
  slidesToScroll = 1,
  widgetName = "carousel",
  slideChanged,
  arrowClass,
  enableBannerUIv2 = false,
}: SliderProps) => {
  const dotsRef = useRef(null);
  const containerRef = useRef(null);
  const currentSlideRef = useRef(initSlide || 0);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initSlide || 0);

  const CHILDRENS = [...Array(React.Children.count(children)).keys()];

  let autoPlayInterval: NodeJS.Timer;

  /* Callback To track the current slide in user's viewport */
  function observerCallback() {
    if (containerRef.current) {
      let SELECTED_INDEX = 0;
      let leftestSlide: number;

      const SLIDES = (containerRef.current as HTMLDivElement).children;

      CHILDRENS.forEach((index: number) => {
        const CURRENT_SLIDE_DIMENSION = (SLIDES[index] as HTMLElement)?.getBoundingClientRect();

        if (
          CURRENT_SLIDE_DIMENSION &&
          CURRENT_SLIDE_DIMENSION.left > -1 &&
          (typeof leftestSlide === "undefined" || leftestSlide > CURRENT_SLIDE_DIMENSION.left)
        ) {
          leftestSlide = CURRENT_SLIDE_DIMENSION.left;
          SELECTED_INDEX = +((SLIDES[index] as HTMLElement).dataset.index as string);
        }
      });

      /* give callback only incase index is different then current index */
      if (currentSlideRef.current !== SELECTED_INDEX) {
        slideChanged?.(SELECTED_INDEX);
      }

      setCurrentSlideIndex(SELECTED_INDEX);
      currentSlideRef.current = SELECTED_INDEX;

      /* In case of Assests Provided and overflow for dots scroll them to have them in viewport always */
      if (dotsRef.current) {
        const leftPosition = 58 * SELECTED_INDEX;
        (dotsRef.current as HTMLElement).scrollLeft = document.dir === "rtl" ? -leftPosition : leftPosition;
      }
    }
  }

  /* Changing Slide Based on the Index Provide */
  function changeSlide(index: number, smoothBehaviour = true) {
    const CONTAINER = containerRef?.current as unknown as HTMLDivElement;
    const leftPosition = (CONTAINER?.clientWidth / slidesPerView) * index;

    /* Scroll Behaviour change to Auto incase we don't wanna show animation for certain usecases */
    if (CONTAINER) {
      if (smoothBehaviour) CONTAINER.style.scrollBehavior = "smooth";
      else CONTAINER.style.scrollBehavior = "auto";

      CONTAINER.scrollLeft = document.dir === "rtl" ? -leftPosition : leftPosition;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { rootMargin: "0px", threshold: 1 });

    if (containerRef.current) {
      const SLIDES = (containerRef.current as HTMLDivElement).children;

      CHILDRENS.forEach((index: number) => {
        const CURRENT_SLIDE = SLIDES[index] as HTMLElement;

        if (CURRENT_SLIDE) {
          /* Assigning Snap Styling to Children Slides */
          CURRENT_SLIDE.style.scrollSnapStop = "always";
          CURRENT_SLIDE.style.width = `${slidesPerView ? 100 / slidesPerView : 100}%`;
          if (enableBannerUIv2) {
            const image = CURRENT_SLIDE.getElementsByTagName("img")[0];
            CURRENT_SLIDE.style.height = `${image.height}px`;
            CURRENT_SLIDE.style.scrollSnapAlign = "center";
          } else {
            CURRENT_SLIDE.style.scrollSnapAlign = "start";
            CURRENT_SLIDE.style.flexShrink = "0";
          }

          /* Attaching Intersection Observer to track and id to know index */
          observer.observe(CURRENT_SLIDE);
          CURRENT_SLIDE.dataset.index = index.toString();
        }
      });
    }

    /* AutoPlay Logic Trigger */
    if (autoPlay) {
      autoPlayInterval = setInterval(() => {
        const NEXT_SLIDE_INDEX = currentSlideRef.current + slidesToScroll;
        const NOT_LAST_SLIDE = NEXT_SLIDE_INDEX < CHILDRENS.length;

        changeSlide(NOT_LAST_SLIDE ? NEXT_SLIDE_INDEX : 0, NOT_LAST_SLIDE);
      }, autoPlayDelay || 10000);
    }

    return () => clearInterval(autoPlayInterval);
  }, [children]);

  /* Scroll to the required slide if provided otherwise first */
  useEffect(() => {
    if (initSlide) changeSlide(initSlide, false);
    else changeSlide(0, false);
  }, []);

  // 3d banner slide change
  useEffect(() => {
    if (enableBannerUIv2 && containerRef.current) {
      const SLIDES = (containerRef.current as HTMLDivElement).children;
      const CURRENT_SLIDE = SLIDES[currentSlideIndex] as HTMLElement;
      const currentImage = CURRENT_SLIDE.getElementsByTagName("img")[0];
      if (currentImage) {
        currentImage.style.transition = "0.5s ease-in-out";
        currentImage.style.padding = "0px 0px";
      }

      let PREVIOUS_SLIDE;
      let NEXT_SLIDE;
      if (currentSlideIndex != 0) {
        PREVIOUS_SLIDE = SLIDES[currentSlideIndex - 1] as HTMLElement;
        const prevImg = PREVIOUS_SLIDE.getElementsByTagName("img")[0];
        if (prevImg) {
          prevImg.style.transition = "0.5s ease-in-out";
          prevImg.style.padding = "0px 16px";
        }
      }
      if (currentSlideIndex != SLIDES.length - 1) {
        NEXT_SLIDE = SLIDES[currentSlideIndex + 1] as HTMLElement;
        const nextImage = NEXT_SLIDE.getElementsByTagName("img")[0];
        if (nextImage) {
          nextImage.style.transition = "0.5s ease-in-out";
          nextImage.style.padding = "0px 16px";
        }
      }
    }
  }, [currentSlideIndex]);

  const DISABLE_LEFT = currentSlideIndex === 0;
  const DISABLE_RIGHT = currentSlideIndex >= CHILDRENS.length - slidesPerView;

  return (
    <div className={`${className || ""} G3Slider relative`}>
      <div
        tabIndex={0}
        ref={containerRef}
        style={SNAP_STYLE}
        aria-live={autoPlay ? "off" : "polite"}
        className={`w-full overflow-x-scroll overflow-y-hidden flex m-auto items-center ${
          CHILDRENS?.length < slidesPerView ? "justify-center" : ""
        } ${enableBannerUIv2 && " space-x-4  px-10"}`}
      >
        {children}
      </div>

      {(() => {
        if (CHILDRENS.length > slidesPerView && IS_DESKTOP) {
          if (className === "SINGLE_COLLECTION") {
            return (
              <div className="bg-white rounded-full absolute -top-10 right-0 flex justify-around items-center w-20 p-1 shadow">
                <button
                  type="button"
                  disabled={DISABLE_LEFT}
                  onClick={() => changeSlide(currentSlideIndex - slidesToScroll, true)}
                  className={`grow rtl:rotate-180 ${DISABLE_LEFT ? "opacity-50" : ""}`}
                >
                  <img
                    alt="leftArrow"
                    className="rotate-180 w-3 h-3 m-auto"
                    src="https://files.myglamm.com/site-images/original/multimedia.png"
                  />
                </button>
                |
                <button
                  type="button"
                  disabled={DISABLE_RIGHT}
                  onClick={() => changeSlide(currentSlideIndex + slidesToScroll, true)}
                  className={`grow rtl:rotate-180 ${DISABLE_RIGHT ? "opacity-50" : ""}`}
                >
                  <img
                    alt="rightArrow"
                    className="w-3 h-3 m-auto"
                    src="https://files.myglamm.com/site-images/original/multimedia.png"
                  />
                </button>
              </div>
            );
          }

          return (
            <>
              <button
                type="button"
                disabled={DISABLE_LEFT}
                onClick={() => changeSlide(currentSlideIndex - slidesToScroll, true)}
                className={`absolute inset-y-0 my-auto h-max rtl:rotate-180 ${DISABLE_LEFT ? "opacity-75" : ""} ${
                  arrowClass?.left || "left-0"
                }`}
              >
                <LeftArrow />
              </button>
              <button
                type="button"
                disabled={DISABLE_RIGHT}
                onClick={() => changeSlide(currentSlideIndex + slidesToScroll, true)}
                className={`absolute inset-y-0 my-auto h-max rtl:rotate-180 ${DISABLE_RIGHT ? "opacity-75" : ""} ${
                  arrowClass?.right || "right-0"
                }`}
              >
                <RightArrow />
              </button>
            </>
          );
        }

        return null;
      })()}

      {/* SLIDER DOTS - Full / Dots / Assets(Images of Products) represented with */}
      {(() => {
        if (dots && CHILDRENS.length > 1) {
          if (Array.isArray(dots)) {
            return (
              <ul
                ref={dotsRef}
                style={SNAP_STYLE}
                className="p-1 mt-4 overflow-x-scroll overflow-y-hidden fixed right-0 left-4 whitespace-nowrap bottom-7"
                role="tablist"
                aria-label="Slides"
              >
                {dots.map((img: any, index: number) => (
                  <li
                    key={index}
                    onClick={() => changeSlide(index)}
                    className={clsx(
                      "inline-block m-2",
                      currentSlideIndex === index && "Thumbnail--active rounded-lg border border-gray-800"
                    )}
                    role="tab"
                    aria-label={`Slide ${index + 1}`}
                    aria-selected={index === currentSlideIndex ? "true" : "false"}
                    aria-controls={`${widgetName?.toLowerCase()?.split(" ")?.join("-")}-item-${index + 1}`}
                  >
                    <div aria-hidden className="flex justify-center h-14 w-14 outline-none">
                      <ImageComponent
                        alt={img?.name}
                        src={img?.properties?.thumbnailUrl || img?.url}
                        className="self-center h-10 w-10 object-contain"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            );
          }

          switch (dots) {
            case "dots":
              return (
                <ul className="carousel__dots text-center list-none w-full z-10" role="tablist" aria-label="Slides">
                  {CHILDRENS.map((idx: number) => (
                    <li
                      key={`dots-${idx}`}
                      onClick={() => changeSlide(idx)}
                      className={clsx(
                        "carousel__dots-item w-1.5 h-1.5 rounded inline-block outline-none",
                        idx === currentSlideIndex ? "__active bg-color1" : "bg-color2"
                      )}
                      role="tab"
                      aria-label={`Slide ${idx + 1}`}
                      aria-selected={idx === currentSlideIndex ? "true" : "false"}
                      aria-controls={`${widgetName?.toLowerCase()?.split(" ")?.join("-")}-item-${idx + 1}`}
                    />
                  ))}
                </ul>
              );

            case "full":
              return (
                <ul className="list-none bottom-4 w-full flex py-3 z-10" role="tablist" aria-label="Slides">
                  {CHILDRENS.map((idx: number) => (
                    <li
                      key={`dots-${idx}`}
                      onClick={() => changeSlide(idx)}
                      className={clsx(
                        "carousel__dots-item h-1.5 rounded outline-none w-full",
                        idx === currentSlideIndex ? "bg-color1" : "bg-color2"
                      )}
                      role="tab"
                      aria-label={`Slide ${idx + 1}`}
                      aria-selected={idx === currentSlideIndex ? "true" : "false"}
                      aria-controls={`${widgetName?.toLowerCase()?.split(" ")?.join("-")}-item-${idx + 1}`}
                    />
                  ))}
                </ul>
              );

            default:
              return null;
          }
        }

        return null;
      })()}
    </div>
  );
};

export default GoodGlammSlider;
