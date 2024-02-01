import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";

import OrderAPI from "@libAPI/apis/OrderAPI";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import WidgetLabel from "./WidgetLabel";

import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";

const ReviewStars = dynamic(() => import(/* webpackChunkName: "ReviewStars" */ "@libComponents/PDP/Reviews/ReviewStars"), {
  ssr: false,
});

const HomeMiniReview = dynamic(
  () => import(/* webpackChunkName: "HomeMiniReview" */ "@libComponents/PopupModal/HomeMiniReview"),
  {
    ssr: false,
  }
);

const Review = ({ item, icid }: any) => {
  const { t } = useTranslation();
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const [showMiniReviewModal, setShowMiniReviewModal] = useState(false);
  const [lastDeliveredProducts, setLastDeliveredProducts] = useState<any[]>([]);
  const [reviewProduct, setReviewProduct] = useState({});

  useEffect(() => {
    if (profile) {
      fetchLastDeliveredOrders(profile?.id);
    } else {
      setLastDeliveredProducts([]);
    }
  }, [profile]);

  // If the user is registered then fetch user's purchased product for rating purpose
  const fetchLastDeliveredOrders = (id: any) => {
    const orderApi = new OrderAPI();
    orderApi.getLastDeliveredOrders(id).then(res => {
      setLastDeliveredProducts(res?.data?.data?.data || []);
    });
  };

  const onProductClick = (product: any) => {
    setReviewProduct(product);
    setShowMiniReviewModal(true);
  };

  const getStarRatingFromMiniRating = (product: any, starRating: any) => {
    // after successful submition of review, this function is called.
    fetchLastDeliveredOrders(profile?.id);
  };

  return (
    <ErrorBoundary>
      {profile && lastDeliveredProducts.length > 0 && (
        <section className="SingleLookBookWidget py-4">
          <WidgetLabel title={item.commonDetails.title} />
          {lastDeliveredProducts.map((product: any, index: number) => (
            <div
              key={index}
              className="mt-2"
              style={{ width: "95%" }}
              onClick={() => {
                onProductClick(product);
              }}
            >
              <div className="inline-flex border p-2 pr-3 rounded-lg ml-3 w-full items-start shadow-sm">
                <div className="w-1/4 p-1 rounded-sm">
                  {/* <WebPImage
                      width={300}
                      height={300}
                      className="rounded"
                      src={product.imageUrl}
                      alt={product.name}
                    /> */}
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="w-3/4 px-2 grid">
                  <div className="font-bold w-full min-h-[50px] leading-tight">{product.name}</div>
                  <div className="font-bold w-full inline-flex items-center justify-between">
                    <span className="font-bold text-gray-500 text-sm">Rate Product</span>
                    <div>
                      <ReviewStars preSelectedStart={0} size="1.3rem" reset={false} resetValue={0} interactive={false} />
                    </div>
                  </div>
                  {SHOP.ENABLE_GLAMMPOINTS && (
                    <div className="font-thin text-smfont-thin text-xs mt-3 text-right flex-inline items-center">
                      Earn 25 <GoodPointsCoinIcon className="inline h-4 w-4" /> {t("myglammPoints")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <HomeMiniReview
            t={t}
            show={showMiniReviewModal}
            onRequestClose={() => setShowMiniReviewModal(false)}
            product={reviewProduct}
            getStarRatingFromMiniRating={getStarRatingFromMiniRating}
          />
        </section>
      )}
    </ErrorBoundary>
  );
};

export default Review;
