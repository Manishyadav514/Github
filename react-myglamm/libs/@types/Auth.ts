export type useAuthOptions = {
  initialState?: any;
  mergeCart?: boolean;
  redirect?: boolean;
  onSuccess?: () => void;
  memberTag?: string;
  timer?: number;
  redirectToPayment?: boolean;
  onlyMobileLogin?: boolean;
  simplifiedLogin?: boolean;
  otherData?: any;
  verifiedPhoneNumberPendingLogin?:boolean;
  onFailure?: () => void;
};

export type LoginState = {
  mobile: string;
  ISDCode: string;
  name: string;
};

export type VerifyState = {
  isNewUser?: boolean;
  otp?: string;
  email: string;
  name: string;
  referralCode: string;
  isBA?: boolean;
  gender?: string;
  dob?: string;
  isSocialLogin?: boolean;
  mobile: string;
  cutThePrice?: boolean;
  source?: string;
  sourceSlug?: string;
};

export type VerifyTrueCallerState = {
  phoneNumber?: string;
  email?: string;
  name?: string;
  referralCode?: string;
};
