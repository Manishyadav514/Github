import { useEffect } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { cartLoaded, updateCart } from "@libStore/actions/cartActions";

import { fetchCart } from "@checkoutLib/Cart/HelperFunc";
import { getCartIdentifier } from "@checkoutLib/Storage/HelperFunc";

/**
 * Fetch Cart on Mount if Not Present in Redux
 */
export function useFetchCart(rerunOnZipChange = false) {
  const { identifier } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const { shippingAddress } = useSelector((store: ValtioStore) => store.userReducer);

  useEffect(() => {
    // waiting for shipping address before chkout call to get all the required data from single call
    if ((rerunOnZipChange && shippingAddress?.zipcode) || !rerunOnZipChange) {
      /* Rerun this every time only incase of zipChange flag is true */
      if (getCartIdentifier() && (!identifier || rerunOnZipChange)) {
        fetchCart(shippingAddress?.zipcode).then(cart => {
          if (cart) updateCart(cart);
          else cartLoaded();
        });
      } else cartLoaded();
    }
  }, [shippingAddress?.zipcode]);
}
