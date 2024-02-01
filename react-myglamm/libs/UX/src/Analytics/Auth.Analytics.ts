import Adobe from "@libUtils/analytics/adobe";
import { GAcompleteRegistration, GALoginCompleted } from "@libUtils/analytics/gtm";

import { EventState, EVENT_TYPES, SimplifiedState } from "@typesLib/Analytics";

import { ADOBE } from "@libConstants/Analytics.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

/**
 * Adobe Analytics[15] - Page Load - Registration Success/Failure API
 *
 * @memberof Auth
 * @private
 * @param {string} status - Status of Registration Success or Failure
 * @param {Object} profile - Profile of user
 */
async function setRegistrationAdobePageLoad(status: EventState, journeyType?: string | null | string, social?: boolean) {
  if (journeyType === "Signupfreelipstick" && status === "success") {
    (window as any).digitalData = {
      common: {
        pageName: `web|SignupSuccess`,
        newPageName: "signup success",
        subSection: "Signup",
        assetType: "Signup",
        newAssetType: "Signup",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(),
    };
  } else {
    (window as any).digitalData = {
      common: {
        pageName: `web|order checkout|register|${status}`,
        newPageName: `signup ${status}`,
        subSection: "checkout step1",
        assetType: "registration",
        newAssetType: "registration",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(),
    };
  }

  Adobe.PageLoad();
}

function adobeOTPFailedLoad(profile: any, loginType?: string) {
  // Adobe Analytics[13] - Page Load - OTP API Failed
  (window as any).digitalData = {
    common: {
      pageName: "web|order checkout|login|failure",
      newPageName: "login failure",
      subSection: "checkout step1",
      assetType: "checkout login",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType,
      saveDataEnabled: (navigator as any).connection?.saveData,
    },
    user: Adobe.getUserDetails(profile),
  };
  Adobe.PageLoad();
}

const AdobeSimplifiedLogin = (eventName: SimplifiedState) => {
  (window as any).digitalData = {
    common: {
      pageName: `web|order checkout|simplified login|${eventName}`,
      newPageName: eventName.includes("registration") ? `signup${eventName.split("registration").pop()}` : `login ${eventName}`,
      subSection: "checkout step1",
      assetType: "login",
      newAssetType: "login",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "otp",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};

const AdobeLoginEvent = (eventName: EventState, social: boolean) => {
  (window as any).digitalData = {
    common: {
      pageName: `web|order checkout|login|${eventName}`,
      newPageName: `login ${eventName}`,
      subSection: "checkout step1",
      assetType: "checkout login",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "otp",
    },
    user: Adobe.getUserDetails(),
  };

  Adobe.PageLoad();
};

const AdobeTrueCallerLoginEvent = (eventName: "success" | "failure") => {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: `web|order checkout|login|truecaller${eventName}`,
      newPageName: `truecaller login ${eventName}`,
      subSection: "checkout step1",
      assetType: "",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "truecaller",
    },
  };
};
const AdobeTrueCallerLoadEvent = () => {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: "web|order checkout|login|truecaller load",
      newPageName: "truecaller onload",
      subSection: "checkout step1",
      assetType: "",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "truecaller",
    },
  };
};

const AdobeTrueCallerRegEvent = () => {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: "web|order checkout|register|truecaller enter details",
      newPageName: "truecaller signup",
      subSection: "checkout step1",
      assetType: "",
      newAssetType: "registration",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "truecaller",
    },
  };
};

const AdobeTrueCallerSignupEvent = (eventName: "success" | "failure") => {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: `web|order checkout|register|truecaller${eventName}`,
      newPageName: `signup ${eventName}`,
      subSection: "checkout step1",
      assetType: "",
      newAssetType: "registration",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "truecaller",
    },
  };
};

const AdobeTCAnotherMethod = (msg: string) => {
  ADOBE_REDUCER.adobePageLoadData = {
    common: {
      pageName: `web|order checkout|register|truecallerdimissed|${msg}`,
      newPageName: `truecaller modal dismissed`,
      subSection: "checkout step1",
      assetType: "",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginType: "truecaller",
    },
  };
};

/**
 * #region // *WebEngage [22] - Registration Completed
 *
 * @memberOf Auth
 * @private
 * @param {Object} consumer - Consumer Response from Registration API
 * @param {Object} socialData - Social Data of user recieved from Soical Providers
 */
