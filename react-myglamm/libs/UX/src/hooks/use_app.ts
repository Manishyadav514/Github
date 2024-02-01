import { useEffect } from "react";
import { useRouter } from "next/router";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import WishlistAPI from "@libAPI/apis/WishlistAPI";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { addLoggedInUser } from "@libStore/actions/userActions";
import { NAV_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";

import { GAPageView } from "@libUtils/analytics/gtm";
import { getVendorCode } from "@libUtils/getAPIParams";
// import { setVendorAPI } from "@libUtils/withReduxUtils";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { getClientQueryParam, initAppWVScript, initialClientCalls, storeUTMParams } from "@libUtils/_apputils";

import { CountryConfig } from "@typesLib/Redux";

import { checkUserLoginStatus, getBottomNavSlug } from "@checkoutLib/Storage/HelperFunc";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

/**
 * Intiates All the Functions and Logic requires on page load (On-Mount)
 * @param store Redux Store
 */

export function use_App(store: any) {
  const router = useRouter();

  useEffect(() => {
    // setVendorAPI(store.vendor); // setting vendor for client

    const { memberId } = checkUserLoginStatus() || {};

    /* Store and update utmParams if any present */
    storeUTMParams();

    // this is to send affiliate key to order put call
    // when the referral comes from an affilate link
    const aff_rc = getClientQueryParam("aff_rc");
    // this is to send affiliate key to order put call
    // when the referral comes from an affilate link
    const rc = getClientQueryParam("rc");
    const affiliate_vendor = getClientQueryParam("affiliate_vendor");
    if (typeof aff_rc === "string" || typeof rc === "string") {
      setLocalStorageValue(LOCALSTORAGE.REFERRAL_CODE, aff_rc || rc);
    }
    if (typeof affiliate_vendor === "string") {
      setLocalStorageValue(LOCALSTORAGE.AFFILIATE_VENDOR, affiliate_vendor);
    }

    /* Get Coupons from Query Params and set it in LocalStorage and get it auto Applied on Cart - Mystery Rewards */
    const discountCode = getClientQueryParam("discountCode");
    if (discountCode) {
      setLocalStorageValue(LOCALSTORAGE.COUPON, discountCode);
    }

    /* Initial calls that runs for all users */
    const countryConstants: CountryConfig[] = store.constantReducer.countryConstants;
    initialClientCalls(store, countryConstants);

    /* In Case of Cross Domain Token start polling till proper token is received */
    if (LOCALSTORAGE.MEMBER_ID in localStorage && LOCALSTORAGE.CORS_TOKEN in localStorage) {
      let counter = 0;
      const pollInterval = setInterval(() => {
        counter += 1;
        /* Wait till the time cors token is removed or hit 50 times */
        if (!(LOCALSTORAGE.CORS_TOKEN in localStorage) || counter > 49) {
          initAPICalls();
          clearInterval(pollInterval);
        }
      }, 20);
    } else if (memberId) {
      /* Calling On Load Apis and Storing in Redux */
      initAPICalls();
    }

    if ((window as any).snowplow) {
      (window as any).snowplow("newTracker", "sp", GBC_ENV.NEXT_PUBLIC_SNOWPLOW_ENDPOINT, {
        appId: "my-app-id",
        contexts: {
          webPage: true,
        },
      });
      const memberId = localStorage.getItem("memberId");
      if (memberId) {
        (window as any).snowplow("setUserId", memberId);
      }

      (window as any).snowplow("enableActivityTracking", {
        minimumVisitLength: 30,
        heartbeatDelay: 10,
      });
    }

    /**
     * Loading bar above header,
     * invokes whenever route changes
     *
     */
    router.events.on("routeChangeStart", (url: string) => {
      if (process.env.NODE_ENV === "development") {
        console.info(`Loading: ${url}`);
      }
      (async () => {
        const nProgress = await import("nprogress");
        nProgress.start();
      })();
    });

    if (!router.asPath.includes("/product")) {
      GAPageView(router.asPath);
      snowplowPageView();
    }
    router.events.on("routeChangeComplete", url => {
      window.requestIdleCallback(async () => {
        const nProgress = await import("nprogress");
        nProgress.done();
      });
      try {
        if (!url.startsWith("/product/")) {
          GAPageView(url.split("?")[0]);
          snowplowPageView();
        }
      } catch (e) {
        // no-op
      }
      window.dataLayer?.push({ event: "optimize.activate" });
    });
    router.events.on("routeChangeError", () => {
      (async () => {
        const nProgress = await import("nprogress");
        nProgress.done();
      })();
    });

    /* Webview Script */
    initAppWVScript();

    setTimeout(() => window.dataLayer?.push({ event: "optimize.activate" }), 500);
  }, [router.locale]);

  useEffect(() => {
    const constantsApi = new ConstantsAPI();

    const fetchBottomNav = async () => {
      const response = await constantsApi.getNavigation(getBottomNavSlug());

      if (response) NAV_REDUCER.bottomNav = response?.data?.data?.[0]?.details;
    };

    if (getBottomNavSlug()) {
      fetchBottomNav();
    }
  }, []);

  function initAPICalls() {
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

    const consumerApi = new ConsumerAPI();
    const wishlistApi = new WishlistAPI();
    Promise.all([
      consumerApi.getProfile(memberId),

      wishlistApi.getWishlistProductIds(memberId).catch(err => {
        console.error(err);
        return { data: {} };
      }),
    ])
      .then(Res => {
        const [profile, wishlist] = Res;

        if (wishlist?.data?.data?.id) {
          setLocalStorageValue(LOCALSTORAGE.WISHLIST_ID, wishlist.data?.data?.id);
        }

        if (profile?.data) {
          addLoggedInUser(profile.data.data);

          /* Store userSegment if present in profile call */
          const userSegment = profile.data.data.meta.attributes?.userSegmentVc?.[getVendorCode()];
          if (userSegment?.length) setLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, userSegment, true);
        }
        if (wishlist?.data?.data?.productIds) USER_REDUCER.userWishlist = wishlist.data.data.productIds;
      })
      .catch(err => console.error(`Error`, err));
  }

  const snowplowPageView = () => {
    if ((window as any).snowplow) {
      (window as any).snowplow("trackPageView");
    }
  };
}
