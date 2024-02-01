import React from "react";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import useTranslation from "@libHooks/useTranslation";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { PDPCouponList, PDPProd } from "@typesLib/PDP";

import { formatPrice } from "@libUtils/format/formatPrice";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";

import DownloadIcon from "../../../public/svg/downloadicon.svg";

const PDPPersonalisedBestPriceCstm = ({ coupon, product }: { coupon: PDPCouponList; product: PDPProd }) => {
  const { t } = useTranslation();

  const appDownload = coupon?.appDownload && product?.urlShortner?.shortUrl;

  const BEST_PRICE_CONFIG = t("customBestPriceConfig");

  const isOverflowImg = BEST_PRICE_CONFIG.layout === "overflow";

  return (
    <div
      className="rounded-lg"
      style={{
        padding: "1.5px",
        background: "linear-gradient(to bottom, #E3251A 5%, #74BD44 25%, #D18537 50%,#4ED8EF 50%, #CB73DF 75%, #D0A660 95%)",
      }}
    >
      <div
        style={{ backgroundColor: BEST_PRICE_CONFIG.secondaryColor }}
        className="rounded-lg flex justify-around p-3 items-center relative"
      >
        {BEST_PRICE_CONFIG.imgSrc && (
          <div className={isOverflowImg ? "w-1/3" : "w-1/4"}>
            {isOverflowImg ? (
              <img
                alt="Best Price"
                src={BEST_PRICE_CONFIG.imgSrc}
                className="absolute bottom-1 my-auto left-1 w-1/4 scale-110"
              />
            ) : (
              <img src={BEST_PRICE_CONFIG.imgSrc} alt="Best Price" className="w-full" />
            )}
          </div>
        )}

        <div className={`w-full ${isOverflowImg ? "pl-6" : "px-2.5"}`}>
          <div className="flex items-center h-5">
            <span className="text-sm font-semibold mr-1 whitespace-nowrap">Best Price :</span>
            <span className="font-semibold mr-1 text-xl">{formatPrice(coupon?.payableAmount, true)}</span>

            <del className="text-sm text-gray-600">{formatPrice(product.offerPrice, true)}</del>
          </div>

          {/* Coupon description available only when coupon is applicable */}
          <p
            className="text-sm break-words whitespace-normal opacity-80"
            dangerouslySetInnerHTML={{ __html: BEST_PRICE_CONFIG.description }}
          />
        </div>

        {/* BEST COUPON Section */}
        <div className={`text-center flex flex-col justify-around items-center ${appDownload ? "w-44" : "w-20"}`}>
          <div
            style={{ borderColor: BEST_PRICE_CONFIG.primaryColor }}
            className="text-xs w-full p-1.5 border border-dashed truncate rounded overflow-hidden"
          >
            {coupon?.couponCode}
          </div>
          <button
            className="font-bold text-white text-xs w-full py-1.5 mt-1.5 flex justify-center items-center gap-1 rounded"
            style={{ backgroundColor: BEST_PRICE_CONFIG.primaryColor }}
            // Will auto apply the existing coupon and redirects the user to the cart
            onClick={() => {
              if (appDownload) {
                return (location.href = getAppStoreRedirectionUrl(
                  product?.urlShortner?.shortUrl,
                  t("trackingChannel") || "dsappinstall"
                ));
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
      </div>
    </div>
  );
};

export default PDPPersonalisedBestPriceCstm;
