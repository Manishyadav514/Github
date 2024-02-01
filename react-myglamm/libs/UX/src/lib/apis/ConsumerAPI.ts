import MyGlammAPI from "../MyGlammAPI";
import { getVendorCode } from "@libUtils/getAPIParams";

import { ProfileUpdatePyload } from "@typesLib/Consumer";
import { AddAddressPayload, communicationPreference, CustomerProfileData, EditAddressPayload } from "@typesLib/MyGlammAPI";
import { LanguageFilter } from "@typesLib/APIFilters";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

class ConsumerAPI extends MyGlammAPI {
  /**
   * User profile
   * @returns
   */
  public getProfile(identifier: string) {
    return this.myGlammV2.get(`/members-ms/members/${identifier}?b=true`);
  }

  /**
   * Update User profile
   * @returns
   */
  public updateProfile(identifier: string, updatedProfile: ProfileUpdatePyload) {
    return this.myGlammV2.put(`/members-ms/member/${identifier}`, updatedProfile);
  }

  public updateProfilePatch(identifier: string, updatedProfile: any) {
    return this.myGlammV2.patch(`/members-ms/members/${identifier}`, updatedProfile);
  }

  public updateUserLangPreference(currentLanguage: LanguageFilter) {
    return this.myGlammV2.put(`https://mag.myglamm.net/members-ms/member/updateLanguage/${checkUserLoginStatus()?.memberId}`, {
      currentLanguage,
    });
  }

  /**
   *  Get User Address
   *  @returns User Address
   */
  public getAddress(where: any, skip = 0, limit = 10) {
    const filter = {
      where,
      limit,
      skip,
      order: ["createdAt DESC"],
    };

    return this.myGlammV2.get(`/members-ms/membersAddresses?filter=${JSON.stringify(filter)}`);
  }

  /**
   * Delete Address Based on Id
   */
  public deleteAddress(id: string) {
    return this.myGlammV2.delete(`/members-ms/membersAddresses/${checkUserLoginStatus()?.memberId}/${id}`);
  }

  /**
   *  Get User Address
   *  @returns User Address
   */
  public getCityDetails(pinCodes: Array<string>) {
    return this.myGlammV2.get(`/location-ms/pincode/details?filter={"where":{"pincodes":["${pinCodes}"]}}`);
  }

  public getAddressCountryList() {
    return this.myGlammV2.get(`/location-ms/getCountryList`);
  }

  /**
   * Get All the ciities mapped to the country
   * @param countryId
   * @returns Array of Cities
   */
  public getAllCities(countryId: number) {
    return this.myGlammV2.get(`/location-ms/cities?filter={"where":{"countryId": ${countryId}}}`);
  }

  /**
   *  Get User Address
   *  @returns User Address
   */
  public addAddress(payload: AddAddressPayload) {
    const data: AddAddressPayload = {
      defaultFlag: "false",
      meta: {
        appVersion: `${navigator.appCodeName}/${navigator.appVersion}`,
        deviceType: "Mobile_Website",
        deviceId: "",
      },
      ...payload,
    };
    return this.myGlammV2.post(`/members-ms/membersAddresses`, data);
  }

  /**
   *  Edit User Address
   *  @returns User Address
   */
  public editAddress(payload: EditAddressPayload) {
    const data: EditAddressPayload = {
      defaultFlag: "false",
      ...payload,
      meta: {
        appVersion: `${navigator.appCodeName}/${navigator.appVersion}`,
        deviceType: "Mobile_Website",
        deviceId: "",
        source: "",
      },
    };

    return this.myGlammV2.put(`/members-ms/membersAddresses/${payload.id}`, data);
  }

  /**
   *  Edit User Address
   *  @returns User Address
   */
  public getRequiredAddressFields() {
    return this.myGlammV2.get("/members-ms/membersAddress/config");
  }

  /**
   * NotificationSettings
   * @returns
   */
  public communicationPrefernce(data: communicationPreference, id: string) {
    return this.myGlammV2.put(`/members-ms/updateCommunicationsData/${id}`, data);
  }

  /** Get Questions for customer prefrence
   *  @returns Questions
   */
  public getQuestionnaire() {
    return this.myGlammV2.get(
      `/customer-profile-ms/questionnaire?filter:{"tag":"myprofile","status":"1","vendorCode": ${MyGlammAPI.Filter.APIVendor}}`
    );
  }

  /** Get Answers of customer prefrence
   *  @returns Order details
   */
  public getAnswers(consumerId: any) {
    return this.myGlammV2.get(`/customer-profile-ms/questionnaireAnswer?identifier=${consumerId}&tag=myprofile&version=v2`);
  }

  /**
   * Create Answers for user if answer doesn't exists
   * @param payload - Payload Data
   */
  public setCustomerProfile(payload: CustomerProfileData) {
    return this.myGlammV2.post(`/customer-profile-ms/questionnaireAnswer?tag=myprofile&version=${getVendorCode()}`, payload);
  }

