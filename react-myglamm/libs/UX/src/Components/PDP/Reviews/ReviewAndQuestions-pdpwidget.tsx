import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";

import { PDPProd } from "@typesLib/PDP";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import ConfigText from "@libComponents/Common/ConfigText";

import { adobeCallOnCTAClick, AdobeReviewShowMoreEvent } from "@productLib/pdp/AnalyticsHelper";

import RatingStar from "./Ratings";
import ReviewList from "./ReviewList";
import WriteAReview from "./WriteAReview";
import CustomerQuestion from "./CustomerQuestion";
import ReviewRatingDisplay from "./ReviewRatingDisplay";
import { useSnapshot } from "valtio";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { SLUG } from "@libConstants/Slug.constant";

const Widgets = dynamic(() => import("@libComponents/HomeWidgets/Widgets"), { ssr: false });

const ImageModal = dynamic(() => import(/* webpackChunkName: "ImageModal" */ "@libComponents/PopupModal/ImageModal"), {
  ssr: false,
});

const sliceIntoChunks = (arr: any, chunkSize: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

const ReviewCard = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const { reviews, ratings, productMeta, categories, id } = product;

  const [Reviews, setReviews] = useState({
    list: reviews?.reviewsList,
    count: reviews?.totalCount,
    skip: 5,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("");
  const [showForms, setShowForms] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [selectedReviewForImg, setSelectedReviewForImg] = useState<any>();

  const subRating = ratings?.subRating ? Object.keys(ratings?.subRating) : [];
  const filterData = {
    rating: "all",
    reviews: "all",
  };

  const marketplaceData: any[] = [];

  productMeta.marketplaceRatings?.forEach((val: any) => {
    if (val?.showMarketplaceRating) {
      marketplaceData.push(val);
    }
  });

  const hideReviewsOnProductIds: Array<string> = t("hideReviewsOnProductIds") || [];

  const visibelMarketplace = sliceIntoChunks(marketplaceData, 2);

  useEffect(() => {
    setShowForms(false);
    setActiveForm("");
    const ReviewsCpy = JSON.parse(JSON.stringify(Reviews));
    ReviewsCpy.count = reviews?.totalCount;
    ReviewsCpy.skip = 5;
    setReviews(ReviewsCpy);
  }, [reviews]);

  useEffect(() => {
    const ReviewsCpy = JSON.parse(JSON.stringify(Reviews));
    if (reviews?.reviewsList?.length > 0) {
      ReviewsCpy.count = reviews?.totalCount;
      ReviewsCpy.list = reviews.reviewsList;
      setReviews(ReviewsCpy);
    } else {
      ReviewsCpy.count = reviews?.totalCount;
      ReviewsCpy.list = [];
      setReviews(ReviewsCpy);
    }
  }, [reviews]);

  const onLoadMoreReviews = () => {
    AdobeReviewShowMoreEvent(product);
    const where: {
      itemId: any;
      itemType: string;
      rating?: number;
      containImage?: boolean;
    } = {
      itemId: {
        inq: [product.id],
      },
      itemType: "product",
      rating: 0,
      containImage: false,
    };

    if (filterData.rating !== "" && filterData.rating !== "all") {
      where.rating = parseInt(filterData.rating, 10);
    } else {
      delete where.rating;
    }
    if (filterData.reviews !== "" && filterData.reviews !== "all") {
      where.containImage = true;
    } else {
      delete where.containImage;
    }
    const payload = {
      order: ["createdAt DESC", "rating DESC"],
      limit: 5,
      skip: Reviews.skip,
      where,
    };
    const api = new ProductAPI();
    api.getReviews(payload).then((res: any) => {
      if (isOpen) {
        const ReviewsCpy = JSON.parse(JSON.stringify(Reviews));
        ReviewsCpy.count = res.data?.data?.totalCount;
        ReviewsCpy.list = res.data?.data?.reviewsList;
        ReviewsCpy.skip = ReviewsCpy.skip + 5;
        setReviews(ReviewsCpy);
      } else {
        const ReviewsCpy = JSON.parse(JSON.stringify(Reviews));
        ReviewsCpy.list = [...Reviews.list, ...res.data?.data?.reviewsList];
        ReviewsCpy.skip = ReviewsCpy.skip + 5;
        setReviews(ReviewsCpy);
      }
    });
  };

  const onRequestClose = () => {
    setIsOpen(!isOpen);
    const ReviewsCpy = JSON.parse(JSON.stringify(Reviews));
    ReviewsCpy.skip = 0;
    setReviews(ReviewsCpy);
    onLoadMoreReviews();
  };
  const adobeButtonClickEvent = (formName: any, eventName: any) => {
    setShowForms(true);
    if (formName === "review") {
      setActiveForm("review_form");
      PDP_STATES.modalStates.SubmitReviewModal = true;
    } else if (formName === "question") {
      setActiveForm("question_form");
      onRequestClose();
    }
    // Adobe Analytics(131) - On Click - Wishlisht Button click on ShoppingBag.
    // write a review  | ask a question
    adobeCallOnCTAClick(product, eventName);
  };

  const handleReviewImgClick = (review: any, index: number) => {
    setSelectedReviewForImg({ ...(review || {}), index });
    setShowImgModal(true);
  };

  const { SubmitReviewModal } = useSnapshot(PDP_STATES).modalStates || {};

  useEffect(() => {
    if (!SubmitReviewModal) {
      setActiveForm("");
    }
  }, [SubmitReviewModal]);

  return (
    <>
      {visibelMarketplace?.map((val: any, idx: number) => {
        return (
          <div
            key={`mkp-${idx}`}
            className={`flex ${val.length > 1 ? "justify-between" : "justify-center"} px-2 bg-white overflow-x-auto`}
          >
            {val.map((value: any, idx: number) => {
              return (
                <div key={`mkp-idx-${idx}`} className="flex items-center h-24 mx-1 flex-sliderChild">
                  {value?.imageUrl ? (
                    <img src={value?.imageUrl} className="w-14 text-xs " alt={`${value?.name} logo`} />
                  ) : (
                    <img src={DEFAULT_IMG_PATH()} className="w-14" />
                  )}

                  <div className="ml-2 ">
                    <span className="flex w-24">
                      <RatingStar star={Math.floor(4)} key={Math.floor(4)} />
                      <p className="text-sm text-gray-700 mt-0.5">
                        {value?.avgRating % 1 != 0 ? value?.avgRating : value?.avgRating + ".0"}
                      </p>
                    </span>

                    <p className="text-gray-700">{t("marketPlaceRatings", [value?.totalRatings])}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="ReviewAccordion mb-2 mt-1 bg-white">
        {!hideReviewsOnProductIds?.includes(id) && (
          <>
            <div className="flex justify-between items-center text-black outline-none p-5">
              <div className="flex items-center h-4">
                <p className={`relative text-sm text-black font-bold uppercase bg-underline w-max leading-tight to-red-200`}>
                  <ConfigText configKey="ratingsReviews" fallback="RATINGS, REVIEWS & Questions" />
                </p>
                <div className="flex flex-1 justify-center items-center" />
              </div>
            </div>
            <div className="p-0 m-0">
              <div>
                <ReviewRatingDisplay ratings={ratings} subRating={subRating} />
                <ReviewList
                  Reviews={Reviews.list}
                  handleReviewImgClick={handleReviewImgClick}
                  product={product}
                  totalReviewCount={Reviews.count}
                  reviews={reviews}
                />
              </div>
            </div>
          </>
        )}
        {/* Show Review Form / Question Form Buttons */}
        <WriteAReview showReviewForm={activeForm === "review_form"} adobeButtonClickEvent={adobeButtonClickEvent} />
      </div>

      {FEATURES.fetchPdpCustomBranding && <Widgets slugOrId={SLUG().PDP_CB_WIDGET} />}

      {/* Questions Section*/}
      <CustomerQuestion
        showQuestionForm={activeForm === "question_form"}
        adobeButtonClickEvent={adobeButtonClickEvent}
        product={product}
        showForms={showForms}
      />

      {selectedReviewForImg && (
        <ImageModal
          show={showImgModal}
          onRequestClose={() => setShowImgModal(false)}
          review={selectedReviewForImg}
          page="reviews"
        />
      )}
    </>
  );
};

export default ReviewCard;
