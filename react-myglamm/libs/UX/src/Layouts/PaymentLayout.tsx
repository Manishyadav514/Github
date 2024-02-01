import React, { Fragment, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useFetchCart } from "@libHooks/useFetchCart";
import { useSelector } from "@libHooks/useValtioSelector";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import BackBtn from "@libComponents/LayoutComponents/BackBtn";

import { ValtioStore } from "@typesLib/ValtioStore";

import { formatPrice } from "@libUtils/format/formatPrice";

import { removeGiftCardProductFromCart } from "@checkoutLib/Cart/HelperFunc";

import { fetchShippingAddress } from "@libStore/actions/userActions";

const PaymentLayout = ({ children }: { children: ReactElement }) => {
  const { back } = useRouter();
  const { t } = useTranslation();

  /* Get Cart Data if not Available */
  useFetchCart(true);

  useAttachCountryAddressFilter();

  const { shippingAddress } = useSelector((store: ValtioStore) => store.userReducer);
  const { payableAmount, products } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  useEffect(() => {
    if (products?.length > 0) {
      removeGiftCardProductFromCart(products);
    }
  }, [products]);

  useEffect(() => {
    /* Fetch user shipping address */
    if (!shippingAddress) fetchShippingAddress();
  });

  const handleBack = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to go back?")) {
      return;
    }

    back();
  };

  return (
    <Fragment>
      <header className="flex justify-between w-full items-center sticky h-12 top-0 z-50 bg-white shadow">
        <BackBtn handleBack={handleBack} />
        <h2 className="capitalize font-semibold grow">{t("payment")}</h2>
        <div className="mr-2 text-right text-10">
          <span className="text-gray-700">{t("amountToPay") || `Amount To Pay`}</span>{" "}
          <div className="font-semibold text-base">{formatPrice(payableAmount || 0, true, false)}</div>
        </div>
      </header>

      {children}
    </Fragment>
  );
};

export default PaymentLayout;
