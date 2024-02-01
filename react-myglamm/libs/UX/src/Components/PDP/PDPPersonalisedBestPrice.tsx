import React from "react";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";
import DownloadIcon from "../../../public/svg/downloadicon.svg";
import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import { PDPCouponList } from "@typesLib/PDP";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

const PDPPersonalisedBestPrice = ({
  productPrice,
  productOfferPrice,
  coupon,
  isCouponApplicable,
  showLoginModal,
  productURL = "",
}: {
  productPrice: number;
  productOfferPrice: number;
  coupon: any;
  isCouponApplicable: boolean;
  showLoginModal: () => void;
  productURL?: string;
}) => {
  const { t } = useTranslation();
  const guestUserPersonalisedOfferText = t("PDPPersonalisedOfferText") || "Login to Unlock Additional Discount.";
  const appDownload = coupon?.appDownload && productURL;
  const newPDP = PDP_VARIANTS?.newPDPRevamp === "1" ? true : false;
  return (
    <div
      className={`rounded-lg flex justify-around py-3 px-4 bg-color2 ${
        newPDP ? "border-l-4 border-color4 border-solid" : "border border-color1 border-dashed "
      }`}
    >
      <div className="w-full">
        <>
          <span className="font-semibold mr-1">Best Price :</span>
          {isCouponApplicable ? (
            <span className="font-semibold mr-1.5 text-xl">{formatPrice(coupon?.payableAmount, true)}</span>
          ) : (
            <span className="font-semibold mr-1.5 text-xl">{formatPrice(productOfferPrice, true)}</span>
          )}

          {isCouponApplicable && <del className="text-sm text-gray-600 mr-1">{formatPrice(productPrice, true)}</del>}
        </>

        {/* Coupon description available only when coupon is applicable */}
        {isCouponApplicable && <p className="text-xs mt-1 mr-1 break-words whitespace-normal">{coupon?.couponDescription}</p>}

        {/* when no coupon is available then display config powered text */}
        {!isCouponApplicable && !checkUserLoginStatus() && (
          <p className="text-xs mt-1 mr-1">{guestUserPersonalisedOfferText}</p>
        )}
      </div>
      {/* BEST COUPON Section */}
      {isCouponApplicable ? (
        <div className={`text-center flex flex-col justify-around items-center ${appDownload ? "w-44" : "w-20"}`}>
          <div
            className={`text-xs w-full py-1.5 bg-color2 border border-color1 border-dashed truncate px-1 ${
              newPDP && "rounded-md"
            }`}
          >
            {coupon?.couponCode}
          </div>
          <button
            className={`font-bold text-white text-xs w-full py-1.5 mt-1.5 bg-color1 flex justify-center items-center gap-1 ${
              newPDP && "rounded-md"
            }`}
            // Will auto apply the existing coupon and redirects the user to the cart
            onClick={() => {
              if (appDownload) {
                return (location.href = getAppStoreRedirectionUrl(productURL, t("trackingChannel") || "dsappinstall"));
              }
              setLocalStorageValue(LOCALSTORAGE.COUPON, coupon.couponCode);
              (PDP_STATES.pdpOffers.couponList as PDPCouponList[])[0].selected = true;
              dispatchEvent(new Event("PDPATC"));
            }}
          >
            {appDownload ? (
              <>
                <DownloadIcon className="mb-0.5" /> {t("downloadApp") || "DOWNLOAD APP"}
              </>
            ) : (
              t("apply") || "APPLY"
            )}
          </button>
        </div>
      ) : (
        !checkUserLoginStatus() &&
        !isCouponApplicable && (
          <div className="text-center flex flex-col justify-around items-center">
            <button
              className={`font-bold text-white text-xs align-middle w-14 py-1.5 mt-1.5 bg-color1`}
              onClick={() => {
                showLoginModal();
              }}
            >
              Login
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default PDPPersonalisedBestPrice;
