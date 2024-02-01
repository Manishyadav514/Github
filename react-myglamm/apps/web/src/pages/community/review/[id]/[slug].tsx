import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ReviewCard from "@libComponents/CommonBBC/ReviewCard";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";

const ReviewDetail = () => {
  const [reviewDetail, setReviewDetail] = useState(null);
  const router = useRouter();
  const getReviewDetail = async () => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.getReviewDetail(router?.query?.id || "");
      const reviewData = response?.data?.data?.data;
      const identifiers = response?.data?.data?.relationalData?.identifiers;
      const identifierKeys = Object.keys(identifiers);
      response.data.data.data = reviewData?.map(review => {
        if (identifierKeys?.includes(review.identifier)) {
          return {
            ...review,
            authorDetails: identifiers[review.identifier],
          };
        }
        return review;
      });
      setReviewDetail(response.data.data);
    } catch (err) {
      //
    }
  };
  useEffect(() => {
    getReviewDetail();
  }, []);
  return (
    <div className="mb-3 bg-white border-solid border border-gray-100 border-t-0 p-4 w-[600px] flex flex-column mx-auto">
      {reviewDetail?.data?.length ? (
        <>
          {reviewDetail?.data?.map(review => (
            <ReviewCard review={review} isDetailsScreen />
          ))}
        </>
      ) : // <p>No reviews found</p>
      null}
    </div>
  );
};
export default ReviewDetail;
