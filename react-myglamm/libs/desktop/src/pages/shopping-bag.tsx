import React, { ReactElement, useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import { ValtioStore } from "@typesLib/ValtioStore";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { GACartViewed } from "@libUtils/analytics/gtm";

import { getCheckoutUrl, handleGWPSelect } from "@checkoutLib/Cart/HelperFunctionWeb";
import { GACartViewEvent, getCartAdobeDigitalData } from "@checkoutLib/Cart/Analytics";

import ShoppinBagTotal from "../Components/cart/shoppinBagTotal";
import LowerFunnelLayout from "../Components/layout/LowerFunnelLayout";
import ShoppingBagProduct from "../Components/cart/shoppingBagProduct";

const ShoppingBag = () => {
  const { t } = useTranslation();
  useAttachCountryAddressFilter();
  const { cart, cartLoaded, shippingAddress, userAddress } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    cartLoaded: store.cartReducer.cartLoaded,
    userAddress: store.userReducer.userAddress,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  const [loader, setLoader] = useState(false);

  const handleCheckout = () => {
    setLoader(true);
    getCheckoutUrl(shippingAddress, userAddress, cart).then(route => Router.push(route));
  };

  /* SC-view and GA cart view event */
  useEffect(() => {
    if (cartLoaded && cart.identifier) {
      ADOBE_REDUCER.adobePageLoadData = getCartAdobeDigitalData(cart, undefined);
      GACartViewed(GACartViewEvent(cart));
    }
  }, [cart]);

  if (cart.allProducts?.length > 0) {
    return (
      <main className="bg-white">
        <Head>
          <title key="title">{t("shoppingBag")}</title>
        </Head>

        <div className="max-w-screen-xl mx-auto">
          <h1 className="uppercase text-3xl pt-4 text-center">
            {t("myBag")}&nbsp;({cart.productCount})
          </h1>

          <div className="px-8 py-4">
            <div className="w-full bg-ctaImg text-white text-18 rounded-sm py-2 flex justify-center items-center tracking-wide">
              <strong className="capitalize">{t("congrats") || "congrats!"}</strong>&nbsp;
              <div dangerouslySetInnerHTML={{ __html: cart.discounts.description || "You're eligible for free gift" }} />
              &nbsp;
              <button type="button" onClick={() => handleGWPSelect(cart)} className="border-white border-b font-bold">
                {t("pleaseSelect")}
              </button>
            </div>
          </div>

          <ShoppingBagProduct />
        </div>

        <ShoppinBagTotal />

        <div className="pt-6 pb-2 text-center">
          <button
            type="button"
            disabled={loader}
            onClick={handleCheckout}
            className="bg-ctaImg text-white uppercase relative rounded-sm h-12 w-full max-w-sm text-18 tracking-wide"
          >
            {t("proceedCheckout")}

            {loader && <LoadSpinner className="w-10 inset-0 absolute m-auto" />}
          </button>
        </div>
      </main>
    );
  }

  if (cartLoaded) {
    return (
      <main className="bg-white flex flex-col justify-center items-center text-center" style={{ height: "550px" }}>
        <Head>
          <title key="title">{t("oopsBagIsEmpty") || "Shopping Bag"}</title>
        </Head>

        <h1 className="text-3xl mb-4 tracking-wide">{t("oopsBagIsEmpty")}</h1>
        <div className="w-56 h-56 mx-auto relative">
          <span className="eye one bg-gray-400 rounded-full h-3 w-3 absolute top-10 left-20 animate-pulse" />
          <span className="eye two bg-gray-400 rounded-full h-3 w-3 absolute top-10 right-20 animate-pulse" />
          <span className="mouth w-16 h-1 rounded-full bg-gray-400 absolute inset-x-0 mx-auto top-20 animate-bounce" />
          <img
            alt="Empty Cart"
            className="mx-auto"
            src="https://files.myglamm.com/site-images/original/img-empty-shopping-cart.png"
          />
        </div>
      </main>
    );
  }

  return (
    <div className="relative w-screen h-screen">
      <LoadSpinner className="w-20 inset-0 m-auto absolute" />
    </div>
  );
};

ShoppingBag.getLayout = (page: ReactElement) => <LowerFunnelLayout>{page}</LowerFunnelLayout>;

export default ShoppingBag;
