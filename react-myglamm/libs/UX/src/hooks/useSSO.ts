import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { User } from "@typesLib/Consumer";

import CartAPI from "@libAPI/apis/CartAPI";
import WishlistAPI from "@libAPI/apis/WishlistAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { updateCart, updateProductCount } from "@libStore/actions/cartActions";

import { addLoggedInUser } from "@libStore/actions/userActions";

import { getVendorCode } from "@libUtils/getAPIParams";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { getCouponandPoints } from "@checkoutLib/Storage/HelperFunc";

import useTranslation from "./useTranslation";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

export const useSSO = () => {
  const { t } = useTranslation();

  const { push, pathname } = useRouter();

  const [isSSOLoaded, setIsSSOLoaded] = useState(!!(typeof window !== "undefined" && (window as any).g3Login));

  /* Interval Check for SSO Script loaded or not before trigger */
  useEffect(() => {
    let ssoInterval: NodeJS.Timer;

    if (!isSSOLoaded) {
      let counter = 0;

      ssoInterval = setInterval(() => {
        counter += 1;
        if ((window as any).g3Login) {
          setIsSSOLoaded(true);
          clearInterval(ssoInterval);
        } else if (counter > 25) {
          clearInterval(ssoInterval);
        }
      }, 200);
    }

    return () => clearInterval(ssoInterval);
  }, []);

  function onSuccess(data: User) {
    addLoggedInUser(data);

    if (pathname === "/login") push("/");

    /* Calls in Background */
    try {
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

      mergeCartAfterAuth(memberId);

      /* Hit Glammpoint API to credit surveyPoints if responsesurveyId present */
      const resSurveyId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
      if (resSurveyId && SHOP.ENABLE_GLAMMPOINTS) {
        const surveys = t("myglammXOSurveys");

        const consumerApi = new ConsumerAPI();
        consumerApi
          .freeGlammPoint({
            type: "glammPoints",
            identifier: memberId,
            module: t("surveyModule"),
            vendorCode: getVendorCode(),
            slug: surveys[0]?.slug || surveys.slug,
            platform: `survey${surveys[0]?.index || surveys.index}`,
          })
          .catch(() => null);
      }

      /* In case a membertag key present in localstorage */
      removeLocalStorageValue(LOCALSTORAGE.SURVEY_MEMBERTAG);

      const wishlistApi = new WishlistAPI();
      wishlistApi.getWishlistProductIds(memberId).then(({ data: wishlist }) => {
        if (wishlist.data?.id) {
          localStorage.setItem("wishlistId", wishlist.data?.data?.id);
        }

        USER_REDUCER.userWishlist = wishlist.data?.data?.productIds;
      });
    } catch (error: any) {
      console.error(error.response?.data?.message || error);
    }
  }

  const mergeCartAfterAuth = async (consumerId: any) => {
    const cartId = getLocalStorageValue(LOCALSTORAGE.CARTID);

    try {
      const cartApi = new CartAPI();

      if (cartId) {
        const { data: cartData } = await cartApi.mergeCart(consumerId, cartId);

        removeLocalStorageValue(LOCALSTORAGE.CARTID);

        if (pathname === "/shopping-bag") {
          const { coupon, gp } = getCouponandPoints();

          cartApi.updateCart(coupon, gp, undefined).then(({ data: result }) => updateCart(result));

          /* Directly Redirect on Login In Case User doesn't have any prior cart */
          if (!cartData.data.existingUserCart) {
            getShippingAddress().then(address => {
              if (address) {
                return push("/payment");
              }

              /* No Address Present then redirect to Add Address Form Page */
              setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment");
              return push("/addAddress");
            });
          }
        } else {
          /* Leaving the Checkout pages get only product Count after Merge Cart */
          cartApi.getCount().then(({ data: res }) => updateProductCount(res.data?.productCount || 0));
        }
      } else {
        cartApi.getCount().then(({ data: res }) => updateProductCount(res.data?.productCount || 0));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { onSuccess, isSSOLoaded };
};
