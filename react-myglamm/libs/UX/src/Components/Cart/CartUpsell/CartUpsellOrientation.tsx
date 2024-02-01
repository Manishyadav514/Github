import React, { useEffect } from "react";

import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { ValtioStore } from "@typesLib/ValtioStore";

import { setSessionStorageValue } from "@libUtils/sessionStorage";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

const CartUpsellNucleus = dynamic(() => import(/* webpackChunkName: "CartUpsellNucleus" */ "./CartUpsellNucleus"), {
  ssr: false,
});

const CartUpsellDS = dynamic(() => import("./CartUpsellDS"));

const CartUpsellPersonalised = dynamic(() => import("./CartUpsellPersonalized"));

const CartUpsellOrientation = (props: any) => {
  const { t } = useTranslation();
  const upsellCoupons = t("abUpsellCoupons");
  const { couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const variants = props.variants;
  useEffect(() => {
    if (variants?.giftCardUpsellVariant && variants?.giftCardUpsellVariant !== "no-variant") {
      setSessionStorageValue(SESSIONSTORAGE.GIFT_CARD_UPSELL_VARIANT, variants?.giftCardUpsellVariant);
    }
  }, [variants?.giftCardUpsellVariant]);

  const displayUpsellComponent = (variant: string) => {
    // this is current not being used
    // scrollUpsellRowsTogether is being passed just that it doesnt break on all cases
    switch (variant) {
      case "0":
        return <CartUpsellNucleus {...props} />;

      case "1":
        return <CartUpsellDS {...props} variant={variant} />;
      case "2":
        return (
          <React.Fragment>
            <CartUpsellNucleus {...props} variant={variant} />
            <CartUpsellPersonalised {...props} />
          </React.Fragment>
        );
      case "3":
        return (
          <React.Fragment>
            <CartUpsellDS {...props} variant={variant} />
            <CartUpsellPersonalised {...props} />
          </React.Fragment>
        );

      default:
        return null;
    }
  };
  if (
    variants?.cartUpsellVariant &&
    variants?.cartUpsellVariant !== "no-variant" &&
    // incase upsell applicable coupons are there then check it and only then activate A/B
    (!upsellCoupons || upsellCoupons?.length === 0 || upsellCoupons?.includes(couponData?.couponCode || ""))
  ) {
    return displayUpsellComponent(variants?.cartUpsellVariant);
  }

  if (FEATURES?.enableDsUpsell || variants?.giftCardUpsellVariant === "2") {
    return <CartUpsellDS {...props} />;
  }

  if (FEATURES?.enableDsUpsellWithPersonalizedPicks) {
    return (
      <React.Fragment>
        <CartUpsellDS {...props} />
        <CartUpsellPersonalised {...props} />
      </React.Fragment>
    );
  }
  /* If no variant, show default nucleus upsell */
  return (
    <React.Fragment>
      <CartUpsellNucleus {...props} />
    </React.Fragment>
  );
};

export default CartUpsellOrientation;
