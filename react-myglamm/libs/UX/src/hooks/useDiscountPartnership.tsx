import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { PARTNERSHIP_STATE } from "@libStore/valtio/PARTNERSHIP.store";
import { handlePartnershipData } from "@libUtils/getDiscountPartnership";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { getSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";
import { useEffect } from "react";
import { useSnapshot } from "valtio/react";

const useDiscountPartnership = ({ products, SSRPartnerShipData, productDetail, discountCode, isMiniPDPBanner }: any) => {
  const { partnershipData, partnershipAmount } = useSnapshot(PARTNERSHIP_STATE);

  useEffect(() => {
    if (SSRPartnerShipData?.partnershipCoupon) {
      setSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, SSRPartnerShipData, true);
      PARTNERSHIP_STATE.partnershipData = SSRPartnerShipData;
      return;
    }
    const checkData = async () => {
      if (products && isMiniPDPBanner) {
        await handlePartnershipData({ products, discountCode });
      }
    };
    checkData();
  }, [products]);

  useEffect(() => {
    if (productDetail?.id) {
      const partnershipTagValue = getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, true);
      if (productDetail?.productTag === partnershipTagValue?.productTag) {
        PARTNERSHIP_STATE.partnershipAmount = partnershipTagValue;
        return;
      } else {
        PARTNERSHIP_STATE.partnershipAmount = {};
      }
      const partnershipDetails = partnershipData?.couponList?.find((data: any) => {
        return data.productId === productDetail.id;
      });

      if (partnershipDetails) {
        const productData = {
          ...partnershipDetails,
          productTag: productDetail.productTag,
          partnershipCoupon: partnershipData?.partnershipCoupon,
        };
        const couponData = getLocalStorageValue(LOCALSTORAGE.COUPON) || undefined;
        if (productData?.productTag === productDetail?.productTag) {
          const productTagData = {
            payableAmount: productData?.payableAmount,
            discountAmount: productData?.discountAmount,
            productTag: productDetail?.productTag,
          };
          setSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, productTagData, true);
          PARTNERSHIP_STATE.partnershipAmount = productTagData;
          if (!couponData) {
            setLocalStorageValue(LOCALSTORAGE.COUPON, productData?.partnershipCoupon);
          }
        }
      }
    }
  }, [partnershipData, productDetail?.id]);

  return { partnershipData, partnershipAmount };
};

export default useDiscountPartnership;