function setGTMWebEngageRegistration(consumer: any, socialData?: any, journeyType?: string | null, memberTag?: string) {
  const fbObjRegister: any = {};
  fbObjRegister.Identity = consumer?.user?.id;
  fbObjRegister.Name = consumer?.user?.firstName;
  fbObjRegister.Email = consumer?.user?.email ? consumer.user?.email : "";
  fbObjRegister.Phone = consumer?.user?.phoneNumber;
  fbObjRegister.Gender = consumer?.user?.gender;
  let registrationPlatform = "Website";
  if (socialData?.type === "google") {
    registrationPlatform = "Google";
  } else if (socialData?.type === "facebook") {
    registrationPlatform = "Facebook";
  }
  const webengageRegistrationDataLayer = {
    id: consumer.user.id,
    firstName: consumer.user.firstName,
    lastName: consumer.user.lastName || "",
    mobile: consumer.user.phoneNumber,
    Registration_date: consumer.user.createdAt,
    email: consumer.user.email,
    Gender: consumer.user?.gender || "female",
    referral_code: consumer.user.referenceCode,
    parentReferalCode: localStorage.getItem("rc") || "",
    googleRegistered: socialData?.type === "google",
    facebookRegistered: socialData?.type === "facebook",
    medium: registrationPlatform.toLowerCase() === "website" ? "Phone Number" : registrationPlatform,
    referral: "rc" in localStorage,
    userType: "Member",
    loginType: journeyType,
    memberTag,
    dob: consumer.user?.meta?.registrationInfo?.dob,
  };

  fbObjRegister.webengage = webengageRegistrationDataLayer;

  const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
  if (fbEventId) {
    fbObjRegister.webengage["eventID"] = fbEventId;
  }

  GAcompleteRegistration(fbObjRegister);
  // #endregion WebEngage [22] - Registration Completed

  // #region // *WebEngage [10] - Login Completed : after registration
  const webengageDataLayer = {
    platform: registrationPlatform,
    userType: "Member",
    firstName: consumer.user.firstName,
    lastName: consumer.user.lastName || "",
    phoneNumber: consumer.user.phoneNumber,
    email: consumer.user.email,
  };

  // #endregion *WebEngage [10] - Login Completed
  return GALoginCompleted(webengageDataLayer);
}

function setLoginCompleted(socialData?: any) {
  const userProfile = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  let registrationPlatform = "Website";
  if (socialData?.type === "google") {
    registrationPlatform = "Google";
  } else if (socialData?.type === "facebook") {
    registrationPlatform = "Facebook";
  }
  const webengageDataLayer = {
    platform: registrationPlatform,
    userType: "Member",
    firstName: userProfile?.firstName,
    lastName: userProfile?.lastName,
    phoneNumber: userProfile?.phoneNumber,
    email: userProfile?.email,
  };
  GALoginCompleted(webengageDataLayer);
}

function AdobeLoginStart(variant?: string) {
  (window as any).digitalData = {
    common: {
      pageName: "web|order checkout|login|enter details",
      newPageName: "login enter details",
      subSection: "checkout step1",
      assetType: "checkout login",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };

  if (typeof variant === "string" && variant !== "no-variant") {
    (window as any).digitalData.whatsAppExpVar = variant;
  }
  Adobe.PageLoad();
}

function AdobeEnterOTP() {
  const isWhatsAppOpted = getLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, true);

  (window as any).digitalData = {
    common: {
      pageName: "web|order checkout|login|enter otp",
      newPageName: "login enter otp",
      subSection: "checkout step1",
      assetType: "checkout login",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },

    user: Adobe.getUserDetails(),
  };

  if (typeof isWhatsAppOpted === "boolean") {
    (window as any).digitalData.whatsAppConsent = isWhatsAppOpted ? "whatsapp consent opt-in" : "whatsapp consent opt-out";
  }

  Adobe.PageLoad();
}

