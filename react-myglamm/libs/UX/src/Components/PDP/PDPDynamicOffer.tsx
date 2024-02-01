import React, { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";

import CopyIcon from "../../../public/svg/copycoupon.svg";
import ArrowPink from "../../../public/svg/right-pink.svg";
import Close from "../../../public/svg/ic-close.svg";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import useTranslation from "@libHooks/useTranslation";
import { showSuccess } from "@libUtils/showToaster";
import { formatPrice } from "@libUtils/format/formatPrice";

interface couponState {
  couponCode: string;
  couponDescription: string;
  couponOfferType: string;
  payableAmount: number;
  discountAmount: number;
  endDate: string;
  offerText: string;
}

const PDPDynamicOffer = ({ price, offerCouponList }: { price: number; offerCouponList: any[] }) => {
  const [couponList, setCouponList] = useState<couponState[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const { t, isConfigLoaded } = useTranslation();

  useEffect(() => {
    // Need to only add key
    if (t("isDynamicOfferOnPDP")) {
      setCouponList(offerCouponList);
    }
  }, [isConfigLoaded]);

  return (
    <>
      {couponList?.length > 0 && (
        <div className="p-4 py-3 bg-white mt-2">
          <div className="rounded-md border max-h-32 border-color1 bg-offerPDP">
            <div className="flex items-center justify-between pt-4 pb-3 px-3">
              <div className="grow">
                {couponList[0]?.couponOfferType === "Price Discount" ? (
                  <PriceDiscount coupon={couponList[0]} price={price} />
                ) : (
                  <ProductDiscount coupon={couponList[0]} />
                )}
              </div>
              <CouponCode code={couponList[0]?.couponCode} endDate={couponList[0]?.endDate} />
            </div>
          </div>
          {couponList?.length > 1 && (
            <div className="flex justify-end mt-1.5">
              <button onClick={() => setShow(true)} className="font-bold text-color1 text-xs flex items-center">
                <span> More Offers </span>
                <span className="font-bold h-5 w-5">
                  <ArrowPink role="img" aria-labelledby="more offers" title="more offers" />
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Offers Modal */}
      {show && (
        <PopupModal show={show} onRequestClose={() => setShow(false)}>
          <section
            className="bg-white rounded-t-lg relative overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 15vh)", minHeight: "60vh" }}
          >
            <div className="bg-white flex justify-between  py-3 p-4 sticky top-0">
              <p className="text-md font-bold leading-none"> More Offers </p>
              <button className="text-xl leading-none px-2" onClick={() => setShow(false)}>
                <Close role="img" aria-labelledby="close modal" />
              </button>
            </div>
            {couponList.slice(1).map((coupon, i) => {
              return (
                <div key={coupon.couponCode} className="border-t border-gray-100 px-4 py-3">
                  <CouponType coupon={coupon} price={price} moreOffers={true} />
                </div>
              );
            })}
          </section>
        </PopupModal>
      )}
    </>
  );
};

const CouponType = ({ coupon, price, moreOffers }: { coupon: couponState; price: number; moreOffers?: boolean }) => {
  return (
    <div className="flex-grow">
      {coupon?.couponOfferType === "Price Discount" ? (
        <PriceDiscount coupon={coupon} price={price} />
      ) : (
        <ProductDiscount coupon={coupon} />
      )}
      <CouponCode code={coupon?.couponCode} endDate={coupon?.endDate} moreOffers={moreOffers} />
    </div>
  );
};

const PriceDiscount = ({ coupon, price }: { coupon: couponState; price: number }) => {
  return (
    <>
      <div className="text-sm font-bold leading-normal flex items-center flex-wrap">
        Best Price:&nbsp;
        <div className="flex items-center">
          <span className="font-bold text-18 mr-1">{formatPrice(coupon?.payableAmount, true)}</span>
          <del className="text-sm pb-0.5 text-gray-400 font-normal">{formatPrice(price, true)}</del>
        </div>
      </div>

      <p className="text-xs mb-1" style={{ letterSpacing: "0.2px" }}>
        {coupon?.couponDescription}
      </p>
    </>
  );
};

const ProductDiscount = ({ coupon }: { coupon: couponState }) => {
  return (
    <>
      <p className="text-sm font-bold leading-normal">{coupon?.offerText}</p>
      <p className="text-xs mb-1" style={{ letterSpacing: "0.2px" }}>
        {coupon?.couponDescription}
      </p>
    </>
  );
};

const CouponCode = ({ code, endDate, moreOffers = false }: { code: string; endDate: string; moreOffers?: boolean }) => {
  const { t } = useTranslation();

  // Adobe Analytics(151) - On Click - Copy Code.
  const CopyCodeAdobeClick = (couponCode: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|offers listing`,
        linkPageName: `web|pdp offers listing`,
        newLinkPageName: "PDP Offers Listing",
        assetType: "product",
        newAssetType: "product",
        subSection: "product description",
        platform: ADOBE.PLATFORM,
        ctaName: couponCode,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      showSuccess("Copied!");
      CopyCodeAdobeClick(text);
    } catch (error) {
      console.error("The Clipboard API is not available.");
    }
  };

  const dayRemains = differenceInDays(new Date(endDate), new Date());
  return (
    <div className={`${moreOffers ? "flex items-center" : "w-2/5"}`}>
      <div className={`${moreOffers && "w-1/3"} flex h-7 overflow-hidden`} onClick={() => copyToClipboard(code)}>
        <div className="w-3/4 border uppercase border-dashed border-r-0 px-2 text-center text-11 rounded-l-md bg-color2 border-color1  flex items-center justify-center">
          <div className="line-clamp-1 leading-none tracking-wider">{code}</div>
        </div>
        <div className="rounded-r-md bg-color1 border border-color1 flex items-center">
          <button className="mx-2" aria-label="Coupon Icon">
            <CopyIcon />
          </button>
        </div>
      </div>

      {dayRemains < 16 && (
        <p className={`text-11 text-stone-500 text-center ${moreOffers ? "pl-2" : "mt-1"}`}>
          {dayRemains === 0
            ? t("expiresToday") || "Expire today"
            : dayRemains === 1
            ? t("expiresTomorrow") || `Expire in 1 day`
            : t("expiresInDays", [dayRemains?.toString()]) || `Expire in ${dayRemains} days`}
        </p>
      )}
    </div>
  );
};

export default PDPDynamicOffer;