  /**
   * Update Customer Prefrence
   * @param id {string} - QuestionAnswerId
   * @param data {}Object - updated Answers
   */
  public updateCustomerProfile(id: string, data: CustomerProfileData) {
    return this.myGlammV2.patch(
      `/customer-profile-ms/questionnaireAnswer/${id}?tag=myprofile&version=${getVendorCode()}`,
      data
    );
  }

  /**
   * Get Dashborad info of User
   * @param consumerId -{string}
   */
  public getConsumerDashBoard(consumerId: string, directChild = false) {
    return this.myGlammV2.get(`/members-ms/members/${consumerId}/referrals?getDirectChild=${directChild}`);
  }

  public getRefferralCoupons(id: string) {
    return this.myGlammV2.get(`/members-ms/members/${id}/unused-referral-coupons`);
  }

  /**
   * Sync User Contacts and Post Data in Backend
   */
  public syncUserContacts(payload: any) {
    return this.myGlammV2.post("/members-ms/sync-contacts", payload);
  }

  /**
   * Give Free MyGlammPOINTS on successful sharing on FaceBook
   * @param payload {*}
   */
  public freeGlammPoint(payload: any) {
    const data = {
      ...payload,
      vendorCode: MyGlammAPI.Filter.APIVendor,
    };
    return this.myGlammV2.post(`/share-and-earn-ms/credit/points`, data);
  }

  /**
   * Get Survey Member Type for User
   * @param surveyName - Name of the Active Survey
   * @param memberId - Identifier of the User
   */
  public getSurveyMemberType(surveyName: string, memberId: string) {
    return this.myGlammV2.get(`/worker-ms/surveyMemberType?surveyName=${surveyName}&identifier=${memberId}`);
  }

  /**
   * Get Rewards after completing surveys
   * @param memberId ={string}
   */
  public getSurveyRewards(memberId: string, surveyName: string) {
    const data = {
      vendorCode: MyGlammAPI.Filter.APIVendor,
      surveyName,
      identifier: memberId,
      language: MyGlammAPI.Filter.LanguageFilter,
      country: MyGlammAPI.Filter.CountryFilter,
    };

    return this.myGlammV2.post(`/share-and-earn-ms/survey/validate`, data);
  }

  public outSideDelivery(payload: any) {
    const data: AddAddressPayload = {
      ...payload,
    };

    return this.myGlammV2.post(`/order-ms/internationalShipping`, data);
  }

  public getDump(key: string, identifier: string) {
    return this.myGlammV2.get(`/dump-ms/dump?key=${key}&identifier=${identifier}`);
  }

  public getDumpV2(key: string[], identifier: string) {
    const filter = { where: { identifier, key: { inq: key } } };
    return this.myGlammV2.get(`/dump-ms/dumpsData?filter=${JSON.stringify(filter)}`);
  }

  /* Used for Personlaisation Dump data for Guest Specifically */
  public getGuestDump(identifier: string) {
    return this.myGlammV2.get(`/dump-ms/guestDump/mcvid/${identifier}`);
  }

  public postDump(data: any) {
    const payload = [
      {
        ...(data[0] || {}),
        vendorCode: MyGlammAPI.Filter.APIVendor,
        country: MyGlammAPI.Filter.CountryFilter,
        language: MyGlammAPI.Filter.LanguageFilter,
      },
    ];

    return this.myGlammV2.post(`/dump-ms/dump/survey`, payload);
  }

  public getFirebaseToken(identifier: string) {
    return this.myGlammV2.get(`/worker-ms/customToken/${identifier}`);
  }

  public postQuestionsToFirebase(data: any, identifier: any) {
    return this.myGlammV2.post(`/worker-ms/member/${identifier}/askMeHow/question`, data);
  }

  public checkCouponUsed(userId: string, couponCode: string) {
    const where = { userId, couponCode, statusId: 1, vendorCode: getVendorCode() };

    return this.myGlammV2.get(`/discount-v2-ms/v1/discountLogs/memberSpecific/usageCount?where=${JSON.stringify(where)}`);
  }
  // PDP Dynamic Offer
  public dynamicOffer(productId: string, memberId: string) {
    return this.myGlammV2.get(
      `/discount-v2-ms/v1/discounts/recommendCouponForPDP?&productId=${productId}&memberId=${memberId}`
    );
  }

  // PDP DS Powered Personalised Dynamic Offer
  public DSPersonalisedDynamicOffer(identifier: string, key: string = "pdpOfferPersonalization") {
    return this.myGlammV2.get(`/dump-ms/dump?&identifier=${identifier}&key=${key}`, { headers: { apikey: true } });
  }

  // AB Partnership Coupon for PDP and Collection
  public getCouponAPIData = (productId: any, coupon: string) => {
    const memberId = checkUserLoginStatus()?.memberId;
    return this.myGlammV2.get(
      `/discount-v2-ms/v1/discounts/partnershipDiscount?productId=${productId}&couponCode=${coupon}${
        memberId ? `&memberId=${memberId}` : ""
      }`
    );
  };
}

export default ConsumerAPI;
