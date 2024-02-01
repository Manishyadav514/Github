import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductAPI from "@libAPI/apis/ProductAPI";
import ImageModal from "@libComponents/PopupModal/ImageModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@libLayouts/Layout";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import { ADOBE } from "@libConstants/Analytics.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import PlayIcon from "../../../../public/svg/play.svg";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const allImages = () => {
  const Router = useRouter();
  const [Reviews, setReviews] = useState<any>();
  const [totalReviewCount, setTotalReviewCount] = useState<number>(0);
  const [skp, setSkp] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showImgModal, setShowImgModal] = useState(false);
  const [selectedReviewForImg, setSelectedReviewForImg] = useState<any>();
  const reviewData: any[] = [];

  const PRODUCT_TAG = decodeURIComponent(Router.query.slug as string);

  useEffect(() => {
    const api = new ProductAPI();
    api
      .getReviews({
        order: ["createdAt DESC", "rating DESC"],
        limit: 10,
        skip: 0,
        where: {
          itemTag: encodeURIComponent(PRODUCT_TAG),
          // itemId: {
          //   inq: [ProductId],
          // },
          itemType: "product",
          containImage: true,
        },
      })
      .then((res: any) => {
        console.log("Response", res);
        setReviews(res?.data?.data?.reviewsList);
        setTotalReviewCount(res?.data?.data?.totalCount);
        if (res?.data?.data?.reviewsList?.length >= res?.data?.data?.totalCount) {
          setHasMore(false);
        }
        console.log("total", totalReviewCount);
      });
  }, []);

  useEffect(() => {
    const pageload = {
      common: {
        pageName: "web|product description page|all review images",
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
  //   On Load More Event

  const onLoadMoreReviews = () => {
    if (Reviews?.length >= totalReviewCount) {
      setHasMore(false);
    }
    const where: {
      itemTag: string;
      itemType: string;
      rating?: number;
      containImage?: boolean;
    } = {
      itemTag: encodeURIComponent(PRODUCT_TAG),
      // itemId: {
      //   inq: [ProductId],
      // },
      itemType: "product",
      containImage: true,
    };

    const payload = {
      order: ["createdAt DESC", "rating DESC"],
      limit: 10,
      skip: skp,
      where,
    };
    const api = new ProductAPI();
    api.getReviews(payload).then((res: any) => {
      setReviews([...Reviews, ...res.data?.data?.reviewsList]);
      setSkp(skp + 10);
    });
  };

  const handleReviewImgClick = (review: any, index: number) => {
    setSelectedReviewForImg({ ...(review || {}), index });
    setShowImgModal(true);
  };

  Reviews?.map((review: any) => {
    review?.meta?.images.map((image: any) => {
      if (image) {
        const fileType = image.substr(image?.length - 3);
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
        reviewData.push(reviewContent);
      }
    });
  });

  return (
    <>
      <header className="sticky w-full top-0 outline-none z-50 border-4 border-l-0 border-r-0 border-t-0">
        <div className="flex flex-row items-center h-12 bg-white">
          <BackBtn />
          <p className="text-xl font-medium">Review Images</p>
        </div>
      </header>
      <div className="bg-white">
        <div className="relative pt-5">
          <div className="px-4">
            {/* Review List */}
            {Reviews && (
              <>
                <div className="border-gray-200 mt-0">
                  <InfiniteScroll
                    dataLength={Reviews}
                    next={onLoadMoreReviews}
                    hasMore={hasMore}
                    loader={<h4 className="text-center font-semibold py-4 text-gray-600">Loading. . .</h4>}
                    endMessage={<h4 className="text-center font-semibold py-4 text-gray-600">Yay!! You have seen it all</h4>}
                  >
                    <div style={{ columnCount: 2 }} className="">
                      {reviewData?.map((review: any, index: number) => {
                        return (
                          <>
                            {review?.fileType === "mp4" ? (
                              <div className="relative mb-3">
                                <PlayIcon className={`h-5 w-5 absolute top-2 right-2`} />
                                <video
                                  onClick={() => handleReviewImgClick(review, index)}
                                  className="rounded-xl w-full h-full object-cover"
                                >
                                  <source src={review?.image} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              review?.image && (
                                <div className="mb-3" onClick={() => handleReviewImgClick(review, index)}>
                                  <ImageComponent
                                    src={review?.image}
                                    alt="Review Img"
                                    className="rounded-xl w-full h-full object-cover"
                                  />
                                </div>
                              )
                            )}
                          </>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>
              </>
            )}
          </div>

          {selectedReviewForImg?.image && (
            <ImageModal
              show={showImgModal}
              onRequestClose={() => setShowImgModal(false)}
              review={selectedReviewForImg}
              onLoadMoreReviews={onLoadMoreReviews}
              reviewData={reviewData}
              page="images"
            />
          )}
        </div>
      </div>
    </>
  );
};

allImages.getLayout = (children: React.ReactElement) => (
  <Layout footer={false} header={false}>
    {children}
  </Layout>
);

export default allImages;
