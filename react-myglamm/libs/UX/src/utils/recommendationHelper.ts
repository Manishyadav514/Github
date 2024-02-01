import axios from "axios";
import { getCookie } from "@libUtils/cookies";
import { COOKIE } from "@libConstants/Storage.constant";
import { isClient } from "./isClient";
import axiosRetry from "axios-retry";
import Router from "next/router";

async function recommendationHelper(requestObject: any, widgetDetails: any, productSku?: any, showDSWidget = true) {
  const recommendedRequestObj = requestObject && JSON.parse(requestObject);
  const memberId = localStorage.getItem("memberId") || getCookie(COOKIE.MEMBERID_DS);
  const dataType: any = { buy: "category", collection: "collection" };

  /* key are written lowercase so it can match any as default making it lower case in replaceText  */
  const replacements = {
    sku: productSku || memberId || "default",
    memberid: memberId || "default",
    entrydata: Router.asPath?.split("?")[0] || "",
    entrytype: dataType[Router.pathname.split("/")[1]] || "",
    default: "default",
  };

  const replaceText = (text: string, replacements: any) => {
    if (text) {
      return text?.replace(/{{\s*(.*?)\s*(\|\s*default(\s*:\s*(.*?))?)?\s*}}/g, (match: any, placeholder: any) => {
        return replacements[placeholder.toLowerCase()] ?? "default";
      });
    }
    return "";
  };

  const config = {
    headers: {
      apikey: recommendedRequestObj?.header?.apikey,
    },
  };

  const recommendedRequestObjUrl: string = replaceText(recommendedRequestObj?.url, replacements);

  /**
   * Updating Based on the Type of Widget i.e Collection or Regular Products
   * Returns the default Widget incase DS Widget [breaks/or is empty/or not configured] with dsWidgetType set as none by default
   * dsWidgetType : none specifies that the ds widget was configured but its broken or the response is empty
   */
  const setRegularProductData = (dsWidgetType = "none") => {
    if (widgetDetails?.descriptionData[0]?.relationalData?.products) {
      return {
        products: Object.values(widgetDetails.descriptionData[0].relationalData.products).map((prod: any) => ({
          ...prod,
          key: recommendedRequestObj?.nucleusAddToBagTag,
          widgetName: widgetDetails?.title,
        })),
        dsWidgetType,
      };
    }
    if (widgetDetails?.descriptionData[0]?.value.length) {
      return {
        products: widgetDetails.descriptionData[0].value.map((prod: any) => ({
          ...prod,
          key: recommendedRequestObj?.nucleusAddToBagTag,
          widgetName: widgetDetails?.title,
        })),
        dsWidgetType,
      };
    }
    return { products: [], dsWidgetType };
  };

  try {
    if (!recommendedRequestObjUrl) throw Error("No DS API Configured");

    if (showDSWidget) {
      const axi = axios.create();
      if (isClient()) {
        axiosRetry(axi, {
          retries: 5,
          retryDelay: x => {
            return x * 750;
          },
          onRetry: (retryCount, error, requestConfig) => {
            // console.error(`Retry No. ${retryCount}: ${requestConfig.method} ${requestConfig.url}`);
          },
        });
      }
      return axi
        .get(recommendedRequestObjUrl, config)
        .then(({ data: result }) => {
          if (result.data.length && result.data[0].value.products.length) {
            const productTempArr: any = [];
            const isBestPrice = result.data[0].value?.isBestPrice;
            const variantValue = result.data[0].value?.variantValue;
            const dsTitle = result.data[0].value?.dsTitle || "";
            const globalTags = result.data[0].value?.globalTags;
            Object.values(result.data[0].value.products).forEach((product: any) => {
              productTempArr.push({
                id: product.id || product.sku,
                key: result?.data?.[0]?.key,
                offerPrice: product.priceOffer * 100,
                productTitle: product?.productTitle || "",
                assets: [
                  {
                    imageUrl: {
                      "400x400": product.imageURL,
                    },
                    type: "image",
                    url: product.imageURL,
                    title: product.productName,
                    properties: {
                      imageAltTag: product.productName,
                    },
                  },
                ],
                urlManager: {
                  url: product.slug,
                },
                price: product.priceMRP * 100,
                urlShortner: {
                  shortUrl: product.url,
                },
                cms: [
                  {
                    languages: ["EN"],
                    content: {
                      subtitle: product.productSubTitle,
                      name: product.productName,
                    },
                  },
                ],
                type: product.type || 1,
                sku: product.sku,
                rating: product.rating,
                shade: product.shade,
                isShades: product.isShades || false,
                shadeCount: product.shadeCount || 1,
                category: product?.category || "",
                subCategory: product?.subCategory || "",
                hasShade: product?.hasShade,
                isPreOrder: product?.isPreOrder,
                widgetName: widgetDetails?.title,
                meta: product?.meta,
                dsProductTags: product?.dsProductTags || [],
                isFreeShipping: product?.freeShipping || false,
                couponList: product?.subscription?.couponList || [],
              });
            });

            return {
              products: productTempArr,
              dsWidgetType: "true",
              variantValue,
              globalTags,
              dsTitle,
              isBestPrice,
            };
          }
          // If result does not contain product, used in reminder widget
          // if (!result.data.length && isReminderWidget) {
          //   return result.data;
          // }

          /* If DS Response is empty then return the default widget response and set the dsWidget type as none */
          return setRegularProductData();
        })
        .catch(() => {
          /* If DS API breaks then return the default widget response and set the dsWidget type as none */
          return setRegularProductData();
        });
    } else {
      return setRegularProductData();
    }
  } catch {
    /* If Ds API  is not configured on widget meta then return the default widget response and  pass defaultWidget as dsWidget */
    return setRegularProductData("defaultWidget");
  }
}

export default recommendationHelper;
