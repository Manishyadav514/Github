export type coupons = {
  couponCode: string;
  couponDescription: string;
  couponName: string;
  message: string;
  rewardDetails?: {
    burnConfigType?: number;
    redeemablePoints?: number;
    expireAt?: any;
    percievedPrice?: number;
    subTitle?: string;
    discountCode?: string;
    name?: string;
    thumnailImage?: {
      couponImage?: string;
    };
    id?: string;
  };
};

export type promoCode = {
  handleCoupon: (e: any, coupon?: string) => void;
  couponsList: any;
  disableButton: boolean;
  title: string;
  coupon?: coupons | undefined;
  setCoupon?: any;
  showModal?: boolean;
  setShowModal?: any;
  triggerAdobeClickEvent?: any;
};

export type recommendCoupon = {
  handleCoupon: (e: any, coupon?: string) => void;
  recommendCoupons: any;
  setRecommendCoupons: any;
  coupon: coupons | undefined;
  setCoupon: any;
  showModal: boolean;
  setShowModal: any;
  triggerAdobeClickEvent: any;
};
