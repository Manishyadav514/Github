import PDPRatingV2 from "@libComponents/PDPWidgets/PDPRatingV2";
import { format } from "date-fns";
import React from "react";
import ImgVideoList from "./ImgVideoList";

const SingleReview = ({ review, isLastReview, handleReviewImgClick, productTag }: any) => {
  const date = review?.createdAt ? format(new Date(review?.createdAt.split("T")[0]), "dd MMM, yyyy") : "";
  const questionAnswers = review?.questionAnswers || [];
  return (
    <div key={review?.reviewId} className={isLastReview ? "border-0 mb-0" : "border-b border-themeGray pb-3 mb-3"}>
      <span className="flex justify-between pb-1.5">
        <p className="text-xs font-bold"> {review?.reviewerInfo?.firstName} </p>
        {date ? <p className="text-xs text-gray-400">{date}</p> : null}
      </span>
      <span className="mb-2 block">
        <PDPRatingV2 avgRating={review?.rating} fontSize={12} svgSize={9.5} />
      </span>
      {!!questionAnswers?.length && (
        <div className="flex flex-wrap pb-3">
          {questionAnswers?.map((data: any) => {
            return (
              <span className="h-4" key={data?.questionId} >
                <p className="inline text-11 font-bold pr-1 border-r border-black mr-1.5 leading-tight ">
                  {`${data?.questionLabel}: `}
                  <span className="font-normal">
                    {data?.answersLabel?.map((ans: any) => {
                      return <>{`${ans?.label}${data?.answersLabel?.length > 1 ? ";" : ""}`}</>;
                    })}
                  </span>
                </p>
              </span>
            );
          })}
        </div>
      )}
      {review?.meta?.images?.length ? (
        <div className="flex overflow-x-auto pb-3">
          {review.meta.images.map((value: string, i: number) => {
            return (
              <ImgVideoList
                review={review}
                value={value}
                index={i}
                handleReviewImgClick={handleReviewImgClick}
                productTag={productTag}
                key={value}
              />
            );
          })}
        </div>
      ) : null}
      <p className="text-xs line-clamp-3">{review?.reviewContent}</p>
    </div>
  );
};

export default SingleReview;
