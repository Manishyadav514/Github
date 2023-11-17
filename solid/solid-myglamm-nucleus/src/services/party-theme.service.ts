import { API_CONFIG, API_ENDPOINT } from "@constants/api.constant";
import NucleusAPI from "./nucleusAPI";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { getLocalStorageValue } from "@/utils/localStorage";

class PartyThemeAPI extends NucleusAPI {
  public fetchAllTheme(
    vendorCode: string,
    page: number = 1,
    limit: number = API_CONFIG.pageSize,
    order: string[] | string = ["createdAt DESC"],
    country: string = "IND",
    inq: number[] | string[],
    where?: object,
    include?: string[]
  ) {
    const secure_token = getLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN) || "";
    let config = {
      headers: {
        "x-access-token": secure_token
      }
    };
    const skip = (page - 1) * limit;
    const statusId = { inq };

    const requestPayload = {
      limit,
      order: [order],
      skip,
      where: {
        country,
        statusId,
        vendorCode
      }
    };

    const value = {
      limit: 10,
      order: ["createdAt DESC"],
      skip: 0,
      where: {
        ...where,
        country: "IND",
        statusId: {
          inq: [1, 0]
        },
        vendorCode: "mgp"
      }
    };

    return this.NucleusAPI.post<any[]>(
      API_ENDPOINT.partyTheme.fetchAll,
      {
        ...requestPayload
      },
      config
    );
  }

  public sendMFAOTP(
    vendorCode: string,
    countryFilter: string = "IND",
    languageFilter = "EN",
    mfaModule: string = "party theme"
  ) {
    const filter = {
      vendorCode,
      countryFilter,
      languageFilter
    };

    return this.NucleusAPI.post<any[]>(
      API_ENDPOINT.otpVerification.sendMFAOTP,
      { mfaModule },
      {
        params: filter
      }
    );
  }

  public verifyMFAOTP(
    vendorCode: string,
    countryFilter: string = "IND",
    languageFilter = "EN",
    mfaModule: string,
    uuid: string,
    otp: number | string
  ) {
    const filter = {
      vendorCode,
      countryFilter,
      languageFilter
    };

    const requestPayload = {
      mfaModule,
      uuid,
      otp
    };

    return this.NucleusAPI.post<any[]>(
      API_ENDPOINT.otpVerification.verifyMFAOTP,
      { ...requestPayload },
      {
        params: filter
      }
    );
  }
}

export default PartyThemeAPI;
