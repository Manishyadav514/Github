import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import CartAPI from "@libAPI/apis/CartAPI";
import useLogin from "@libHooks/useLogin";
import { useSSO } from "@libHooks/useSSO";
import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";
import { updateCart, updateCartLoader } from "@libStore/actions/cartActions";
import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import Adobe from "@libUtils/analytics/adobe";
import { showError } from "@libUtils/showToaster";
import { getVendorCode } from "@libUtils/getAPIParams";
import { GACartViewed, GAcheckoutInitiate } from "@libUtils/analytics/gtm";
import { setLocalStorageValue, getLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";
import Summary from "@libComponents/Cart/Summary";
import CartProduct from "@libComponents/Cart/CartProduct";
import CartCoupons from "@libComponents/Cart/CartCoupons";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import CartDiscount from "@libComponents/Cart/CartDiscount";
import CartFixedBottom from "@libComponents/Cart/CartBottom";
import CartFreeProducts from "@libComponents/Cart/CartFreeProducts";
import CartOverlayLoader from "@libComponents/Cart/CartOverlayLoader";
import CouponFreeProduct from "@libComponents/Cart/CouponFreeProduct";
import CartUserSubscription from "@libComponents/Cart/CartUserSubscription";
import CartNextOrderSubscriberStrip from "@libComponents/Cart/CartNextOrderSubscriberStrip";
import ShoppingBagLayout from "@libLayouts/ShoppingBagLayout";
import { EVENT_TYPES } from "@typesLib/Analytics";
import { cartFreeProduct, eventInfo, FPData, FPOtherData, freeProductData, userCart } from "@typesLib/Cart";
import { getProductData, cartCustomRepsonseLayer, fetchRecommendedCoupons } from "@checkoutLib/Cart/HelperFunc";
import { getCartAdobeDigitalData, GACartViewEvent } from "@checkoutLib/Cart/Analytics";
import { checkUserLoginStatus, getCartIdentifier, getCouponandPoints } from "@checkoutLib/Storage/HelperFunc";
import { handleSSOEvents } from "@libAnalytics/Auth.Analytics";
import { useOptimize } from "@libHooks/useOptimize";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import Script from "next/script";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSplit } from "@libHooks/useSplit";

import { removeGiftCardFromShoppingBag } from "@checkoutLib/Cart/HelperFunc";
import { setSessionStorageValue } from "@libUtils/sessionStorage";
const CartDonate = dynamic(() => import(/* webpackChunkName: "CartDonate" */ "@libComponents/Cart/CartDonate"), { ssr: false });
const CartGoodPoints = dynamic(() => import(/* webpackChunkName: "CartGoodPoints" */ "@libComponents/Cart/CartGoodPoints"), {
  ssr: false,
});

const EmptyCart = dynamic(() => import(/* webpackChunkName: "EmptyCart" */ "@libComponents/Cart/EmptyCart"), { ssr: false });

const FreeProductModal = dynamic(() => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/FreeProductModal"), {
  ssr: false,
});

const CartMessageModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/CartMessageModal"),
  { ssr: false }
);

const OnlyMobileLogin = dynamic(
  () => import(/* webpackChunkName: "OnlyMobileLoginModal" */ "@libComponents/Auth/OnlyMobileLogin.Modal"),
  { ssr: false }
);

const CartUpsell = dynamic(() => import(/* webpackChunkName: "CartUpsellv2" */ "@libComponents/Cart/CartUpsell"), {
  ssr: false,
});

const RemoveGiftCardModal = dynamic(
  () => import(/* webpackChunkName: "CartGoodPoints" */ "@libComponents/PopupModal/RemoveGiftCardModal"),
  {
    ssr: false,
  }
);

