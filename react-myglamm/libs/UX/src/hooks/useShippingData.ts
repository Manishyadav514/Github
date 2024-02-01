import { useEffect } from "react";
import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

function useShippingData(userProfile: any, shippingAddress: any, addressData: any) {
  useEffect(() => {
    const selectedShippingId = sessionStorage.getItem("shippingId");
    if (userProfile && addressData && selectedShippingId) {
      const selectedShippingAdd = addressData.find((add: any) => add.id === selectedShippingId);
      USER_REDUCER.shippingAddress = selectedShippingAdd;
    } else if (userProfile && addressData && !shippingAddress) {
      const shipping = addressData.filter((data: any) => data.defaultFlag === "true")[0];
      if (shipping) {
        USER_REDUCER.shippingAddress = shipping;
      }
    } else if (userProfile && addressData && shippingAddress) {
      const shipping = addressData.filter((data: any) => data.id === shippingAddress.id)[0];
      if (shipping) {
        USER_REDUCER.shippingAddress = shipping;
      }
    }
  }, [userProfile, shippingAddress, addressData]);
}

export default useShippingData;
