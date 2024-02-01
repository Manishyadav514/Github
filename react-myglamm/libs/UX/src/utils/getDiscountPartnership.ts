import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { PARTNERSHIP_STATE } from "@libStore/valtio/PARTNERSHIP.store";
import { getSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";
import { getClientQueryParam } from "@libUtils/_apputils";
import { isClient } from "./isClient";
import { setLocalStorageValue } from "./localStorage";

type handleProductDiscountCode = {
  discountCode: string;
  productId: any;
  skip?: number;
};

type handlePartnershipData = {
  products: any;
  discountCode?: string;
  skip?: number;
};

export const setDiscountData = (data: any) => {
  setSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, data, true);
  PARTNERSHIP_STATE.partnershipData = data;
  return data;
};

const handleProductDiscountCode = async ({ discountCode, productId, skip = 0 }: handleProductDiscountCode) => {
  if (discountCode) {
    if (!FEATURES.disableDiscountPartnership) {
      let productIds: any;
      const isCollection = Array.isArray(productId);
      if (isCollection) {
        productIds = JSON.stringify(productId?.slice(skip, 10 + skip))
          ?.slice(1, -1)
          .replace(/["']/g, "");
      } else {
        productIds = productId;
      }
      const couponApi = new ConsumerAPI();
      try {
        if (productIds !== "") {
          const { data: res } = await couponApi.getCouponAPIData(productIds, discountCode.toUpperCase());
          if ((isCollection && res?.data?.finalPriceCoupon) || (!isCollection && productIds !== "")) {
            if (skip >= 10 && isClient()) {
              const storedCouponData =
                PARTNERSHIP_STATE.partnershipData || getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true);
              const resData = {
                couponList: [...(storedCouponData?.couponList || []), ...res.data.couponList],
                finalPriceCoupon: res?.data?.finalPriceCoupon,
                partnershipCoupon: discountCode.toUpperCase(),
                skip: skip,
              };
              return setDiscountData(resData);
            } else {
              const resData = { ...res.data, partnershipCoupon: discountCode.toUpperCase(), skip: 10 };
              return setDiscountData(resData);
            }
          }
        }
      } catch {
        // console.error(`coupon error - ${discountCode}`) // Commenting this line as this error count is huge in Data Dog
        return {};
      }
    }
  }
};

export const handlePartnershipData = async ({ products, discountCode, skip }: handlePartnershipData) => {
  if (products?.length || products !== undefined) {
    const coupon = discountCode || getClientQueryParam("discountCode") || "";

    if (coupon) {
      setLocalStorageValue(LOCALSTORAGE.COUPON, coupon);
      return await handleProductDiscountCode({ discountCode: coupon, productId: products, skip });
    }
  }
};
