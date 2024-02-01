import CTPAPI from "@libAPI/apis/CTPAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { logURI } from "@libUtils/debug";
import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { handlePartnershipData } from "@libUtils/getDiscountPartnership";
import { getSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { SLUG } from "@libConstants/Slug.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { PDPProd } from "@typesLib/PDP";
import { cartType, freeProductData } from "@typesLib/Cart";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { PDP_API_INCLUDES, PDP_FREE_PRODUCT_INCLUDES, PDP_SHADES_API_INCLUDES, PDP_WIDGETS } from "./PDP.constant";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

export async function getPDPIntialProps(ctx: any) {
  /* URL Logs for CSR PDP redirection */
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && GBC_ENV.NEXT_PUBLIC_ENABLE_HIT_LOGS) {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }

  try {
    const { slug, sbot, discountCode } = ctx.query;

    const enableNewPDP = ctx.configV3?.featureFlags?.enableNewPDP;

    const productApi = new ProductAPI();
    const { data: productRes } = await productApi.getProduct(
      { "urlManager.url": `/product/${slug.split("?")[0]}` },
      0,
      PDP_API_INCLUDES
    );

    const [productData] = productRes?.data?.data || [];

    /* Handle API Faulure or Slug/product URL not found */
    if (!productData) {
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return { errorCode: 404 };
    }

    const widgetApi = new WidgetAPI();
    const [
      shadesRes,
      ratingsData,
      reviews,
      Questions,
      productStockRes,
      offers,
      flashSale,
      footerBanners,
      partnerShipData,
      fbtData,
      newPDPWidget,
    ]: any = await Promise.allSettled([
      productApi.getProductShades(
        "IND",
        {
          id: { nin: [productData.id] },
          "productMeta.displaySiteWide": true,
          productTag: encodeURIComponent(productData.productTag),
        },
        0,
        PDP_SHADES_API_INCLUDES
      ),
      productApi.getAvgRatingsByProductTag(productData.productTag),
      productApi.getReviews({
        order: ["createdAt DESC", "rating DESC"],
        limit: 5,
        skip: 0,
        where: {
          itemTag: encodeURIComponent(productData.productTag),
          itemType: "product",
        },
      }),
      productApi.getQuestions({
        statusId: 1,
        postType: "productQuestion",
        productTag: productData.productTag,
      }),
      productApi.getProductStock(productData?.sku),
      ...PDP_WIDGETS?.map(({ slugOrId, name }) => {
        if (slugOrId) {
          return widgetApi.getWidgets({
            where: {
              slugOrId,
              ...(name ? { name, items: productData.id } : {}),
            },
          });
        }

        return Promise.resolve(null);
      }),
      discountCode ? handlePartnershipData({ products: productData.id, discountCode, skip: 0 }) : Promise.resolve(),
      sbot
        ? productApi.getProduct({
            type: 2,
            hidden: false,
            and: [
              {
                products: productData?.id,
              },
              {
                products: {
                  length: 2,
                },
              },
            ],
          })
        : Promise.resolve(),
      enableNewPDP ? widgetApi.getWidgets({ where: { slugOrId: SLUG()?.PDP_V2 } }) : Promise.resolve(),
    ]);

    PDP_STATES.frequentlyBoughtData = fbtData?.value?.data?.data || {};
    const { discountDetails, relationalData } = productRes.data;
    const childId = productData?.categories.find((category: any) => category.type === "child")?.id;
    const parentId = productData?.categories.find((category: any) => category.type === "parent")?.id;
    const subChildId = productData?.categories.find((category: any) => category.type === "subChild")?.id;

    const categories = {
      childId,
      parentId,
      subChildId,
      childCategoryName: relationalData?.categories[childId]?.cms[0]?.content?.name,
      parentCategoryName: relationalData?.categories[parentId]?.cms[0]?.content?.name,
      subChildCategoryName: relationalData?.categories[subChildId]?.cms[0]?.content?.name,
      childSlug: relationalData?.categories[childId]?.urlManager?.url || "",
      parentSlug: relationalData?.categories[parentId]?.urlManager?.url || "",
      subChildSlug: relationalData?.categories[subChildId]?.urlManager?.url || "",
    };

    const offerWidget = offers?.value?.data?.data?.data?.widget;

    return {
      PDPProduct: {
        ...productData,
        categories,
        reviews: reviews?.value?.data?.data,
        partnerShipData: partnerShipData?.value,
        ratings: ratingsData?.value?.data?.data,
        questions: Questions?.value?.data?.data?.data,
        questionsCount: Questions?.value?.data?.data?.count,
        shades: shadesRes?.value?.data?.data?.data || [],
        stock: productStockRes?.value?.data?.data?.stock,
        freeProducts: {
          ...(discountDetails?.[productData.id]?.discountValue?.freeProducts || {}),
          categoryId: discountDetails?.categoryId,
        },
        childProducts:
          (productData.productMeta.allowShadeSelection || FEATURES.enableComboV2) && productData.type === 2
            ? productData.products?.map((prod: any) => relationalData?.products[prod]) || []
            : [],
      },
      PDPWidgets: {
        offers: IS_DESKTOP ? offerWidget : getPDPOfferHTMLData(offerWidget),
        footerBanners: footerBanners?.value?.data?.data?.data?.widget,
        flashSale: flashSale?.value?.data?.data?.data?.widget?.[0],
        newPDPWidget: newPDPWidget.value?.data?.data?.data,
      },
      isBot: !!GBC_ENV.NEXT_PUBLIC_ENABLE_DYN_REN && !!sbot, // dynamic rendering,
      enableNewPDP,
    };
  } catch (e) {
    logURI(ctx.asPath);
    console.error(e);
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end(e);
    }
    return {
      errorCode: 404,
    };
  }
}

