import React, { useEffect, useState } from "react";
import Router from "next/router";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { GACartViewed } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { SET_MINI_CART_MODAL } from "@libStore/valtio/MODALS.store";

import { getCheckoutUrl, handleGWPSelect } from "@checkoutLib/Cart/HelperFunctionWeb";
import { GACartViewEvent, getCartAdobeDigitalData } from "@checkoutLib/Cart/Analytics";

import MiniCartProduct from "../cart/miniCartProduct";

import BagIcon from "../../../../UX/public/svg/carticon.svg";

const MiniCartModal = ({ show }: { show: boolean }) => {
  const { t } = useTranslation();

  const { cart, shippingAddress, userAddress } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    userAddress: store.userReducer.userAddress,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  const [loader, setLoader] = useState(false);

  const hideModal = () => SET_MINI_CART_MODAL({ show: false });

  const handleCheckout = () => {
    setLoader(true);
    getCheckoutUrl(shippingAddress, userAddress, cart).then(route => {
      Router.push(route);
      setLoader(false);
      hideModal();
    });
  };

  /* SC-view and GA cart view event */
  useEffect(() => {
    if (show) {
      ADOBE_REDUCER.adobePageLoadData = getCartAdobeDigitalData(cart, undefined);
      GACartViewed(GACartViewEvent(cart));
    }
  }, [show, cart]);

  const CART_DISCOUNT = cart.amountToSpendForNextDiscount || cart.discounts?.type;

  if (cart) {
    return (
      <PopupModal type="right-modal" show={show} onRequestClose={hideModal}>
        <section className={`w-full bg-white h-screen ${CART_DISCOUNT ? "pb-64" : "pb-44"}`} style={{ width: "420px" }}>
          <div className="bg-themeGray flex justify-between items-center text-2xl sticky top-0 p-5 pt-8 pr-2.5">
            <p className="flex items-center">
              <BagIcon width={38} height={38} className="mr-1" /> {t("myBag")}&nbsp;({cart?.productCount})
            </p>

            <img
              alt="close"
              onClick={hideModal}
              className="absolute bottom-6 right-8 my-auto cursor-pointer h-8 w-8"
              src="https://files.myglamm.com/site-images/original/1031533-cancel-close-cross-delete-remove-icon.png"
            />
          </div>

          <MiniCartProduct />

          <div className="w-full border-t border-gray-300 absolute bottom-0 bg-white">
            {cart.discounts?.type && (
              <div className="mt-3 mb-1 px-5">
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: cart.discounts.description || "You're eligible for free gift" }}
                />
                <button
                  type="button"
                  onClick={() => handleGWPSelect(cart)}
                  className="mt-0.5 block border-black h-5 border-b font-bold"
                >
                  {t("pleaseSelect")}
                </button>
              </div>
            )}

            {cart.amountToSpendForNextDiscount > 0 && (
              <p className="text-sm mt-3 mb-1 px-5">
                {t("spendAmount").replace("Rs. {amount}", formatPrice(cart.amountToSpendForNextDiscount, true, false))}
              </p>
            )}

            <p className="text-17 flex justify-between items-center px-5 pt-2 pb-3">
              {t("totalAmount")} <span className="text-2xl">{formatPrice(cart.payableAmount, true, false)}</span>
            </p>

            <button
              type="button"
              disabled={loader}
              onClick={handleCheckout}
              className="bg-ctaImg w-full relative flex justify-between items-center uppercase text-white pl-4 pr-5 h-16 font-bold transition-all hover:pr-3"
            >
              {t("checkout") || "checkout"}
              <img
                alt="arrow"
                className="w-6 h-6 transition"
                src="https://files.myglamm.com/site-images/original/icons8-arrow-50.png"
              />

              {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
            </button>
          </div>
        </section>
      </PopupModal>
    );
  }

  return null;
};

export default MiniCartModal;
