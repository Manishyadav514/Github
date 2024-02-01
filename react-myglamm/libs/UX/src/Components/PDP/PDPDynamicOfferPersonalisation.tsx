import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";

import { PDPCouponList, PDPProd, ProductData } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { pdpAdobePageLoad } from "@productLib/pdp/AnalyticsHelper";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import PDPPersonalisedBestPrice from "@libComponents/PDP/PDPPersonalisedBestPrice";

import ArrowPink from "../../../public/svg/right-pink.svg";
import PDPPersonalisedBestPriceCstm from "./PDPPersonalisedBestPriceCstm";

const PDPCouponListModal = dynamic(
  () => import(/* webpackChunkName: "PDPCouponModal" */ "@libComponents/PopupModal/PDPCouponListModal"),
  { ssr: false }
);

interface dynamicOfferProps {
  product: PDPProd;
}

const PDPDynamicOfferPersonalisation = ({ product }: dynamicOfferProps) => {
  const [show, setShow] = useState<boolean>();

  const { t } = useTranslation();

  const { pdpOffers, selectedChildProducts } = useSnapshot(PDP_STATES);

  const couponList = pdpOffers.couponList as PDPCouponList[];

  const openLoginModal = (e: any) => {
    if (checkUserLoginStatus()) {
      SHOW_LOGIN_MODAL({
        show: true,
        hasGuestCheckout: false,
        hasSocialLogin: false,
        type: "onlyMobile",
        onSuccess: () => setTimeout(() => pdpAdobePageLoad(product, selectedChildProducts as ProductData[]), 1000),
      });
      e.preventDefault();
    }
  };

  const BEST_PRICE_CONFIG = t("customBestPriceConfig");

  // Check if PDP Best offers layout data available
  return (
    <>
      <section className="bg-white pt-3 px-3 pb-2 border-t-4 border-themeGray">
        {BEST_PRICE_CONFIG.active ? (
          <PDPPersonalisedBestPriceCstm coupon={couponList?.[0]} product={product} />
        ) : (
          <PDPPersonalisedBestPrice
            productPrice={product?.price}
            productOfferPrice={product?.offerPrice}
            coupon={couponList?.[0]}
            isCouponApplicable
            showLoginModal={() => openLoginModal(new Event("click"))}
            productURL={product?.urlShortner?.shortUrl}
          />
        )}

        {couponList?.length > 1 && (
          <div className="flex justify-end mt-1.5">
            <button onClick={() => setShow(true)} className="font-bold text-color1 text-xs flex items-center">
              <span> More Offers </span>
              <span className="font-bold h-5 w-5">
                <ArrowPink role="img" aria-labelledby="more offers" />
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Offers Modal */}
      {typeof show === "boolean" && (
        <PDPCouponListModal product={product} show={show} couponList={couponList} hide={() => setShow(false)} />
      )}
    </>
  );
};

export default PDPDynamicOfferPersonalisation;
