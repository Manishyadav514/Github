import { useSelector } from "@libHooks/useValtioSelector";
import { cartProduct } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";
import Adobe from "@libUtils/analytics/adobe";

import { cartCustomRepsonseLayer, updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { GAOfferAppliedFailed, GAProductRemovedFromCart } from "@libUtils/analytics/gtm";
import { GARemoveProduct, getCartAdobeProduct, promoCodeFailedAdobeEvent } from "@checkoutLib/Cart/Analytics";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import { addToBag, updateCartLoader } from "@libStore/actions/cartActions";

function useRemoveSubscriptionProduct() {
  const userProfile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const removeVirtualProduct = (prod: any, updateCheckout: any) => {
    updateCartLoader(true);
    updateProducts(prod, -1).then((res: any) => {
      if (res) {
        if ("couponErrorDetails" in localStorage) {
          const couponErrorDetails = getLocalStorageValue("couponErrorDetails", true);
          GAOfferAppliedFailed(
            cartCustomRepsonseLayer(res.data),
            couponErrorDetails?.errorMessage,
            couponErrorDetails?.couponName,
            true
          );
          removeLocalStorageValue("couponErrorDetails");
          promoCodeFailedAdobeEvent();
        }

        /* Adobe.send('click') Event Initiate Remove */
        adobeInitEvent(prod, "remove", "product remove");
        GAProductRemovedFromCart(GARemoveProduct(prod));

        /* Exception Condition - Incase applicable points changes after product updation */
        const { appliedGlammPoints, applicableGlammPoints } = res.data || {};
        if (appliedGlammPoints && appliedGlammPoints !== applicableGlammPoints) {
          setLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS, applicableGlammPoints, true);
          return updateCheckout();
        }
        addToBag(res);
      }
      updateCartLoader(false);
    });
  };

  /**
   * ADOBE - ANALYTICS - CLICK EVENT - REMOVE
   */
  const adobeInitEvent = (product: cartProduct, name: string, cta: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|cart summary page|${name}`,
        linkPageName: "web|cart summary page|shopping bag",
        assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: cta,
      },
      user: Adobe.getUserDetails(userProfile),
      product: getCartAdobeProduct([product]).product,
    };
    Adobe.Click();
  };
  return { removeVirtualProduct };
}

export default useRemoveSubscriptionProduct;
