import useTranslation from "@libHooks/useTranslation";
import { getProductImageOnlyReviews } from "@productLib/pdp/HelperFunc";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ImgVideoList from "./ImgVideoList";

const ReviewImg = ({ product, handleReviewImgClick }: any) => {
  const [imageOnlyReviews, setImageOnlyReviews] = useState<any>();
  const [reviewData, setReviewData] = useState<any>();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchImageOnlyReview = async () => {
      try {
        const res = await getProductImageOnlyReviews(product);
        setReviewData(res?.data?.data);

        // const reviewImg = res?.data?.data.reviewsList
        //   .reduce((acc: any, review: any) => {
        //     if (review.meta.images && review.meta.images.length > 0) {
        //       acc.push({
        //         img: [...review.meta.images],
        //       });
        //     }
        //     return acc;
        //   }, [])
        //   .filter((x: any) => x);
        const reviewImages = res?.data?.data.reviewsList?.flatMap((review: any, reviewIndex: number) => {
          return review?.meta?.images.map((imgUrl: any) => ({
            imgUrl,
            reviewIndex,
          }));
        });
        setImageOnlyReviews(reviewImages);
      } catch {
        //
      }
    };
    fetchImageOnlyReview();
  }, [product?.id]);

  if (!imageOnlyReviews?.length) {
    return null;
  }

  return (
    <div className="border-b border-themeGray pb-5 mb-5">
      <p className="font-bold text-15 pt-2 pb-3"> {t("customerPhotos&Videos") || "Customer Photos & Videos"} </p>

      <div className="flex overflow-x-auto">
        {imageOnlyReviews.slice(0, 5).map((value: { imgUrl: string; reviewIndex: number }) => {
          return (
            <ImgVideoList
              review={reviewData?.reviewsList[value?.reviewIndex]}
              value={value?.imgUrl}
              index={value?.reviewIndex}
              handleReviewImgClick={handleReviewImgClick}
              productTag={product?.productTag}
              totalCount={reviewData?.totalCount}
              key={value.imgUrl}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ReviewImg;
