import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { ValtioStore } from "@typesLib/ValtioStore";
import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useSnapshot } from "valtio";
import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import { CTPData } from "@typesLib/PDP";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";
import { getTrialProductPricing, calculateDiscountPercentage, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const PDPPrice = ({ product }: any) => {
  const { t } = useTranslation();

  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const { ctpProductData } = useSnapshot(PDP_STATES).CTP as CTPData;

  const discountData = isClient() && JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.AB_DYNAMIC_DISCOUNT_PRICE) || "{}");

  const [productTag, setProductTag] = useState<any>(discountData?.discountProductTag || product?.productTag);
  const [discountPrice, setDiscountPrice] = useState<any>(discountData?.discountPrice || 0);
  const profileId = useSelector((store: ValtioStore) => store.userReducer.userProfile?.id);
  const price = formatPrice(product?.price) as number;
  const offerPrice = formatPrice(product?.offerPrice) as number;
  const actualPrice = offerPrice || price;
  const firstOrderAmountGP = t("firstOrderAmountGP");
  const socialGlammPoints = t("socialGlammPoints");
  const showBestPrice = firstOrderAmountGP + socialGlammPoints <= actualPrice && socialGlammPoints > 0;
  const partnershipPayable = useDiscountPartnership({
    products: product?.id,
    productDetail: product,
    SSRPartnerShipData: product.partnerShipData,
  }).partnershipAmount?.payableAmount;

  const SSRpayableAmount = product.partnerShipData?.couponList?.find((data: any) => {
    return data.productId === product.id;
  })?.payableAmount;

  const partnershipPayableAmount = isClient() ? partnershipPayable : SSRpayableAmount;

  if (product?.productMeta?.cutThePrice && profileId && ctpProductData?.statusId > 0 && ctpProductData?.statusId < 4) {
    return (
      <>
        <div className="w-3/6 flex gap-0.5 items-end">
          <h2 className="font-bold text-2xl leading-tight ">{formatPrice(product?.price - ctpProductData?.point, true)}</h2>
          <h2 className="font-thin text-xs text-gray-400 pb-0.5">
            <del>{formatPrice(price, true, false)}</del>&nbsp;
          </h2>
        </div>
        <span className="text-ratingGreen font-thin text-xs -mt-1 block">
          {`${t("youHaveCut") || "You’ve Cut"} ${formatPrice(ctpProductData?.point, true)}`}
        </span>
        <p className="font-thin -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </>
    );
  }

  if (partnershipPayableAmount || partnershipPayableAmount === 0) {
    return (
      <>
        <div className="w-3/6">
          <div className="flex gap-0.5 items-end">
            <h2 className="font-bold text-xl text-price  leading-tight ">
              {partnershipPayableAmount === 0 ? "FREE" : formatPrice(partnershipPayableAmount, true)}
            </h2>
            {/* change text color #f9f9f9 to #979797 for sufficient color contrast */}
            <h2 className="font-thin text-xs pb-0.5" style={{ color: "#979797", marginTop: "2px" }}>
              <del>{formatPrice(price, true, false)}</del>&nbsp;
              <span className="font-semibold text-ratingGreen uppercase">
                {t("priceOffPercentage", [Math.round(((price - partnershipPayableAmount / 100) / price) * 100).toString()])}
              </span>
            </h2>
          </div>
          {/* change text color #f9f9f9 to #979797 for sufficient color contrast */}
          <p className="font-thin  -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
            {t("inclusiveAllTaxes")}
          </p>
        </div>
      </>
    );
  }

  if (discountPrice && discountPrice <= price && productTag === product?.productTag) {
    return (
      <>
        {price - discountPrice === 0 ? (
          <>
            <div className="w-3/6 flex gap-0.5">
              <h2 className="font-bold uppercase text-xl leading-tight">Free</h2>
              <span className="text-gray-400">
                <del>{formatPrice(price, true, false)}</del>
              </span>
            </div>
            {/* change text color #f9f9f9 to #979797 for sufficient color contrast */}
            <p className="font-thin -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
              {t("inclusiveAllTaxes")}
            </p>
          </>
        ) : (
          <div className="w-3/6 pr-2">
            <div className="w-full flex gap-0.5 items-end">
              <h2 className="font-bold text-price  text-xl leading-tight ">
                {formatPrice(price - discountPrice, true, false)}
              </h2>
              {/* change text color #f9f9f9 to #979797 for sufficient color contrast */}
              <h2 className="font-thin text-xs flex min-w-fit pb-0.5" style={{ color: "#979797", marginTop: "2px" }}>
                <del>{formatPrice(price, true, false)}</del>&nbsp;
                {Math.round(((price - (price - discountPrice)) / price) * 100) !== 100 &&
                  Math.round(((price - (price - discountPrice)) / price) * 100) !== 0 && (
                    <span className="font-semibold text-ratingGreen uppercase">
                      {t("priceOffPercentage", [Math.round(((price - (price - discountPrice)) / price) * 100).toString()])}
                    </span>
                  )}
              </h2>
            </div>
            {/* change text color #f9f9f9 to #979797 for sufficient color contrast */}
            <p className="font-thin  -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
              {t("inclusiveAllTaxes")}
            </p>
          </div>
        )}
      </>
    );
  }

  const renderOfferPriceWithDiscount = () => {
    const configPrice = getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex, true) || offerPrice;

    return (
      <>
        <div className="w-full flex gap-0.5 items-end">
          <h2 className="font-bold text-2xl leading-tight">
            {getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex)}
          </h2>
          <h2 className="font-thin text-sm flex min-w-fit pb-0.5" style={{ color: "#979797", marginTop: "2px" }}>
            <del>{formatPrice(price, true, false)}</del>&nbsp;
            <span className="font-semibold text-ratingGreen uppercase">
              {t("priceOffPercentage", [calculateDiscountPercentage(price * 100, configPrice).toString()])}
            </span>
          </h2>
        </div>
        <p className="font-thin -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </>
    );
  };

  const renderDefaultOfferPrice = () => {
    return (
      <div className="w-full">
        <h2 className="font-bold text-2xl  leading-tight">
          {getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex)}
        </h2>
        <p className="font-thin -mt-1" style={{ fontSize: "10px", lineHeight: "12px", color: "#979797" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="w-3/6 pr-2">
        <div>
          {(profileId || !showBestPrice) && price > offerPrice ? renderOfferPriceWithDiscount() : renderDefaultOfferPrice()}
        </div>
      </div>
    </>
  );
};
export default PDPPrice;
