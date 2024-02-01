import React from "react";
import clsx from "clsx";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import RedeemG3CouponModal from "./RedeemG3CouponModal";
import { promoCode, coupons } from "@typesLib/PromoCode";
import useTranslation from "@libHooks/useTranslation";

const PromoCodes = ({
  handleCoupon,
  couponsList,
  disableButton,
  title,
  coupon,
  setCoupon,
  showModal = false,
  setShowModal,
  triggerAdobeClickEvent,
}: promoCode) => {
  const { t } = useTranslation();

  const handleRedeemModal = (e: any, coupon: any) => {
    e.preventDefault();
    setCoupon(coupon);
    setShowModal(true);
  };

  return (
    <div className="w-full mt-4">
      <h2 className="my-2 px-3 text-sm">{title}</h2>
      {couponsList.map((coupon: coupons) => (
        <div className="mb-2 bg-white px-4" key={coupon.couponCode}>
          <div className={"flex-col w-full py-4   relative"}>
            <div className="leading-relaxed flex items-center justify-between " style={{ color: "#676767" }}>
              <div
                className="text-xs px-1 py-2 text-center couponText rounded uppercase border border-color1 bg-color2 border-dashed font-bold text-black flex items-center justify-center"
                style={{ minWidth: "120px", maxWidth: "220px" }}
              >
                {coupon.rewardDetails ? (
                  <>
                    <GoodPointsCoinIcon className="h-4 w-4 mx-1" />
                    <span className="capitalize"> {`Redeem for ${coupon?.rewardDetails?.redeemablePoints} Good Points`} </span>
                  </>
                ) : (
                  coupon?.couponCode
                )}
              </div>

              <button
                disabled={disableButton}
                className={clsx(
                  "py-1 text-center font-semibold uppercase text-sm",
                  disableButton ? "opacity-20" : "text-color1"
                )}
                onClick={e => {
                  if (coupon.rewardDetails) {
                    triggerAdobeClickEvent("apply");
                    return handleRedeemModal(e, coupon);
                  }
                  handleCoupon(e, coupon.couponCode);
                }}
                type="submit"
              >
                {t("apply")}
              </button>
            </div>
          </div>
          <div>
            <div className="">
              {/* <p className="text-sm font-bold">{coupon?.couponName}</p> */}
              <p className="text-sm pb-3" style={{ borderBottom: "1px solid #f2f2f2" }}>
                {coupon?.couponDescription}
              </p>

              <div className="flex items-center justify-between py-3">
                <span className="text-xs" style={{ color: !disableButton ? "#00977b" : "#ee0f0f" }}>
                  {coupon?.message}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {!disableButton && (
        <RedeemG3CouponModal
          coupon={coupon}
          show={showModal}
          handleCoupon={handleCoupon}
          hide={() => {
            setShowModal(false);
            setCoupon(undefined);
          }}
          triggerAdobeClickEvent={triggerAdobeClickEvent}
        />
      )}
    </div>
  );
};

export default PromoCodes;
