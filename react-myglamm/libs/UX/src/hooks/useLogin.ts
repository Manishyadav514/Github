import { useRef, useState, useEffect, RefObject } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { useRouter } from "next/router";

import { setCookie } from "@libUtils/cookies";
import { getVendorCode } from "@libUtils/getAPIParams";
import { showError, showSuccess } from "@libUtils/showToaster";
import Webengage from "@libUtils/analytics/webengage";
import { GALoginCompleted, GAUpdateDetails, GA4Event } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { isClient } from "@libUtils/isClient";
import { getClientQueryParam } from "@libUtils/_apputils";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";
import { setSessionStorageValue } from "@libUtils/sessionStorage";
import { fetchUserProfile, getAndStoreSegmentTags } from "@libUtils/login/HelperFunc";

import {
  setGTMWebEngageRegistration,
  setRegistrationAdobePageLoad,
  adobeOTPFailedLoad,
  AdobeTrueCallerLoginEvent,
  AdobeTrueCallerLoadEvent,
  AdobeTrueCallerRegEvent,
  AdobeTrueCallerSignupEvent,
  AdobeTCAnotherMethod,
  AdobeSimplifiedLogin,
  AdobeWebOTPSuccessForGuest,
  AdobeSendOTPOnCheckout,
} from "@libAnalytics/Auth.Analytics";

import { SHOP } from "@libConstants/SHOP.constant";
import { COOKIE, LOCALSTORAGE, SESSIONSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import { STATES } from "@libConstants/Auth.constant";

import AuthAPI from "@libAPI/apis/AuthAPI";
import CartAPI from "@libAPI/apis/CartAPI";

import { getShippingAddress } from "@checkoutLib/Payment/HelperFunc";
import { User } from "@typesLib/Consumer";
import { createConsumerPayload } from "@typesLib/MyGlammAPI";
import { ValtioStore } from "@typesLib/ValtioStore";
import { SurveyState } from "@typesLib/Survey";
import { useAuthOptions, LoginState, VerifyState, VerifyTrueCallerState } from "@typesLib/Auth";

import useTranslation from "./useTranslation";
import { useSelector } from "./useValtioSelector";
import useEffectAfterRender from "./useEffectAfterRender";

import { PAYMENT_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";
import { addLoggedInUser } from "@libStore/actions/userActions";
import { updateProductCount } from "@libStore/actions/cartActions";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

/**
 * Authentication Module Logic Hook
 * @member Auth
 * @param {Object} options - useAuth Hook options
 * @access public
 */

const SURVEY_VERSION = isClient() && sessionStorage.getItem("surveyVersion");
const responseSurveyId =
  isClient() && sessionStorage.getItem(`${LOCALSTORAGE.RESPONSE_SURVEY_ID}${SURVEY_VERSION ? `-${SURVEY_VERSION}` : ""}`);
const { platform }: SurveyState = isClient() && JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.SURVEY_INFO) || "{}");
const isWhatsAppOpted = getLocalStorageValue(LOCALSTORAGE.ENABLE_WHATSAPP_OTP, true);

const removeGuestDetailsOnAuthComplete = () => {
  removeLocalStorageValue(LOCALSTORAGE.STOKEN);
  removeLocalStorageValue(LOCALSTORAGE.IS_GUEST);
  removeLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS);
  removeLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN);
};

// TrueCaller SDK
const initializeTrueCaller = (requestNonce: string) => {
  return `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${requestNonce}&partnerKey=${GBC_ENV.NEXT_PUBLIC_TRUECALLER_APP_KEY}&partnerName=MyGlamm&lang=en&loginPrefix=placeorder&loginSuffix=verifymobile&ctaPrefix=use&ctaColor=%23000000&ctaTextColor=%23ffffff&btnShape=round&skipOption=useanothermethod`;
};

const getMemberTags = (options: any, location: any) => {
  const memberTags = [];
  const shippingOnAddressVariant = sessionStorage.getItem(LOCALSTORAGE.SHIPPING_CHARGES_ON_PAYMENT_VARIANT);
  const isOfflineUser = sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME);

  if (isOfflineUser) {
    memberTags.push("orh_offline");
  }

  if (shippingOnAddressVariant) {
    memberTags.push(`shipping_on_payment_experiment_${shippingOnAddressVariant}`);
  }
  if (options.memberTag) {
    memberTags.push(options.memberTag);
  }

  if (location.memberTag) {
    memberTags.push(location.memberTag);
  }

  return memberTags;
};

