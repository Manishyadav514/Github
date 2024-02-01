import MyGlammAPI from "../MyGlammAPI";

import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { getLocalStorageValue } from "@libUtils/localStorage";

import { createConsumerPayload, SocialPayload, VerifyOTPParams } from "@typesLib/MyGlammAPI";
import { isClient } from "@libUtils/isClient";
import { v4 as uuid4 } from "uuid";

/**
 * AuthAPI Class
 * @extends MyGlammAPI
 */
class AuthAPI extends MyGlammAPI {
  /**
   * Generate OTP with V2 API
   * @param params countryCode :string, mobileNumber: string
   */
  public generateOTP(params: { countryCode: string; mobile: string; name: string; isWhatsAppOpted?: boolean }) {
    return this.myGlammV2.post(
      `/loginFallback`,
      {
        ...params,
        vendorCode: MyGlammAPI.Filter.APIVendor,
      },
      { params: { rcAction: "sendOtp", rcApi: "/v6/otp/generate" } } // reCaptcha Triggered
    );
  }

  /**
   * Verify OTP V2
   * @returns
   */
  public async verifyOTP(params: VerifyOTPParams) {
    return this.myGlammV2.post(
      "/members/login",
      {
        ...params,
        vendorCode: MyGlammAPI.Filter?.APIVendor,
      },
      { params: { rcAction: "verifyOtp", rcApi: "/v6/members/login" } }
    );
  }

  /**
   * Register New Consumer
   */
  public createConsumer(payload: createConsumerPayload) {
    let _eventID = "";

    if (isClient()) {
      const fbEventID = uuid4();
      sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, fbEventID);
      if (fbEventID) {
        _eventID = "?eventID=" + fbEventID;
      }
    }

    return this.myGlammV2.post(`/members/registration${_eventID}`, payload, {
      headers: { ...this.HEADERS, "x-access-token": sessionStorage.getItem(SESSIONSTORAGE.TEMP_TOKEN) },
    });
  }

  /**
   * Check if Referral Code is valid or not before registering user.
   * @param referralCode {string} - Referral Code
   */
  public validateReferralCode(referralCode: string) {
    return this.myGlammV2.get(`/members-ms/members/checkReference/${referralCode}`);
  }

  /**
   * Login with social account (Facebook, Google)
   */
  public socialLogin(payload: SocialPayload) {
    return this.myGlammV2.post(`/members/social`, payload);
  }

  /**
   * Get Consumer Wallet Info
   * @param id {string} MemberId of user
   */
  public getConsumerWallet(id: string) {
    return this.myGlammV2.get(`/wallet-ms/wallet/consumerWalletDetail?filter={"where":{"identifier":"${id}"}}`);
  }

  /* Truecaller verification  */
  public verifyTrueCaller(requestNonce: string) {
    return this.myGlammV2.post(`/verifyTruecaller`, {
      requestId: requestNonce,
    });
  }

  /**
   * Token HandShake
   * Enables Cross Domain Login
   */
  public tokenHandShake() {
    return this.myGlammV2.post("/tokenHandshake", { idToken: getLocalStorageValue(LOCALSTORAGE.CORS_TOKEN) });
  }

  public getClientAuthToken = (payload: { memberId: string; mobileNumber: string; memberCountry: string }) => {
    return this.myGlammV2.post(`/payment-v2-ms/v1/juspay/getUserToken`, payload);
  };
}

export default AuthAPI;
