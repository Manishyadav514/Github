import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import format from "date-fns/format";

import useTranslation from "@libHooks/useTranslation";

import { getProductImageOnlyReviews, processImageOnlyReviewsCarouselData } from "@productLib/pdp/HelperFunc";

import StarFilled from "../../../../public/svg/star-filled.svg";
import PlayIcon from "../../../../public/svg/play.svg";
import ReviewArrow from "../../../../public/svg/reviewArrow.svg";
import { PDPProd } from "@typesLib/PDP";
import Image from "next/image";

const ReviewList = ({ Reviews, handleReviewImgClick, product, totalReviewCount, reviews }: any) => {
  const { t } = useTranslation();
  const [fullTextIds, setFullTextIds] = useState([] as any);
  const [carouselData, setCarouselData] = useState<any>();
  const [imageOnlyReviews, setImageOnlyReviews] = useState<any>();

  const showFullText = (id: any) => {
    if (fullTextIds.includes(id)) {
      fullTextIds.splice(fullTextIds.indexOf(id), 1);
    } else {
      fullTextIds.push(id);
    }
    setFullTextIds([...fullTextIds]);
  };

  useEffect(() => {
    const fetchImageOnlyReviews = async () => {
      try {
        const res = await getProductImageOnlyReviews(product);
        const tempimageOnlyReviews = res?.data?.data;
        setImageOnlyReviews(tempimageOnlyReviews);
        setCarouselData(processImageOnlyReviewsCarouselData(tempimageOnlyReviews));
      } catch {
        //
      }
    };
    fetchImageOnlyReviews();
  }, [reviews]);

  const reviewImageType = (
    reviewData: any,
    isLarge: boolean,
    isLastImage: boolean = false,
    isCover: boolean = false,
    index: number = 0
  ) => {
    if (reviewData?.fileType === "mp4") {
      return (
        <div className="relative" key={reviewData.id}>
          <PlayIcon className={`h-5 w-5 absolute top-2 ${isCover ? "right-4" : "right-2"}`} />
          <video
            className={`${isCover ? "w-44 h-32 mr-3 rounded" : isLarge ? "w-48 h-48" : "w-24 h-24"} ${
              !isCover && "px-1 py-1 rounded-lg"
            } object-cover `}
            onClick={() => handleReviewImgClick(reviewData, index)}
          >
            <source src={reviewData?.image} type="video/mp4" />
          </video>
          {isLastImage && <p className="absolute font-semibold text-gray-900 text-xl capitalize top-8 left-5">+ {t("more")}</p>}
        </div>
      );
    } else {
      return (
        <div className="relative" key={reviewData.id}>
          <div
            className={`${isCover ? "w-44 h-32 mr-3 rounded" : isLarge ? "w-48 h-48" : "w-24 h-24"} ${
              isLastImage && "opacity-60"
            } ${!isCover && "px-1 py-1 rounded-lg"} object-cover overflow-hidden`}
          >
            <Image
              src={reviewData?.image}
              width={100}
              height={100}
              alt="Review_Image"
              className="object-cover w-full h-full"
              onClick={() => handleReviewImgClick(reviewData, index)}
            />
          </div>
          {isLastImage && <p className="absolute font-semibold text-gray-900 text-xl capitalize top-8 left-5">+ {t("more")}</p>}
        </div>
      );
    }
  };

  return (
    <div>
      {Reviews && (
        <>
          <div className="border-gray-200 mt-6">
            {imageOnlyReviews?.reviewsList?.length > 3 && (
              <div className="flex overflow-y-scroll pl-4 mb-5">
                {carouselData?.map((data: any, dataIndex: number) => {
                  return data?.map((reviews: any, reviewsIndex: number) => {
                    if (reviews !== undefined && !Array.isArray(reviews)) {
                      return (
                        <div className="flex-sliderChild" key={`revfs-${dataIndex}-${reviewsIndex}`}>
                          {reviewImageType(reviews, true)}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex-sliderChild" key={`revfs-${dataIndex}-${reviewsIndex}`}>
                          {reviews?.map((review: any, reviewIndex: number) => {
                            let isLastImage = false;
                            if (
                              carouselData.length > 2 &&
                              dataIndex === carouselData.length - 1 &&
                              reviewIndex === reviews.length - 1 &&
                              data[1].length > 1
                            ) {
                              isLastImage = true;
                            }
                            if (isLastImage) {
                              return (
                                <Link href={`${product.productTag}/allImages`} key={reviewIndex}>
                                  {reviewImageType(review, false, isLastImage)}
                                </Link>
                              );
                            }
                            return <Fragment key={reviewIndex}>{reviewImageType(review, false)}</Fragment>;
                          })}
                        </div>
                      );
                    }
                  });
                })}
              </div>
            )}

            {Reviews?.map((review: any, index: any) => {
              const date = review?.createdAt ? format(new Date(review?.createdAt.split("T")[0]), "dd MMM, yyyy") : "";
              let trimmedContent = "";
              if (fullTextIds.includes(review?.reviewId)) {
                trimmedContent = review?.reviewContent;
              } else {
                trimmedContent = review?.reviewContent.slice(0, 90);
              }
              return (
                <React.Fragment key={review?.reviewId}>
                  {index !== 0 && <div className="p-1 pt-2.5 border-t border-gray-100" />}
                  <div key={review?.reviewId} className="mb-4 pl-5 pr-5">
                    <div className="w-auto flex justify-between mb-3">
                      <div>
                        <span className="font-semibold text-gray-700">{review?.reviewerInfo?.firstName}</span>
                        {date ? <span className="font-light text-gray-700 ml-1">| {date}</span> : null}
                      </div>

                      <div className="flex relative justify-between text-center items-center rounded-full h-6 w-auto border border-gray-300">
                        <p className="text-center flex px-2 font-semibold text-sm border-r border-gray-300 h-full pt-0.5">
                          {review.rating}
                        </p>
                        <span className="pl-1 pr-2 mb-0.5">
                          <StarFilled height={13} width={13} role="img" aria-labelledby="product rating" />
                        </span>
                      </div>
                    </div>
                    {review?.meta?.images && review?.meta?.images?.length > 0 && (
                      <div className="flex overflow-y-scroll">
                        {review?.meta?.images.map((image: any, ind: number) => {
                          const fileType = image?.substr(image.length - 3);
                          const reviewContent = {
                            image,
                            reviewId: review?.reviewId,
                            createdAt: review?.createdAt,
                            rating: review?.rating,
                            reviewTitle: review?.reviewTitle,
                            reviewContent: review?.reviewContent,
                            reviewerInfo: review?.reviewerInfo,
                            fileType,
                          };
                          return (
                            image && (
                              <div className="mt-2 mb-6 flex-sliderChild" key={`revos-${ind}`}>
                                {reviewImageType(reviewContent, false, false, true, index)}
                              </div>
                            )
                          );
                        })}
                      </div>
                    )}
                    <p className="text-basefont-thin">
                      {review?.reviewContent?.length > 90 ? (
                        <span>
                          {trimmedContent}
                          <span className="text-pink-500" onClick={() => showFullText(review?.reviewId)}>
                            {fullTextIds.includes(review?.reviewId) ? `...${t("readLess")}` : `...${t("readMore")}`}
                          </span>
                        </span>
                      ) : (
                        review?.reviewContent
                      )}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {totalReviewCount > Reviews?.length && (
            <div
              className=" p-4 m-auto"
              style={{
                borderTop: "3px solid #f5f5f6",
              }}
            >
              <Link href={`${(product as PDPProd)?.urlShortner.slug}/all-reviews`}>
                <span className="text-sm tracking-widest font-extrabold flex items-center uppercase">
                  <ReviewArrow title="read all reviews" />
                  <p className="mx-3">{t("readAllReviews") || "READ ALL REVIEWS"}</p>
                </span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
