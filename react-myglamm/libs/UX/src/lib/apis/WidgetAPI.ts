import { SLUG } from "@libConstants/Slug.constant";

import MyGlammAPI from "@libAPI/MyGlammAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { checkBlackListWidgetSlug, checkIfWidgetGroupIsActive } from "@libUtils/widgetUtils";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

// import { IGetBanner } from "@typesLib/MyGlammAPI";

class WidgetAPI extends MyGlammAPI {
  /**
   * Get Widgets
   */
  public getWidgets(where: any, limit = 10, skip = 0) {
    const userSegments = getLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, true);
    if (userSegments?.length) {
      where.where.tag = userSegments;
    }
    /* Without slug widget api call doesn't work so added extra check  */
    const slug = where?.where?.slugOrId;
    if (!FEATURES.disableBlacklistWidget) {
      if (!slug) {
        console.log("SlugId not found");
        return Promise.resolve({ data: {} });
      }
      const isWidgetGroupActive = checkIfWidgetGroupIsActive(slug);

      if (slug !== SLUG().GLAMM_STUDIO && !isWidgetGroupActive) {
        console.log(`Widget Group is inactive or deleted - ${slug}`);
        return Promise.resolve({ data: {} });
      }
    }

    return this.myGlammV2.get(
      `/search-ms/widget?filter=${encodeURIComponent(JSON.stringify(where))}&limit=${limit}&skip=${skip}`,
      {
        headers: { apikey: true },
      }
    );
  }

  /**
   * Get Home Widgets
   */
  public getHomeWidgets(where: any, limit = 10, skip = 0, isLoggedIn: boolean, orderBySegment: string = "") {
    const slug = where?.where?.slugOrId;
    /* Without slug widget api call doesn't work so added extra check  */
    if (!FEATURES.disableBlacklistWidget) {
      if (!slug) {
        console.log("SlugId not found");
        return Promise.resolve({ data: {} });
      }
      const isWidgetGroupActive = checkIfWidgetGroupIsActive(slug);

      if (!isWidgetGroupActive) {
        console.log(`Widget Group is inactive or deleted - ${slug}`);
        return Promise.resolve({ data: {} });
      }
    }

    return this.myGlammV2.get(
      `/search-ms/widget?filter=${encodeURIComponent(
        JSON.stringify(where)
      )}&limit=${limit}&skip=${skip}&isLoggedIn=${isLoggedIn}${
        orderBySegment && `&orderBySegment=${encodeURIComponent(orderBySegment)}`
      }`,
      { headers: { apikey: true } }
    );
  }

  /**
   * Get offers for Top Banner in layout
   */
  public getTopBannerOffers() {
    const slug = SLUG().OFFER_TEXT_EN;

    return this.myGlammV2.get(`/search-ms/widgetGroups/${slug}`, { headers: { apikey: true } });
  }

  /**
   * Lookbook Page
   * @returns Array of Lookbooks Categories
   */
  public getLooksCategories() {
    return this.myGlammV2.post(`/search-ms/indices/search/lookbook-category`, {}, { headers: { apikey: true } });
  }

  /**
   * Get Sub-Category of LookBook
   * @param categoryId {string}
   * @param skip {number}
   */
  public getLooksSubcategory(categoryId: string, skip = 0) {
    return this.myGlammV2.post(
      `/search-ms/indices/search/lookbook`,
      {
        limit: 20,
        skip,
        order: ["createdAt DESC"],
        ...(categoryId ? { where: { categoryId } } : {}),
      },
      { headers: { apikey: true } }
    );
  }

  /**
   * Get recommended looks for current looks page
   * @param id -{ String } - Id of look
   * @param categoryId - { String } - Id of Sub Category
   */
  public getRecommendedLooks(id: string, categoryId: string) {
    return this.myGlammV2.post(
      `/search-ms/indices/search/lookbook`,
      {
        limit: 10,
        where: { id: { neq: id }, categoryId },
      },
      { headers: { apikey: true } }
    );
  }

  /**
   * Get Looks page
   * @param slug - String Slug of looks page
   */
  public getLooksBySlug(slug: string) {
    return this.myGlammV2.post(
      `/search-ms/indices/search/lookbook?getRelationalData=true`,
      {
        where: { "urlShortner.slug": slug },
      },
      { headers: { apikey: true } }
    );
  }

  /**
   * Get Lipstick Shades Data
   */
  public getLipStickShades() {
    return this.myGlammV2.post(
      `/search-ms/indices/search/shade-finder`,
      {
        where: {
          category: "lips",
        },
        limit: 30,
        offset: 0,
      },
      { headers: { apikey: true } }
    );
  }

  /**
   * Get Active Offers Data
   */
  public getOfferCategories() {
    return this.myGlammV2.get(`search-ms/offerCategories`, {
      headers: { apikey: true },
    });
  }

  /**
   * Get Offers List
   * @param ids {Array}
   * @param offset {number}
   */
  public getOffers(ids: string[], offset: number) {
    const filter = {
      limit: 10,
      skip: offset,
      where: {
        categoryId: ids,
      },
    };
    return this.myGlammV2.get(`search-ms/offers?filter=${JSON.stringify(filter)}`, { headers: { apikey: true } });
  }

  public getPhotoSlurp(params: string, page = 1) {
    return this.myGlammV2.get(`communication-ms/photoslurp${params}&page=${page}`, { headers: { apikey: true } });
  }

  /**
   * Get Reminder Widget Data
   */
  public getReminderWidget(params: any) {
    const paramsData = JSON.parse(params);
    return this.myGlammV2.get(`${paramsData?.url}`, { headers: { apikey: true } });
  }

  /**
   * Get Discount Offer
   */
  public getOfferDiscount(memberId: any, offset: number) {
    const limit = 10;
    const skip = offset;

    return this.myGlammV2.get(
      `/search-ms/member/discounts?searchText=${memberId}&limit=${limit}&skip=${skip}&sortDiscount=MGXO500,MGXO300,MGXO499&active=true&expiry=false&available=true`
    );
  }

  /**
   * Get Scratch Card and Exclusive Offers Data
   */
  public getReminderWidgetData(url: any) {
    return this.myGlammV2.get(`/search-ms/exclusiveOffers`, { headers: { apikey: true } });
  }

  /**
   * Dynamic Get Call Used by Widgets to hit any route
   */
  public dynamicG3Call(url: string) {
    return this.myGlammV2.get(url.replace("{{memberId}}", checkUserLoginStatus()?.memberId));
  }

  public getSkinProblemProducts(urlArray: any) {
    return urlArray.map((where: any) => {
      return this.myGlammV2.get(`/search-ms/products/skin/problems?filter=${JSON.stringify(where)}&limit=10&skip=0`, {
        headers: { apikey: true },
      });
    });
  }
}

export default WidgetAPI;
