import React, { useEffect } from "react";
import { getCurrencySymbol } from "@libUtils/format/formatPrice";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const CartAutoCouponModal = ({ setShowAutoApplyCouponModal }: { setShowAutoApplyCouponModal: (value: boolean) => void }) => {
  const { couponData, payableAmount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const isCouponDataEmpty = Object.keys(couponData).length === 0;

  useEffect(() => {
    setLocalStorageValue(LOCALSTORAGE.BEST_COUPON_AUTO_APPLIED, "1");
  }, [couponData.couponCode]);

  if (!isCouponDataEmpty) {
    return (
      <React.Fragment>
        <div className="w-full h-full	flex flex-col justify-center items-center top-0 left-0 fixed bg-black/60 z-50">
          <div className="bg-white p-5 w-64  relative rounded auto-coupon-modal">
            <div className="relative">
              <img src="https://files.myglamm.com/site-images/original/giftcardbackground.png" className="w-full" />
              <img className="absolute m-auto inset-0" src="https://files.myglamm.com/site-images/original/success.png" />
            </div>
            <p className="font-bold text-xs mt-5 text-center">{`${couponData.couponCode} Applied`}</p>
            <p className="text-green-600 font-bold text-center mt-2">{`You saved ${getCurrencySymbol()}${
              couponData.userDiscount
            }`}</p>
            <p className="text-xs text-gray-400 text-center mt-1">with this promo code</p>
            <p className="text-xs text-center mt-2">
              Now you pay{" "}
              {
                <span className="font-bold text-xs">
                  {getCurrencySymbol()}
                  {payableAmount}
                </span>
              }
              {""} instead of{" "}
              <span className="font-bold text-xs">
                {getCurrencySymbol()}
                {payableAmount + (couponData.userDiscount || 0)}
              </span>
            </p>
            <div className="flex justify-center items-center">
              <button className="text-color1 text-xs mt-5" onClick={() => setShowAutoApplyCouponModal(false)}>
                Wohoo! thanks
              </button>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .auto-coupon-modal::after {
              content: "";
              animation: progress forwards 3s linear;
              width: 0px;
              height: 4px;
              background: var(--color1);
              position: absolute;
              left: 0px;
              bottom: 0px;
              display: block;
            }
            @keyframes progress {
              from {
                width: 0px;
              }
              to {
                width: 100%;
              }
            }
            @-webkit-keyframes progress {
              from {
                width: 0px;
              }
              to {
                width: 100%;
              }
            }
          `}
        </style>
      </React.Fragment>
    );
  }

  return null;
};

export default CartAutoCouponModal;
