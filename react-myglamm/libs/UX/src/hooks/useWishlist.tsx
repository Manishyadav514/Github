import WishlistAPI from "@libAPI/apis/WishlistAPI";
import { useRouter } from "next/router";
import { addLoggedInUser } from "@libStore/actions/userActions";

import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { GAaddToWishlist } from "@libUtils/analytics/gtm";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { showAddedToBagOrWishlist, showSuccess } from "@libUtils/showToaster";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { getLocalStorageValue } from "@libUtils/localStorage";
import useTranslation from "./useTranslation";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

function useWislist(disableToast = true) {
  const router = useRouter();
  const { t } = useTranslation();

  const addProduct = (productId: string) => {
    const wishlistApi = new WishlistAPI();
    const consumerApi = new ConsumerAPI();
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
    return wishlistApi.addProductToWishlist(memberId || null, productId).then(({ data: res }) => {
      showToaster(res, t("addedToWishlist") || "Added to Wishlist");
      try {
        wishlistApi.creditGPWishlist(memberId).then(res => {
          consumerApi.getProfile(memberId).then(RewardsData => {
            addLoggedInUser(RewardsData.data.data);
          });
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const removeProduct = (productId: string) => {
    const wishlistApi = new WishlistAPI();
    const memberId = localStorage.getItem("memberId");
    return wishlistApi
      .removeProductFromWishlist(memberId || null, localStorage.getItem("wishlistId"), productId)
      .then(({ data: res }) => showToaster(res, t("removedFromWishlist") || "Removed from Wislist"));
  };

  const wishlistAdobeOnClick = (
    addedToWishlist: string,
    product: any,
    contentName: string,
    category?: string,
    subCategory?: string
  ) => {
    const categorySubCategoryAdobeString = category && subCategory ? `${category} - ${subCategory}` : contentName;
    const pageType = category && subCategory ? "product description page" : "product listing page";

    const newLinkPageName = category && subCategory ? "product description" : "product listing";

    const assetType = category && subCategory ? `product` : `${router.asPath.match("/collection") ? "collection" : "category"}`;

    // Adobe Analytics(76 / 79) - On Click - Wishlisht Button click on ShoppingBag.

    (window as any).digitalData = {
      common: {
        linkName: `web|${categorySubCategoryAdobeString}|${pageType}|${addedToWishlist}`,
        linkPageName: `web|${categorySubCategoryAdobeString}|${pageType}`,
        newLinkPageName: `${newLinkPageName}`,
        assetType,
        newAssetType: assetType,
        subSection: categorySubCategoryAdobeString,
        platform: ADOBE.PLATFORM,
        ctaName: addedToWishlist,
        pageLocation: assetType,
      },
      user: Adobe.getUserDetails(),
      product: product || [{}],
    };
    Adobe.Click();
  };

  // #region // *WebEngage [16] - Product Add To Wishlist - PDP Page : GA Function
  const gaAddtoWishlist = (addedProduct: any, category?: any) => {
    let strBundleName = "";
    let strProductName = "";

    if (addedProduct.type === 2) {
      strBundleName = addedProduct?.productName;
    } else {
      strProductName = addedProduct?.productName;
    }

    const product = addedProduct;

    product.webengage = {
      bundleName: strBundleName || "",
      currency: getCurrency(),
      preOrder: addedProduct?.productMeta?.isPreOrder,
      price: formatPrice(addedProduct.price),
      productName: strProductName || "",
      productSKU: addedProduct.sku,
      productSubCategoryName: addedProduct.productTag,
      shade: addedProduct?.shadeLabel || "",
      type: addedProduct?.productMeta?.showInParty ? "Party" : "Normal",
      userType: checkUserLoginStatus() ? "Member" : "Guest",
      isFreeProduct: false,
      offerPrice: formatPrice(addedProduct.offerPrice),
      productType: addedProduct.type,
      productImageURL: addedProduct?.imageUrl,
      productURL: addedProduct.slug,
      primaryCategory: category,
      isTrial: addedProduct?.productMeta?.isTrial || "",
    };
    const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
    if (fbEventId) {
      product.webengage["eventID"] = fbEventId;
    }

    // #endregion // WebEngage [16] - Product Add To Wishlist  - PDP Page : Function Call

    GAaddToWishlist(product, category || "");
  };

  function showToaster(res: any, content: string) {
    if (res.data.id) {
      localStorage.setItem("wishlistId", res.data.id);
    }
    USER_REDUCER.userWishlist = res.data.value;
    !disableToast && showAddedToBagOrWishlist(content);
    return res.data.value;
  }

  return { addProduct, removeProduct, wishlistAdobeOnClick, gaAddtoWishlist };
}

export default useWislist;
