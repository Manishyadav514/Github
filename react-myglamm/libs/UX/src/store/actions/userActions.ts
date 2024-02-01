import { GALogout } from "@libUtils/analytics/gtm";

import router from "next/router";

import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { User, UserAddress } from "@typesLib/Consumer";

import { USER_REDUCER } from "@libStore/valtio/REDUX.store";
/* CLEAR PAGE DATA on login/logout as new session starts */
import { CLEAR_PAGE_DATA } from "@libStore/valtio/PAGE_DATA.store";
import { LOGIN_MODAL_CONSTANT, SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { getVendorCode } from "@libUtils/getAPIParams";

import { SHOP } from "@libConstants/SHOP.constant";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { clearCart } from "./cartActions";

/* Actions - USER */
export const addLoggedInUser = (data: User) => {
  CLEAR_PAGE_DATA();

  USER_REDUCER.userProfile = data;

  setLocalStorageValue(LOCALSTORAGE.PROFILE, data, true);

  const user_profile = {
    name: `${data?.firstName} ${data?.lastName}`,
    user_avatar: data?.meta?.profileImage?.original || "",
    email: data?.email,
    mobile_number: data?.phoneNumber,
    id: data?.id,
  };
  setLocalStorageValue("community_user_profile", user_profile, true);
};

export function logoutUser() {
  localStorage.clear();

  GALogout();

  SHOW_LOGIN_MODAL({ ...LOGIN_MODAL_CONSTANT, show: false });

  (window as any).g3Logout?.({ vendorCode: getVendorCode() });

  CLEAR_PAGE_DATA();

  clearCart();
  USER_REDUCER.userProfile = null;
  USER_REDUCER.userAddress = [];
  USER_REDUCER.userWishlist = [];
  USER_REDUCER.shippingAddress = undefined;
}

export const fetchIsPincodeServiceable = async (shippingAddress: UserAddress) => {
  let isServiceable = false;
  const paymentApi = new PaymentAPI();
  try {
    const response = await paymentApi.checkPincodeIsServiceable(shippingAddress?.zipcode);

    if (response.data.status) {
      isServiceable = response.data.data.isServiceable;
      USER_REDUCER.isPincodeServiceable = isServiceable;
    }

    return isServiceable;
  } catch (err) {
    console.error(err);
    return isServiceable;
  }
};

export const fetchShippingAddress = async () => {
  const isLoggined = checkUserLoginStatus();

  try {
    const address = await getShippingAddress();

    if (address || (!isLoggined && LOCALSTORAGE.GUEST_DETAILS in localStorage)) {
      if (address?.id) {
        sessionStorage.setItem(SESSIONSTORAGE.SHIPPING_ID, address.id);

        /* Used in Middle East countries to pass in api response */
        if (SHOP.REGION === "MIDDLE_EAST") sessionStorage.setItem(SESSIONSTORAGE.CITY_ID, address.cityId);
      }

      const addressData = address || getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS, true);
      USER_REDUCER.shippingAddress = addressData;
      return addressData;
    } else if (router.pathname !== "/shopping-bag") {
      setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment");
      router.push("/addAddress");
    }
  } catch (err) {
    console.error(err);
  }
};
