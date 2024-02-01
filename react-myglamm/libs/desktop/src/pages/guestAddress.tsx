import React, { useEffect } from "react";

import Head from "next/head";
import Router from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useFetchCart } from "@libHooks/useFetchCart";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { fetchAndUpdatedCart } from "@checkoutLib/Cart/HelperFunc";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import GuestChkoutSummary from "../Components/checkout/GuestChkoutSummary";
import CheckoutProductListing from "../Components/checkout/CheckoutProductListing";

const GuestAddress = () => {
  const { t } = useTranslation();

  const { cart, cartLoaded } = useSelector((store: ValtioStore) => store.cartReducer);

  useFetchCart();

  useEffect(() => {
    if ((cartLoaded && !cart.allProducts?.length) || checkUserLoginStatus()) {
      Router.push("/");
    }
  }, [cart, cartLoaded]);

  if (cart.allProducts?.length > 0) {
    return (
      <main className="bg-white pb-8">
        <Head>
          <title>{t("guestCheckout")}</title>
          <meta property="og:title" content={t("guestCheckout")} />
        </Head>

        <div className="max-w-screen-xl mx-auto">
          <h1 className="py-6 text-center text-3xl capitalize">{t("checkout") || "Checkout"}</h1>

          <div className="flex justify-between">
            <section className="w-3/5 pr-8">
              <div className="flex items-center justify-center py-4">
                {t("alreadyHave")}&nbsp;<strong>{t("account")}?</strong>
                <button
                  type="button"
                  onClick={() => SHOW_LOGIN_MODAL({ show: true, onSuccess: fetchAndUpdatedCart })}
                  className="ml-6 rounded h-12 border border-black uppercase text-xs w-36 font-bold"
                >
                  {t("signIn")}
                </button>
              </div>

              <CheckoutProductListing />
            </section>

            <GuestChkoutSummary />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="inset-0 m-auto w-screen h-screen">
      <LoadSpinner />
    </div>
  );
};

export default GuestAddress;
