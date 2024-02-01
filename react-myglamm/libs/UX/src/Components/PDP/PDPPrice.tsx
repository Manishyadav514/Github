import GlammInfoModal from "@libComponents/PopupModal/GlammInfoModal";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { ValtioStore } from "@typesLib/ValtioStore";
import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";
import { useSnapshot } from "valtio";
import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import { CTPData } from "@typesLib/PDP";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";
import { getTrialProductPricing, calculateDiscountPercentage, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const PDPPrice = ({ flashSaleWidgetData, product, isTryon }: any) => {
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
  const isCrossBrandTrial = getClientQueryParam("isCrossBrandTrial") === "true";

  const { ctpProductData } = useSnapshot(PDP_STATES).CTP as CTPData;

  const [flashSaleWidgetMeta, setFlashSaleWidgetMeta] = useState<any>(JSON.parse(flashSaleWidgetData?.meta.widgetMeta || "{}"));
  const [glammModal, setGlammModal] = useState(false);
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

  useEffectAfterRender(() => {
    if (flashSaleWidgetData) {
      const { meta } = flashSaleWidgetData;
      setFlashSaleWidgetMeta(meta.widgetMeta && JSON.parse(meta.widgetMeta));
    }
  }, [flashSaleWidgetData]);

  if (
    !isTryon &&
    product?.productMeta?.cutThePrice &&
    profileId &&
    ctpProductData?.statusId > 0 &&
    ctpProductData?.statusId < 4
  ) {
    return (
      <div className="w-full">
        <h2 className="font-bold text-price text-right leading-tight ">
          {formatPrice(product?.price - ctpProductData?.point, true)}
        </h2>
        <h2 className="font-thin text-xs text-right text-gray-400 mt-1">
          <del>{formatPrice(price, true, false)}</del>&nbsp;
          <span className="text-color1 text-green-700 ml-1">
            {`${t("youHaveCut") || "You’ve Cut"} ${formatPrice(ctpProductData?.point, true)}`}
          </span>
        </h2>
        <p className="font-thin text-right my-1 text-gray-400" style={{ fontSize: "10px", lineHeight: "10px" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  }

  if (partnershipPayableAmount || partnershipPayableAmount === 0) {
    if (isTryon) {
      return (
        <div className="w-2/6">
          <div className="flex mb-0.5">
            <h2 className="font-bold text-xl text-price  leading-tight ">
              {partnershipPayableAmount === 0 ? "FREE" : formatPrice(partnershipPayableAmount, true)}
            </h2>
            <h2 className="font-thin text-xs ml-2" style={{ color: "#595959", marginTop: "2px" }}>
              <del>{formatPrice(price, true, false)}</del>&nbsp;
            </h2>
          </div>
          <p className="font-thin" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
            {t("inclusiveAllTaxes")}
          </p>
        </div>
      );
    }
    return (
      <div className="w-2/6">
        <h2 className="font-bold text-xl text-price text-right leading-tight ">
          {partnershipPayableAmount === 0 ? "FREE" : formatPrice(partnershipPayableAmount, true)}
        </h2>
        {/* change text color #f9f9f9 to #595959 for sufficient color contrast */}
        <h2 className="font-thin text-xs text-right" style={{ color: "#595959", marginTop: "2px" }}>
          <del>{formatPrice(price, true, false)}</del>&nbsp;
          <span className=" text-color1 lowercase">
            {t("priceOffPercentage", [Math.round(((price - partnershipPayableAmount / 100) / price) * 100).toString()])}
          </span>
        </h2>
        {/* change text color #f9f9f9 to #595959 for sufficient color contrast */}
        <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  }

  if (discountPrice && discountPrice <= price && productTag === product?.productTag) {
    return (
      <>
        {price - discountPrice === 0 ? (
          <div className="w-2/6 text-right">
            <h2 className="font-bold uppercase text-xl leading-tight">Free</h2>
            <span className="text-gray-400">
              <del>{formatPrice(price, true, false)}</del>
            </span>
            {/* change text color #f9f9f9 to #595959 for sufficient color contrast */}
            <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
              {t("inclusiveAllTaxes")}
            </p>
          </div>
        ) : (
          <div className="w-2/6 pr-2">
            <div className="w-full">
              <h2 className="font-bold text-price text-right text-xl leading-tight ">
                {formatPrice(price - discountPrice, true, false)}
              </h2>
              {/* change text color #f9f9f9 to #595959 for sufficient color contrast */}
              <h2 className="font-thin text-xs text-right" style={{ color: "#595959", marginTop: "2px" }}>
                <del>{formatPrice(price, true, false)}</del>&nbsp;
                {Math.round(((price - (price - discountPrice)) / price) * 100) !== 100 &&
                  Math.round(((price - (price - discountPrice)) / price) * 100) !== 0 && (
                    <span className=" text-color1 lowercase">
                      {t("priceOffPercentage", [Math.round(((price - (price - discountPrice)) / price) * 100).toString()])}
                    </span>
                  )}
              </h2>
              {/* change text color #f9f9f9 to #595959 for sufficient color contrast */}
              <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
                {t("inclusiveAllTaxes")}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  const renderFlashSalePrice = () => {
    if (isTryon) {
      return (
        <>
          <div className="w-full flex">
            <h1 className="font-bold text-price leading-tight mr-1 ">{formatPrice(500, true, false)}</h1>
            <h2 className="font-thin text-sm  line-through" style={{ color: "#9b9b9b" }}>
              {formatPrice(600, true, false)}
            </h2>
          </div>
          <p style={{ fontSize: "10px" }}>(MRP incl. of all taxes)</p>
        </>
      );
    }
    return (
      <div className="w-full">
        <h1 className="font-bold text-price leading-tight text-right">{formatPrice(500, true, false)}</h1>
        <span>
          <h2 className="font-thin text-sm text-right line-through" style={{ color: "#9b9b9b" }}>
            {formatPrice(600, true, false)}
          </h2>
        </span>
      </div>
    );
  };

  const renderOfferPrice = () => {
    if (isTryon) {
      return (
        <div className="w-full">
          <h2 className="font-bold text-price  leading-tight">{formatPrice(offerPrice, true, false)}</h2>
          <p className="font-thin  my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
            {t("inclusiveAllTaxes")}
          </p>
        </div>
      );
    }
    return (
      <div className="w-full">
        <h2 className="font-bold text-price text-right leading-tight">{formatPrice(offerPrice, true, false)}</h2>
        <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  };

  const renderOfferPriceWithDiscount = () => {
    if (isTryon) {
      return (
        <div className="w-full">
          <div className="flex">
            <h2 className="font-bold text-price leading-tight">{formatPrice(offerPrice, true, false)}</h2>
            <h2 className="font-thin text-xs ml-1" style={{ color: "#595959", marginTop: "2px" }}>
              <del>{formatPrice(price, true, false)}</del>&nbsp;
            </h2>
          </div>
          <p className="font-thin  my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
            {t("inclusiveAllTaxes")}
          </p>
        </div>
      );
    }

    const configPrice =
      getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex, true, isCrossBrandTrial) ||
      offerPrice;

    return (
      <div className="w-full">
        <h2 className="font-bold text-price text-right leading-tight">
          {getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex, false, isCrossBrandTrial)}
        </h2>
        <h2 className="font-thin text-xs text-right" style={{ color: "#595959", marginTop: "2px" }}>
          <del>{formatPrice(price, true, false)}</del>&nbsp;
          <span className="text-color1 lowercase">
            {t("priceOffPercentage", [calculateDiscountPercentage(price * 100, configPrice).toString()])}
          </span>
        </h2>
        <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  };

  const renderDefaultOfferPrice = () => {
    if (isTryon) {
      return (
        <div className="w-full">
          <h2 className="font-bold text-price  leading-tight">{formatPrice(offerPrice, true, false)}</h2>
          <p className="font-thin  my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
            {t("inclusiveAllTaxes")}
          </p>
        </div>
      );
    }
    return (
      <div className="w-full">
        <h2 className="font-bold text-price text-right leading-tight">
          {getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex, false, isCrossBrandTrial)}
        </h2>
        <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
          {t("inclusiveAllTaxes")}
        </p>
      </div>
    );
  };

  if (isTryon) {
    return (
      <>
        <div className="w-2/6 pr-2">
          <div>
            {Object.keys(flashSaleWidgetMeta).length
              ? price > flashSaleWidgetMeta.instantDiscountedPrice
                ? renderFlashSalePrice()
                : renderOfferPrice()
              : (profileId || !showBestPrice) && price > offerPrice
              ? renderOfferPriceWithDiscount()
              : renderDefaultOfferPrice()}
          </div>

          {/* GlammModal */}
          {glammModal && <GlammInfoModal show={glammModal} onRequestClose={() => setGlammModal(false)} showBtn />}

          <style jsx>
            {`
              .text-price {
                font-size: 22px;
                line-height: 1.1;
              }
              .bp-right {
                right: -0.75rem;
              }
              @media screen and (min-width: 375px) {
                .bp-right {
                  right: -1rem;
                }
              }
              @media screen and (min-width: 400px) {
                .bp-right {
                  right: -1.85rem;
                }
              }
            `}
          </style>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-2/6 pr-2">
        {/* <div>
          {flashSaleWidgetMeta ? (
            price > flashSaleWidgetMeta.instantDiscountedPrice ? (
              <div className="w-full">
                <h1 className="font-bold text-price leading-tight text-right">
                  {formatPrice(flashSaleWidgetMeta.instantDiscountedPrice, true, false)}
                </h1>
                <span>
                  <h2 className="font-thin text-sm text-right line-through " style={{ color: "#9b9b9b" }}>
                    {formatPrice(price, true, false)}
                  </h2>
                </span>
              </div>
            ) : (
              <div className="w-full">
                <h2 className="font-bold text-price text-right leading-tight  ">{formatPrice(offerPrice, true, false)}</h2>
                <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
                  {t("inclusiveAllTaxes")}
                </p>
              </div>
            )
          ) : (profileId || !showBestPrice) && price > offerPrice ? (
            <div className="w-full">
              <h2 className="font-bold text-price text-right leading-tight ">{formatPrice(offerPrice, true, false)}</h2>
              <h2 className="font-thin text-xs text-right" style={{ color: "#595959", marginTop: "2px" }}>
                <del>{formatPrice(price, true, false)}</del>&nbsp;
                <span className=" text-color1 lowercase">
                  {t("priceOffPercentage", [Math.round(((price - offerPrice) / price) * 100).toString()])}
                </span>
              </h2>
              <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
                {t("inclusiveAllTaxes")}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="font-bold text-price text-right leading-tight ">{formatPrice(offerPrice, true, false)}</h2>
              <p className="font-thin text-right my-1" style={{ fontSize: "10px", lineHeight: "10px", color: "#595959" }}>
                {t("inclusiveAllTaxes")}
              </p>
            </div>
          )}
        </div> */}

        <div>
          {Object.keys(flashSaleWidgetMeta).length
            ? price > flashSaleWidgetMeta.instantDiscountedPrice
              ? renderFlashSalePrice()
              : renderOfferPrice()
            : (profileId || !showBestPrice) && price > offerPrice
            ? renderOfferPriceWithDiscount()
            : renderDefaultOfferPrice()}
        </div>

        {/* GlammModal */}
        {glammModal && <GlammInfoModal show={glammModal} onRequestClose={() => setGlammModal(false)} showBtn />}

        <style jsx>
          {`
            .text-price {
              font-size: 22px;
              line-height: 1.1;
            }
            .bp-right {
              right: -0.75rem;
            }
            @media screen and (min-width: 375px) {
              .bp-right {
                right: -1rem;
              }
            }
            @media screen and (min-width: 400px) {
              .bp-right {
                right: -1.85rem;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default PDPPrice;
