import React from "react";
import SingleReview from "./SingleReview";
import { PDPProd } from "@typesLib/PDP";

const CustomerReview = ({ product, handleReviewImgClick }: { product: PDPProd; handleReviewImgClick: any }) => {
  const { reviews } = product;

  if (!reviews.reviewsList.length) {
    return null;
  }

  return (
    <>
      {reviews?.reviewsList?.map((review: any, index: any) => {
        const isLastReview = reviews.reviewsList.length - 1 === index;
        return (
          <span key={review?.reviewId} >
            <SingleReview
              review={review}
              isLastReview={isLastReview}
              handleReviewImgClick={handleReviewImgClick}
              productTag={product?.productTag}
            />
          </span>
        );
      })}
    </>
  );
};

export default CustomerReview;