export const handleProductDiscountCode = (productId: any) => {
  const discountCode = getClientQueryParam("discountCode");

  if (discountCode) {
    let productIds: any;
    const isCollection = Array.isArray(productId);
    if (isCollection) {
      productIds = JSON.stringify(productId?.slice(0, 20))?.slice(1, -1).replace(/["']/g, "");
    } else {
      productIds = productId;
    }
    const couponApi = new ConsumerAPI();
    couponApi
      .getCouponAPIData(productIds, discountCode.toUpperCase())
      .then(({ data: res }: any) => {
        if ((isCollection && res?.data?.finalPriceCoupon) || !isCollection) {
          setSessionStorageValue(
            LOCALSTORAGE.PARTNERSHIP_DATA,
            { ...res.data, partnershipCoupon: discountCode.toUpperCase() },
            true
          );
        }
      })
      .catch(() => {
        // console.error(`coupon error ${discountCode}`); // Commenting this line as this error count is huge in Data Dog
      });
  }
};

export const getFreeProductPromise = async (freeProduct: freeProductData, cartType?: cartType, parentId?: string) => {
  let fPwhere: any;
  const productApi = new ProductAPI();
  switch (freeProduct.type) {
    case "productCategory": {
      fPwhere = {
        "categories.id": {
          inq: [freeProduct.categoryId?.[0]],
        },
        inStock: true,
      };
      break;
    }

    case "products": {
      fPwhere = {
        id: {
          inq: [freeProduct.ids[0]],
        },
        inStock: true,
      };
      break;
    }

    case "productTag": {
      fPwhere = {
        productTag: {
          inq: [encodeURIComponent(freeProduct.ids[0])],
        },
        inStock: true,
      };
      break;
    }
    default: {
      console.info(`No Free Product`);
    }
  }

  if (fPwhere) {
    const { data } = await productApi.getProductShades("IND", fPwhere, 0, PDP_FREE_PRODUCT_INCLUDES);

    let updatedProductData = data.data.data;
    if (Array.isArray(updatedProductData)) {
      updatedProductData = updatedProductData.map(prod => ({ ...prod, cartType, parentId }));

      PDP_STATES.PDPFreeProductData = { data: { ...(data.data || {}), data: updatedProductData } }; // inuse of pdp directly
      return updatedProductData;
    }
  }

  return null;
};

export const processImageOnlyReviewsCarouselData = (tempimageOnlyReviews: any) => {
  const chunk = (arr: any, size: number) =>
    Array.from({ length: Math.ceil(arr?.length / size) }, (v, i) => arr?.slice(i * size, i * size + size));
  const smallImg: any[] = [];
  const fullImg: any[] = [];
  const reviewData: any[] = [];

  tempimageOnlyReviews?.reviewsList?.forEach((review: any) => {
    review?.meta?.images?.forEach((image: any) => {
      const fileType = image?.substr(image?.length - 3);
      if (image) {
        const reviewContent = {
          image,
          reviewId: review?.reviewId,
          createdAt: review?.createdAt,
          rating: review?.rating,
          reviewTitle: review?.reviewTitle,
          reviewContent: review?.reviewContent,
          reviewerInfo: review?.reviewerInfo,
          fileType,
        };
        reviewData.push(reviewContent);
      }
    });
  });

  reviewData?.forEach((val: any, ind: number) => {
    if (ind < 9) {
      if (ind % 3 !== 0) {
        smallImg.push(val);
      } else {
        fullImg.push(val);
      }
    }
  });

  const chunkImg = chunk(smallImg, 2);
  const carouselImg = [];
  for (let i = 0; i < fullImg.length && chunkImg.length; i++) {
    carouselImg.push([fullImg[i], chunkImg[i]]);
  }
  return carouselImg;
};

/**
 * Fetching Product Bought Together
 */
export const getProductBoughtTogether = async (product: PDPProd) => {
  if (product.inStock) {
    const productApi = new ProductAPI();
    const { data: productBought } = await productApi.getProduct({
      type: 2,
      hidden: false,
      and: [
        {
          products: product?.id,
        },
        {
          products: {
            length: 2,
          },
        },
      ],
    });

    PDP_STATES.frequentlyBoughtData = productBought.data;
  }
};

/**
 * Fetching PDP Bundle Product
 */
export const getBundleProductData = async (product: PDPProd) => {
  const where = {
    slugOrId: SLUG().PDP_BUNDLE_PRODUCT,
    name: "products",
    items: product.id,
  };
  const widgetApi = new WidgetAPI();
  widgetApi.getWidgets({ where }).then(({ data: bundle }) => {
    const widget = bundle?.data?.data?.widget[0];
    if (widget?.commonDetails?.descriptionData[0]?.value[0]?.id) {
      const productApi = new ProductAPI();
      productApi
        .getProduct({
          id: widget.commonDetails.descriptionData[0].value[0].id,
        })
        .then(({ data }) => {
          PDP_STATES.bundleProductData = {
            productData: data.data.data[0],
            relationalData: data.data.relationalData,
            bundleImg: widget.commonDetails?.descriptionData[0].value[0].assets[0]?.url,
            CTA: bundle.data.data.widget[0]?.meta.cta,
          };
        });
    }
  });
};

/**
 * Fetching Product Image only Reviews
 */
export const getProductImageOnlyReviews = async (product: any) => {
  const productApi = new ProductAPI();
  const productReviews = await productApi.getReviews({
    order: ["createdAt DESC", "rating DESC"],
    limit: 9,
    skip: 0,
    where: {
      itemTag: encodeURIComponent(product.productTag),
      itemType: "product",
      ...(SHOP.SITE_CODE === "srn" ? {} : { containImage: true }),
    },
  });
  return productReviews;
};

/**
 *  PDP OFfers HTML Data Fetch
 */
export const getPDPOfferHTMLData = (widgets: any) => {
  if (!widgets?.length) return null;

  return widgets?.map((widget: any) => {
    const checkHTML = widget.commonDetails?.description.match(/<\/?[a-z][\s\S]*>/i);

    return {
      text: checkHTML ? widget.commonDetails?.description.replace(/<[^>]+>/g, "").trim() : "",
      imgSrc: checkHTML
        ? widget.commonDetails?.description.replace(/\'/g, '"').match(/<img [^>]*src="[^"]*"[^>]*>/gm)
          ? widget.commonDetails?.description
              .replace(/\'/g, '"')
              .match(/<img [^>]*src="[^"]*"[^>]*>/gm)[0]
              .replace(/.*src="([^"]*)".*/, "$1")
          : ""
        : "",
    };
  });
};

/**
 * Get PDP Looks
 */
export const getLooksData = async (id: string) => {
  try {
    const api = new ProductAPI();
    const { data: lookRes } = await api.getLooks("IND", {
      products: id,
    });

    return lookRes.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getWidgetDataOnSlug = async (slug: string) => {
  try {
    const widgetApi = new WidgetAPI();
    const customerAlsoViewed = await widgetApi.getWidgets({ where: { slugOrId: slug } }).catch(data => data);
    return customerAlsoViewed;
  } catch (err) {
    return err;
  }
};

/**
 * Fetching Cut the price data
 */
export const getCTPData = async (sku: string, identifier?: string) => {
  try {
    const ctpAPI = new CTPAPI();
    const ctpData = await ctpAPI.getDataBySKUs(sku, identifier).catch(data => data);
    return ctpData;
  } catch (err) {
    return err;
  }
};

/**
 * Fetching Cut the price data
 */
export const getCTPUserLogs = async (sku: string, identifier?: string) => {
  try {
    const ctpAPI = new CTPAPI();
    const ctpData = await ctpAPI.userLogs(sku, identifier).catch(data => data);
    return ctpData;
  } catch (err) {
    return err;
  }
};

/**
 * Submit Cut the price data
 */
export const initiateCTP = async (input: any) => {
  try {
    const ctpAPI = new CTPAPI();
    const ctpData = await ctpAPI.initiateCTP(input).catch(data => data);
    return ctpData;
  } catch (err) {
    return err;
  }
};

/**
 * Get User Logs and discount on PDP if applicable through CTP
 */
export const getCTPPDPData = async (sku: string) => {
  const { memberId } = checkUserLoginStatus() || {};

  const data: any[] = await Promise.allSettled([getCTPData(sku, memberId), getCTPUserLogs(sku, memberId)]);

  PDP_STATES.CTP = { ctpProductData: data[0]?.value?.data?.data?.data?.[sku], userLogs: data[1]?.value?.data?.data.data };
};

export const isTryonEligible = (product: PDPProd) => product.inStock && product.productMeta?.tryItOn;

export const checkCBPopupLocally = (type: "photoslurp" | "banner" | "videoBanner") => {
  const cbStatusArray = getSessionStorageValue(SESSIONSTORAGE.CB_POPUP_STATUS, true) || [];

  setTimeout(() => setSessionStorageValue(SESSIONSTORAGE.CB_POPUP_STATUS, [...new Set([...cbStatusArray, type])], true), 1000);

  if (cbStatusArray.includes(type)) {
    return false;
  }

  return true;
};

export const nFormatter = (num: any, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
};

export const getShadesSelectionData = async (productId: string, productTag: string) => {
  const shadeWhere = {
    id: { nin: [productId] },
    productTag: encodeURIComponent(productTag),
    "productMeta.displaySiteWide": true,
  };
  const api = new ProductAPI();
  const [aggregatedShade, shade] = await Promise.all([
    api.getAggregateShades(encodeURIComponent(productTag)),
    api.getProductShades("IND", shadeWhere, 0, PDP_API_INCLUDES),
  ]);

  const aggregatedShades = aggregatedShade.data.data;
  const shades = shade.data.data.data;
  return {
    aggregatedShades,
    shades,
  };
};
