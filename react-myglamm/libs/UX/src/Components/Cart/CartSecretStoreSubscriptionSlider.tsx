import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import ImageComponent from "../Common/LazyLoadImage";

interface SliderProps {
  children: any;
  autoPlay?: boolean;
  dots?: "dots" | "full" | any[];
  hideDots?: boolean;
  autoPlayDelay?: number;
  className?: string;
  initSlide?: number;
  slidesPerView?: number;
  slideChanged?: (index: number) => void;
}

const SNAP_STYLE = { scrollBehavior: "smooth", scrollSnapType: "x mandatory" } as React.CSSProperties;

const CartSecretStoreSubscriptionSlider = ({
  children,
  autoPlay,
  autoPlayDelay,
  dots,
  hideDots,
  className,
  initSlide,
  slidesPerView,
  slideChanged,
}: SliderProps) => {
  const dotsRef = useRef(null);
  const containerRef = useRef(null);
  const currentSlideRef = useRef(initSlide || 0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initSlide || 0);
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
        slideChanged?.(SELECTED_INDEX);
      }
    });
  }

  /* Changing Slide Based on the Index Provide */
  function changeSlide(index: number, smoothBehaviour = true) {
    const CONTAINER = containerRef.current as unknown as HTMLDivElement;
    const leftPosition = (innerWidth / (slidesPerView || 1)) * index;

    /* Scroll Behaviour change to Auto incase we don't wanna show animation for certain usecases */
    if (smoothBehaviour) CONTAINER.style.scrollBehavior = "smooth";
    else CONTAINER.style.scrollBehavior = "auto";

    CONTAINER.scrollLeft = document.dir === "rtl" ? -leftPosition : leftPosition;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { rootMargin: "0px", threshold: 0.75 });
    if (containerRef.current) {
      const SLIDES = (containerRef.current as HTMLDivElement).children;
      CHILDRENS.forEach((index: number) => {
        const CURRENT_SLIDE = SLIDES[index] as HTMLElement;
        /* Attaching Intersection Observer to track and id to know index */
        observer.observe(CURRENT_SLIDE);
        CURRENT_SLIDE.dataset.index = index.toString();
      });
    }

    /* Scroll to the required slide if provided otherwise first */
    if (initSlide) changeSlide(initSlide, false);
    else changeSlide(0, false);

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

  return (
    <div className={`${className || ""}`}>
      <div ref={containerRef} style={SNAP_STYLE} className=" overflow-x-scroll flex" tabIndex={0}>
        {children}
      </div>

      {/* SLIDER DOTS - Full / Dots / Assets(Images of Products) represented with */}
      {(() => {
        if (!hideDots && dots && CHILDRENS.length > 2) {
          if (Array.isArray(dots)) {
            return (
              <ul
                ref={dotsRef}
                style={SNAP_STYLE}
                className="p-1 mt-4 overflow-x-scroll overflow-y-hidden fixed right-0 left-4 whitespace-nowrap bottom-7"
              >
                {dots.map((img: any, index: number) => (
                  <li
                    key={index}
                    onClick={() => changeSlide(index)}
                    className={clsx(
                      "inline-block m-2",
                      currentSlideIndex === index && "Thumbnail--active rounded-lg border border-gray-800"
                    )}
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
                <ul className="carousel__dots  list-none w-full z-10">
                  {CHILDRENS.map((idx: number) => (
                    <li
                      key={`dots-${idx}`}
                      onClick={() => changeSlide(idx)}
                      className={clsx(
                        "carousel__dots-item w-1.5 h-1.5 rounded inline-block outline-none",
                        idx === currentSlideIndex ? "__active bg-color1" : "bg-white"
                      )}
                    />
                  ))}
                </ul>
              );
            case "full":
              return (
                <ul className="list-none bottom-4 w-24 flex py-3 z-10">
                  {CHILDRENS.map((idx: number) => (
                    <li
                      key={`dots-${idx}`}
                      onClick={() => changeSlide(idx)}
                      className={clsx(
                        "m-0 h-0.5 rounded outline-none w-full",
                        idx === currentSlideIndex ? "bg-color1" : "bg-white"
                      )}
                      style={{ width: `calc(100% / ${CHILDRENS.length})` }}
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

export default CartSecretStoreSubscriptionSlider;
