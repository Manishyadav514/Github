import React, { useState, useEffect } from "react";
import format from "date-fns/format";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import PopupModal from "./PopupModal";
import { ADOBE } from "@libConstants/Analytics.constant";
import StarFilled from "../../../public/svg/star-filled.svg";
import StarFilledGreen from "../../../public/svg/star-filled-green.svg";

// @ts-ignore
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ImgModalProps {
  review?: any;
  show: boolean;
  onRequestClose: () => void;
  onLoadMoreReviews?: () => void;
  page: string;
  reviewData?: any;
}

const ImageModal = ({ show, onRequestClose, review, onLoadMoreReviews, page, reviewData }: ImgModalProps) => {
  const [current, setCurrent] = useState<number>(review.index);
  const [showFullText, setShowFullText] = useState(false);
  const [disablePan, setDisablePan] = useState<boolean>(true);

  useEffect(() => {
    setCurrent(review.index);
  }, [review]);

  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|product description page|review image detail",
        newPageName: "reviews",
        subSection: "product-description",
        assetType: "reviews",
        newAssetType: "reviews",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, [current]);

  const fullText = () => {
    if (!showFullText) {
      setShowFullText(true);
    } else {
      setShowFullText(false);
    }
  };

  const nextSlide = () => {
    setCurrent(current === reviewData?.length - 1 ? 0 : current + 1);

    setShowFullText(false);
    if (current % 10 === 0) {
      onLoadMoreReviews && onLoadMoreReviews();
    }
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? reviewData?.length - 1 : current - 1);
    setShowFullText(false);
  };

  // GESTURE SWIP LOGIC
  let startingX = 0;
  let startingY = 0;
  let endingX = 0;
  let endingY = 0;
  let moving = false;
  const touchStart = (evt: any) => {
    startingX = evt.touches[0].clientX;
    startingY = evt.touches[0].clientY;
  };
  const touchMove = (evt: any) => {
    moving = true;
    endingX = evt.touches[0].clientX;
    endingY = evt.touches[0].clientY;
  };
  const touchEnd = () => {
    if (!moving) return;
    if (Math.abs(endingX - startingX) > Math.abs(endingY - startingY)) {
      if (endingX > startingX) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    moving = false;
  };

  const ImageMode = ({
    image,
    rating,
    content,
    name,
    date,
    fileType,
  }: {
    image: string;
    rating: number;
    content: string;
    name: string;
    date: any;
    fileType: string;
  }) => {
    let trimmedContent = "";
    if (showFullText) {
      trimmedContent = content;
    } else {
      trimmedContent = content.slice(0, 90);
    }

    return (
      <>
        {fileType === "mp4" ? (
          <video controls>
            <source src={image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <TransformWrapper
              panning={{
                disabled: disablePan,
              }}
              onPanningStart={(e: any) => {
                if (e.state.scale <= 1) {
                  setDisablePan(true);
                } else {
                  setDisablePan(false);
                }
              }}
              doubleClick={{
                step: 0.4,
              }}
            >
              <TransformComponent>
                <img src={image} alt="Review Images" className="image" />
              </TransformComponent>
            </TransformWrapper>
          </>
        )}
        <div className="absolute bottom-0 left-0 px-5 bg-white w-full">
          <div className="my-3 min-w-min w-12 flex relative justify-between text-center items-center rounded-full h-6 border border-gray-300">
            <p className="text-center flex px-2 font-semibold text-sm border-r border-gray-300 h-full pt-0.5">{rating}</p>
            <span className="pl-1 pr-2 mb-0.5">
              {review?.greenRating ? <StarFilledGreen height={13} width={13} /> : <StarFilled height={13} width={13} />}
            </span>
          </div>

          <p className="text-sm py-3">
            {content?.length > 90 ? (
              <span>
                {trimmedContent}
                <span className="text-pink-500" onClick={fullText}>
                  {showFullText ? "...Read Less" : "...Read More"}
                </span>
              </span>
            ) : (
              content
            )}
          </p>

          <div className=" pb-4 mt-3 text-sm">
            <span className="font-semibold text-gray-700">{name}</span>
            <span className="font-light text-gray-700 ml-1">| {date}</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <style>
        {`
        .slider {
          position: relative;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: black;
        }

        .carousel-button {
          position: absolute;
          background: none;
          border: none;
          font-size: 1.5rem;
          top: 35%;
          z-index: 10;
          transform: translateY(-50%);
          color: rgba(255,255,255,.5);
          cursor: pointer;
          padding: 5px .5rem;
          background-color: rgba(0,0,0,.1);
        }

        .carousel-button.prev{
          left: 1rem;
        }

        .carousel-button.next{
          right: 1rem;
        }

        .arrow {
          border-width: 0 3px 3px 0;
          display: inline-block;
          padding: 5px;
        }
        
        .right {
          transform: rotate(-45deg);
        }
        
        .left {
          transform: rotate(135deg);
        }

        .slide {
          opacity: 0;
          transition-duration: 1.5s ease;
        }

        .slide.active {
          opacity: 1;
          transition-duration: 1.5s;
          transition: scale(1.08)

        }
        
        `}
      </style>

      <PopupModal show={show} onRequestClose={onRequestClose} type="center-modal">
        <div
          className="ImageModal w-screen h-screen bg-black flex flex-col justify-between"
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          <button type="button" onClick={onRequestClose} className="p-3 outline-none text-white z-50 text-4xl w-16">
            &times;
          </button>

          <section className="slider">
            {page !== "reviews" && (
              <>
                <button type="button" className="carousel-button next" onClick={nextSlide}>
                  <i title="next" className="arrow right"></i>
                </button>
                <button title="previous" type="button" className="carousel-button prev" onClick={prevSlide}>
                  <i className="arrow left"></i>
                </button>
              </>
            )}
            {page != "reviews" ? (
              reviewData?.map((Slide: any, index: number) => {
                return (
                  <div className={`${index === current ? "slide active" : "slide"} -mt-52`} key={index}>
                    {index === current && (
                      <>
                        <ImageMode
                          image={Slide?.image}
                          rating={Slide?.rating}
                          content={Slide?.reviewContent}
                          name={Slide?.reviewerInfo?.firstName}
                          date={Slide?.createdAt ? format(new Date(Slide?.createdAt.split("T")[0]), "dd MMM, yyyy") : ""}
                          fileType={Slide?.fileType}
                        />
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="-mt-52">
                <ImageMode
                  image={review.image}
                  rating={review.rating}
                  content={review.reviewContent}
                  name={review.reviewerInfo?.firstName}
                  date={review.createdAt ? format(new Date(review.createdAt.split("T")[0]), "dd MMM, yyyy") : ""}
                  fileType={review?.fileType}
                />
              </div>
            )}
          </section>
        </div>
      </PopupModal>
    </>
  );
};

export default ImageModal;
