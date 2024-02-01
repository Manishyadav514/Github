import { AllVendors, VendorCodes } from "./APIFilters";
import { APIVendor } from "./MyGlammAPI";

export type UserAddress = {
  addressNickName: "Home" | "Office" | "Other";
  cityId: string;
  cityName: string;
  countryCode: string;
  countryId: string;
  uiTemplate: "template_are" | "template_ind";
  countryName: string;
  defaultFlag: "false" | "true";
  email: string;
  id: string;
  identifier: string;
  location: string;
  meta: {
    appVersion: string;
    deviceId: string;
    deviceType: "Mobile_Website";
    source: string;
  };
  name: string;
  phoneNumber: string;
  area: string;
  apartment: string;
  stateId: string;
  stateName: string;
  landmark?: string;
  societyName?: string;
  flatNumber?: string;
  statusId: 1 | 0;
  updatedAt: Date;
  zipcode: string;
  isoCode3?: string;
  addressCountyCode?: string;
};

export type addressInitialValues = {
  defaultFlag: boolean;
  name: string;
  phoneNumber: string;
  addressNickName: string;
  countryCode?: string;
  email: string;
  zipcode?: string;
  cityName: string;
  countryName?: string;
  countryId: string;
  apartment?: string;
  area?: string;
  emirate?: string;
  stateName?: string;
  location: string;
};

export type User = {
  juspay_token?: {
    client_auth_token_expiry: string;
    client_auth_token: string;
  };
  commission: any;
  currentBalance: number;
  communicationPreference: {
    email: boolean;
    sms: boolean;
    whatsApp: boolean;
    pushNotification: boolean;
  };
  createdAt: Date;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  location: {
    countryName: string;
    countryCode: string;
    phoneCode: string;
  };
  memberType: {
    typeName: string;
    levelName: string;
  };
  meta: {
    attributes: {
      userGraphVc: { [char in AllVendors]: any };
      userSegmentVc: { [char in AllVendors]: any };
      pdpOfferSegment?: any;
    };
    consumerId: number;
    misInfo: {
      gender: "male" | "female";
    };
    registrationInfo: {
      appVersion: string;
      deviceId: string;
      deviceType: string;
      dob: string;
    };
    tags: any[];
    profileImage?: {
      original: string;
      assetName: string;
      assetId: string;
    };
    babyDetails?: {
      dob?: string;
      dobDateMonth?: string;
      dobFormatted?: string;
      gender?: string;
      lifestage?: {
        name?: string;
        type?: number;
      };
      name?: string;
    };
    vendorLanguage?: any;
  };
  parentReferenceCode: string;
  password: string;
  phoneNumber: string;
  referenceCode: string;
  role: Array<string>;
  shareUrl: string;
  statusId: 1 | 0;
  totalNetworkCount: number;
  updatedAt: Date;
  vendorCode: APIVendor;
};

export type ProfileUpdatePyload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  gender?: string;
  profileImage?: {
    original: string;
    assetName: string;
    assetId: number;
  };
};
