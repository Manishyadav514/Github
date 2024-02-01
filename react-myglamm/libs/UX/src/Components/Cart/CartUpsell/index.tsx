import React from "react";
import Router from "next/router";

import GlammClubLayout from "@libLayouts/GlammClubLayout";
import CartUpsellOrientation from "./CartUpsellOrientation";

import { useSplit } from "@libHooks/useSplit";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

const CartUpsellTemplate = (props: any) => {
  const { profile, shippingCharges } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
    shippingCharges: store.cartReducer.cart.shippingCharges,
  }));

  const variants = useSplit({
    experimentsList: [
      { id: "giftCardUpsellVariant", condition: Router.pathname === "/shopping-bag" },
      { id: "scrollUpsellRowsTogether", condition: Router.pathname === "/shopping-bag" },
      { id: "cartUpsellVariant", condition: Router.pathname === "/shopping-bag" },
    ],
    deps: [],
  });
  const glammClubVariant = useSplit({
    experimentsList: [{ id: "glammClubUpsell", condition: !!profile?.id && shippingCharges === 0 }],
    deps: [profile?.id, shippingCharges],
  });

  const allVariants = { ...variants, ...glammClubVariant };
  return (
    <div>
      {allVariants?.glammClubUpsell === "1" ? (
        <GlammClubLayout>
          <CartUpsellOrientation variants={allVariants} {...props} />
        </GlammClubLayout>
      ) : (
        <CartUpsellOrientation variants={allVariants} {...props} />
      )}
    </div>
  );
};

export default CartUpsellTemplate;
