import { useEffect } from "react";

import { useSelector } from "./useValtioSelector";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { CONSTANT_REDUCER } from "@libStore/valtio/REDUX.store";

import { ValtioStore } from "@typesLib/ValtioStore";

const useFetchInternationalCountryList = () => {
  const { userCart, addressCountry } = useSelector((store: ValtioStore) => ({
    userCart: store.cartReducer.cart,
    addressCountry: store.constantReducer.addressCountryList,
  }));
  const getInternationalCountryList = async () => {
    const consumerApi = new ConsumerAPI();

    try {
      const { data } = await consumerApi.getAddressCountryList();
      CONSTANT_REDUCER.addressCountryList = data?.data;
    } catch (error) {
      console.error("consumerApi.getAddressCountryList api failed");
    }
  };

  useEffect(() => {
    if (userCart?.allowIntShipping && !addressCountry.length) {
      getInternationalCountryList();
    }
  }, [userCart?.allowIntShipping]);

  return;
};

export default useFetchInternationalCountryList;
