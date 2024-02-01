import WishlistAPI from "@libAPI/apis/WishlistAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { USER_REDUCER } from "@libStore/valtio/REDUX.store";
import { addLoggedInUser } from "@libStore/actions/userActions";

import { removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE, SESSIONSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import { getSessionStorageValue, removeSessionStorageValue } from "@libUtils/sessionStorage";

export const fetchUserProfile = async (consumerId: string): Promise<void> => {
  try {
    const wishlistAPI = new WishlistAPI();
    const consumerAPI = new ConsumerAPI();

    // Fetch wishlist and user profile data in parallel
    const [wishlistData, userProfileData] = await Promise.all([
      wishlistAPI.getWishlistProductIds(consumerId),
      consumerAPI.getProfile(consumerId),
    ]);

    // Set wishlist ID in local storage if present
    const wishlistId = wishlistData?.data?.data?.id;
    if (wishlistId) {
      setLocalStorageValue("wishlistId", wishlistId);
    }

    // Set user wishlist and add user to logged in users list
    const userWishlist = wishlistData?.data?.data?.productIds;
    USER_REDUCER.userWishlist = userWishlist;
    addLoggedInUser(userProfileData.data.data);
  } catch (error: any) {
    console.error(error.message);
  }
};

export const removeGuestTokens = () => {
  removeLocalStorageValue(LOCALSTORAGE.STOKEN);
  removeLocalStorageValue(LOCALSTORAGE.IS_GUEST);
  removeLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS);
  removeLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN);
  removeSessionStorageValue(SESSIONSTORAGE.TEMP_LOGIN_DETAILS);
  removeSessionStorageValue(SESSIONSTORAGE.GUEST_PAYMENT_FLOW_VARIANT);
  removeLocalStorageValue(LOCALSTORAGE.CARTID);
};

export const switchUserFromGuestToLogin = () => {
  const temporaryLoginData = getSessionStorageValue(SESSIONSTORAGE.TEMP_LOGIN_DETAILS, true);
  setLocalStorageValue(LOCALSTORAGE.MEMBER_ID, temporaryLoginData.userId);
  setLocalStorageValue(XTOKEN(), temporaryLoginData.xtoken);
};

export const getAndStoreSegmentTags = async (consumerId: string) => {
  const consumerApi = new ConsumerAPI();

  const { data: userTags } = await consumerApi.getDump(LOCALSTORAGE.USER_SEGMENT, consumerId);

  // Store user segment tags in local storage if they are available
  const userSegmentTags = userTags?.data?.[0]?.value?.segment;

  if (userSegmentTags?.length) {
    setLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, userSegmentTags, true);
  }
};
