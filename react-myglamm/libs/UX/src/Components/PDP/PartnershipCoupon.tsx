import React, { useEffect, useState } from "react";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import CouponToaster from "@libComponents/PDP/CouponToaster";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import {
  partnershipCouponOnFailure,
  partnershipCouponOnModalClosed,
  partnershipCouponOnSuccess,
  partnershipCouponPopupOnLoad,
} from "@libAnalytics/PartnershipCoupon.Analytics";
import { setDiscountData } from "@libUtils/getDiscountPartnership";

interface partnerShipModalProps {
  partnerShipModal: boolean;
  productIds: string | string[];
  hide?: () => void;
}

const PartnershipCoupon = ({ productIds, partnerShipModal, hide }: partnerShipModalProps) => {
  const [getCouponCode, setGetCouponCode] = useState<string | any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getProductId, setGetProductId] = useState<any>();
  const [showCouponError, setShowCouponError] = useState<any>();
  const isCollection = Array.isArray(productIds);

  const [showCouponToaster, setShowCouponToaster] = useState(false);

  useEffect(() => {
    if (Array.isArray(productIds)) {
      setGetProductId(JSON.stringify(productIds.slice(0, 20)).slice(1, -1).replace(/["']/g, ""));
    } else {
      setGetProductId(productIds);
    }
  }, [productIds]);

  useEffect(() => {
    if (partnerShipModal) partnershipCouponPopupOnLoad("product description page", "product");
  }, [partnerShipModal]);

  const getCouponData = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const couponApi = new ConsumerAPI();
    const couponData = getLocalStorageValue(LOCALSTORAGE.COUPON) || undefined;

    couponApi
      .getCouponAPIData(getProductId, getCouponCode.toUpperCase())
      .then(({ data: res }) => {
        if ((isCollection && res?.data?.finalPriceCoupon) || !isCollection) {
          const resData = { ...res.data, partnershipCoupon: getCouponCode.toUpperCase(), skip: 0 };
          setDiscountData(resData);
        }
        if (isCollection) {
          partnershipCouponOnSuccess("product listing page", "collection");
        } else {
          partnershipCouponOnSuccess("product description page", "product");
        }
        setIsLoading(false);
        hideModal();
        if (couponData) {
          removeLocalStorageValue(LOCALSTORAGE.COUPON);
        }
        setLocalStorageValue(LOCALSTORAGE.COUPON, getCouponCode.toUpperCase());
        setShowCouponToaster(true);
        setTimeout(() => {
          setShowCouponToaster(false);
        }, 35000);
      })
      .catch(err => {
        setIsLoading(false);
        setShowCouponError(err.response?.data?.message || "INVALID CODE");
        if (isCollection) {
          partnershipCouponOnFailure("product listing page", "collection");
        } else {
          partnershipCouponOnFailure("product description page", "product");
        }
      });
  };

  const hideModal = () => {
    if (hide) return hide(); // incase handled through props

    PDP_STATES.modalStates.partnerShipModal = false;
  };

  useEffect(() => {
    if (getCouponCode?.length === 0) {
      setShowCouponError("");
    }
  }, [getCouponCode]);

  const Loader = () => {
    return (
      <div className="mx-auto relative w-6 h-6">
        <LoadSpinner />
      </div>
    );
  };

  return (
    <>
      <PopupModal
        show={partnerShipModal}
        onRequestClose={() => {
          /* Fire Only incase user clicks outside the modal */
          if (isCollection) {
            partnershipCouponOnModalClosed("product listing page", "collection");
          } else {
            partnershipCouponOnModalClosed("product description page", "product");
          }
          hideModal();
        }}
      >
        <form onSubmit={getCouponData} className="bg-white rounded-t-xl">
          <div className="flex flex-col items-center mx-5">
            <p className="pt-4 font-bold">ENTER COUPON CODE</p>
            <div className="relative w-full">
              <input
                type="text"
                className={`uppercase outline-none w-full py-3 px-3 rounded-md border mt-4 ${
                  showCouponError?.length > 0 ? "border-red-600" : "border-black"
                }`}
                onChange={e => setGetCouponCode(e.target.value)}
                value={getCouponCode}
                placeholder="Enter Coupon Code"
              />
              {getCouponCode && (
                <p
                  onClick={() => {
                    setGetCouponCode("");
                    setShowCouponError("");
                  }}
                  className="text-gray-400 absolute top-7 right-3"
                >
                  x
                </p>
              )}
            </div>
            <div className="w-full h-7 mt-2">
              {showCouponError && <p className="text-red-500 text-xs">&#9432; {showCouponError}</p>}
            </div>
            <button
              type="submit"
              className="mb-8 py-3 w-full bg-ctaImg text-white font-semibold rounded-md"
              disabled={getCouponCode?.length === 0 || getCouponCode === undefined || isLoading}
            >
              {isLoading ? <Loader /> : "ADD COUPON"}
            </button>
          </div>
        </form>
      </PopupModal>

      {showCouponToaster && <CouponToaster />}
    </>
  );
};

export default PartnershipCoupon;
