import { useEffect } from "react";

import { useSelector } from "./useValtioSelector";

import MyGlammAPI from "@libAPI/MyGlammAPI";
import { ValtioStore } from "@typesLib/ValtioStore";

const useAttachCountryAddressFilter = () => {
  const { allowInternational, shippingAddress } = useSelector((store: ValtioStore) => ({
    allowInternational: store.cartReducer.cart.allowIntShipping,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  useEffect(() => {
    if (allowInternational && MyGlammAPI.Filter.AddressCountryCode !== shippingAddress?.isoCode3) {
      MyGlammAPI.changeAddressCountryCode({
        countryCode: shippingAddress?.isoCode3,
        pincode: shippingAddress?.zipcode,
      });
    } else if (allowInternational === false && MyGlammAPI.Filter.AddressCountryCode === shippingAddress?.isoCode3) {
      MyGlammAPI.changeAddressCountryCode(null);
    }
  }, [allowInternational, shippingAddress]);

  return;
};

export default useAttachCountryAddressFilter;
