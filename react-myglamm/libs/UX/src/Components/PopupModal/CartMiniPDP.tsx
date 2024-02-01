import React, { useState } from "react";
import Link from "next/link";

import CartAPI from "@libAPI/apis/CartAPI";

import useTranslation from "@libHooks/useTranslation";

import { showError } from "@libUtils/showToaster";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import { updateCart } from "@libStore/actions/cartActions";

import { cartProduct, productTypes } from "@typesLib/Cart";

// @ts-ignore
import styles from "@libStyles/css/miniPDP.module.css";

import PopupModal from "./PopupModal";

interface minPDPProps {
  show: boolean;
  mainProd: any;
  hide: () => void;
}

const CartMiniPDP = ({ show, mainProd, hide }: minPDPProps) => {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>();

  const intiateReplaceShade = () => {
    setLoader(true);

    const cartApi = new CartAPI();
    cartApi
      .replaceProductInCart({ oldSKU: mainProd.sku, newSKU: activeProduct.sku })
      .then(({ data: result }) => {
        const cartData = result;

        /**
         * Mutating the Replaced Product "hasShade" value to true by default as backend consider it
         * as a new product and requires us to hit the api again which is not requried
         */
        const mutateProductwithSKU = (type: productTypes) => {
          const index = cartData.data.cart[type].findIndex((x: cartProduct) => x.sku === activeProduct.sku);
          if (index !== -1) {
            cartData.data.cart[type][index].hasShade = true;
            return cartData;
          }
          return cartData;
        };

        if (activeProduct.productMeta.isPreOrder) {
          mutateProductwithSKU("preOrderProducts");
        } else {
          mutateProductwithSKU("products");
        }

        updateCart(cartData);
        setLoader(false);
        hide();
      })
      .catch(err => {
        console.error(err.response?.data?.message || "Cart minipdp error");
        showError(err.response?.data?.message || "Error");
      });
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={styles.ModalContainer}>
        <MiniPDPHeader title={t("cartMiniPDPHeader") || "Select Variant Before Payment"} />
        <MiniPDPShadeSelection
          isFree={false}
          nin={[]}
          productId={mainProd.productId}
          includes={["urlManager"]}
          productTag={mainProd.productTag}
          setActiveProd={product => setActiveProduct(product)}
          activeProduct={activeProduct}
        />
      </section>

      {activeProduct && (
        <div className={`flex w-full ${styles.ButtonContianer}`}>
          <Link
            href={activeProduct?.urlManager?.url}
            className="w-1/2 bg-white text-gray-300 text-center font-semibold text-sm uppercase py-3 outline-none"
            aria-label={t("viewDetailsButton")}
          >
            {t("viewDetailsButton")}
          </Link>
          <button
            type="button"
            disabled={loader}
            onClick={intiateReplaceShade}
            className="bg-ctaImg text-white w-1/2 font-semibold uppercase text-sm py-3 relative"
          >
            {t("exchangeCtaStep2Positive")}
            {loader && <LoadSpinner className="mx-auto w-10 absolute top-0 bottom-0 right-0 left-0" />}
          </button>
        </div>
      )}
    </PopupModal>
  );
};

export default CartMiniPDP;
