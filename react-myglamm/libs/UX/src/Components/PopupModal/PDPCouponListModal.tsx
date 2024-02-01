import React from "react";

import { PDPCouponList, PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import PriceStrip from "@libComponents/PDP/PriceStrip";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import PopupModal from "./PopupModal";

import Close from "../../../public/svg/ic-close.svg";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

interface PDPCouponListProps {
  show: boolean;
  product: PDPProd;
  hide: () => void;
  couponList: PDPCouponList[];
}

const PDPCouponListModal = ({ show, couponList, product, hide }: PDPCouponListProps) => {
  const { t } = useTranslation();

  const isDiscountedPercentage = product.price !== product.offerPrice;

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section
        className="bg-white rounded-t-xl relative overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 15vh)"}}
      >
        <div className="bg-white flex justify-between  py-5 p-4 sticky top-0">
          <p className="text-base leading-none"> More Offers </p>
          <button className="text-base leading-none px-2" onClick={hide}>
            <Close role="img" className="w-3 h-3" aria-labelledby="close modal" />
          </button>
        </div>
        {couponList.slice(1).map((coupon, i) => {
          return (
            <div className="px-4 border-t border-themeGray py-2 flex justify-between items-center gap-2" key={coupon.couponCode}>
              {/* List of all the available coupon for the product */}
              <div>
              <PriceStrip
                isCouponApplicable
                productPrice={product.price}
                productOfferPrice={coupon.payableAmount}
                isDiscountedPercentage={isDiscountedPercentage}
              />
              <p className="text-xs mt-1 line-clamp-2">{coupon?.couponDescription}</p>
              <p className="text-xxs text-gray-300 mt-2"> {t("t&cApplicable") || "T&C Applicable"} </p>
              </div>
              <div className="my-2 flex justify-between items-end">
                <div>
                  <div className="text-center truncate px-2 text-xs w-24 py-1.5 bg-color2 border border-color1 border-dashed rounded-md">
                    {coupon?.couponCode}
                  </div>
                  <button
                    // Will tell the PDPATC button component to addToCart and apply the coupon
                    onClick={() => {
                      setLocalStorageValue(LOCALSTORAGE.COUPON, coupon.couponCode);
                      (PDP_STATES.pdpOffers.couponList as PDPCouponList[])[i].selected = true;
                      dispatchEvent(new Event("PDPATC"));
                    }}
                    className={`font-bold text-white text-xs w-24 py-1.5 mt-2 bg-color1 rounded-md`}
                  >
                    {t("apply") || "APPLY"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </PopupModal>
  );
};

export default PDPCouponListModal;