const ShoppingBag = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { cart, userProfile, shippingAddress } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    userProfile: store.userReducer.userProfile,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  const [freeProductsData, setFreeProductsData] = useState<FPData>();
  const [showFreeProductModal, setShowFreeProductModal] = useState<boolean | undefined>();
  const [bestCouponCode, setBestCouponCode] = useState<{
    couponCode: string;
    couponDescription: string;
    couponName: string;
    message: string;
  }>();
  const [hasRecommendedCoupons, setHasRecommendedCoupons] = useState([]);
  const [showRemoveProductModal, setShowRemoveProductModal] = useState<boolean | undefined>();

  /* Storing Coupon Free Product in State as it is maintained by fronentend rather then backend */
  const [couponProductData, setCouponProductData] = useState<cartFreeProduct>();

  const [showLoginModal, setShowLoginModal] = useState<boolean>();
  const [showCartMsgModal, setShowCartMsgModal] = useState<boolean>();
  const [cartUpdated, setCartUpdated] = useState<boolean>(false);

  const experimentIds = t("abTestExperimentIds");

  const variants = useSplit({
    experimentsList: [{ id: "displayShippingOnPayment" }, { id: "guestPaymentFlow", condition: !userProfile?.id }],
    deps: [],
  });

  const { widgetTagsFlag } = experimentIds?.[0] || {};

  const [variantTagsFlag] = useOptimize([widgetTagsFlag, ,]).variants;

  const [couponFreeProductData, setCouponFreeProductData] = useState();

  const { handleTrueCaller, isSpinning } = useLogin({
    mergeCart: true,
    redirect: false,
    onSuccess: () => {
      updateCheckout();
      dispatchEvent(new Event("Login Success"));
    },
  });

  const scViewTriggered = useRef(false);
  const onMountEventTrigger = () => {
    ADOBE_REDUCER.adobePageLoadData = getCartAdobeDigitalData(cart, undefined);
    scViewTriggered.current = true;
  };

  /* Remove coupon code conditionally */
  const ignoreCouponCodes = () => {
    /* for popxo and mgp coupon code is static */
    const couponCode = SHOP.SITE_CODE.match(/popxo|mgp/) ? "POPXOFREE" : t("surveyCouponCodes")?.[0];

    /* For mgp till the user fills the survey "popxofree" should be ignored */
    if ((SHOP.ENABLE_SURVEY_COUPON_RESTRICTION && couponCode) || SHOP.SITE_CODE === "mgp") {
      const surveyResponseId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
      const ignoreCoupons = JSON.parse(getLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT) || "[]");

      if (!surveyResponseId) {
        const ignoreCouponCodes = [...new Set([...ignoreCoupons, couponCode])];
        // add coupon code in local storage
        setLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT, ignoreCouponCodes, true);
      } else {
        // if survey response id is already present then remove it from local storage

        const removeCoupon = ignoreCoupons.filter((coupon: string) => coupon !== couponCode);
        setLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT, removeCoupon || "[]", true);
      }
    }
    return null;
  };

  /** On Mount Call for Checkout - Decides all the first load view of cart */

  useEffect(() => {
    async function updateCartWithInstantDiscount() {
      let userCart: userCart | void = await updateCheckout(false);

      if (userCart) {
        /* In-case of instant discount code again call the checkout api with this coupon */
        if (userCart?.instantDiscountCode) {
          setLocalStorageValue(LOCALSTORAGE.COUPON, cart.instantDiscountCode);
          userCart = await updateCheckout(false);
        }
      }

      setCartUpdated(true);
    }

    /* Check if Cart Identifier present cartId/memberId */
    if (getCartIdentifier()) {
      /*  check if there is any particular coupon which is supposed 
      to be ignored in checkout api call */
      ignoreCouponCodes();

      /* To Avoid Multiple Checkout Calls in start Synchronising them */
      if (cart.skusWithNoHasShade?.length) {
        /* Client Side First Check for skusWithNoHasShade list and then hit checkout */
        const cartApi = new CartAPI();

        cartApi.checkForHasShade(cart.skusWithNoHasShade).then(() => updateCartWithInstantDiscount());
      } else {
        /* Server Side Render Hit Checkout Directly */
        updateCartWithInstantDiscount();
      }
    } else {
      setCartUpdated(true);
    }
  }, []);

  /* Call hasShade integration api based on the skulist after first render */
  useEffectAfterRender(() => {
    if (cart.skusWithNoHasShade?.length && cartUpdated) {
      const cartApi = new CartAPI();
      cartApi.checkForHasShade(cart.skusWithNoHasShade).then(() => updateCheckout(false));
    } else if (!cart.loader && cart.allProducts?.length) {
      /* Adobe Cart Page Load Call */
      GAcheckoutInitiate(cart);

      /* Once listener work is over trigger directly scView event */
      if ((scViewTriggered.current || !FEATURES?.cartAdobeEventKey) && cartUpdated) {
        onMountEventTrigger();
      } else if (FEATURES?.cartAdobeEventKey) {
        /* Attaching eventlistener for Adobe scView event on mount */
        addEventListener(FEATURES?.cartAdobeEventKey, onMountEventTrigger);
      }
    }

    /* Webenage Cart Viewed - Runs on Empty Cart also */
    if (cart.identifier && !cart.loader) {
      GACartViewed(GACartViewEvent(cart));
    }

    // /* Cleanup */
    return () => {
      removeEventListener(FEATURES?.cartAdobeEventKey as string, onMountEventTrigger);
    };
  }, [cart, cartUpdated, cart.skusWithNoHasShade]);

  useEffectAfterRender(() => {
    if (variants?.guestPaymentFlow) {
      setSessionStorageValue(SESSIONSTORAGE.GUEST_PAYMENT_FLOW_VARIANT, variants?.guestPaymentFlow, true);
    }
  }, [variants?.guestPaymentFlow]);

  useEffect(() => {
    const fetchBestCoupon = async () => {
      const data = await fetchRecommendedCoupons();
      setBestCouponCode(data?.availableCouponList?.[0]);

      setHasRecommendedCoupons(data?.availableCouponList);
    };

    if (userProfile && cart?.products?.length > 0 && !cart?.couponData?.couponCode) fetchBestCoupon();
  }, [userProfile, cart]);

  /**
   * Checkout API call and updating data with new values(coupon/glammpoints)
   * Note: It was always return userCart, except bad request or payload
   */
  const updateCheckout = async (initiateLoader = true, eventInfo?: eventInfo): Promise<userCart | undefined> => {
    /* In Case we want things to happen in background */
    if (initiateLoader) updateCartLoader(true);

    const { coupon, gp } = getCouponandPoints();

    const cartApi = new CartAPI();
    try {
      const { data: result } = await cartApi.updateCart(coupon, gp, shippingAddress?.zipcode);

      const cartData = cartCustomRepsonseLayer(result.data);

      /* Initiating Click Event Adobe for Coupons/Glammpoints */
      if (eventInfo) adobeClickEvent(cartData, eventInfo);

      updateCart(result);

      /**
       * Check if Free Product Available on Coupon, if there then show Modal
       * Note: In case user has already added the product once or removed it avoid the logic
       */
      const couponProductId = getLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);
      const { freeProduct } = cartData.couponData || {};

      if (freeProduct?.id && !couponProductData && !couponProductId) {
        showFPModal(freeProduct);
      }

      if (initiateLoader) updateCartLoader(false);

      return cartData;
    } catch (err: any) {
      updateCartLoader(false);
      /**
       * In Case Checkout Call is Failed, removing the coupon and glammpoints from localstorage
       * and rehitting the cart api
       * Note:Only if coupon/glammpoints were there in localstorage we hit api again to avoid loop
       */
      if (coupon || gp) {
        removeLocalStorageValue(LOCALSTORAGE.COUPON);
        removeLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS);

        /* In Case of Instant Discount Below Msg show a bottom modal */
        if (err.response?.data?.message?.match(/you just missed this/gi)) {
          setShowCartMsgModal(true);
        }

        return updateCheckout();
      }
      showError(err.response?.data?.message || "Error");
      return;
    }
  };

  /* Getting Free Product Data (PWP/GWP/Coupon Free Product) and Opening Modal */
  const showFPModal = (
    prodParams: freeProductData,
    otherData?: FPOtherData,
    productAlreadyFetched?: boolean,
    productResponse?: any
  ) => {
    updateCartLoader(true);
    if (productAlreadyFetched) {
      setFreeProductsData(productResponse);
      setShowFreeProductModal(true);
    } else {
      getProductData(prodParams, otherData).then((res: FPData | undefined) => {
        if (res) {
          setFreeProductsData({ ...res, freeProductData: prodParams, otherData });
          setShowFreeProductModal(true);
        }
      });
    }
    updateCartLoader(false);
  };

  /* ADOBE - Click Event Apply/Remove Promocode and Glammpoints */
  const adobeClickEvent = (cartData: userCart, eventName: eventInfo) => {
    const common = {
      linkName: `web|cart summary page|shopping bag|${eventName}-success`,
      linkPageName: "web|cart summary page|shopping bag",
      assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      subSection: "order checkout step3",
      platform: ADOBE.PLATFORM,
      ctaName: `${eventName} success`,
    };

    const adobeData = {
      ...getCartAdobeDigitalData(cartData, common),
      user: Adobe.getUserDetails(),
    };
    (window as any).digitalData = adobeData;
    Adobe.Click();
  };

  const { onSuccess } = useSSO();

  const handleLogin = (redirectToPay = false) => {
    function initLoginModal() {
      if (!redirectToPay) sessionStorage.setItem("doNotRedirect", "true");

      /* In Case SSO enabled trigger it as second priority then truecaller */
      if (SHOP.ENABLE_SSO) {
        return (window as any).g3Login({
          vendorCode: getVendorCode(),
          templateType: "MINI",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
          config: { onSuccess, eventCallbacks: (e: EVENT_TYPES, data: any) => handleSSOEvents(e, data, true) },
        });
      }

      setShowLoginModal(true);

      router.push(
        {
          pathname: "/shopping-bag",
          query: { simplifiedLogin: true },
        },
        undefined,
        { shallow: true }
      );
      // window.dataLayer?.push({ event: "optimize.activate" });
    }

    /* Activate Trucaller only on Myglamm */
    if (FEATURES?.enableTruecaller) {
      return handleTrueCaller(initLoginModal);
    }

    initLoginModal();
  };
  /* LOADING - API Call is going on */
  if (!cartUpdated) {
    return <LoadSpinner className="inset-0 fixed h-screen w-16 mx-auto" />;
  }

  const misProducts = cart?.miscellaneousProducts?.find(i => i?.moduleName === 2);

  if (cart.products?.length > 0) {
    return (
      <main>
        <Head>
          <title key="title">{t("shoppingBag")}</title>
        </Head>

        <Script src={process.env.NEXT_PUBLIC_JUSPAY_SCRIPT} />

        {/* Cart Next order Subscriber (49/9 subscription) strip  */}
        <CartNextOrderSubscriberStrip />

        <div className="flex flex-col p-2" style={{ minHeight: "calc(100vh - 7rem)" }}>
          <CartDiscount showFPModal={showFPModal} />

          <CartProduct showFPModal={showFPModal} updateCheckout={updateCheckout} />

          <CartFreeProducts updateCheckout={updateCheckout} setShowRemoveProductModal={setShowRemoveProductModal} />

          <CouponFreeProduct
            productData={couponProductData}
            updateCheckout={updateCheckout}
            setCouponFreeProductData={(couponFreeProd: any) => {
              setCouponFreeProductData(couponFreeProd);
            }}
          />

          <CartCoupons
            updateCheckout={updateCheckout}
            showLoginModal={() => handleLogin()}
            hasRecommendedCoupons={hasRecommendedCoupons}
            bestCouponCode={bestCouponCode}
          />

          {typeof showRemoveProductModal === "boolean" && (
            <RemoveGiftCardModal
              show={showRemoveProductModal}
              close={() => {
                setShowRemoveProductModal(false);
              }}
              isAddedFromMiscProducts={true}
              product={misProducts}
              removeProduct={removeGiftCardFromShoppingBag}
              setShowRemoveProductModal={setShowRemoveProductModal}
            />
          )}

          <CartUpsell couponFreeProductData={couponFreeProductData} variantTagsFlag={variantTagsFlag} />

          {/* Subscriptions */}
          <CartUserSubscription updateCheckout={updateCheckout} />
          <Summary />
          <CartDonate />

          {SHOP.REGION === "MIDDLE_EAST" && SHOP.ENABLE_GLAMMPOINTS && <CartGoodPoints />}
        </div>

        {/* FIXED BOTTOM SHOWING PAYABLE AMOUTN WITH FURTHER REDIRECTION TO CHECKOUT */}
        {cartUpdated && (
          <CartFixedBottom
            couponFreeProductData={couponFreeProductData}
            showLoginModal={() => handleLogin(true)}
            key={cart.payableAmount}
            updateCheckout={updateCheckout}
          />
        )}

        {/* LOGIN MODAL */}
        {typeof showLoginModal === "boolean" && (
          <OnlyMobileLogin show={showLoginModal} hide={() => setShowLoginModal(false)} updateCart={updateCheckout} mergeCart />
        )}

        {/* FREE PRODUCT MODAL FOR GWP/PWP/COUPON-FREE */}
        {freeProductsData && typeof showFreeProductModal === "boolean" && (
          <FreeProductModal
            show={showFreeProductModal}
            productData={freeProductsData}
            updateCheckout={updateCheckout}
            hide={() => setShowFreeProductModal(false)}
            setCouponProductData={(prod: cartFreeProduct) => setCouponProductData(prod)}
          />
        )}

        {/* MESSAGE MODAL - INSTANT DISCOUNT */}
        {typeof showCartMsgModal === "boolean" && (
          <CartMessageModal
            show={showCartMsgModal}
            hide={() => setShowCartMsgModal(false)}
            modalTexts={{
              title: "You Missed it",
              message: "The flash sale has ended.Please verify the price of products in your cart before making the payment",
              buttonLabel: "OK",
            }}
          />
        )}

        {/* OVERLAY - SHOWN IN CASE OF ANY ACTION THAT TAKES TIME ON CART */}
        <CartOverlayLoader show={cart.loader || isSpinning} />
      </main>
    );
  }

  /* No Products or Cart is yet to be created for the user */
  if (cart.products?.length === 0 || cartUpdated) {
    return <EmptyCart />;
  }

  return null;
};

ShoppingBag.getLayout = (page: ReactElement) => <ShoppingBagLayout>{page}</ShoppingBagLayout>;

export default ShoppingBag;
