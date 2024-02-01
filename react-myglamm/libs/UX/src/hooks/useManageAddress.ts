import { useEffect, useState } from "react";
import Router from "next/router";

import { useInView } from "react-intersection-observer";

import { UserAddress } from "@typesLib/Consumer";
import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { adobeAddressSelectedClick, adobeSelectAddressPageLoad } from "@checkoutLib/Address/AnalyticsHelperFunc";

import { setSessionStorageValue } from "@libUtils/sessionStorage";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { CART_REDUCER, CONSTANT_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";

import { useSelector } from "./useValtioSelector";

export function useManageAddress() {
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true });

  const { userAddress } = useSelector((store: ValtioStore) => store.userReducer);

  const isLoggined = checkUserLoginStatus();

  /* Address Call and Store in Redux */
  const getAddresses = async (purge = false) => {
    setHasMore(true);
    try {
      const consumerApi = new ConsumerAPI();
      const { data } = await consumerApi.getAddress(
        { identifier: isLoggined?.memberId, statusId: 1 },
        purge ? 0 : userAddress.length
      );

      let addressList = data.data.data;
      if (!CART_REDUCER?.cart?.allowIntShipping) {
        // assuming that international will be done only for india
        addressList = addressList?.filter(
          (address: any) =>
            address?.isoCode3 === undefined || address?.isoCode3 === (CONSTANT_REDUCER?.isdCodes?.[0]?.isoCode3 || "IND")
        );
      }

      /* Stop Lazyloading Address in case lenth is less than the limit */
      if (addressList?.length < 10) setHasMore(false);

      /* Store Data in Redux */
      const updatedAddressList = [...(purge ? [] : userAddress), ...(addressList || [])];
      USER_REDUCER.userAddress = updatedAddressList;

      /* Reroute to add Address Page incase no address avilable */
      if (updatedAddressList.length === 0) {
        Router.replace("/addAddress");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const shouldDelete = window.confirm("Are you sure, you want to delete this address?");

    if (shouldDelete) {
      USER_REDUCER.userAddress = [];

      const consumerApi = new ConsumerAPI();
      await consumerApi.deleteAddress(id);
      getAddresses(true);
    }
  };

  const storeShippingAddress = (address: UserAddress) => {
    USER_REDUCER.shippingAddress = address;
    sessionStorage.setItem("shippingId", address.id);

    setSessionStorageValue(SESSIONSTORAGE.SHIPPING_ID, address.id); // update id in session for the user

    /* Address Select - ADOBE CLICK EVENT */
    adobeAddressSelectedClick();
  };

  /* Pagination Logic */
  useEffect(() => {
    if (!isLoggined) {
      Router.push("/");
    } else if (hasMore && (inView || userAddress.length === 0)) {
      getAddresses();
    }
  }, [inView]);

  // Adobe Analytics[21] - Page Load - Change Address
  useEffect(() => {
    adobeSelectAddressPageLoad();
  }, []);

  return { ref, userAddress, storeShippingAddress, getAddresses, handleDeleteAddress };
}
