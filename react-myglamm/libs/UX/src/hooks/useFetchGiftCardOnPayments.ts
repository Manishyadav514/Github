import { useEffect, useState } from "react";
import { useSelector } from "./useValtioSelector";

import { fetchCart, fetchGiftCards, fetchUpsellProducts, updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { adobeAddGiftCard, adobeUnCheckGiftCard } from "@checkoutLib/Payment/Payment.Analytics";
import { getCartIdentifier } from "@checkoutLib/Storage/HelperFunc";
import { addToBag, updateCart } from "@libStore/actions/cartActions";

import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { ValtioStore } from "@typesLib/ValtioStore";
import { setSessionStorageValue } from "@libUtils/sessionStorage";
import { isGiftCardFromPhase1 } from "@checkoutLib/Payment/HelperFunc";

export const useFetchGiftCardOnPayments = (giftCardVariant: any) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>();
  const [giftCardProduct, setGiftCardProduct] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [upsellData, setUpsellData] = useState<any>();
  const [showGiftCardModal, setShowGiftCardModal] = useState<boolean | undefined>();
  const { shippingAddress, cart } = useSelector((store: ValtioStore) => ({
    shippingAddress: store.userReducer.shippingAddress,
    cart: store.cartReducer.cart,
  }));

  const userRemovedGiftCardManually = getLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY, true);

  useEffect(() => {
    const giftCard = getLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, true);
    if (cart.identifier === getCartIdentifier()) {
      const isPaymentGiftCardAdded =
        !!isGiftCardFromPhase1(cart.products) || !!cart.miscellaneousProducts?.find(product => product.moduleName === 2);
      if (cart.shippingCharges > 0 && ["1", "2"].includes(giftCardVariant?.giftCardPayment)) {
        fetchUpsellProducts(cart, giftCardVariant?.giftCardPayment)
          .then(res => {
            if (res) {
              if (giftCardVariant?.giftCardPayment === "1") {
                setUpsellData(res?.upsellData);
                setGiftCardProduct(res?.upsellProducts?.[0]);
                // if user has removed the giftcard once do not add it
                if (!isPaymentGiftCardAdded && !userRemovedGiftCardManually && !giftCard) {
                  addGiftCardToCart(res?.upsellProducts?.[0], res?.upsellData, "");
                }
                if (isPaymentGiftCardAdded) {
                  setLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT, true, true);
                  setIsChecked(true);
                  setGiftCardProduct(giftCard);
                }
              } else {
                // When we get variant as 2 and is added in Background
                setSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_VARIANT, giftCardVariant?.giftCardPayment);
                setLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, res?.upsellProducts?.[0], true);
                setLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, res?.upsellData, true);
              }
            }
          })
          .catch(e => console.error(e));
      } else if (
        cart.shippingCharges === 0 &&
        giftCardVariant?.giftCardPaymentPhase2 === "1" &&
        !isGiftCardFromPhase1(cart.products)
      ) {
        // Giftcard Phase 2
        fetchGiftCards(cart)
          .then(res => {
            !isPaymentGiftCardAdded && !userRemovedGiftCardManually && setShowGiftCardModal(true);
            setUpsellData(res?.upsellData);
            setGiftCardProduct(res?.upsellProducts?.[0]);
            setSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_PHASE_2_VARIANT, giftCardVariant?.giftCardPaymentPhase2);
          })
          .catch(err => console.error(err));
      } else if (giftCard && (!isGiftCardFromPhase1(cart.products) || giftCardVariant?.giftCardPayment === "1")) {
        // Giftcard Phase 1 & 2
        // if giftcard added from payment you will find giftcard in miscallaneous products and not in products array
        const upsellData = getLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, true);
        upsellData && setUpsellData(upsellData);
        setLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT, true, true);
        isPaymentGiftCardAdded && setIsChecked(true);
        isPaymentGiftCardAdded && setGiftCardProduct(giftCard);
      }
    }
  }, [giftCardVariant, cart.identifier, cart.shippingCharges, cart.products]);

  const addGiftCardToCart = async (product: any, upsellData?: any, ctaName?: string) => {
    setIsLoading(true);

    const type = product.subProductType;
    const res = await updateProducts(
      { ...product, type, upsellKey: upsellData?.key, variantValue: upsellData?.variantValue },
      1
    );
    if (res) {
      setLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, product, true);
      setLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT, true, true);
      setLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY, false, true);
      setLocalStorageValue(LOCALSTORAGE.UPSELL_DATA, upsellData, true);
      setIsChecked(true);
      addToBag(res);
      adobeAddGiftCard(product, ctaName);
    }

    fetchCart(shippingAddress?.zipcode).then(data => {
      updateCart(data);
      setIsLoading(false);
    });

    setShowGiftCardModal(false);
  };

  const removeGiftCard = async (product: any) => {
    setIsLoading(true);
    const type = product.subProductType;
    const res = await updateProducts(
      { ...product, type, upsellKey: upsellData?.key, variantValue: upsellData?.variantValue },
      -1
    );
    if (res) {
      removeLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT);
      removeLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT);
      setLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY, true, true);
      adobeUnCheckGiftCard(product);
      setIsChecked(false);
      addToBag(res);
    }

    fetchCart(shippingAddress?.zipcode).then(data => {
      updateCart(data);
      setIsLoading(false);
    });
  };

  const handleProductNotAddedFromModal = () => {
    removeLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT);
    removeLocalStorageValue(LOCALSTORAGE.IS_GIFT_CARD_ADDED_FROM_PAYMENT);
    setLocalStorageValue(LOCALSTORAGE.USER_REMOVED_GIFT_CARD_MANUALLY, true, true);
    setShowGiftCardModal(false);
  };

  return {
    isChecked,
    giftCardProduct,
    isLoading,
    upsellData,
    addGiftCardToCart,
    removeGiftCard,
    showGiftCardModal,
    setShowGiftCardModal,
    handleProductNotAddedFromModal,
  };
};
