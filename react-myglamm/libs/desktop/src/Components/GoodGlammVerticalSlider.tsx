import React, { useEffect, useRef, useState } from "react";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import ArrowIcon from "../../../UX/public/svg/arrow-left.svg";

interface SliderProps {
  children: any;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
  initSlide?: number;
  slidesPerView?: number;
  slidesToScroll?: number;
  widgetName?: string;
  slideChanged?: (index: number) => void;
  arrowClass?: { left: string; right?: string };
}

const SNAP_STYLE = { scrollBehavior: "smooth", scrollSnapType: "y mandatory" } as React.CSSProperties;

const GoodGlammVerticalSlider = ({
  children,
  className,
  initSlide,
  slidesPerView = 1,
  slidesToScroll = 1,
  slideChanged,
  arrowClass,
}: SliderProps) => {
  const containerRef = useRef(null);
  const currentSlideRef = useRef(initSlide || 0);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initSlide || 0);

  const CHILDRENS = [...Array(React.Children.count(children)).keys()];

  /* Callback To track the current slide in user's viewport */
  function observerCallback() {
    if (containerRef.current) {
      let SELECTED_INDEX = 0;
      let topestSlide: number;

      const CONTAINER_DIMENSION = (containerRef.current as HTMLDivElement)?.getBoundingClientRect();
      const SLIDES = (containerRef.current as HTMLDivElement).children;

      CHILDRENS.forEach((index: number) => {
        const CURRENT_SLIDE_DIMENSION = (SLIDES[index] as HTMLElement)?.getBoundingClientRect();

        const currentTop = CURRENT_SLIDE_DIMENSION?.top - CONTAINER_DIMENSION?.top;
        if (currentTop > -1 && (typeof topestSlide === "undefined" || topestSlide > currentTop)) {
          topestSlide = currentTop;
          SELECTED_INDEX = +((SLIDES[index] as HTMLElement).dataset.index as string);
        }
      });

      /* give callback only incase index is different then current index */
      if (currentSlideRef.current !== SELECTED_INDEX) {
        slideChanged?.(SELECTED_INDEX);
      }

      setCurrentSlideIndex(SELECTED_INDEX);
      currentSlideRef.current = SELECTED_INDEX;
    }
  }

  /* Changing Slide Based on the Index Provide */
  function changeSlide(index: number, smoothBehaviour = true) {
    const CONTAINER = containerRef.current as unknown as HTMLDivElement;
    const topestPosition = (CONTAINER.clientHeight / slidesPerView) * index;

    /* Scroll Behaviour change to Auto incase we don't wanna show animation for certain usecases */
    if (CONTAINER) {
      if (smoothBehaviour) CONTAINER.style.scrollBehavior = "smooth";
      else CONTAINER.style.scrollBehavior = "auto";
      CONTAINER.scrollTop = document.dir === "rtl" ? -topestPosition : topestPosition;
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
          CURRENT_SLIDE.style.scrollSnapAlign = "start";
          CURRENT_SLIDE.style.scrollSnapStop = "always";
          // CURRENT_SLIDE.style.height = `${slidesPerView ? 100 / slidesPerView : 100}%`;
          CURRENT_SLIDE.style.flexShrink = "0";

          /* Attaching Intersection Observer to track and id to know index */
          observer.observe(CURRENT_SLIDE);
          CURRENT_SLIDE.dataset.index = index.toString();
        }
      });

      const CONTAINER_HEIGHT = (SLIDES?.[0] as HTMLElement)?.clientHeight * slidesPerView;
      (containerRef.current as HTMLDivElement).style.height = `${CONTAINER_HEIGHT}px`;
      // @ts-ignore
      (containerRef.current as HTMLDivElement).parentElement.style.height = `${CONTAINER_HEIGHT}px`;
    }
  }, [children]);

  /* Scroll to the required slide if provided otherwise first */
  useEffect(() => {
    if (initSlide) changeSlide(initSlide, false);
    else changeSlide(0, false);
  }, []);

  const DISABLE_LEFT = currentSlideIndex === 0;
  const DISABLE_RIGHT = currentSlideIndex >= CHILDRENS.length - slidesPerView;

  return (
    <div className={`${className || ""} G3Slider relative`}>
      <div
        tabIndex={0}
        aria-live="off"
        ref={containerRef}
        style={{ ...SNAP_STYLE }}
        className="overflow-y-scroll overflow-x-hidden flex flex-col m-auto items-center"
      >
        {children}
      </div>

      {(() => {
        if (CHILDRENS.length > slidesPerView && IS_DESKTOP) {
          return (
            <>
              <button
                type="button"
                disabled={DISABLE_LEFT}
                onClick={() => changeSlide(currentSlideIndex - slidesToScroll, true)}
                className={`absolute w-max inset-x-0 -top-6 mx-auto my-0 rotate-90 rtl:rotate-180 ${
                  DISABLE_LEFT ? "opacity-75" : ""
                } ${arrowClass?.left || ""}`}
              >
                <ArrowIcon />
              </button>
              <button
                type="button"
                disabled={DISABLE_RIGHT}
                onClick={() => changeSlide(currentSlideIndex + slidesToScroll, true)}
                className={`absolute w-max inset-x-0 -bottom-6 mx-auto my-0 -rotate-90 rtl:rotate-180 ${
                  arrowClass?.right || ""
                }`}
              >
                <ArrowIcon />
              </button>
            </>
          );
        }

        return null;
      })()}
    </div>
  );
};

export default GoodGlammVerticalSlider;
