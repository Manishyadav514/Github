import React, { useState } from "react";
import Image from "next/image";

import { formatPrice } from "@libUtils/format/formatPrice";

import useTranslation from "@libHooks/useTranslation";

import Checkbox from "../../../public/svg/checkbox.svg";

import dynamic from "next/dynamic";
import RemoveGiftCardModal from "@libComponents/PopupModal/RemoveGiftCardModal";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import { useSplit } from "@libHooks/useSplit";

import CartOverlayLoader from "@libComponents/Cart/CartOverlayLoader";

import { useFetchGiftCardOnPayments } from "@libHooks/useFetchGiftCardOnPayments";

import { adobeCloseGCModal } from "@checkoutLib/Payment/Payment.Analytics";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { isGiftCardFromPhase1 } from "@checkoutLib/Payment/HelperFunc";

const GiftCardDetails = dynamic(() => import("@libComponents/PopupModal/GiftCardDetails"), {
  ssr: false,
});

const GiftCardPhase2Modal = dynamic(() => import("@libComponents/PopupModal/GiftCardPhase2Modal"), { ssr: false });

const AddGiftCard = () => {
  const [showGiftCardTermsAndConditions, setShowGiftCardTermsAndConditions] = useState<boolean | undefined>();
  const [showRemoveProductModal, setShowRemoveProductModal] = useState<boolean | undefined>();
  const { t } = useTranslation();

  const { cart } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
  }));
  const giftCard = getLocalStorageValue(LOCALSTORAGE.GIFT_CARD_PRODUCT, true);

  const variants = useSplit({
    experimentsList: [
      { id: "giftCardPayment", condition: cart.shippingCharges > 0 || !!giftCard },
      {
        id: "giftCardPaymentPhase2",
        condition: (cart.shippingCharges === 0 && !isGiftCardFromPhase1(cart.products)) || !!giftCard,
      },
    ],
    deps: [cart.shippingCharges],
  });

  const {
    upsellData,
    isLoading,
    giftCardProduct,
    addGiftCardToCart,
    removeGiftCard,
    isChecked,
    showGiftCardModal,
    setShowGiftCardModal,
    handleProductNotAddedFromModal,
  } = useFetchGiftCardOnPayments(variants);

  const handleAdobeForTermsAndConditions = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|GC payment|termsCondition",
        newPageName: "View Gift Card Terms Conditions",
        assetType: "payment",
        newAssetType: "payment",
        platform: ADOBE.PLATFORM,
        pageLocation: "payment",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  if ((variants?.giftCardPayment === "1" || variants?.giftCardPaymentPhase2 === "1") && giftCardProduct) {
    return (
      <React.Fragment>
        <div className="p-2 shadow-md rounded mb-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isChecked ? (
                <Checkbox
                  width="20"
                  height="20"
                  className="w-5 my-auto mr-3"
                  onClick={() => {
                    setShowRemoveProductModal(true);
                  }}
                />
              ) : (
                <button
                  type="button"
                  aria-label="checkbox"
                  className="border-2 border-darkpink rounded w-5 h-5 bg-white my-auto mr-3"
                  onClick={() => {
                    addGiftCardToCart(giftCardProduct, upsellData);
                  }}
                />
              )}

              <Image width={56} height={56} src={giftCardProduct?.imageURL} alt={giftCardProduct?.productName} />
              <div className="ml-2">
                <div className="font-bold ">{giftCardProduct?.productName} </div>
                {cart.shippingCharges === 0 ? (
                  <div className="text-11 text-gray-600 ">{t("gcValidFor") || "Valid for 3 months"}</div>
                ) : (
                  <ProductPrice product={giftCardProduct} />
                )}
              </div>
            </div>
            <div
              className="text-sm text-color1"
              onClick={() => {
                handleAdobeForTermsAndConditions();
                setShowGiftCardTermsAndConditions(true);
              }}
            >
              {t("viewDetails")}
            </div>
          </div>
        </div>

        {typeof showGiftCardModal === "boolean" && (
          <GiftCardPhase2Modal
            show={showGiftCardModal}
            onClose={() => {
              adobeCloseGCModal(giftCardProduct);
              handleProductNotAddedFromModal();
            }}
            giftCard={giftCardProduct}
            setShowGiftCardTermsAndConditions={setShowGiftCardTermsAndConditions}
            setShowGiftCardModal={setShowGiftCardModal}
            upsellData={upsellData}
            handleAddToBag={addGiftCardToCart}
          />
        )}

        {typeof showRemoveProductModal === "boolean" && (
          <RemoveGiftCardModal
            show={showRemoveProductModal}
            close={() => {
              setShowRemoveProductModal(false);
            }}
            isAddedFromMiscProducts={false}
            product={giftCardProduct}
            removeProduct={removeGiftCard}
            setShowRemoveProductModal={setShowRemoveProductModal}
          />
        )}

        {typeof showGiftCardTermsAndConditions === "boolean" && (
          <GiftCardDetails
            show={showGiftCardTermsAndConditions}
            onClose={() => setShowGiftCardTermsAndConditions(false)}
            selectedProduct={giftCardProduct}
            handleAddToBag={addGiftCardToCart}
            minBillAmount={giftCardProduct?.minimumBillAmount}
            hideAddToBagCta={true}
          />
        )}

        <CartOverlayLoader show={isLoading} />
      </React.Fragment>
    );
  }

  return null;
};

const ProductPrice = ({ product }: { product: any }) => {
  const { t } = useTranslation();

  if (product?.priceOffer < product?.priceMRP) {
    return (
      <div className="flex items-center mt-1">
        <span className="text-sm font-bold">{formatPrice(product.priceOffer, true)}</span>
        <del className="text-left text-gray-600 opacity-60 text-sm ml-1">{formatPrice(product.priceMRP, true)}</del>
        <span className="text-sm font-bold text-green-600 ml-2">
          {t("priceOffPercentage", [Math.round(((product.priceMRP - product.priceOffer) / product.priceMRP) * 100).toString()])}
        </span>
      </div>
    );
  }

  return <div className="font-semibold text-sm mt-1">{formatPrice(product?.priceMRP, true)}</div>;
};

export default AddGiftCard;
