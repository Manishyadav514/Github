import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";

import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { GACartViewEvent } from "@checkoutLib/Cart/Analytics";
import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { GA4Event } from "@libUtils/analytics/gtm";
import { setLocalStorageValue } from "@libUtils/localStorage";

import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import Arrow from "../../../../public/svg/rightArrowWhite.svg";

const ErrorFreeProductsOnCartModal = dynamic(
  () => import(/* webpackChunkName: "ErroFlaggedProducts" */ "@libComponents/PopupModal/ErrorFreeProductsOnCartModal"),
  { ssr: false }
);

interface FixedBottomProps {
  showLoginModal: () => void;
  showMoreProductsModal: boolean;
}

const CartFixedBottomStrip = ({ showLoginModal, showMoreProductsModal }: FixedBottomProps) => {
  const { push, prefetch } = useRouter();

  const { t } = useTranslation();

  const { cart, shippingAddress } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  const [loader, setLoader] = useState(false);

  const [showErrProductsModal, setShowErrProductsModal] = useState<boolean | undefined>();

  const handleRedirection = () => {
    const cartEventData = GACartViewEvent(cart);
    const isGuestPaymentFlow = "v1|true" === getSessionStorageValue(SESSIONSTORAGE.GUEST_PAYMENT_FLOW_VARIANT, true);
    GA4Event([
      {
        event: "begin_checkout",
        ecommerce: {
          currency: getCurrency(),
          value: cartEventData.cartValue,
          coupon: cart?.couponData?.couponCode,
          items: cartEventData.items.map((p: any) => {
            return {
              item_id: p["Product SKU"],
              item_name: p["Product Name"],
              price: p["Product Price"],
              quantity: p["Product Quantity"],
              coupon: cart?.couponData?.couponCode ?? "",
              item_category: p["Product Category Parent"],
              item_category_2: p["Product Category Child"],
              item_category_3: p["Product Category subChild"],
              brand: p.brand,
              discount: p.discount,
              items_variant: p["Product Shade Label"],
            };
          }),
        },
      },
    ]);

    /* Show Error Products Modal Prompt in case coupon applied and there are error flagged free prodcuts */
    if (
      !showErrProductsModal &&
      cart.couponData?.couponCode &&
      [...cart.pwpProducts, ...cart.gwpProducts].find(x => x.errorFlag)
    ) {
      return setShowErrProductsModal(true);
    }

    const isLoggined = checkUserLoginStatus();
    if (isLoggined) {
      setLoader(true);

      /* In-case Redux Contains Shipping Address directly redirect to Payment */
      if (shippingAddress) {
        /* Extra Check for Middle-East Countries */
        if (parseInt(shippingAddress.countryId) !== cart.countryId) {
          return push("/select-address");
        }
        return push("/payment");
      }

      /* Get Default User Address or redirect user to addAddress Page if that's also not present */
      prefetch("/payment");
      return getShippingAddress()
        .then(address => {
          if (address) {
            /* Extra Check for Middle-East Countries */
            if (parseInt(address.countryId) !== cart.countryId) {
              return push("/select-address");
            }
            return push("/payment");
          }

          setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment");
          return push("/addAddress");
        })
        .catch(() => setLoader(false));
    }
    if (SHOP.ENABLE_GUEST_CHECKOUT || isGuestPaymentFlow || cart?.allowIntShipping) {
      return push("/addAddress");
    }

    /* Guest User */
    return showLoginModal();
  };

  if (SHOP.REGION === "MIDDLE_EAST") {
    return (
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 4px 0px" }}
        className="sticky bottom-0 inset-x-0 w-full z-10 flex justify-between bg-white py-2 px-2.5 rounded-t-sm"
      >
        <button
          id="placeOrderCTA"
          type="button"
          disabled={loader}
          onClick={handleRedirection}
          className="bg-ctaImg w-full rounded-sm text-white font-bold uppercase justify-center flex h-11 tracking-wide items-center relative text-sm"
        >
          {t("placeOrder")}
          <Arrow className="w-4 h-4 absolute right-4" role="img" aria-labelledby="save & continue" />
          {loader && <LoadSpinner className="absolute m-auto inset-0 w-8" />}
        </button>

        {typeof showErrProductsModal === "boolean" && (
          <ErrorFreeProductsOnCartModal
            show={showErrProductsModal}
            onProceed={handleRedirection}
            hide={() => setShowErrProductsModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px -4px 4px 0px" }}
      className={`sticky bottom-0 inset-x-0 w-full flex justify-between bg-white py-2 px-2.5 rounded-t-sm z-10
      }`}
    >
      <div className="w-1/2">
        <p className="text-xs text-gray-600">{t("shoppinBagValue")}</p>
        <p className="font-semibold text-xl flex items-center">
          {!FEATURES.hideShippingChargesOnPayment
            ? formatPrice(cart.shoppingBagPayableAmount, true, false)
            : formatPrice(cart.payableAmount, true, false)}

          {cart.payableAmount !== cart.grossAmount && cart.payableAmount < cart.grossAmount && (
            <del className="text-xs text-gray-400 ml-2 my-auto block">{formatPrice(cart.grossAmount, true, false)}</del>
          )}
        </p>
      </div>

      <button
        id="placeOrderCTA"
        type="button"
        disabled={loader}
        onClick={handleRedirection}
        className="text-sm flex relative items-center text-white font-semibold uppercase py-3.5 px-4 justify-evenly bg-ctaImg rounded w-1/2 _analytics-gtm-place-order"
      >
        {t("placeOrder")}
        <Arrow className="w-4 h-4" role="img" aria-labelledby="place order" />
        {loader && <LoadSpinner className="absolute m-auto inset-0 w-8" />}
      </button>

      {typeof showErrProductsModal === "boolean" && (
        <ErrorFreeProductsOnCartModal
          show={showErrProductsModal}
          onProceed={handleRedirection}
          hide={() => setShowErrProductsModal(false)}
        />
      )}
    </div>
  );
};

export default CartFixedBottomStrip;
