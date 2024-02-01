import React, { ReactElement, useEffect } from "react";

import Head from "next/head";
import Router from "next/router";

import { UserAddress } from "@typesLib/Consumer";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import { fetchIsPincodeServiceable } from "@libStore/actions/userActions";

import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { adobeScCheckoutEvent } from "@checkoutLib/Payment/Payment.Analytics";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import CheckoutSummary from "../Components/checkout/CheckoutSummary";
import LowerFunnelLayout from "../Components/layout/LowerFunnelLayout";
import ChkoutShippingAddress from "../Components/checkout/ChkoutShippingAddress";
import CheckoutProductListing from "../Components/checkout/CheckoutProductListing";

const Checkout = () => {
  const { t } = useTranslation();
  useAttachCountryAddressFilter();
  const { shippingAddress, cart, cartLoaded } = useSelector((store: ValtioStore) => ({
    shippingAddress: store.userReducer.shippingAddress,
    cart: store.cartReducer.cart,
    cartLoaded: store.cartReducer.cartLoaded,
  }));

  const checkAddressServicibility = async () => {
    let address = shippingAddress;

    /* If no address call the api and get it */
    if (!address) {
      address = (await getShippingAddress()) as UserAddress;
    }

    if (address) {
      adobeScCheckoutEvent();
      if (address.zipcode) fetchIsPincodeServiceable(address);
    } else {
      Router.push("/shopping-bag");
    }
  };

  useEffect(() => {
    if (cartLoaded && !cart.allProducts?.length) {
      Router.push("/"); // Redirect to Home incase of Empty Cart
    } else {
      checkAddressServicibility();
    }
  }, [cartLoaded]);

  if (cart.allProducts?.length > 0) {
    return (
      <main className="max-w-screen-xl mx-auto">
        <Head>
          <title>{t("checkout") || "Checkout"}</title>
        </Head>

        <h1 className="py-6 text-center text-3xl capitalize">{t("checkout") || "Checkout"}</h1>

        <div className="flex justify-between">
          <section className="w-3/5 pr-8">
            <ChkoutShippingAddress />

            <CheckoutProductListing />
          </section>

          <CheckoutSummary />
        </div>
      </main>
    );
  }

  return (
    <div className="inset-0 fixed m-auto w-screen h-screen">
      <LoadSpinner />
    </div>
  );
};

Checkout.getLayout = (page: ReactElement) => <LowerFunnelLayout>{page}</LowerFunnelLayout>;

export default Checkout;
