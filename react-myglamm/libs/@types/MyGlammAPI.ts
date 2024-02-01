export type PromiseArray = Promise<any>;

export type APIVendor = "mgp" | "stb" | "bbc" | "tmc" | "orh" | "srn";
export type Indices = "products" | "lookbook" | "pages";

export type Filter = {
  order?: Array<string>;
  limit?: number;
  skip?: number;
  where: {
    itemId?: {
      inq: Array<string | number>;
    };
    itemType: string;
    itemTag?: string;
    containImage?: boolean;
    vendorCode?: APIVendor;
  };
};

export type VerifyOTPParams = {
  countryCode: string;
  mobile: string;
  email?: string;
  otp: string;
  type: string;
  linkSocial?: string;
  socialId?: string | number;
  vendorCode?: string;
};

export type createConsumerPayload = {
  vendorCode?: string;
  firstName: string;
  lastName: string;
  phoneISO3: string;
  email: string;
  phoneNumber: string;
  location: {
    countryName: string;
    countryCode: string;
    phoneCode: string;
  };
  meta: {
    simplifiedLogin?: boolean;
    memberTags?: Array<string>;
    type?: string | string[];
    responseSurveyId?: string;
    surveyName?: string;
    registrationInfo: {
      utm?: {}; // Optional
      dob: string;
      appVersion: string;
      deviceType: "Mobile_Website";
      deviceId: string;
    };
    misInfo?: {
      gender: string;
    };
    cutThePrice?: boolean;
    source?: string;
    sourceSlug?: string;
  };
  parentReferenceCode?: string;
  linkSocial?: string;
  socialId?: string | number;
  memberType?: {
    typeName: string;
    levelName: string;
  };
};

export interface AddAddressPayload {
  identifier: string;
  addressNickName: string;
  name: string;
  phoneNumber: string;
  email: string;
  zipcode: string;
  cityName: string;
  cityId: string;
  stateName: string;
  stateId: string;
  countryName: string;
  countryId: string;
  location?: string;
  landmark?: string;
  defaultFlag?: "true" | "false";
  statusId?: number;
  flatNumber?: string;
  societyName?: string;
  meta?: {
    appVersion?: string;
    deviceType: "Mobile_Website";
    deviceId: string;
    source?: string;
  };
}

export interface EditAddressPayload extends AddAddressPayload {
  id: string;
}

export type communicationPreference = {
  email: boolean;
  whatsApp: boolean;
  sms: boolean;
};

export interface SocialPayload {
  type: "google" | "facebook";
  id: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
}

export interface CustomerProfileData {
  userInfo: {
    name: string;
    email: string;
    contact: string;
    identifier: string;
  };
  data: [
    {
      answer: [string];
      questionId: string;
    },
    {
      answer: [string];
      questionId: string;
    },
    {
      answer: [string];
      questionId: string;
    },
    {
      answer: [string];
      questionId: string;
    }
  ];
}

export type orderPayload = {
  dsExpectedDeliveryDate: string;
  identifier: string;
  couponCode: string | null;
  address: {
    billingAddressId: string;
    shippingAddressId: string;
  };
  paymentData: Array<{
    type: string;
    value: number;
    successURL?: string;
    cancelURL?: string;
    meta?: {
      simpl?: {
        chargeToken: string;
      };
    };
  }>;
  userDiscountFreeProductsIds: Array<string>;
  meta: {
    deviceType: "WAP" | "Mobile_Website";
    ipAddress?: string;
    browser?: string;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmContent: string | null;
    utmTerm: string | null;
    referralCode?: string;
    checkoutType?: string;
    affiliate?: boolean;
  };
  consumerDetails?: any;
  guestOrder?: boolean;
};
