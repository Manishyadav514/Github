import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getSessionStorageValue, removeSessionStorageValue } from "@libUtils/sessionStorage";
import { proxy } from "valtio";

type PARTNERSHIP_STATE = {
  partnershipData: {
    couponList?: any[];
    finalPriceCoupon?: boolean;
    partnershipCoupon?: string;
    skip?: number;
  };
  partnershipAmount: {
    payableAmount?: number;
    discountAmount?: number;
    productTag?: string;
  };
};

export let PARTNERSHIP_STATE: PARTNERSHIP_STATE = proxy({
  partnershipData: getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) || {
    couponList: [],
    finalPriceCoupon: false,
    partnershipCoupon: "",
    skip: 0,
  },
  partnershipAmount: {},
});

export const RESET_PARTNERSHIP_STATE = () => {
  PARTNERSHIP_STATE.partnershipData = {
    couponList: [],
    finalPriceCoupon: false,
    partnershipCoupon: "",
    skip: 0,
  };

  PARTNERSHIP_STATE.partnershipData = {};
  removeSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA);
};