function handleSocialLoginCompletedAnalytics(payload: any, userData: any) {
  let registrationPlatform;
  if (!payload?.type) {
    registrationPlatform = "Website";
  } else {
    switch (payload?.type) {
      case "google": {
        registrationPlatform = "Google";
        break;
      }
      case "facebook": {
        registrationPlatform = "Facebook";
        break;
      }
      default: {
        throw new Error("Unsupported Social Platform detected");
      }
    }
  }

  const webengageDataLayer = {
    platform: registrationPlatform,
    userType: "Member",
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData?.phoneNumber,
    email: userData.email,
  };

  GALoginCompleted(webengageDataLayer);

  GA4Event([
    {
      event: "login",
    },
    {
      user_id: userData.id,
    },
  ]);

  if (SHOP.SITE_CODE === "bbc") {
    const userDetails = {
      userDetails: userData,
    };

    const defaultData = {
      userType: "Member",
      identity: userData?.id || "",
      userDetails: { userDetails: userDetails.userDetails },
    };

    GAUpdateDetails("Login Completed 1", defaultData);
  }
}

function useLogin(options: useAuthOptions) {
  const verifyOTPData: RefObject<any> = useRef();
  const Auth = new AuthAPI();
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, mobileNumber, isdCodes, countryId } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
    mobileNumber: store.userReducer.userMobileNumber,
    isdCodes: store.constantReducer.isdCodes,
    countryId: store.cartReducer.cart.countryId,
  }));

  const [isNewUser, setIsNewUser] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState<number>(options.timer || 0);
  const [inputMobileNumber, setInputMobileNumber] = useState("");
  const [location, setLocation] = useState({
    countryName: "India",
    countryCode: "IND",
    phoneCode: "91",
    memberTag: "",
  });
  const [socialData, setSocialData] = useState({
    email: undefined,
    name: undefined,
    socialId: "",
    id: undefined,
    type: "",
    gender: "",
    dob: "",
  });
  const [isSocialLogin, setSocialLogin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeState, setActiveState] = useState(STATES.LOGIN_USING_INPUT);

  const otpForm = useForm<VerifyState>({
    defaultValues: {
      isNewUser,
      otp: "",
      email: socialData?.email || "",
      name: socialData?.name || "",
      referralCode: (typeof window !== "undefined" && (getClientQueryParam("rc") || localStorage.getItem("rc"))) || "",
      isBA: false,
      gender: socialData?.gender || "female",
      dob: socialData?.dob || "",
      isSocialLogin,
    },
    mode: "all",
  });
  const [otp, name] = otpForm.watch(["otp", "name"]);
  const loginForm = useForm<LoginState>({
    mode: "onChange",
    defaultValues: {
      mobile: mobileNumber ? mobileNumber.number : "",
      name: "",
    },
  });
  const [WatchISDFiled] = loginForm.watch(["ISDCode"]);

  const mergeCartAfterAuth = async (consumerId: string): Promise<void> => {
    const cartId = getLocalStorageValue(LOCALSTORAGE.CARTID);
    if (!cartId) {
      return;
    }
    const cartApi = new CartAPI();
    try {
      const { data: cartData } = await cartApi.mergeCart(consumerId, cartId);

      if (router.pathname !== "/shopping-bag") {
        const { data: res } = await cartApi.getCount();
        updateProductCount(res.data?.data?.productCount || res.data?.productCount || 0);
      }
      removeLocalStorageValue(LOCALSTORAGE.CARTID);

      /* In case we don't wanna redirect user to payment/address page */
      if ("doNotRedirect" in sessionStorage) {
        sessionStorage.removeItem("doNotRedirect");
        return;
      }

      if ((!cartData.data.existingUserCart && router.pathname === "/shopping-bag") || router.pathname === "/guest/address") {
        const shippingAddress = await getShippingAddress();

        if (!shippingAddress) {
          setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, IS_DESKTOP ? "checkout" : "payment");
          router.push(IS_DESKTOP ? "/add-shipping-address" : "/addAddress");
          return;
        }

        const isMiddleEastCountry: boolean = parseInt(shippingAddress.countryId) !== cartData?.data?.cloudfrontCountryId;

        if (isMiddleEastCountry) {
          router.push("/select-address");
          return;
        }

        USER_REDUCER.shippingAddress = shippingAddress;

        router.push(IS_DESKTOP ? "/checkout" : "/payment");
        return;
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const setLocationByISDCode = (ISDCode: string) => {
    const countryCodeToMatch = ISDCode || "91";
    const selectedISD = isdCodes?.find(x => x.countryCode === countryCodeToMatch);

    if (selectedISD) {
      setLocation({
        countryCode: selectedISD.isoCode3,
        countryName: selectedISD.countryLabel,
        phoneCode: selectedISD.countryCode,
        memberTag: selectedISD.countryVendorCodeTag,
      });
    }
  };

  const checkIfCodEnabled = (isCodEnabled: boolean) => {
    // Disable COD if isCodAllowed is false for user
    if (isCodEnabled === false) {
      showError(t("guestFlowCodNotEligible") || "COD is not currently available for this order.");
      // disable payment on cod
      PAYMENT_REDUCER.isCodEnable = false;
      if (options?.verifiedPhoneNumberPendingLogin && options?.onFailure) {
        // close modal
        options?.onFailure();
      }
    }

    return isCodEnabled;
  };

  const redirectToURL = () => {
    const redirectURL = getClientQueryParam("redirect");
    const isSignupFreeLipstick = getClientQueryParam("type") === "Signupfreelipstick";

    if (redirectURL && typeof redirectURL === "string") {
      if (/\/my-\w+$|\/customer-profile\/$/.test(redirectURL)) {
        return router.push(redirectURL);
      }
      const category = redirectURL.split("/")[1];
      if (category) {
        return router.push(`/[category]?category=${category}`, redirectURL);
      }
    }

    if (isSignupFreeLipstick && isNewUser) {
      return null;
    }

    if (options.redirect) {
      if (isNewUser) {
        return null;
      }
      return router.push("/");
    }
    return null;
  };

  const fetchUserDetails = async (consumerId: string, userData: User) => {
    // WebEngage [10] - Login Completed
    handleSocialLoginCompletedAnalytics(socialData, userData);

    // Call Wallet and rewards API to get user GlammPoints and user Circle details
    fetchUserProfile(consumerId);

    // Call to Dump API to get userSegment Tags after login
    getAndStoreSegmentTags(consumerId);

    // If cart merge option is passed then merge the guest and consumer carts and fetch the updated cart.
    if (options.mergeCart) {
      await mergeCartAfterAuth(consumerId);
    }
    // Redirect consumer after successful login
    redirectToURL();

    // On Success callback function
    if (options.onSuccess) {
      options.onSuccess();
    }
  };

  const saveMemberDetailInSessionStorage = (xtoken: string, userId: string) => {
    setSessionStorageValue(
      SESSIONSTORAGE.TEMP_LOGIN_DETAILS,
      {
        xtoken,
        userId,
      },
      true
    );
  };

  const saveMemberDetails = (xtoken: string, userId: string, firstName: string, lastName: string) => {
    setLocalStorageValue(XTOKEN(), xtoken);
    setLocalStorageValue(LOCALSTORAGE.MEMBER_ID, userId);
  };

  const saveMemberDetailHandler = (xtoken: string, userId: string, firstName: string, lastName: string) => {
    if (options?.verifiedPhoneNumberPendingLogin) {
      saveMemberDetailInSessionStorage(xtoken, userId);
    } else {
      saveMemberDetails(xtoken, userId, firstName, lastName);
    }

    setCookie(COOKIE.MEMBERID_DS, userId, COOKIE.COOKIETIME); // Save member Id in cookie - for DS widget
    setCookie(COOKIE.USERNAME_DS, (firstName + " " + lastName).trim(), COOKIE.COOKIETIME);
    Webengage.webEngageLoggedIn(userId);
  };
  const submitLogin = async (value: LoginState) => {
    const ISDCode = value.ISDCode?.replace("+", "");
    setLocationByISDCode(ISDCode);
    setIsNewUser(false);

    try {
      USER_REDUCER.userMobileNumber = { number: value.mobile, isdCode: ISDCode };
      setInputMobileNumber(value.mobile);
      AdobeSendOTPOnCheckout();

      const otpGenerationResponse = await Auth.generateOTP({
        countryCode: ISDCode,
        mobile: value.mobile,
        isWhatsAppOpted,
        name: value.name,
      });
      const { userExists } = otpGenerationResponse?.data || {};

      // begin registration
      if (!userExists) {
        setIsNewUser(true);
        otpForm.setValue("isNewUser", true);
      }

      // Check for social user
      const isSocialLogin = !!socialData?.id;
      setSocialLogin(isSocialLogin);
      otpForm.setValue("isSocialLogin", isSocialLogin);

      setActiveState(STATES.OTP_VERIFICATION);

      setTimer(30);

      /* call to Web OTP Api function [ auto read sms otp] */
      getWebOTP();
      return;
    } catch (LoginError: any) {
      showError(LoginError?.response?.data?.message || LoginError);
      console.error({ LoginError });
      if (options?.verifiedPhoneNumberPendingLogin && options?.onFailure) {
        options?.onFailure();
        const btn = document.getElementById("codBtn") as HTMLButtonElement;
        if (btn) btn.disabled = false;
      }
    }
  };

  const onSetOTPMetaValues = (metaData: any) => {
    for (const [key, value] of Object.entries(metaData)) {
      // @ts-ignore
      otpForm.setValue(key, value);
    }
  };

  const submitOTP = async (formValues: any) => {
    let verifyData = verifyOTPData.current;
    let consumerId;

    try {
      if (!otpVerified) {
        /**
         * Only Verify OTP once, if user registration fails
         * it should not call otp verification again.
         */
        let verifyOTPConfig: {
          countryCode: string;
          mobile: string;
          otp: string;
          type: string;
          meta?: {
            responseSurveyId: string;
            surveyName: string;
          };
          linkSocial?: string;
          socialId?: string;
        } = {
          countryCode: mobileNumber.isdCode,
          mobile: mobileNumber.number,
          otp: formValues.otp,
          type: "mobile",
        };

        if (responseSurveyId) {
          verifyOTPConfig.meta = { responseSurveyId, surveyName: platform };
        } else if (socialData.id) {
          verifyOTPConfig.linkSocial = "1";
          verifyOTPConfig.socialId = socialData.socialId;
        } else {
          removeLocalStorageValue(LOCALSTORAGE.STOKEN);
        }

        verifyData = await Auth.verifyOTP(verifyOTPConfig);

        // @ts-ignore
        verifyOTPData.current = verifyData;
        const { data } = verifyData;

        if (data?.code === 200) {
          setOtpVerified(true);
          removeLocalStorageValue(LOCALSTORAGE.STOKEN);
        }
        if (!isNewUser) {
          // if preverifyPhoneNumber
          saveMemberDetailHandler(data.token, data.user.id, data.user.firstName, data.user.lastName);
          // only when user is logging on payment mode
          if (options?.verifiedPhoneNumberPendingLogin && !checkIfCodEnabled(data?.user?.meta?.attributes?.isCodEnabled)) {
            // do not call any analytics directly return
            return;
          }

          consumerId = data.user.id;
          if (options.onlyMobileLogin) {
            AdobeSimplifiedLogin("success");
            GA4Event([
              {
                event: "login",
              },
              {
                user_id: data.user.id,
              },
            ]);
          }
        } else {
          sessionStorage.setItem(SESSIONSTORAGE.TEMP_TOKEN, data.token); // store temp token for new user to hit registration api
        }
      }

      /**
       * If user does not exists then register a new consumer
       * with required payload
       */
      if (isNewUser) {
        const { name, email } = formValues;
        if (name && email) {
          submitRegister(formValues);
        } else {
          setActiveState(STATES.NEW_USER_REGISTRATION);
        }
      } else {
        if (!options?.verifiedPhoneNumberPendingLogin) {
          await fetchUserDetails(consumerId, verifyData.data.user);
        } else {
          // since we are not calling fetchUserDetails directly
          handleSocialLoginCompletedAnalytics(socialData, verifyData.data.user);
        }
        setActiveState(STATES.AUTH_COMPLETE);
      }
    } catch (error: any) {
      /**
       * Catch the API failure response and display error message
       */
      if (!otpVerified) {
        otpForm.setError("otp", {
          type: "",
          message: t("invalidOtp"),
        });
      }

      otpForm.setValue("otp", "");

      if (error.response) {
        console.error("auth-error-1", error.response.data.message);
        showError(error.response?.data?.message);
      } else {
        console.error("auth-error-2", error.message);
        showError(error.message);
      }

      if (options.onlyMobileLogin) {
        AdobeSimplifiedLogin("failure");
      } else {
        adobeOTPFailedLoad(profile, "otp");
      }
    }
  };

  const submitRegister = async (values: VerifyState) => {
    let otpVerificationData = verifyOTPData.current;
    let consumerId;
    const type = getClientQueryParam("type");

    try {
      /**
       * If user does not exists then register a new consumer with required payload
       */

      if (isNewUser) {
        const [firstName, lastName] = values.name.trim().split(" ");

        // Create payload for registering a new consumer
        const registerMemberRequestBody: createConsumerPayload = {
          phoneNumber: mobileNumber.number.toString(),
          email: values.email || "",
          parentReferenceCode: values.referralCode.toUpperCase(),
          phoneISO3: location.countryCode,
          firstName,
          lastName: lastName || "",
          location: {
            countryCode: location.countryCode,
            countryName: location.countryName,
            phoneCode: location.phoneCode,
          },
          vendorCode: getVendorCode(),
          meta: {
            registrationInfo: {
              appVersion: `${navigator.appCodeName}/${navigator.appVersion}`,
              deviceType: "Mobile_Website",
              deviceId: "",
              dob: values.dob || "",
            },
            misInfo: {
              gender: values.gender || "",
            },
            simplifiedLogin: options.simplifiedLogin,
            cutThePrice: values?.cutThePrice || false,
            source: values?.source || "",
            sourceSlug: values?.sourceSlug || "",
          },
        };

        /**
         * Set linkSocial and SocialId for New Registration via Social Login
         */
        if (socialData.id) {
          registerMemberRequestBody.linkSocial = "1";
          registerMemberRequestBody.socialId = socialData.socialId;
        }

        /**
         * Set MemberType for Beuty Associate Registration.
         * For Normal User MemberType is automatially set by API
         */
        if (isNewUser && values.isBA) {
          registerMemberRequestBody.memberType = {
            typeName: "beauty associate",
            levelName: "silver",
          };
        }

        /* In Case a Member-Tag is present */
        const memberTags = getMemberTags(options, location);

        if (memberTags.length) {
          registerMemberRequestBody.meta.memberTags = memberTags;
        }

        /* In Case a Login Journey Type Present */
        if (type) {
          registerMemberRequestBody.meta.type = type;
        }

        /* In Case a ResponseSurveyId present */
        if (responseSurveyId) {
          registerMemberRequestBody.meta.responseSurveyId = responseSurveyId;
          registerMemberRequestBody.meta.surveyName = platform;
        }

        /*  In Case user landed through UTM Params */
        if (LOCALSTORAGE.UTM_PARAMS in localStorage) {
          const utmParams = getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true) || {};
          registerMemberRequestBody.meta = {
            ...registerMemberRequestBody.meta,
            ...utmParams,
          };
        }

        const { data: consumer } = await Auth.createConsumer(registerMemberRequestBody);

        saveMemberDetailHandler(consumer.token, consumer.user.id, firstName, lastName);
        // only when user is logging on payment mode
        if (options?.verifiedPhoneNumberPendingLogin && !checkIfCodEnabled(consumer?.user?.meta?.attributes?.isCodEnabled)) {
          // do not call any analytics directly return
          return;
        }

        /**
         * Dispatch Adobe Page Load Event for Registration View
         */
        if (options.onlyMobileLogin) {
          AdobeSimplifiedLogin("registration success");
        } else {
          await setRegistrationAdobePageLoad("success", type, !!socialData.socialId);
        }

        /**
         * Setup GTM WebEngage DataLayer for Registration
         */
        setGTMWebEngageRegistration(consumer, socialData, type, options.memberTag);
        consumerId = consumer.user.id;
        GA4Event([
          {
            event: "sign_up",
          },
          {
            user_id: consumerId,
          },
        ]);

        otpVerificationData.data.user = consumer.user;
      }

      if (!options?.verifiedPhoneNumberPendingLogin) {
        await fetchUserDetails(consumerId, otpVerificationData.data.user);
      } else {
        // since we are not calling fetchUserDetails directly
        handleSocialLoginCompletedAnalytics(socialData, otpVerificationData.data.user);
      }
      setActiveState(STATES.AUTH_COMPLETE);
    } catch (error: any) {
      /**
       * Catch the API failure response and display error message
       */

      // setActiveState(STATES.OTP_VERIFICATION);

      if (isNewUser) {
        if (options.onlyMobileLogin) {
          AdobeSimplifiedLogin("registration failure");
        } else {
          await setRegistrationAdobePageLoad("failure");
        }
      }

      if (error.response) {
        console.error("auth-error-3", error.response.data.message);
        showError(error.response?.data?.message);
      } else {
        console.error("auth-error-4", error.message);
        showError(error.message);
      }
    }
  };

  // ================= SOCIAL LOGIN SECTION ================= //

  /**
   * Social Login handler function
   * @param {Object} payload - Payload data received from Social Platform
   */
  const handleSocialLogin = async (payload: any) => {
    setActiveState(STATES.SOCIAL);

    /**
     * Call /social API with payload from Social login
     * if user has already linked their social account with Myglamm account
     * then we'll get final x-access-token and user profile in response.
     *
     * If user has not linked their social account then we'll receive a temp
     * token that we have to use to register and link the account.
     */
    try {
      const data = await Auth.socialLogin(payload);

      if (!data?.data?.userExists) {
        setSocialData({
          socialId: data.data.social_consumer._id,
          id: payload.id,
          name: payload.name,
          email: payload.email || "",
          type: payload.type || "",
          gender: payload.gender || "",
          dob: payload.dob || "",
        });
        /*  Store the temp token in localstorage then call subsequent API calls with temp token until you get final x-access-token */
        setLocalStorageValue(LOCALSTORAGE.STOKEN, data?.data?.token);
        setActiveState(STATES.SOCIAL_SIGNUP);
      } else {
        /*  If user already linked then save it to localstorage and redux */
        saveMemberDetails(data?.data?.token, data?.data?.user?.id, data?.data?.user?.firstName, data?.data?.user?.lastName);
        addLoggedInUser(data?.data?.user);

        // #region // *WebEngage [10] - Login Completed : Social
        handleSocialLoginCompletedAnalytics(payload, data?.data?.user);

        const consumerId = data.data.user.id;
        fetchUserProfile(consumerId);

        /**
         * If cart merge option is passed then merge the guest and consumer
         * carts and fetch the updated cart.
         */
        if (options?.mergeCart) {
          await mergeCartAfterAuth(consumerId);
        }
        handleSuccessReset();
        setActiveState(STATES.AUTH_COMPLETE);
      }
    } catch (OTPFormError) {
      setActiveState(STATES.LOGIN_USING_INPUT);
      console.error(OTPFormError);
    }
  };

  const handleSuccessReset = () => {
    loginForm.reset();
    otpForm.reset();
    if (options.onSuccess) {
      options.onSuccess();
    }
  };

  /**
   * Resend OTP call
   */
  const handleResendOTP = () => {
    setTimer(30);
    otpForm.clearErrors();
    otpForm.setValue("otp", "");
    Auth.generateOTP({
      countryCode: mobileNumber.isdCode,
      mobile: mobileNumber.number,
      isWhatsAppOpted,
      name: loginForm.getValues("name"),
    });
    /* call to web OTP Api function [ auto read sms otp] */
    getWebOTP();
  };

  /* function for auto read otp [Web OTP API] */
  const getWebOTP = () => {
    if ("OTPCredential" in window) {
      const abort = new AbortController();
      setTimeout(() => {
        // abort after two minutes
        abort.abort();
      }, 2 * 60 * 1000);
      navigator.credentials
        .get({
          signal: abort.signal,
          // @ts-ignore
          otp: { transport: ["sms"] },
        })
        .then((otp: any) => {
          console.log("otpresponse", otp);
          // @ts-ignore
          otpForm.setValue("otp", otp?.code);
          AdobeWebOTPSuccessForGuest();
        })
        .catch((err: any) => {
          console.log("error", err);
        });
    } else {
      console.log("WebOTP not supported!.");
    }
  };

  /* TrueCaller Setup --------*/
  const handleNewUserTC = async (formValues: any, setLogin: () => void) => {
    try {
      const [firstName, lastName] = formValues.name.trim().split(" ");

      const registerMemberRequestBody: createConsumerPayload = {
        phoneNumber: formValues.phoneNumber,
        email: formValues.email || "",
        phoneISO3: location.countryCode,
        parentReferenceCode: (isClient() && (getClientQueryParam("rc") || localStorage.getItem("rc"))) || "",
        firstName,
        lastName: lastName || "",
        location: {
          countryCode: location.countryCode,
          countryName: location.countryName,
          phoneCode: location.phoneCode,
        },
        vendorCode: getVendorCode(),
        meta: {
          registrationInfo: {
            appVersion: `${navigator.appCodeName}/${navigator.appVersion}`,
            deviceType: "Mobile_Website",
            deviceId: "",
            dob: "",
          },
        },
      };
      /**
       * In Case user landed through UTM Params
       */
      if (LOCALSTORAGE.UTM_PARAMS in localStorage) {
        const utmParams = getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true) || {};
        registerMemberRequestBody.meta = {
          ...registerMemberRequestBody.meta,
          ...utmParams,
        };
      }

      const { data: consumer } = await Auth.createConsumer(registerMemberRequestBody);
      AdobeTrueCallerSignupEvent("success");
      saveMemberDetails(consumer.token, consumer.user.id, consumer.user.firstName, consumer.user.lastName);
      await fetchUserDetails(consumer.user.id, consumer.user);
      setIsSpinning(false);
      showSuccess("Login Successful");
      setActiveState(STATES.AUTH_COMPLETE);
    } catch (error) {
      setActiveState(STATES.LOGIN_USING_INPUT);
      setIsSpinning(false);
      setLogin();
      AdobeTrueCallerSignupEvent("failure");
      console.log(error);
    }
  };

  const handleUserExistTC = async (
    data: {
      data: {
        userExists: boolean;
        token: string;
        user: User;
      };
    },
    setLogin: () => void
  ): Promise<void> => {
    if (data?.data?.userExists) {
      try {
        saveMemberDetails(data.data.token, data.data.user.id, data.data.user.firstName, data.data.user.lastName);
        // #region // *WebEngage [10] - Login Completed : Social
        handleSocialLoginCompletedAnalytics(null, data?.data?.user);
        AdobeTrueCallerLoginEvent("success");
        // #endregion *WebEngage [10] - Login Completed
        await fetchUserDetails(data?.data?.user?.id, data?.data?.user);
        showSuccess("Login Successful");
        setActiveState(STATES.AUTH_COMPLETE);
      } catch (error) {
        console.log(error);
        AdobeTrueCallerLoginEvent("failure");
        setActiveState(STATES.LOGIN_USING_INPUT);
        setLogin();
      } finally {
        setIsSpinning(false);
      }
    } else {
      setActiveState(STATES.NEW_USER_REGISTRATION);
      const values: { name: string; email: string; phoneNumber: string } = {
        name: `${data.data.user.firstName} ${data.data.user.lastName}`,
        email: data.data.user.email,
        phoneNumber: data.data.user.phoneNumber,
      };
      if (!options?.verifiedPhoneNumberPendingLogin) {
        setLocalStorageValue(XTOKEN(), data?.data?.token);
      }
      showSuccess("Registering…");
      AdobeTrueCallerRegEvent();
      handleNewUserTC(values, setLogin);
    }
  };

  const verifyTrueCaller = async (requestNonce: string, setLogin: () => void) => {
    try {
      let count = 0;
      const PollDataTC: NodeJS.Timeout = setInterval(async (): Promise<void> => {
        if (count > 5) {
          setActiveState(STATES.LOGIN_USING_INPUT);
          setIsSpinning(false);
          setLogin();
          return clearInterval(PollDataTC);
        }
        count++;
        const data = await Auth.verifyTrueCaller(requestNonce as string);
        if (data?.data?.user?.id) {
          clearInterval(PollDataTC);
          return handleUserExistTC(data, setLogin);
        }
      }, 1500);
    } catch (error) {
      console.error("Truecaller integration ", error);
    }
  };

  const handleTrueCaller = (setLogin: () => void) => {
    //To check if user is IOS user and skip truecaller verification
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) || sessionStorage.getItem("truecaller") === "disable") {
      console.log("TrueCaller Disable");
      return setLogin();
    }
    //requestNonce will be send on callback url
    const requestNonce = uuid4();
    setLocalStorageValue("requestNonce", requestNonce);
    window.location.href = initializeTrueCaller(requestNonce);

    setTimeout(() => {
      if (document.hasFocus()) {
        return setLogin();
      }
      //To Check weather document get focus back
      const checkFocus: any = setInterval(() => {
        if (document.hasFocus()) {
          setActiveState(STATES.TRUECALLER);
          setIsSpinning(true);
          verifyTrueCaller(requestNonce, setLogin);
          AdobeTrueCallerLoadEvent();
          return clearInterval(checkFocus);
        }
      }, 1000);
    }, 300);
  };

  const trueCallerForm = useForm<VerifyTrueCallerState>({
    defaultValues: {
      referralCode: (isClient() && (getClientQueryParam("rc") || localStorage.getItem("rc"))) || "",
    },
    mode: "all",
  });

  /* TrueCaller Setup End---------------------- */
  useEffect(() => {
    if (activeState === STATES.LOGIN_USING_INPUT) {
      setOtpVerified(false);
    }
  }, [activeState]);

  useEffect(() => {
    if (socialData && loginForm.formState.errors.mobile) {
      setSocialLogin(false);
    }
  }, [loginForm]);

  useEffect(() => {
    if (
      otp?.length === 4 &&
      /* Run SumitOTP when onlyMobileLogin not present or present without newUser */
      (!options.onlyMobileLogin || (options.onlyMobileLogin && !isNewUser))
    ) {
      otpForm.handleSubmit(submitOTP)();
    }
  }, [otp]);

  useEffect(() => {
    if (socialData && name === "") {
      otpForm.setValue("name", socialData.name || "");
      otpForm.setValue("email", socialData.email || "");
      otpForm.setValue("gender", socialData.gender || "female");
      otpForm.setValue("dob", socialData.dob || "");
    }
  }, [socialData]);

  /**
   * Timer for OTP
   */
  useEffect(() => {
    let clearTimer: number | NodeJS.Timeout;
    if (timer > 0) {
      clearTimer = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }

    return () => {
      if (typeof clearTimer === "number") {
        clearTimeout(clearTimer);
      }
    };
  }, [timer]);

  /* Reset Mobile Number in case ISD changes */
  useEffectAfterRender(() => {
    if (WatchISDFiled) {
      loginForm.setValue("mobile", "", { shouldValidate: true });
    }
  }, [WatchISDFiled]);

  useEffect(() => {
    const GEO_COUNTRY_ID = isdCodes?.find(x => x.id === countryId)?.countryCode;
    if (GEO_COUNTRY_ID) {
      loginForm.setValue("ISDCode", formatPlusCode(GEO_COUNTRY_ID));
    }
    return () => {
      sessionStorage.removeItem(SESSIONSTORAGE.TEMP_TOKEN); // remove temp token on unmount
    };
  }, []);

  useEffect(() => {
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
    const xtoken = getLocalStorageValue(XTOKEN());

    if ([STATES.LOGIN_USING_INPUT, STATES.SOCIAL, STATES.TRUECALLER].includes(activeState)) {
      removeLocalStorageValue(LOCALSTORAGE.STOKEN);

      if (!memberId || !xtoken) {
        removeLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
        removeLocalStorageValue(XTOKEN());
      }
    }
    if (activeState === STATES.AUTH_COMPLETE && !options?.verifiedPhoneNumberPendingLogin) {
      removeGuestDetailsOnAuthComplete();
    } else if (activeState === STATES.AUTH_COMPLETE && options?.verifiedPhoneNumberPendingLogin && options.onSuccess) {
      options.onSuccess();
    }

    if (activeState === STATES.LOGIN_USING_INPUT && getLocalStorageValue(LOCALSTORAGE.STOKEN)) {
      if (!memberId) {
        setActiveState(STATES.SOCIAL_SIGNUP);
      } else {
        removeLocalStorageValue(LOCALSTORAGE.STOKEN);
      }
    }
  }, [activeState]);

  return {
    loginForm,
    onSubmit: {
      login: submitLogin,
      otp: submitOTP,
      register: submitRegister,
    },
    otpForm,
    handleSocialLogin,
    otpVerified,
    referralValid: false,
    activeState,
    setActiveState,
    state: {
      inputMobileNumber,
      location,
    },
    storeData: {
      socialData,
      mobileNumber,
      profile,
    },
    redirectToURL,
    router,
    timer,
    handleResendOTP,
    isNewUser,
    handleTrueCaller,
    isSpinning,
    trueCallerForm,
    handleNewUserTC,
    isSocialLogin,
    setSocialLogin,
    onSetOTPMetaValues,
  };
}

export default useLogin;
