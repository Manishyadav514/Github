import { useRouter } from "next/router";

import CartAPI from "@libAPI/apis/CartAPI";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { cartProduct } from "@typesLib/Cart";

import Adobe from "@libUtils/analytics/adobe";
import { isClient } from "@libUtils/isClient";
import { showError } from "@libUtils/showToaster";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { onAddToBagError } from "@productLib/pdp/AnalyticsHelper";
import { checkUserLoginStatus, getCartIdentifier } from "@checkoutLib/Storage/HelperFunc";

import { addToBag } from "@libStore/actions/cartActions";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

function useAddtoBag(relationalData?: any, otherDatas?: any) {
  const router = useRouter();

  const ADOBE_DATA =
    ADOBE.ADD_TO_BAG[router.asPath.split("/")[1]] || ADOBE.ADD_TO_BAG[router.asPath.split("/")[2] || "product"];
  const { assetType, newAssetType, newLinkPageName } = ADOBE_DATA || {};

  /* Reusable Data - Related to Adobe and FreeProduct or PWP */
  const { freeProduct, name } = otherDatas || {};

  /* Get Child - SubChild Name for Analytics */
  function getCategoryName(addedProduct: any, type = "child") {
    try {
      const tempData = addedProduct.categories?.[`${type}CategoryName`]; // As on PDP we keep the category data inside main object
      if (tempData) return tempData;

      const { id } = addedProduct?.categories?.find((x: any) => x.type === type) || {};

      return relationalData?.categories[id]?.cms[0]?.content?.name || "";
    } catch {
      return "";
    }
  }

  /**
   * @param product - Product Data to be Added in Cart
   * @param type - Type Required for API call to add the Product in Cart
   * @param parentId - Product of parent if isFreeProduct
   */
  const addProductToCart = (
    product: any,
    type?: number,
    parentId?: string,
    childProducts?: Array<string>,
    runAdobe = true,
    showMessageToast = true,
    surveyForm = false,
    isSubscriptionProduct = false
  ): Promise<boolean | any> => {
    const identifier = getCartIdentifier();
    const isFreeProduct = type === 2 || type === 4;
    const isGuest = !getLocalStorageValue("memberId");
    const isProducts = Array.isArray(product);
    const products = isProducts ? product : [product];
    const firstProduct = products[0];

    const cartApi = new CartAPI();
    const getFreeProducts = () => {
      const listOfFreeProducts: any = [];
      products.forEach((product: any) => {
        listOfFreeProducts.push({
          parentId,
          productId: product?.id || product.productId,
          quantity: 1,
          type,
          subProductType: product.type || 1,
          childProducts,
        });
      });
      return listOfFreeProducts;
    };

    const decoyPriceId = firstProduct?.decoyPriceId;
    /* Recurring SubscriptionId */
    const subscriptionId = firstProduct?.subscriptionId;

    const SURVEY_VERSION = isClient() && sessionStorage.getItem("surveyVersion");

    let productsPayload: any;
    if (isFreeProduct) {
      productsPayload = getFreeProducts();
    } else if (typeof product === "string") {
      // Sending sku from blog page
      productsPayload = [
        {
          sku: product,
          slug: "",
          productId: "",
          quantity: 1,
          subProductType: 0,
          type: 0,
        },
      ];
    } else {
      productsPayload = products.map(prod => {
        return {
          parentId: prod?.parentId,
          productId: prod?.id || prod?.productId,
          quantity: prod?.decoyQuantity || prod?.quantity || 1,
          type: prod?.productMeta?.isPreorder ? 3 : 1,
          subProductType: prod?.type || prod.productType || 1,
          ...(prod?.type === 2 && { childProducts: childProducts }),
          tag: prod?.key || SOURCE_STATE?.addToBagSource,
          decoyPriceId: prod?.decoyPriceId,
          subscriptionId: prod?.subscriptionId,
          ...(SURVEY_VERSION && { variantValue: `mb=${SURVEY_VERSION}` }),
        };
      });
    }
    return cartApi
      .addToBag({
        identifier,
        isGuest,
        products: productsPayload,
      })
      .then(({ data: cart }) => {
        if (isSubscriptionProduct) {
          const subscriptionProduct = cart?.data?.cart?.products.find(
            (product: cartProduct) => product.productMeta.isVirtualProduct && product.type === 1
          );
          if (subscriptionProduct) {
            let PRODUCT = subscriptionProduct;
            if (subscriptionProduct.meta) {
              const {
                SKU,
                sku,
                URL,
                priceMRP,
                price,
                offerPrice,
                type,
                imageURL,
                priceOffer,
                category,
                productTitle,
                subCategory,
                productName,
              } = firstProduct || {};

              PRODUCT = {
                cms: [{ content: { name: productTitle || productName } }],
                productMeta: { isPreOrder: subscriptionProduct.meta.isPreProduct },
                price: priceMRP || price,
                sku: SKU || sku,
                productTag: "",
                offerPrice: priceOffer || offerPrice,
                type,
                assets: [{ imageUrl: { ["200x200"]: imageURL } }],
                urlManager: { url: { URL } },
                category,
                subCategory,
              };
            }

            if (decoyPriceId) {
              PRODUCT["decoyPriceId"] = decoyPriceId;
              if (subscriptionId) {
                PRODUCT["ctaName"] = `add to bag|subscription|pack of ${firstProduct?.quantity}| ${firstProduct?.frequency}`;
              } else {
                PRODUCT["ctaName"] = `add to bag|decoy|pack of ${firstProduct?.decoyQuantity}`;
              }
            }

            adobeAddToCart([PRODUCT], isFreeProduct);
            gaAddtoCart(PRODUCT, isFreeProduct);
          }
        }

        /* Storing Product or Cart Data in Redux */
        addToBag(cart);

        console.log({ firstProduct });

        if ((firstProduct?.productMeta || firstProduct.meta || isProducts) && runAdobe) {
          const PRODUCT: any[] = generateDataForAdobe(typeof product === "string" ? cart?.data?.cart?.products : products);

          if (decoyPriceId) {
            PRODUCT[0]["decoyPriceId"] = decoyPriceId;
            if (subscriptionId) {
              PRODUCT[0]["ctaName"] = `add to bag|subscription|pack of ${product?.quantity}| ${product?.frequency}`;
            } else {
              PRODUCT[0]["ctaName"] = `add to bag|decoy|pack of ${product?.decoyQuantity}`;
            }
          }

          adobeAddToCart(PRODUCT, isFreeProduct);
          gaAddtoCart(PRODUCT[0], isFreeProduct);
        }

        /* Chaining Condtions for storing cartId and add free product if any */
        if (isGuest && !(LOCALSTORAGE.CARTID in localStorage)) {
          setLocalStorageValue(LOCALSTORAGE.CARTID, cart.data.cart.identifier);
        }
        // if (!isFreeProduct && freeProduct?.length === 1) {
        //   return addProductToCart(freeProduct[0], freeProductType, product.id);
        // }

        if (isFreeProduct) {
          return router.push("/shopping-bag");
        }
        return true;
      })
      .catch(err => {
        const { message } = err.response?.data || {};

        console.log({ err });

        if (message && showMessageToast) {
          showError(message);
          console.error(message, JSON.stringify(productsPayload));
          onAddToBagError(message, router.asPath);
        }
        /* if this function is called in survey form send the error response object  */
        if (surveyForm) {
          return {
            message,
          };
        }
        return false;
      });
  };

  /**
   * Add To Cart Analytics - Adobe and GTM with Webengage - Handled PLP Data too
   */
  const adobeAddToCart = (addedProduct: any, isFree: boolean) => {
    const { productTag, sku, SKU, price, priceMRP, offerPrice, priceOffer, subCategory, category, productTitle, widgetName } =
      addedProduct[0] || {};

    const adobeCta = ADOBE_DATA?.ctaName;

    (window as any).digitalData = {
      common: {
        assetType,
        source: SOURCE_STATE?.addToBagSource || "other",
        newAssetType,
        newLinkPageName,
        ctaName: adobeCta || addedProduct[0]?.ctaName || "add to bag",
        platform: ADOBE.PLATFORM,
        linkPageName: ADOBE_DATA?.linkPageName.replace("{productTag}", productTag || productTitle || " "),
        linkName: ADOBE_DATA?.linkName
          .replace("{name}", name || productTag || productTitle || " ")
          .replace("{category}", getCategoryName(addedProduct[0]) || category || " "),
        subSection:
          ADOBE_DATA?.subSection
            ?.replace("{category}", getCategoryName(addedProduct[0]) || category || " ")
            ?.replace("{subCategory}", subCategory) ||
          category ||
          `${getCategoryName(addedProduct[0]) || category || "{category}"} - ${
            getCategoryName(addedProduct[0], "subChild") || productTag || subCategory || " "
          }`,
      },
      user: Adobe.getUserDetails(),
      product: addedProduct.map((prod: any) => {
        return {
          productSKU: prod.sku || prod.SKU,
          productQuantity: 1,
          productOfferPrice: formatPrice(prod.offerPrice || prod.priceOffer),
          productPrice: formatPrice(prod.price || prod.priceMRP),
          productDiscountedPrice: formatPrice((prod.price || prod.priceMRP) - (prod.offerPrice || prod.priceOffer)),
          productRating: "",
          productTotalRating: "",
          stockStatus: "in stock",
          isPreOrder: prod?.productMeta?.isPreOrder ? "yes" : "no",
          PWP:
            (isFree &&
              (freeProduct?.[0]?.productTag ||
                freeProduct?.[0]?.cms[0]?.content?.name ||
                addedProduct[0]?.cms[0]?.content?.name)) ||
            "",
          hasTryOn: "no",
          blogName: ADOBE_DATA?.blogName?.replace("{blogName}", name) || "",
          lookName: ADOBE_DATA?.lookName?.replace("{lookName}", name) || "",
          widgetName: "",
        };
      }),
      dsRecommendationWidget: {
        title: widgetName?.toLowerCase() || "",
      },
    };
    Adobe.Click();
  };

  // #region // *WebEngage [16] - Product Add To Cart - PDP Page : GA Function
  const gaAddtoCart = (addedProduct: any, isFreeProduct: boolean) => {
    const product = JSON.parse(JSON.stringify(addedProduct));
    let bundleName = "";
    let productName = "";

    if (addedProduct?.type === 2) {
      bundleName = addedProduct?.cms?.[0]?.content.name;
    } else {
      productName = addedProduct?.cms?.[0]?.content.name;
    }

    product.webengage = {
      bundleName,
      currency: getCurrency(),
      freeGiftWithProduct: isFreeProduct ? false : !!freeProduct?.length,
      inviteCode: "",
      preOrder: addedProduct?.productMeta?.isPreOrder,
      price: formatPrice(addedProduct.price),
      productName,
      productSKU: addedProduct.sku,
      productSubCategoryName: addedProduct.productTag || addedProduct?.subCategory,
      shade: addedProduct.cms?.[0]?.attributes?.shadeLabel || "",
      type: addedProduct?.productMeta?.showInParty ? "Party" : "Normal",
      userType: checkUserLoginStatus() ? "Member" : "Guest",
      isFreeProduct: isFreeProduct || addedProduct?.offerPrice === 0,
      offerPrice: formatPrice(addedProduct.offerPrice),
      productType: addedProduct.type,
      productImageURL: addedProduct?.assets?.find((x: any) => x.type === "image")?.imageUrl["200x200"],
      productURL: addedProduct.urlManager?.url || URL,
      primaryCategory: getCategoryName(addedProduct) || addedProduct.category,
      subscriptionoptinstatus: localStorage.getItem("subscriptionoptinstatus") || "",
      isTrial: addedProduct?.productMeta?.isTrial || "",
      showingTrialProduct: getSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU) === product?.sku,
    };
    const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
    if (fbEventId) {
      product.webengage["eventID"] = fbEventId;
    }
    // #endregion // WebEngage [16] - Product Add To Cart - PDP Page : Function Call

    GAaddToCart(product, getCategoryName(addedProduct) || addedProduct.category || "");
  };

  const generateDataForAdobe: any = (products: any[]) => {
    return products.map(product => {
      if (product.meta || product.productMeta) {
        const {
          SKU,
          sku,
          URL,
          priceMRP,
          price,
          offerPrice,
          type,
          imageURL,
          priceOffer,
          category,
          productTitle,
          subCategory,
          productName,
          widgetName,
          cms,
        } = product;

        return {
          cms: cms ?? [{ content: { name: productTitle || productName } }],
          productMeta: {
            isPreOrder: product?.meta?.isPreProduct || product?.productMeta?.isPreOrder,
            isTrial: product?.meta?.isTrial || product?.productMeta?.isTrial,
          },
          price: priceMRP || price,
          sku: SKU || sku,
          productTag: "",
          offerPrice: priceOffer || offerPrice,
          type,
          assets: product?.assets,
          urlManager: { url: product?.urlManager?.url || product?.urlShortner?.slug || URL },
          category,
          subCategory,
          widgetName,
        };
      } else {
        return product;
      }
    });
  };

  return { addProductToCart };
}

export default useAddtoBag;
