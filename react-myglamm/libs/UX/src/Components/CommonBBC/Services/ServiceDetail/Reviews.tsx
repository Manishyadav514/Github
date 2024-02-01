import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import PrimaryBtn from "@libComponents/CommonBBC/PrimaryBtn";

import ReviewCard from "@libComponents/CommonBBC/ReviewCard";

const Reviews = ({ reviews, serviceDetails }: any) => {
  const router = useRouter();
  const reviewPath = `/${router.asPath}/reviews`.replace("#modal", "");
  return (
    <div className="mb-3 bg-white border-solid border border-gray-100 border-t-0 mx-3 p-4">
      <h3 className="text-base mb-3 text-gray-500 font-normal">Reviews</h3>
      {reviews?.data?.length ? (
        <>
          {reviews?.data?.map((review: any) => (
            <ReviewCard review={review} />
          ))}
          {reviews?.count > 3 ? (
            <Link href={reviewPath} legacyBehavior aria-label="See more reviews">
              <div className="cursor-pointer uppercase latest-comments__txt  bbc-primary-color1 text-right mb-4">
                See more reviews
              </div>
            </Link>
          ) : null}
        </>
      ) : (
        <p className="mb-3">No reviews found</p>
      )}
      <PrimaryBtn
        buttonName="Write a Review"
        customClassName="block mx-auto"
        buttonOnClick={() => {
          router.push({
            pathname: `/write-a-review`,
            query: { service_id: serviceDetails.id },
          });
        }}
      />
    </div>
  );
};

export default Reviews;
