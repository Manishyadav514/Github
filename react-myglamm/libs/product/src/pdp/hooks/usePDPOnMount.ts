import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useRouter } from "next/router";

import { DecoySubscription, PDPOffersData, PDPProd, SubscriptionFrequency } from "@typesLib/PDP";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";

import { PARTNERSHIP_STATE } from "@libStore/valtio/PARTNERSHIP.store";

import { setAdobeEvarCustom } from "../AnalyticsHelper";
import {
  getBundleProductData,
  getCTPPDPData,
  getFreeProductPromise,
  getProductBoughtTogether,
  handleProductDiscountCode,
} from "../HelperFunc";
import { SLUG } from "@libConstants/Slug.constant";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { getClientQueryParam } from "@libUtils/_apputils";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

enum OfferType {
  NOCOUPON = 0,
  BACKENDCOUPON = 1,
  DSCOUPON = 2,
}

export function usePDPOnMount(product: PDPProd) {
  const { t } = useTranslation();
  const { asPath, query } = useRouter();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const {
    dynamicOfferVariant,
    pdpRecurringSubscriptionVariant,
    frequentlyBroughtVariant,
    addOnProductVariant,
    downloadCtaVariant,
    widgetonAddtocart,
  } = useSnapshot(PDP_VARIANTS);
  const { showBestOffer, pdpOffers, addOnData, prodWidgetData, modalStates } = useSnapshot(PDP_STATES);

  // save viewed product id to localStorage for use in recently views carousel that is lazy loaded
  useEffect(() => {
    let prevVal = getLocalStorageValue(LOCALSTORAGE.RECENT_PRODUCTS, true) || [];

    const { id, productMeta, childProducts } = product;
    const { isPreOrder } = productMeta;

    if (
      !prevVal.includes(id) &&
      ((childProducts?.length && childProducts.every(x => x.inStock)) || product.inStock || isPreOrder)
    ) {
      /* remove the last productId incase no of ids are more then the threshold */
      if (prevVal.length >= 11) {
        prevVal.shift();
      }

      prevVal.unshift(id);
      setLocalStorageValue(LOCALSTORAGE.RECENT_PRODUCTS, prevVal, true);
    }
  }, [product.id]);

  // Pops up the review pdp modal if url contains #rating or query.layout = rating
  useEffect(() => {
    if (asPath.match("#rating") || query?.action === "rating") {
      setTimeout(() => {
        PDP_STATES.modalStates.SubmitReviewModal = true;
      }, 250);
    }
  }, []);

  /* Store/Retrieve Coupon data if discountCode query presnt in URL */
  useEffect(() => {
    handleProductDiscountCode(product.id);
  }, [product.id]);

  /* PDP Frequently Bought V2 A/B fallback to normal */
  useEffect(() => {
    if (frequentlyBroughtVariant && product.type === 1 && product.inStock) {
      if (frequentlyBroughtVariant !== "no-variant") (window as any).evars.evar153 = frequentlyBroughtVariant;

      if (frequentlyBroughtVariant === "1") {
        const widgetApi = new WidgetAPI();
        widgetApi.getWidgets({ where: { slugOrId: SLUG().PDP_FREQUENTLY_BROUGHT } }).then(({ data }) => {
          if (data?.data?.data?.widget?.length) {
            PDP_STATES.frequentlyBoughtDataV2 = data?.data?.data?.widget || [];
          } else {
            getProductBoughtTogether(product); // fallback
          }
        });
      } else {
        getProductBoughtTogether(product); // fallback
      }
    }
  }, [product.sku, frequentlyBroughtVariant]);

  useEffect(() => {
    if (dynamicOfferVariant && pdpRecurringSubscriptionVariant && !product?.productMeta?.cutThePrice) {
      const productApi = new ProductAPI();

      const segment = getLocalStorageValue(LOCALSTORAGE.PROFILE, true)?.meta?.attributes?.pdpOfferSegment?.[0] || "default";

      productApi.getDecoyPricingOnPDP(product.sku, segment, dynamicOfferVariant === "1").then(({ data }: any) => {
        const { decoyPricing, couponList, addOnProducts }: PDPOffersData = data?.data || {};

        const subscriptionsFrequenciesExists = !!decoyPricing?.find(x => x.subscriptionsFrequencies?.length);

        PDP_STATES.pdpOffers = { decoyPricing, couponList, addOnProducts };

        if (pdpRecurringSubscriptionVariant === "1" && subscriptionsFrequenciesExists) {
          /* From the default pack extract it's showBestOffer flag to enable/disable best price widget on first load */
          const pack = decoyPricing?.[t("subscriptionConfig")?.defaultPack || 2] as DecoySubscription;
          const subscriptionFrequency =
            pack.subscriptionsFrequencies?.find(x => x.tag?.includes("Most Popular")) ||
            (pack.subscriptionsFrequencies?.[t("subscriptionConfig")?.defaultFrequency || 0] as SubscriptionFrequency);

          /* sorting before hand and storing */
          PDP_STATES.pdpOffers.decoyPricing = sortSubscriptions(decoyPricing as DecoySubscription[], "sortOrder");

          /* because this is a subscription product we make best price visible & enable/disable it based on flags recieved */
          PDP_STATES.showBestOffer = subscriptionFrequency.showBestOffer;

          /* Default selection of pack & subscription on first load */
          PDP_STATES.selectedRecurringSubscription = {
            quantity: pack.quantity,
            decoyPriceId: pack.id,
            subscriptionId: subscriptionFrequency.id,
            frequency: subscriptionFrequency.frequency,
          };
        } else if (
          couponList?.length &&
          !t("partnershipSource").includes(getClientQueryParam("utm_source")?.toLowerCase()) &&
          !getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true)
        ) {
          PDP_STATES.showBestOffer = true; // fallbacks to showing the UI
        } else {
          PDP_STATES.showBestOffer = false;
        }

        /* Evar Set condtions for all the cases of decoy/subscription */
        if (pdpRecurringSubscriptionVariant !== "no-variant") {
          setAdobeEvarCustom(
            subscriptionsFrequenciesExists,
            pdpRecurringSubscriptionVariant,
            "evar157",
            "subscription product"
          );
        }
      });
    }
  }, [product.sku, dynamicOfferVariant, pdpRecurringSubscriptionVariant, userProfile]);

  useEffect(() => {
    if (showBestOffer && !checkPrefixCouponsExist() && pdpOffers.couponList?.length) {
      const { couponList } = pdpOffers;
      let newCouponList = [...couponList];

      // If DS experiment variant 1 then only need to display - DS coupons otherwise not.
      // filtering DS coupons using "DS" prefix existing logic.
      if (dynamicOfferVariant !== "1") {
        newCouponList = couponList.filter(x => !x.couponCode.startsWith("DS") || x.offerFrom !== "DS");
        PDP_STATES.pdpOffers.couponList = newCouponList;
      }

      /* Setting eVar based on the new coupon state */
      if (!newCouponList.length) (window as any).evars.evar139 = `TRUE|${OfferType.NOCOUPON}`;
      else if (newCouponList[0].couponCode.startsWith("DS")) (window as any).evars.evar139 = `TRUE|${OfferType.DSCOUPON}`;
      else (window as any).evars.evar139 = `TRUE|${OfferType.BACKENDCOUPON}`;
    } else if (typeof showBestOffer === "boolean") {
      (window as any).evars.evar139 = `TRUE|${OfferType.NOCOUPON}`;
    }
  }, [showBestOffer, product.sku]);

  useEffect(() => {
    /* GET PWP Data */
    if (product.freeProducts) {
      getFreeProductPromise(product.freeProducts);
    }

    /* GET Bundled Product Data */
    if (product.inStock) {
      getBundleProductData(product);
    }

    // CTP call incase loggedin user and ctp enabled
    if (product.productMeta.cutThePrice && userProfile?.id && FEATURES.enableCTP) {
      getCTPPDPData(product.sku);
    }
  }, [product.sku]);

  // update addOnData based on exp variant and product data
  useEffect(() => {
    const isAddOnAvailable = pdpOffers?.addOnProducts?.[0]?.id?.length > 0;
    if (isAddOnAvailable) (window as any).evars.evar119 = addOnProductVariant;
    let showAddOnComp = isAddOnAvailable && (addOnProductVariant === "1" || addOnProductVariant === "2");
    PDP_STATES.addOnData = {
      ...addOnData,
      addOnMethod: showAddOnComp && addOnProductVariant === "1" ? "AddOnSelected" : "",
      showMiniPDPModal: false,
      addOnExp: showAddOnComp,
      dsKey: pdpOffers?.addOnProducts?.[0]?.key,
      addOnProduct: {
        ...pdpOffers?.addOnProducts?.[0]?.value?.products?.[0],
        URL: pdpOffers?.addOnProducts?.[0]?.value?.products?.[0]?.slug,
      },
    };
  }, [pdpOffers?.addOnProducts, addOnProductVariant]);

  // prod widget
  useEffect(() => {
    if (widgetonAddtocart && widgetonAddtocart !== "no-variant") {
      PDP_STATES.prodWidgetData = {
        ...prodWidgetData,
        widgetLogic: "show",
        widgetVarint: widgetonAddtocart,
      };
    }
  }, [widgetonAddtocart]);

  useEffect(() => {
    if (downloadCtaVariant && downloadCtaVariant !== "no-variant") {
      (window as any).evars.evar124 =
        query?.discountCode && getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) && downloadCtaVariant === "1"
          ? "True"
          : "False";
    }
  }, [downloadCtaVariant]);

  const prefixCoupons = t("hideDynamicOfferCoupons") || ["MGXO", "CLAIMREWARD", "BIGGBOSS", "MYSTERY", "PAR"];

  /** Check If certain coupons already stored in localstorage */
  const checkPrefixCouponsExist = () => {
    const storedCoupon = getLocalStorageValue(LOCALSTORAGE.COUPON);
    if (storedCoupon) {
      return prefixCoupons.find((prefix: string) => storedCoupon.startsWith(prefix));
    }

    return false;
  };

  const sortSubscriptions = (subscriptionArray: any[], key: string) =>
    [...subscriptionArray].sort((a, b) => a?.[key] - b?.[key]);

  useEffect(() => {
    if (typeof modalStates?.similarProductModal === "boolean") {
      (window as any).digitalData.common.widgetEntry = modalStates?.similarProductModal ? "icon" : "scroll";
    }
  }, [modalStates?.similarProductModal]);

  const videoID = getClientQueryParam("videoid");
  const videoSource = getClientQueryParam("videotype");

  useEffect(() => {
    if (videoID && (videoSource === "yt" || videoSource === "ps")) {
      PDP_STATES.modalStates.videoPopupModal = true;
    }
  }, [videoID, videoSource]);

  const utmSource = getClientQueryParam("utm_source")?.toLowerCase();

  useEffect(() => {
    const getLocalPartnershipData = PARTNERSHIP_STATE?.partnershipData?.partnershipCoupon;
    const discountCode = getClientQueryParam("discountCode");
    if (t("partnershipSource").includes(utmSource) && !getLocalPartnershipData && !discountCode) {
      PDP_STATES.modalStates.partnerShipModal = true;
    }
  }, [utmSource]);
}