function AdobeWebOTP() {
  (window as any).digitalData = {
    common: {
      pageName: "web|web otp success",
      newPageName: "web otp success",
      subSection: "checkout step1",
      assetType: "web otp",
      newAssetType: "web otp",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginStatus: "guest",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
}

function AdobeSimplifiedEnterOTP() {
  const isWhatsAppOpted = getLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, true);
  (window as any).digitalData = {
    common: {
      pageName: "web|order checkout|simplified login|enter details login|enter otp",
      newPageName: "login enter otp",
      subSection: "checkout step1",
      assetType: "login",
      newAssetType: "login",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };

  if (typeof isWhatsAppOpted === "boolean") {
    (window as any).digitalData.whatsAppConsent = isWhatsAppOpted ? "whatsapp consent opt-in" : "whatsapp consent opt-out";
  }

  Adobe.PageLoad();
}

function AdobeSimplifiedLoginStart(variant?: string, pageName?: string) {
  (window as any).digitalData = {
    common: {
      pageName: `${pageName ? pageName : "web|order checkout|"}simplified login|enter details login|enter details`,
      newPageName: "login enter details",
      subSection: "checkout step1",
      assetType: "login",
      newAssetType: "login",
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };

  if (typeof variant === "string" && variant !== "no-variant") {
    (window as any).digitalData.whatsAppExpVar = variant;
  }
  Adobe.PageLoad();
}

function handleSSOEvents(type: EVENT_TYPES, additionalInfo: any, simplified = false) {
  const consumer = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

  switch (type) {
    case "LOGIN_START":
      if (simplified) return AdobeSimplifiedLoginStart();
      return AdobeLoginStart();

    case "ENTER_OTP":
      if (simplified) return AdobeSimplifiedEnterOTP();
      return AdobeEnterOTP();

    case "WEB_OTP":
      return AdobeWebOTP();

    case "LOGIN_SUCCESS":
      setLoginCompleted();
      if (simplified) return AdobeSimplifiedLogin("success");
      return AdobeLoginEvent("success", false);

    case "LOGIN_FAILURE":
      if (simplified) return AdobeSimplifiedLogin("failure");
      return AdobeLoginEvent("failure", false);

    case "LOGIN_SOCIAL_SUCCESS":
      setLoginCompleted(additionalInfo);
      return AdobeLoginEvent("success", true);

    case "LOGIN_SOCIAL_FAILURE":
      return AdobeLoginEvent("failure", true);

    case "SIGNUP_SUCCESS":
      setGTMWebEngageRegistration({ user: consumer });
      if (simplified) return AdobeSimplifiedLogin("registration success");
      return setRegistrationAdobePageLoad("success", undefined, false);

    case "SIGNUP_FAILURE":
      if (simplified) return AdobeSimplifiedLogin("registration failure");
      return setRegistrationAdobePageLoad("failure", undefined, false);

    case "SIGNUP_SOCIAL_SUCCESS":
      setGTMWebEngageRegistration({ user: consumer }, additionalInfo);
      return setRegistrationAdobePageLoad("success", undefined, true);

    case "SIGNUP_SOCIAL_FAILURE":
      return setRegistrationAdobePageLoad("failure", undefined, true);

    default:
      return null;
  }
}

function AdobeWebOTPSuccessForGuest() {
  (window as any).digitalData = {
    common: {
      pageName: "web|web otp success",
      newPageName: "web otp success",
      subSection: "checkout step1",
      assetType: "web otp",
      newAssetType: "web otp",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    login: {
      loginStatus: "guest",
    },
  };
  ADOBE_REDUCER.adobePageLoadData = (window as any).digitalData;
}

function AdobeSendOTPOnCheckout() {
  (window as any).digitalData = {
    common: {
      linkName: "web|order checkout|simplified login|send otp",
      linkPageName: "send otp",
      ctaName: "send otp",
      newLinkPageName: "login send otp",
      subSection: "Login",
      assetType: "login",
      newAssetType: "login",
      platform: ADOBE.PLATFORM,
      pageLocation: "",
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
}

export {
  setGTMWebEngageRegistration,
  setRegistrationAdobePageLoad,
  AdobeLoginEvent,
  adobeOTPFailedLoad,
  AdobeSimplifiedLogin,
  AdobeTrueCallerLoginEvent,
  AdobeTrueCallerLoadEvent,
  AdobeTrueCallerRegEvent,
  AdobeTrueCallerSignupEvent,
  AdobeTCAnotherMethod,
  handleSSOEvents,
  setLoginCompleted,
  AdobeWebOTP,
  AdobeSimplifiedEnterOTP,
  AdobeEnterOTP,
  AdobeLoginStart,
  AdobeSimplifiedLoginStart,
  AdobeWebOTPSuccessForGuest,
  AdobeSendOTPOnCheckout,
};
