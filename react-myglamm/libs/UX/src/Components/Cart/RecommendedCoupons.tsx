import React, { useEffect, useState } from "react";
import CartAPI from "@libAPI/apis/CartAPI";
import ApplyCouponSkeleton from "@libComponents/Skeleton/ApplyCouponSkeleton";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import PromoCodes from "@libComponents/Cart/PromoCodes";
import NoPromoCodesAvailable from "@libComponents/Cart/NoPromoCodesAvailable";
import { recommendCoupon } from "@typesLib/PromoCode";
import useTranslation from "@libHooks/useTranslation";
const RecommendedCoupons = ({
  handleCoupon,
  recommendCoupons,
  setRecommendCoupons,
  coupon,
  setCoupon,
  showModal,
  setShowModal,
  triggerAdobeClickEvent,
}: recommendCoupon) => {
  const { t } = useTranslation();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const { memberId } = checkUserLoginStatus() || {};

  /* Recommended Coupons Call - Only for Registered Users */
  useEffect(() => {
    if (memberId) {
      const cartApi = new CartAPI();

      cartApi
        .getRecommendedCouponsV2(memberId)
        .then(({ data: response }) => {
          setRecommendCoupons(response?.data);
          setShowSkeleton(false);
        })
        .catch(error => {
          console.error(error);
          setShowSkeleton(false);
        });
    }
  }, []);

  /* Skeleton Loader */
  if (showSkeleton) {
    return <ApplyCouponSkeleton />;
  }

  /* Recommended Coupons List - If Any Applicable */

  return (
    <>
      {recommendCoupons &&
      (recommendCoupons?.availableCouponList?.length > 0 || recommendCoupons?.unavailableCouponList?.length > 0) ? (
        <>
          {recommendCoupons?.availableCouponList?.length > 0 && (
            <PromoCodes
              handleCoupon={handleCoupon}
              couponsList={recommendCoupons?.availableCouponList}
              disableButton={false}
              coupon={coupon}
              setCoupon={setCoupon}
              showModal={showModal}
              setShowModal={setShowModal}
              triggerAdobeClickEvent={triggerAdobeClickEvent}
              title={t("availableOffers") || "Available Offers"}
            />
          )}

          {recommendCoupons?.unavailableCouponList?.length > 0 && (
            <PromoCodes
              disableButton={true}
              handleCoupon={handleCoupon}
              couponsList={recommendCoupons?.unavailableCouponList}
              title={t("unAvailableOffers") || "Unavailable Offers"}
            />
          )}
        </>
      ) : (
        <NoPromoCodesAvailable />
      )}
    </>
  );
};

export default RecommendedCoupons;
