import React, { useState } from "react";
import CartAPI from "@libAPI/apis/CartAPI";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import useTranslation from "@libHooks/useTranslation";
import { showError } from "@libUtils/showToaster";
import { format } from "date-fns";
import Calender from "../../../public/svg/calender.svg";

const RedeemG3CouponModal = ({
  coupon,
  show,
  hide,
  handleCoupon,
  triggerAdobeClickEvent,
}: {
  coupon: any;
  show: boolean;
  hide: any;
  handleCoupon: any;
  triggerAdobeClickEvent: any;
}) => {
  const { t } = useTranslation();
  const [loader, setLoader] = useState<boolean>(false);
  const RedeemCoupon = (e: any, id: string) => {
    e.preventDefault();
    setLoader(true);
    const cartApi = new CartAPI();
    cartApi
      .redeemG3Coupon(id)
      .then(res => {
        setLoader(false);
        hide();
        triggerAdobeClickEvent("confirm");
        handleCoupon(e, res.data.data.couponCode);
      })
      .catch(error => {
        console.error(error);
        setLoader(false);
        showError(error.response?.data?.message || "Error");
      });
  };

  if (!coupon) {
    return <></>;
  }

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <div className="bg-white rounded-t-xl" style={{ maxHeight: "75vh" }}>
        <div className="px-4">
          <p className="text-normal text-center pt-5 font-bold capitalize ">{coupon?.message}</p>
          <div className="flex justify-center py-6">
            <div>
              <img
                className="h-16 w-16 object-contain"
                src={coupon?.rewardDetails?.thumnailImage?.couponImage}
                alt="product image"
              />
            </div>
            <div className="ml-2">
              <p
                className="text-xs font-bold mb-3  overflow-hidden"
                style={{ minWidth: "120px", maxWidth: "240px", maxHeight: "32px" }}
              >
                Free {coupon?.rewardDetails?.name}
              </p>
              <p className="text-xs text-gray-400 flex items-center ">
                <Calender className="mr-2 h-3 w-3" />{" "}
                <span> Valid till {format(new Date(coupon?.rewardDetails?.expireAt), "dd MMM yyyy")} </span>
              </p>
            </div>
          </div>
          <p className="text-center font-bold uppercase "> coupon code </p>

          <div
            className="px-1 py-2 my-6 mt-4 text-center couponText rounded uppercase border border-color1 bg-color2 border-dashed font-bold text-black mx-auto overflow-hidden h-10"
            style={{ minWidth: "120px", maxWidth: "240px" }}
          >
            {coupon?.couponCode}
          </div>
          <div className="text-sm flex items-center justify-center my-4">
            <GoodPointsCoinIcon className="h-4 w-4 mx-1" />
            <span className=" text-gray-600 font-bold">
              {coupon?.rewardDetails?.redeemablePoints} {t("goodPoints")}
            </span>
            <span className="text-gray-600">&nbsp;will be deducted from your account.</span>
          </div>
        </div>
        <div className="p-2 border-t border-gray-200">
          <button
            type="button"
            disabled={loader}
            className="text-white w-full h-11 font-bold bg-ctaImg p-3  uppercase  text-sm rounded relative flex justify-center items-center"
            onClick={e => RedeemCoupon(e, coupon?.rewardDetails?.id)}
          >
            {loader ? <LoadSpinner className="w-8" /> : "confirm"}
          </button>
        </div>
      </div>
    </PopupModal>
  );
};
export default RedeemG3CouponModal;
