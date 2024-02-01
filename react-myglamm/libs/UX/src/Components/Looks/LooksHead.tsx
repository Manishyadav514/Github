import React, { useEffect } from "react";
import Head from "next/head";

import { ADOBE } from "@libConstants/Analytics.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { GALookPageViewed } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const LooksHead = ({ looks }: { looks: any }) => {
  const [looksData] = looks.data;

  // Adobe Analytics[36] - Page Load - Look details
  useEffect(() => {
    prepareAdobePageLoad();
    // #region  // *Webengage [11] - Look Page Viewed : function call
    prepareWebengageLookDatalayer(looksData);
    // #endregion  // Webengage [11] - Look Page Viewed : function call
  }, []);

  const prepareAdobePageLoad = () => {
    const ddlProducts: any[] = [];
    if (looksData?.products?.length > 0) {
      const prepareProductObject = () => {
        looksData.products.forEach((looksProductId: any) => {
          if (looks?.relationalData?.products[looksProductId]) {
            const product: any = looks?.relationalData?.products[looksProductId];
            let ddlProductOfferPrice = 0;
            let ddlProductPrice = 0;
            let ddlProductDiscountedPrice = 0;

            // prepare product price & offer price x quantity
            ddlProductOfferPrice = formatPrice(product.offerPrice) as number;
            ddlProductPrice = formatPrice(product.price) as number;
            ddlProductDiscountedPrice = parseFloat((ddlProductPrice - ddlProductOfferPrice).toString());

            //
            ddlProducts.push({
              productQuantity: 1,
              productSKU: product.sku,
              productOfferPrice: ddlProductOfferPrice,
              productPrice: ddlProductPrice,
              productDiscountedPrice: ddlProductDiscountedPrice,
              productRating: "",
              productTotalRating: "",
              stockStatus: product.inStock ? "in stock" : "out of stock",
              isPreOrder: product.productMeta.isPreOrder ? "yes" : "no",
              PWP: "",
              hasTryOn: "no",
            });
          }
        });
      };
      prepareProductObject();
    }

    const digitalData = {
      common: {
        pageName: `web|glammstudio|looks|${looksData.cms[0]?.content.name.toLowerCase()}`,
        newPageName: "lookbook detail",
        subSection: `${looks.relationalData.categoryId[looksData.categoryId].cms[0]?.content.name.toLowerCase()}`,
        assetType: "lookbook",
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
      look: {
        lookName: `${looksData.cms[0]?.content.name.toLowerCase()}`,
        lookCategory: `${looks.relationalData.categoryId[looksData.categoryId].cms[0]?.content.name.toLowerCase()}`,
      },
      product: ddlProducts,
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  };

  // #region  // *Webengage [11] - Look Page Viewed : Function
  const prepareWebengageLookDatalayer = (LookDetails: string) => {
    const webengageDataLayer: any = {
      lookCategory: looks?.relationalData?.categoryId[looksData.categoryId]?.cms[0]?.content?.name || "",
      lookName: looksData?.cms[0]?.content?.name || "",
      userType: checkUserLoginStatus() ? "Member" : "Guest",
    };
    GALookPageViewed(webengageDataLayer);
  };
  // #endregion // Webengage [11] - Look Page Viewed : Function

  return (
    <Head>
      <title>{looksData?.cms[0]?.metadata?.title}</title>

      <meta key="description" name="description" content={looksData?.cms[0]?.metadata?.description} />
      <meta key="keywords" name="keywords" content={looksData?.cms[0]?.metadata?.keywords} />
      <link
        key="canonical"
        rel="canonical"
        href={
          looksData?.cms[0]?.metadata?.canonicalTag || `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${looksData?.urlManager.url}`
        }
      />

      <meta key="og:title" property="og:title" content={looksData?.cms[0]?.metadata?.title} />
      <meta key="og:description" property="og:description" content={looksData?.cms[0]?.metadata?.description} />
      <meta key="og:url" property="og:url" content={`${BASE_URL()}${looksData?.urlManager.url}`} />
      <meta
        key="og:image"
        property="og:image"
        content={looksData?.assets?.length > 0 ? looksData?.assets?.find((asset: any) => asset.type === "image").url : ""}
      />
      {looksData?.cms[0]?.metadata?.noIndex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

export default LooksHead;
