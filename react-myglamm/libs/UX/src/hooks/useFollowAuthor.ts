import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import BBCArticlesAPI from "@libAPI/apis/BBCArticlesAPI";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { ValtioStore } from "@typesLib/ValtioStore";

const useFollowAuthor = authorDetails => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const [isFollowing, setIsFollowing] = React.useState(0);

  const getFollowStatus = async () => {
    try {
      const articlesAPI = new BBCArticlesAPI();
      const res = await articlesAPI.checkAuthorFollowStatus(authorDetails.user_slug, userProfile.id);
      if (res?.status === 200) {
        setIsFollowing(res.data.data[0].follow);
      } else {
        throw res;
      }
    } catch (error) {
      // error handling
    }
  };

  const followAPICall = async () => {
    try {
      const payload = {
        vendorCode: "g3",
        country: "IND",
        sourceVendorCode: "bbc",
        entityId: authorDetails?.user_slug,
        entityType: "user",
      };
      const articlesAPI = new BBCArticlesAPI();
      const res = await articlesAPI.followUser(payload);
      if (res?.status === 200) {
        setIsFollowing(res?.data?.data?.data?.statusId === 1 ? 1 : 0);
      } else {
        throw res;
      }
    } catch (error) {
      setIsFollowing(0);
      // error handling
    }
  };

  const unfollowAPICall = async () => {
    try {
      const payload = {
        entityId: authorDetails?.user_slug,
        entityType: "user",
        statusId: 2,
        country: "IND",
        vendorCode: "g3",
        sourceVendorCode: "bbc",
      };
      const articlesAPI = new BBCArticlesAPI();
      const res = await articlesAPI.unfollowUser(payload);
      if (res?.status === 200) {
        setIsFollowing(res?.data?.data?.data?.statusId === 2 ? 0 : 1);
      } else {
        throw res;
      }
    } catch (error) {
      setIsFollowing(1);
      // error handling
    }
  };

  const onFollowAuthor = async () => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    GAgenericEvent("engagement", "BBC Clicked On Follow Button", authorDetails.user_slug);
    followAPICall();
  };

  const onUnFollowAuthor = async () => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    GAgenericEvent("engagement", "BBC Clicked On Unfollow Button", authorDetails.user_slug);
    unfollowAPICall();
  };

  React.useEffect(() => {
    if (userProfile?.id) {
      getFollowStatus();
    }
  }, [userProfile?.id]);

  return [isFollowing, onFollowAuthor, onUnFollowAuthor];
};

export default useFollowAuthor;
