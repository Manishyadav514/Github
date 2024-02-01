import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ReviewCard from "@libComponents/CommonBBC/ReviewCard";

import ErrorComponent from "@libPages/_error";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

const ReviewsListing = ({ isError, serviceDetailResponse }: any) => {
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [reviews, setReviews] = useState<any>(null);

  const getReviews = async () => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.getReviews(serviceDetailResponse.id, 30);
      const reviewData = response?.data?.data?.data;
      const identifiers = response?.data?.data?.relationalData?.identifiers;
      const identifierKeys = Object.keys(identifiers);
      if (response) {
        response.data.data.data = reviewData?.map((review: any) => {
          if (identifierKeys?.includes(review?.identifier)) {
            return {
              ...review,
              authorDetails: identifiers[review?.identifier],
            };
          }
          return review;
        });
        setReviews(response.data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setReviews([]);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }

  return (
    <main>
      <div className="my-3 bg-white border-solid border border-gray-100 border-t-0 mx-3 p-4">
        <h3 className="text-base mb-3 text-gray-500 font-normal">Reviews</h3>
        {reviews?.data?.length ? (
          <>
            {reviews?.data?.map((review: any) => (
              <ReviewCard review={review} />
            ))}
          </>
        ) : (
          <p className="mb-3">No Reviews found</p>
        )}
      </div>
    </main>
  );
};

export default ReviewsListing;
