import React, { useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { PDPProd } from "@typesLib/PDP";
import RatingReviewHighlight from "./Rating&ReviewHighlight";
import SubRatingList from "../PDP/PDPWidgetComponents/SubRatingList";
import ReviewImg from "@libComponents/PDP/PDPWidgetComponents/CustomerPhotosVideoReview";
import ImageModal from "@libComponents/PopupModal/ImageModal";
import CustomerReview from "@libComponents/PDP/PDPWidgetComponents/CustomerReview";
import ReadAllButton from "@libComponents/PDP/PDPWidgetComponents/ReadAllButton";
import dynamic from "next/dynamic";
import { adobeCallOnCTAClick } from "@productLib/pdp/AnalyticsHelper";
const SubmitReviewForm = dynamic(
  () => import(/* webpackChunkName: "SubmitReviewForm" */ "@libComponents/PDP/Reviews/SubmitReviewV2"),
  {
    ssr: false,
  }
);

const PDPReviewV2 = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const { reviews, ratings, productMeta, categories, id } = product;

  const [showImgModal, setShowImgModal] = useState(false);
  const [selectedReviewForImg, setSelectedReviewForImg] = useState<any>();
  // Review Modal
  const [show, setShow] = useState<boolean | undefined>();

  const handleReviewImgClick = (review: any, index: number) => {
    setSelectedReviewForImg({ ...(review || {}), index });
    setShowImgModal(true);
  };

  return (
    <>
      <section className="pt-5 px-4 bg-white border-b border-themeGray">
        <p className="font-bold text-15 m-0 pb-4"> {t("ratings&Reviews") || "Ratings & Reviews"} </p>
        <RatingReviewHighlight ratings={ratings} reviews={reviews} />
        <SubRatingList subRating={ratings?.subRating} />
        <ReviewImg product={product} handleReviewImgClick={handleReviewImgClick} />
        <CustomerReview product={product} handleReviewImgClick={handleReviewImgClick} />
        <ReadAllButton
          ctaText={t("readAllReviews") || "Read All Reviews"}
          link={`${(product as PDPProd).urlShortner.slug}/all-reviews`}
          visible={reviews?.totalCount > reviews?.reviewsList?.length}
        />
      </section>
      <div className="h-28 bg-color2 flex items-center px-4">
        <span className="w-full">
          <p className="text-xs text-center pb-3">
            {t("shareYourThoughtsWithEveryone") || "Share your thoughts with everyone"}
          </p>
          <button
            onClick={() => {
              setShow(true);
              adobeCallOnCTAClick(product, "write a review");
            }}
            className="text-color1 text-sm font-bold border border-color1 h-10 w-full rounded-3 bg-white"
          >
            {t("writeReview") || "Write Review"}
          </button>
        </span>
      </div>

      {selectedReviewForImg && (
        <ImageModal
          show={showImgModal}
          onRequestClose={() => setShowImgModal(false)}
          review={selectedReviewForImg}
          page="reviews"
        />
      )}

      {typeof show === "boolean" && (
        <SubmitReviewForm reviewFormModal={show} product={product} hideReviewFormModal={() => {setShow(false)}} />
      )}
    </>
  );
};

export default PDPReviewV2;
