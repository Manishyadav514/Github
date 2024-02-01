import Router from "next/router";

import { SurveyProduct } from "@typesLib/Survey";

import ProductAPI from "@libAPI/apis/ProductAPI";

import Adobe from "@libUtils/analytics/adobe";
import { isWebview } from "@libUtils/isWebview";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { ADOBE } from "@libConstants/Analytics.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { GAAddProduct, getAdobeProduct } from "@checkoutLib/Cart/Analytics";

import useAddtoBag from "./useAddToBag";
import useAppRedirection from "./useAppRedirection";

export function useSurveyAddToBag() {
  const { redirect } = useAppRedirection();
  const { addProductToCart } = useAddtoBag();

  const addProductToBag = async (productInfo: SurveyProduct & { platform?: string }, callback?: () => void) => {
    const { slug, coupon, discount, productIds, platform } = productInfo || {};

    /* In Specific Cases where productsIds are mentioned directly add them to cart */
    if (productIds) {
      const productApi = new ProductAPI();
      const include = [
        "price",
        "sku",
        "brand",
        "categories",
        "products",
        "productMeta",
        "offerPrice",
        "productTag",
        "type",
        "urlManager",
        "cms",
        "wms",
        "inStock",
      ];

      const { data } = await productApi.getProduct({ id: productIds[0] }, 0, include);
      const [activeProduct] = data.data.data || [];
      const { relationalData } = data.data || {};

      return addProductToCart(activeProduct, 1, undefined, undefined, false).then(res => {
        if (res) {
          /* Adobe Modal Load Event - Mini PDP */
          let category = "";
          let subCategory = "";
          if (relationalData?.categories && activeProduct) {
            category =
              relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content
                .name;
            subCategory =
              relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]
                ?.content.name;
          }

          GAaddToCart(GAAddProduct(activeProduct, category), category);

          (window as any).digitalData = {
            common: {
              linkName: `web|${category} - ${subCategory}|product description page|Claim Your Reward`,
              linkPageName: `web|${subCategory}|${activeProduct.productTag}|product description page`,
              newLinkPageName: window.digitalData?.common?.pageName,
              assetType: "product",
              newAssetType: "product",
              subSection: "",
              platform: ADOBE.PLATFORM,
              ctaName: "claim free lipstick",
              pageLocation: "",
            },
            user: Adobe.getUserDetails(),
            product: getAdobeProduct([activeProduct]),
          };
          Adobe.Click();

          let url = "/shopping-bag";
          if (isWebview()) {
            const isGuest = LOCALSTORAGE.CARTID in localStorage;
            if (isGuest) {
              url = url.concat(`?cartId=${getLocalStorageValue(LOCALSTORAGE.CARTID)}`);
            }
            if (coupon) {
              url = url.concat(`${isGuest ? "&" : "?"}&discountCode=${coupon}`);
            }
          }

          redirect(url);
        }
      });
    }

    const validSlug = slug?.includes("/product/") || slug?.includes("/glammclub/");

    /* If Proper Slug is Provided without domain then show minipdp */
    if (validSlug && !slug?.startsWith("http") && !IS_DESKTOP) {
      if (isWebview()) {
        /**
         * In-Case "responseSurveyId" present in sessionStorage add it as a param
         * while giving callback
         */
        const responseSurveyId = sessionStorage.getItem(LOCALSTORAGE.RESPONSE_SURVEY_ID);
        let url = `${slug}?clickAction=add-to-bag&showMiniPdp=true${discount ? "" : "&uiType=Free"}`;
        if (responseSurveyId) {
          url = url.concat(`&responseSurveyId=${responseSurveyId}&surveyName=survey${platform || ""}`);
        }
        /* Handled Autoapply for webview */
        if (coupon) {
          url = url.concat(`&discountCode=${coupon}`);
        }
        /* append survey version */
        if (Router.query.mb) {
          url = url.concat(`&mb=${Router.query.mb}`);
        }
        /* add flow for app to distinguish survey flow */
        url = url.concat(`&flow=survey`);

        redirect(url, true);
      } else {
        slug?.includes("/product/") && callback?.();
        slug?.includes("/glammclub/") && redirect(slug);
      }
      return;
    }

    redirect(slug || "/");
  };

  return { addProductToBag };
}
