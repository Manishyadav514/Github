import React, { useState, useEffect } from "react";

import format from "date-fns/format";
import InfiniteScroll from "react-infinite-scroll-component";

import Layout from "@libLayouts/Layout";

import ProductAPI from "@libAPI/apis/ProductAPI";

import RatingStar from "@libComponents/PDP/Reviews/Ratings";
import ImageModal from "@libComponents/PopupModal/ImageModal";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import FilterReviewModal from "@libComponents/PDP/Reviews/FilterReview.Modal";
import SEOMain from "@libComponents/LayoutComponents/SEOMain";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import FilterIcon from "../../../../public/svg/filter.svg";
import StarFilled from "../../../../public/svg/star-filled.svg";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import PlayIcon from "../../../../public/svg/play.svg";
import Head from "next/head";
import { PDP_API_INCLUDES } from "@productLib/pdp/PDP.constant";
import Router, { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { BASE_URL } from "@libConstants/COMMON.constant";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import RatingReview from "@libComponents/PDPWidgets/Rating&ReviewHighlight";
import SubRatingList from "@libComponents/PDP/PDPWidgetComponents/SubRatingList";
import SingleReview from "@libComponents/PDP/PDPWidgetComponents/SingleReview";
import { useSnapshot } from "valtio";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { useSplit } from "@libHooks/useSplit";
import Image from "next/image";

const allReviews = ({ productReviewData, avgProductRatingData, product, skipValue, ssrPage }: any) => {
  // const [ProductId] = useState<any>(Router.query.slug);
  const router = useRouter();
  const [Reviews, setReviews] = useState<any>(productReviewData?.reviews);
  const [skp, setSkp] = useState<number>(skipValue + 10);
  const [currentPageNo, setCurrentPageNo] = useState<number>(ssrPage);

  const [isFilterCalled, setIsFilterCalled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    rating: "all",
    reviews: "all",
  });
  const [showImgModal, setShowImgModal] = useState(false);
  const [selectedReviewForImg, setSelectedReviewForImg] = useState<any>();
  const [totalReviewCount, setTotalReviewCount] = useState<number>(productReviewData?.totalCount || 0);
  const [ratings, setRatings] = useState<any>(avgProductRatingData);
  const subRating = ratings?.subRating ? Object.keys(ratings?.subRating) : [];
  const [fullTextIds, setFullTextIds] = useState([] as any);
  const { t } = useTranslation();
  const metaTitle = t("allReviewsMetaTitle") || "{{PRODUCT_NAME}} Reviews - {{BRAND_NAME}}";
  const metaDesc =
    t("allReviewsMetaDesc") ||
    "Read customer reviews for {{PRODUCT_NAME}} from {{BRAND_NAME}}. Find out how our {{PRODUCT_NAME}} has helped them and explore the latest {{PRODUCT_NAME}} reviews.";
  const PRODUCT_TAG = product?.productTag;
  const PRODUCT_NAME = product?.cms[0]?.content?.name;
  const BRAND_NAME = product?.brand?.name;

  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|product description page|all reviews",
        newPageName: "reviews",
        subSection: "product-description",
        assetType: "reviews",
        newAssetType: "reviews",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  // on Load More Event

  const onLoadMoreReviews = () => {
    const where: {
      itemTag: any;
      itemType: string;
      rating?: number;
      containImage?: boolean;
    } = {
      itemTag: encodeURIComponent(PRODUCT_TAG),
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
      limit: 10,
      skip: skp,
      where,
    };
    const api = new ProductAPI();
    api.getReviews(payload).then((res: any) => {
      if (isOpen) {
        setReviews([]);
        setTotalReviewCount(res.data?.data?.totalCount);
        setReviews(res.data?.data?.reviewsList);
        setSkp(skp + 10);
        if (currentPageNo * 10 <= totalReviewCount) {
          refreshQueryParam(currentPageNo + 1);
          setCurrentPageNo(currentPageNo + 1);
        }
      } else {
        setReviews([...Reviews, ...res.data?.data?.reviewsList]);
        setSkp(skp + 10);
        if (currentPageNo * 10 <= totalReviewCount) {
          refreshQueryParam(currentPageNo + 1);
          setCurrentPageNo(currentPageNo + 1);
        }
      }
    });
  };

  const refreshQueryParam = debounce((pageNo: number) => {
    const newQueryParams = { ...router.query, page: pageNo };
    Router.push(
      {
        query: newQueryParams,
      },
      undefined,
      { shallow: true }
    );
  }, 500);

  // End of onLoadMore Event

  const toggleFilter = () => {
    if (!isFilterCalled) {
      setIsFilterCalled(true);
    }
    setIsOpen(!isOpen);
    setSkp(0);
    setCurrentPageNo(1);
    refreshQueryParam(1);
  };

  const onRequestClose = () => {
    setIsOpen(!isOpen);
    setSkp(0);
    setCurrentPageNo(1);
    refreshQueryParam(1);
    onLoadMoreReviews();
  };

  const handleReviewImgClick = (review: any, index: number) => {
    setSelectedReviewForImg({ ...(review || {}), index });
    setShowImgModal(true);
  };

  const showFullText = (id: any) => {
    if (fullTextIds.includes(id)) {
      fullTextIds.splice(fullTextIds.indexOf(id), 1);
    } else {
      fullTextIds.push(id);
    }
    setFullTextIds([...fullTextIds]);
  };

  const reviewImageType = (
    reviewData: any,
    isLarge: boolean,
    isLastImage: boolean = false,
    isCover: boolean = false,
    index: number = 0
  ) => {
    if (reviewData?.fileType === "mp4") {
      return (
        <div className="relative">
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
        <div className="relative">
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
              className="h-full w-full object-cover "
              onClick={() => handleReviewImgClick(reviewData, index)}
            />
          </div>
          {isLastImage && <p className="absolute font-semibold text-gray-900 text-xl capitalize top-8 left-5">+ {t("more")}</p>}
        </div>
      );
    }
  };

  const { newPDPRevamp } = useSnapshot(PDP_VARIANTS);

  const variant =
    useSplit({
      experimentsList: [{ id: "pdpRevamp", condition: FEATURES?.enableNewPDP }],
      deps: [product?.id],
    }) || {};

  useEffect(() => {
    if (FEATURES?.enableNewPDP && variant?.pdpRevamp && variant?.pdpRevamp !== "no-variant") {
      PDP_VARIANTS.newPDPRevamp = variant?.pdpRevamp;
    }
  }, [variant]);

  return (
    <>
      <Head>
        {/* SEO */}
        <title>{metaTitle?.replace("{{PRODUCT_NAME}}", `${PRODUCT_NAME}`)?.replace("{{BRAND_NAME}}", `${BRAND_NAME}`)}</title>
        <meta
          key="description"
          name="description"
          content={metaDesc?.replace(/{{PRODUCT_NAME}}/g, `${PRODUCT_NAME}`)?.replace(/{{BRAND_NAME}}/g, `${BRAND_NAME}`)}
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${product?.urlShortner.slug}/all-reviews`}
        />
        {currentPageNo - 1 > 0 && (
          <link
            rel="prev"
            href={`${BASE_URL()}${router.asPath.split("?")[0]}${currentPageNo - 1 > 1 ? `?page=${currentPageNo - 1}` : ""}`}
          />
        )}
        {currentPageNo * 10 <= totalReviewCount && (
          <link rel="next" href={`${BASE_URL()}${router.asPath.split("?")[0]}?page=${currentPageNo + 1}`} />
        )}
      </Head>

      <header className="sticky w-full top-0 outline-none z-50 border-4 border-l-0 border-r-0 border-t-0">
        <div className="flex flex-row items-center h-12 bg-white">
          <BackBtn />
          <p className="text-xl font-medium">All Reviews</p>
        </div>
      </header>
      {newPDPRevamp === "1" && (
        <style jsx global>
          {`
            :root {
              --color1: #ed1b5b;
              --color2: #fef4f7;
              --btnBg: linear-gradient(#ed1b5b, #ed1b5b);
            }
          `}
        </style>
      )}

      {/*  */}
      <div className="bg-white">
        {Reviews && (
          <>
            {newPDPRevamp === "1" ? (
              <div className="px-4 pt-5 pb-2">
                <RatingReview ratings={ratings} reviews={{ totalCount: ratings?.totalReviews }} />
                <SubRatingList subRating={ratings?.subRating} />
              </div>
            ) : (
              <div className="ratings px-5 py-4 mb-5 flex border border-l-0 border-r-0 border-t-0">
                <div className="LEFT w-2/5 px-2 flex flex-col justify-center border border-l-0 border-b-0 border-t-0 my-4">
                  <div className="flex items-end">
                    <p className="text-5xl">{ratings?.avgRating % 1 != 0 ? ratings?.avgRating : ratings?.avgRating + ".0"}</p>
                  </div>
                  <div className="flex my-2">
                    {ratings?.avgRating && (
                      <RatingStar star={parseInt(ratings?.avgRating, 10)} key={parseInt(ratings?.avgRating, 10)} />
                    )}
                  </div>

                  <div className="">
                    <p className="text-gray-500 text-xs">{t("pdpBasedOnRating", [ratings?.totalCount])}</p>
                  </div>
                </div>
                <div className="RIGHT pl-4 text-gray-700 w-full">
                  {subRating.length > 0 && (
                    <>
                      <p className="text-start text-sm my-3 font-bold">
                        {/* {t("pdpWhatCustomersThink") || `What Customers Think !`} */}
                        {t("customersThinksTitle")}
                      </p>
                      {subRating.map((innerRating: any) => {
                        const text = ratings.subRating[innerRating]; // The value displayed
                        return (
                          <React.Fragment key={innerRating}>
                            {ratings?.subRating[innerRating] && text && (
                              <>
                                <div className="flex justify-between">
                                  <p className="text-gray-500 text-xs font-semibold">{innerRating}</p>
                                  <div className="flex items-center">
                                    <div className="ml-2 flex w-16 mr-3">
                                      <RatingStar star={parseInt(text, 10)} key={parseInt(text, 10)} />
                                    </div>
                                    <span className="text-xs">{text % 1 != 0 ? text : text + ".0"}</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {Reviews && (
          <>
            {
              <>
                {newPDPRevamp === "1" ? (
                  <div className="w-full flex justify-between items-center pb-5 px-4">
                    <p className="text-base font-medium">{t("allReviews") || "All Reviews"}</p>
                    <button
                      type="button"
                      onClick={toggleFilter}
                      className="flex items-center justify-end rounded text-xxs font-semibold bg-color2 p-2 px-4"
                    >
                      <span className="mx-3">Filter</span>
                      <FilterIcon className="filter" role="img" aria-labelledby="filter" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center my-7">
                      {Reviews.length > 0 && (
                        <p className="mx-5 font-semibold text-xl flex items-center text-gray-700">All Reviews</p>
                      )}

                      {totalReviewCount === 0 && (
                        <p className="text-xs text-center font-thin px-5 text-gray-700">
                          {t("pdpNoReviews") || `No reviews found`}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={toggleFilter}
                        className="flex items-center justify-end rounded text-xxs font-semibold mx-5 bg-color2 p-2 px-4"
                      >
                        <span className="mx-3">Filter</span>
                        <FilterIcon className="filter" role="img" aria-labelledby="filter" />
                      </button>
                    </div>
                    {totalReviewCount > 0 && (
                      <div className="py-4 px-5 flex justify-end font-thin text-sm text-gray-700">{totalReviewCount} Rated</div>
                    )}
                  </>
                )}
              </>
            }
            <div className="border-gray-200 mt-0">
              <InfiniteScroll
                dataLength={Reviews?.length}
                next={onLoadMoreReviews}
                hasMore={Reviews?.length < totalReviewCount}
                loader={null}
              >
                {Reviews?.map((review: any, index: any) => {
                  if (newPDPRevamp === "1") {
                    return (
                      <div className="px-4" key={review?.reviewId}>
                        <SingleReview
                          review={review}
                          isLastReview={false}
                          productTag={PRODUCT_TAG}
                          handleReviewImgClick={handleReviewImgClick}
                        />
                      </div>
                    );
                  }

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
              </InfiniteScroll>
            </div>
          </>
        )}
        {selectedReviewForImg?.image && (
          <ImageModal
            show={showImgModal}
            onRequestClose={() => setShowImgModal(false)}
            review={selectedReviewForImg}
            page="reviews"
          />
        )}

        {isFilterCalled && (
          <FilterReviewModal
            open={isOpen}
            onRequestClose={onRequestClose}
            toggleFilter={toggleFilter}
            filterData={filterData}
          />
        )}
      </div>
    </>
  );
};

allReviews.getInitialProps = async (ctx: any): Promise<any> => {
  const { slug, page } = ctx.query;

  const productApi = new ProductAPI();
  const { data: productRes } = await productApi.getProduct(
    { "urlManager.url": `/product/${slug.split("?")[0]}` },
    0,
    PDP_API_INCLUDES
  );
  if (productRes?.data?.count === 0) {
    if (ctx.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }
    return { errorCode: 404 };
  }

  const { ...product } = productRes?.data?.data?.[0];
  const relationalData = productRes?.data?.relationalData;
  const skipValue = page ? (Number(page) - 1) * 10 : 0;

  const productReviewData = await productApi
    .getReviews({
      order: ["createdAt DESC", "rating DESC"],
      limit: 10,
      skip: skipValue,
      where: {
        itemTag: encodeURIComponent(product?.productTag),
        itemType: "product",
      },
    })
    .then((res: any) => {
      return { reviews: res?.data?.data?.reviewsList, totalCount: res?.data?.data?.totalCount };
    });
  const avgProductRatingData = await productApi.getAvgRatingsByProductTag(product?.productTag).then((res: any) => {
    return res?.data?.data;
  });
  return { productReviewData, avgProductRatingData, relationalData, product, skipValue };
};

allReviews.getLayout = (children: React.ReactElement) => (
  <Layout footer={false} header={false}>
    {children}
  </Layout>
);
export default allReviews;
