/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import LeftArrow from "../../public/svg/slickArrowLeft.svg";
import RightArrow from "../../public/svg/slickArrowRight.svg";

interface SliderProps {
  children: any;
  autoPlay?: boolean;
  dots?: boolean;
  autoPlayDelay?: number;
  className?: string;
  slidesPerView?: number;
  arrowClass?: { left: string; right?: string };
}

const SNAP_STYLE = { scrollBehavior: "smooth", scrollSnapType: "x mandatory" } as React.CSSProperties;

const GoodGlammSlider = ({
  children,
  autoPlay,
  autoPlayDelay,
  dots,
  className,
  slidesPerView = 1,
  arrowClass,
}: SliderProps) => {
  const dotsRef = useRef(null);
  const containerRef = useRef(null);
  const currentSlideRef = useRef(0);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const CHILDRENS = [...Array(React.Children.count(children)).keys()];

  let autoPlayInterval: NodeJS.Timer;

  /* Callback To track the current slide in user's viewport */
  function observerCallback(entries: any[]) {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const SELECTED_INDEX = parseInt(entry.target.dataset.index, 10);

        setCurrentSlideIndex(SELECTED_INDEX);
        currentSlideRef.current = SELECTED_INDEX;

        /* In case of Assests Provided and overflow for dots scroll them to have them in viewport always */
        if (dotsRef.current) {
          const leftPosition = 58 * SELECTED_INDEX;
          (dotsRef.current as HTMLElement).scrollLeft = document.dir === "rtl" ? -leftPosition : leftPosition;
        }
      }
    });
  }

  /* Changing Slide Based on the Index Provide */
  function changeSlide(index: number, smoothBehaviour = true) {
    const CONTAINER = containerRef.current as unknown as HTMLDivElement;

    /* Calculation - width of single child in contianer multiply to the index(to be moved to) minus slides perview */
    const leftPosition = (CONTAINER.offsetWidth / slidesPerView) * index;

    /* Not Using Intersection Observer incase of manual and no autplay so setting the state manually too */
    if (!autoPlay) {
      setCurrentSlideIndex(index);
      currentSlideRef.current = index;
    }

    /* Scroll Behaviour change to Auto incase we don't wanna show animation for certain usecases */
    if (CONTAINER) {
      if (smoothBehaviour) CONTAINER.style.scrollBehavior = "smooth";
      else CONTAINER.style.scrollBehavior = "auto";
      CONTAINER.scrollLeft = document.dir === "rtl" ? -leftPosition : leftPosition;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { rootMargin: "0px", threshold: 0.75 });

    if (containerRef.current) {
      const SLIDES = (containerRef.current as HTMLDivElement).children;

      CHILDRENS.forEach((index: number) => {
        const CURRENT_SLIDE = SLIDES[index] as HTMLElement;

        if (CURRENT_SLIDE) {
          /* Assigning Snap Styling to Children Slides */
          CURRENT_SLIDE.style.scrollSnapAlign = "start";
          CURRENT_SLIDE.style.scrollSnapStop = "always";
          CURRENT_SLIDE.style.width = `${slidesPerView ? 100 / slidesPerView : 100}%`;
          CURRENT_SLIDE.style.flexShrink = "0";

          /* Attaching Intersection Observer to track and id to know index */
          autoPlay && observer.observe(CURRENT_SLIDE);
          CURRENT_SLIDE.dataset.index = index.toString();
        }
      });
    }

    /* AutoPlay Logic Trigger */
    if (autoPlay) {
      autoPlayInterval = setInterval(() => {
        const NEXT_SLIDE_INDEX = currentSlideRef.current + 1;
        const NOT_LAST_SLIDE = NEXT_SLIDE_INDEX < CHILDRENS.length;

        changeSlide(NOT_LAST_SLIDE ? NEXT_SLIDE_INDEX : 0, NOT_LAST_SLIDE);
      }, autoPlayDelay || 10000);
    }

    return () => clearInterval(autoPlayInterval);
  }, [children]);

  const DISABLE_LEFT = currentSlideIndex === 0;
  const DISABLE_RIGHT = currentSlideIndex === CHILDRENS.length - slidesPerView;

  return (
    <div className={`${className || ""} G3Slider max-w-screen-xl mx-auto`}>
      <div className="relative">
        <div
          ref={containerRef}
          style={SNAP_STYLE}
          className="w-full overflow-x-hidden overflow-y-hidden flex m-auto  items-center hide-scrollbar-css"
        >
          {children}
        </div>

        {(() => {
          if (CHILDRENS.length > slidesPerView) {
            if (className === "SINGLE_COLLECTION") {
              return (
                <div className="bg-white rounded-full absolute -top-10 right-0 flex justify-around items-center w-20 p-1 shadow">
                  <button
                    type="button"
                    disabled={DISABLE_LEFT}
                    onClick={() => changeSlide(currentSlideIndex - 1, true)}
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
                    onClick={() => changeSlide(currentSlideIndex + 1, true)}
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
                  onClick={() => changeSlide(currentSlideIndex - 1, true)}
                  className={`absolute inset-y-0 left-0 my-auto rtl:rotate-180 ${DISABLE_LEFT ? "opacity-75" : ""} ${
                    arrowClass?.left || ""
                  }`}
                >
                  <LeftArrow />
                </button>
                <button
                  type="button"
                  disabled={DISABLE_RIGHT}
                  onClick={() => changeSlide(currentSlideIndex + 1, true)}
                  className={`absolute inset-y-0 right-0 my-auto rtl:rotate-180 ${DISABLE_RIGHT ? "opacity-75" : ""} ${
                    arrowClass?.right || ""
                  }`}
                >
                  <RightArrow />
                </button>
              </>
            );
          }

          return null;
        })()}
      </div>

      {dots && CHILDRENS.length > 1 && (
        <ul className="text-center list-none w-full z-10 mt-2">
          {CHILDRENS.map((idx: number) => (
            <li
              key={`dots-${idx}`}
              onClick={() => changeSlide(idx)}
              style={{ transition: "width .3s ease 0s" }}
              className={clsx(
                "w-2 h-1.5 rounded inline-block outline-none mx-1 cursor-pointer",
                idx === currentSlideIndex ? "w-4 bg-color1" : "bg-gray-300"
              )}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoodGlammSlider;
