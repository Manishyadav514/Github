import React from "react";
import { differenceInDays } from "date-fns";
import PriceStrip from "@libComponents/PDP/PriceStrip";
import PDPGlammPointStrip from "@libComponents/PDP/PDPGlammPointStrip";
import PDPCouponExpireTime from "@libComponents/PDP/PDPCouponExpireTime";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const NewBestPrice = ({
  endDate,
  productPrice,
  productOfferPrice,
  coupon,
  isGlammPointsApplicable,
  isCouponApplicable,
  isDiscountedPercentage,
  discountPercentage,
  onAddToCart,
  isAddable,
  isPreOrder,
  formatPrice,
}: {
  endDate: string;
  productPrice: number;
  productOfferPrice: number;
  coupon: any;
  isGlammPointsApplicable: boolean;
  isCouponApplicable: boolean;
  isDiscountedPercentage: boolean;
  discountPercentage: any;
  onAddToCart: any;
  isAddable: any;
  isPreOrder: any;
  formatPrice: any;
}) => {
  const dayRemains = differenceInDays(new Date(endDate), new Date());
  const addToCartType = isAddable ? 1 : isPreOrder ? 3 : 0;

  return (
    <>
      <div className="w-full">
        <PriceStrip
          productPrice={productPrice}
          productOfferPrice={isCouponApplicable ? coupon?.payableAmount : productOfferPrice}
          isCouponApplicable={isCouponApplicable}
          isDiscountedPercentage={isDiscountedPercentage}
          formatPrice={formatPrice}
        />

        {/* Coupon description available only when coupon is applicable */}
        {isCouponApplicable && <p className="text-xs mt-1 mr-1">{coupon?.couponDescription}</p>}

        {/* Discounted percentage available only when th coupon is not applicable and discount is available */}
        {!isCouponApplicable && isDiscountedPercentage && (
          <span className="text-color1 text-xs lowercase">({discountPercentage(productPrice, productOfferPrice)}% off)</span>
        )}

        {/* Coupon expiration time available only when coupon is applicable and glammpoints is not applicable */}
        {isCouponApplicable && !isGlammPointsApplicable && dayRemains < 16 && <PDPCouponExpireTime dayRemains={dayRemains} />}

        {/* Inclusive tax msg avaialble only for base price and discounted price */}
        {!isCouponApplicable && !isGlammPointsApplicable && (
          <div className="text-xxs text-gray-400 mt-1">Inclusive of all taxes</div>
        )}

        {/* GlammPoints available only when its applicable */}
        {isGlammPointsApplicable && <PDPGlammPointStrip formatPrice={formatPrice} />}
      </div>
      {/* BEST COUPON */}
      {isCouponApplicable && (
        <div className="text-center flex flex-col justify-around items-center">
          <div className="text-xs w-20 py-1.5 bg-color2 border border-color1 border-dashed truncate px-1">
            {coupon?.couponCode}
          </div>
          <button
            className={`${addToCartType !== 1 && "hidden"} font-bold text-white text-xs w-20 py-1.5 mt-1.5 bg-color1`}
            // Will auto apply the existing coupon and redirects the user to the cart
            onClick={() => {
              if (addToCartType === 1) {
                setLocalStorageValue(LOCALSTORAGE.COUPON, coupon?.couponCode);
                onAddToCart(addToCartType);
              }
            }}
          >
            APPLY
          </button>
        </div>
      )}
    </>
  );
};

export default NewBestPrice;
