import React, { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import StarIcon from "../../../../UX/public/svg/star-filled.svg";

const ReviewModalWeb = dynamic(() => import("../Popupmodals/ReviewModalWeb"), { ssr: false });

const PDPReviews = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [reviewData, setReviewData] = useState(product.reviews);
  const [showReviewModal, setShowReviewModal] = useState<boolean | undefined>();

  const handleWriteReview = () => {
    if (!checkUserLoginStatus()) {
      // login check
      SHOW_LOGIN_MODAL({ show: true, onSuccess: () => setShowReviewModal(true) });
    } else {
      setShowReviewModal(true);
    }
  };

  const loadMoreReviews = async () => {
    const productApi = new ProductAPI();

    setLoading(true);
    try {
      const { data: res } = await productApi.getReviews({
        order: ["createdAt DESC", "rating DESC"],
        limit: 5,
        skip: reviewData.reviewsList.length,
        where: {
          itemTag: encodeURIComponent(product.productTag),
          itemType: "product",
        },
      });

      setLoading(false);
      setReviewData({ ...reviewData, reviewsList: [...reviewData.reviewsList, ...(res.data?.reviewsList || [])] });
    } catch {
      setLoading(false);
    }
  };

  useEffectAfterRender(() => {
    setReviewData(product.reviews);
  }, [product.id]);

  return (
    <Fragment>
      <div className="border-t border-b border-themegray pt-6 pb-14 text-center">
        <p className="font-bold text-18">{t("reviewProduct") || "Review Product"}</p>
        <p className="mt-3 mb-5">{t("shareYourThoughts") || "Share your thoughts with everyone"}</p>
        <button type="button" onClick={handleWriteReview} className="bg-ctaImg text-white h-12 text-sm px-4 rounded-sm">
          {t("writeReview") || "Write a review"}
        </button>
      </div>

      {reviewData?.reviewsList?.length > 0 && (
        <div className="py-6 border-b border-gray-200">
          <h3 className="font-bold mb-7">
            {(t("ratingsReviews") || "RATINGS & REVIEWS")?.toUpperCase()}&nbsp;
            <i>
              ({reviewData.totalCount} {t("review") || "Reviews"})
            </i>
          </h3>

          {reviewData.reviewsList.map((review, index) => (
            <div
              key={review.reviewId}
              className={`py-2 ${index === reviewData.reviewsList.length - 1 ? "" : "border-b border-gray-200"}`}
            >
              <div className="flex py-2">
                {new Array(review.rating).fill("star").map((_, i) => (
                  <StarIcon key={`stars${i}`} height={28} width={28} className="mr-1" />
                ))}
              </div>

              <p className="mb-7 mt-2">{review.reviewContent}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center pb-4">
                  <span>{review?.reviewerInfo?.firstName}</span>
                  <div className="h-4 border-r border-gray-300 mx-2" />
                  <span className="text-sm">{format(new Date(review.createdAt), "do MMM, yyyy")}</span>
                </div>

                {/* Comment Out if Halpfull feature is mandatory */}
                {/* <button
                  type="button"
                  className="border border-gray-200 h-9 px-1.5 capitalize text-right rounded-sm flex items-center"
                >
                  <ImageComponent
                    width={15}
                    height={15}
                    alt="thums up"
                    className="ml-1 mr-2"
                    src="https://files.myglamm.com/site-images/original/like.png"
                  />
                  {t("helpful") || "helpful"}{" "}
                  <strong className="border-l border-gray-200 h-9 pl-1.5 ml-2 flex items-center">
                    {review.helpfulCountLength}
                  </strong>
                </button> */}
              </div>
            </div>
          ))}

          {reviewData.totalCount > reviewData.reviewsList.length && (
            <button
              type="button"
              disabled={loading}
              onClick={loadMoreReviews}
              className="capitalize font-bold text-15 mt-6 mb-2"
            >
              {t("loadMore") || "load more"}
            </button>
          )}
        </div>
      )}

      {typeof showReviewModal === "boolean" && (
        <ReviewModalWeb show={showReviewModal} product={product} hide={() => setShowReviewModal(false)} />
      )}
    </Fragment>
  );
};

export default PDPReviews;
