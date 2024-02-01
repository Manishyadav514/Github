import React, { useState, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { useSelector } from "@libHooks/useValtioSelector";

import CartAPI from "@libAPI/apis/CartAPI";

import useTranslation from "@libHooks/useTranslation";

import CustomLayout from "@libLayouts/CustomLayout";
import { updateCart } from "@libStore/actions/cartActions";
import Adobe from "@libUtils/analytics/adobe";
import { GA4promoCodeFailure, GA4promoCodeSuccess, GAOfferApplied } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { analyticsPrmoCode, promoCodeFailedAdobeEvent } from "@checkoutLib/Cart/Analytics";
import { cartCustomRepsonseLayer } from "@checkoutLib/Cart/HelperFunc";
import { ValtioStore } from "@typesLib/ValtioStore";
import { coupons } from "@typesLib/PromoCode";
import CartOverlayLoader from "@libComponents/Cart/CartOverlayLoader";
import RecommendedCoupons from "@libComponents/Cart/RecommendedCoupons";
import { GAOfferAppliedFailed } from "@libUtils/analytics/gtm";
import { fetchShippingAddress } from "@libStore/actions/userActions";

function PromoCode() {
  const router = useRouter();
  const { t } = useTranslation();

  const [couponCode, setCouponCode] = useState("");
  const [recommendCoupons, setRecommendCoupons] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<coupons | undefined>();
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const { userProfile, shippingAddress } = useSelector((store: ValtioStore) => store.userReducer);

  useEffect(() => {
    if (!shippingAddress) fetchShippingAddress();
  }, []);

  /* ADOBE EVENT - CLICK - Confirm CTA */
  const triggerAdobeClickEvent = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|reward detail|${ctaName}`,
        linkPageName: ADOBE.ASSET_TYPE.REWARD_DETAIL,
        ctaName: ctaName,
        newLinkPageName: ADOBE.ASSET_TYPE.REWARD_DETAIL,
        subSection: ADOBE.ASSET_TYPE.REWARD_DETAIL,
        assetType: "shopping bag",
        newAssetType: "shopping bag",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  /* Handle G3 Coupons*/
  const handleG3Coupon = (event: any, recommendCoupon?: string) => {
    event.preventDefault();
    const couponStr = (recommendCoupon || couponCode).toUpperCase();
    if (!couponStr.length) return alert(t("plsEnterPromoCode"));
    setLoader(true);
    const findG3Coupon = recommendCoupons?.availableCouponList?.find((coupon: any) => {
      if (coupon.couponCode === couponStr && "rewardDetails" in coupon) return true;
      return false;
    });
    if (findG3Coupon) {
      setCoupon(findG3Coupon);
      setShowModal(true);
      triggerAdobeClickEvent("apply");
      return setLoader(false);
    }
    // Regular flow continue if G3 coupon not found
    handleCoupon(event, couponStr);
  };

  /* Apply Coupon and Redirection Logic */
  const handleCoupon = (event: any, recommendCoupon?: string) => {
    event.preventDefault();

    const couponStr = (recommendCoupon || couponCode).toUpperCase();

    if (couponStr.length) {
      setLoader(true);
      const glammpoints = getLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);

      // send value as true to validate couponCode code
      const showAutoApplyInvalidCouponMessage = true;

      const cartApi = new CartAPI();
      cartApi
        .updateCart(couponStr, glammpoints, shippingAddress?.zipcode, showAutoApplyInvalidCouponMessage)
        .then(({ data: res }) => {
          updateCart(res);
          analyticsPrmoCode(cartCustomRepsonseLayer(res.data));
          GA4promoCodeSuccess(cartCustomRepsonseLayer(res.data));
          setLocalStorageValue(LOCALSTORAGE.COUPON, couponStr);

          setLoader(false);
          router.push("/shopping-bag");
        })
        .catch(err => {
          setLoader(false);
          setErrorMessage(err.response?.data?.message);
          promoCodeFailedAdobeEvent(err.response?.data?.message, couponStr);
          GA4promoCodeFailure(err.response?.data?.message, couponStr);
          GAOfferAppliedFailed(cart, err.response?.data?.message, couponStr);
          console.log(err.response);
        });
    } else {
      alert(t("plsEnterPromoCode"));
    }
  };

  const triggerAdobeOnPageLoad = () => {
    (window as any).digitalData = {
      common: {
        pageName: "web|cart summary page|Apply Promo code",
        newPageName: ADOBE.ASSET_TYPE.APPLY_PC,
        subSection: ADOBE.ASSET_TYPE.CART_SUMMARY,
        assetType: ADOBE.ASSET_TYPE.APPLY_PC,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.PageLoad();
  };

  //Adobe Event on Page Load
  useEffect(() => {
    triggerAdobeOnPageLoad();
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{t("applyPromoCode")}</title>
      </Head>

      <CartOverlayLoader show={loader} />

      {/* APPLY COUPON MANUALLY - FORM */}
      <form onSubmit={handleG3Coupon} className="bg-white h-full flex-1 w-full p-3 pt-4 left-0 my-3">
        <fieldset className="rounded border border-gray-400 h-16 relative focus:border-black mb-1">
          <legend className="text-xs ml-2 uppercase">{t("promoCode")}</legend>
          <input
            value={couponCode}
            placeholder={t("plsEnterPromoCode")}
            onFocus={() => setErrorMessage("")}
            onChange={event => setCouponCode(event.target.value)}
            className="w-full px-2 pt-2 bg-transparent outline-none uppercase"
            role="textbox"
            aria-label="enter promo code"
          />
          <button
            type="submit"
            onClick={handleG3Coupon}
            className={`absolute uppercase font-semibold text-sm border-none top-2.5 right-4 ${
              couponCode.length ? "text-color1" : "opacity-25"
            }`}
          >
            {t("apply")}
          </button>
        </fieldset>

        {errorMessage && <p className="text-red-600 py-1 text-xs h-6">{errorMessage}</p>}

        <span className="flex items-center rounded-sm p-2 mt-4" style={{ backgroundColor: "#ffeed7" }}>
          <img className="w-4" src="https://files.myglamm.com/site-images/original/warning.png" />
          <span className="text-black text-11 leading-none ml-2">{t("looseFreeMakeup")}</span>
        </span>
      </form>

      {/* RECOMMENDED COUPONS LISTING */}
      <RecommendedCoupons
        recommendCoupons={recommendCoupons}
        setRecommendCoupons={setRecommendCoupons}
        handleCoupon={handleCoupon}
        coupon={coupon}
        setCoupon={setCoupon}
        showModal={showModal}
        setShowModal={setShowModal}
        triggerAdobeClickEvent={triggerAdobeClickEvent}
      />
    </React.Fragment>
  );
}

PromoCode.getLayout = (children: ReactElement) => (
  <CustomLayout header="applyPromoCode" fallback="Apply Promocode">
    {children}
  </CustomLayout>
);

export default PromoCode;
