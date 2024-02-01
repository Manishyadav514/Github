import axios from "axios";
import axiosRetry from "axios-retry";

import { SHOP } from "@libConstants/SHOP.constant";

import { isClient } from "@libUtils/isClient";
import { getVendorCode } from "@libUtils/getAPIParams";

import MyGlammAPI from "../MyGlammAPI";

class ConstantsAPI extends MyGlammAPI {
  /**
   * Get all the Countries In Which the Vendor is applicable
   * @returns Array of Countries Possible
   */
  public getCountrySelections() {
    const a = axios.create();
    if (isClient()) {
      axiosRetry(a, {
        retries: 5,
        retryDelay: x => {
          return x * 750;
        },
        onRetry: (retryCount, error, requestConfig) => {
          // console.error(`Retry No. ${retryCount}: ${requestConfig.method} ${requestConfig.url}`);
        },
      });
    }

    return a.get(
      `${process.env.NEXT_PUBLIC_APIV2_URL}/location-ms/g3CountrySelections${SHOP.ENABLE_LIVE_API ? "Live" : ""}?vendorCode=${
        MyGlammAPI.Filter.APIVendor
      }`,
      {
        headers: { apikey: MyGlammAPI.API_KEY },
      }
    );
  }

  /**
   * Get Countries Basic Info
   * @returns Array of All Countries with isd code and all
   */
  public getCountryByLabel(defaultCountryId: string) {
    return this.myGlammV2.get(
      `/location-ms/g3CountryLanguageDetails${SHOP.ENABLE_LIVE_API ? "Live" : ""}?defaultCountryId=${defaultCountryId}`
    );
  }

  /**
   * Get Config Based on Country - Vendor - Language
   * @returns Array key-pair values
   */
  public getConfig(identifier = "globalV3") {
    return this.myGlammV2.get(`/configuration-ms/v3/config?identifierFilter=${identifier}`, {
      headers: { apikey: true },
    });
  }

  /**
   * Get Active Widget Group Slugs
   * @returns Array values
   */

  public getActiveWidgetGroupSlugs(platform: string) {
    return this.myGlammV2.get(`/search-ms/widgetGroups/slug?source=${platform}`, {
      headers: { apikey: true },
    });
  }

  /**
   * Get Navigations Widgets
   * @param slug {String} - Slug Name for Navigation
   * @returns Array of Items along with sub-categories
   */
  public getNavigation(slug: string | string[]) {
    if (Array.isArray(slug)) {
      return this.myGlammV2.get(
        `/navigation-ms/navigations?filter={"where":{"slug": { "inq": ${JSON.stringify(slug)}}, "statusId": 1}}`
      );
    }

    return this.myGlammV2.get(`/navigation-ms/navigations?filter={"where":{"slug": "${slug}", "statusId": 1}}`);
  }

  /**
   * Store Locator - Get list of all cities
   */
  public getstoreLocator() {
    return this.myGlammV2.get(`/store-locator-ms/getList/cityName/${MyGlammAPI.Filter.APIVendor}`);
  }

  /**
   * Get Store List for City
   * @param query -{String}
   */
  public getFilterStoreLocator(query: string) {
    const payload = {
      order: ["createdAt DESC"],
      where: {
        and: [
          { statusId: { in: [0, 1] } },
          { vendorCode: getVendorCode() },
          {
            or: [{ pincode: "" }, { cityName: query }],
          },
        ],
      },
    };
    return this.myGlammV2.get(`/store-locator-ms/stores/list?filter=${JSON.stringify(payload)}`);
  }

  /**
   * Update user Info
   * @param date -{Date}
   * @param id -{string} - MemberId of User
   */
  public birthdayGlammPoints(date: any, id: string) {
    return this.myGlammV2.put(`/members-ms/member/${id}`, {
      dob: date,
    });
  }

  public dynamicG3Call(url: string) {
    return this.myGlammV2.get(url);
  }
}

export default ConstantsAPI;
