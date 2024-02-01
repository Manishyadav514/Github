import MyGlammAPI from "../MyGlammAPI";

import { Filter } from "@typesLib/MyGlammAPI";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { getVendorCode } from "@libUtils/getAPIParams";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

class ProductAPI extends MyGlammAPI {
  /*
   * Api For URL/product/[slug]
   */

  public getProduct(where: any, skip?: number, include?: any, price?: any, shades: boolean = false) {
    const filter = {
      limit: 50,
      skip,
      where,
      include,
      price,
    };
    return this.myGlammV2.get(
      `/search-ms/indices/search/products?getRelationalData=true&getDeepNestedRelations=true&filter=${JSON.stringify(
        filter
      )}&shades=${shades}&content=${IS_DESKTOP ? "old" : "both"}`,
      { headers: { apikey: true } }
    );
  }

  public getProductShades(_: string, where: any, skip?: number, include?: any, price?: any, limit = 100) {
    const filter = {
      limit,
      skip,
      where,
      include,
      price,
      order: ["productMeta.customSKUSortOrder asc"],
    };
    return this.myGlammV2.get(
      `/search-ms/indices/search/products?getRelationalData=true&getDeepNestedRelations=true&filter=${JSON.stringify(filter)}`,
      { headers: { apikey: true } }
    );
  }

  public getUpsell(where: any, price?: any) {
    return this.myGlammV2.post(
      `/product-catalog-ms/categories/products`,
      {
        where,
        price,
      },
      { headers: { apikey: true } }
    );
  }

  /**
   * Api For getRatings on PDP Page
   * @Params
   * Id = Product hashCode,
   * type = Product / lookbook / etc...
   * vendorCode = country based code [eg. mgp for India]
   */
  public getavgRatings = (id: string, type: string) =>
    this.myGlammV2.get(`/customer-reviews-ms/reviews/item/${id}/${type}/avgRating`, { headers: { apikey: true } });

  public getAvgRatingsByProductTag = (productTag: string) => {
    return this.myGlammV2.get(
      `/customer-reviews-ms/item/avgRating?itemType=product&itemTag=${encodeURIComponent(productTag)}`,
      {
        headers: { apikey: true },
      }
    );
  };

  public getsubRatings = (id: string) =>
    this.myGlammV2.get(`customer-reviews-ms/subRating/item/${id}`, { headers: { apikey: true } });

  public getReviews(filter: Filter) {
    return this.myGlammV2.get(`/customer-reviews-ms/v2/activeReviews?filter=${JSON.stringify(filter)}&userAttributes=true`);
  }

  public createReviews = (body: any) =>
    this.myGlammV2.post(`/customer-reviews-ms/reviews?getRelationalData=true&getDeepNestedRelations=true`, body);

  public createQuestion = (body: any) => this.myGlammV2.post(`/post-ms/productQuestion?`, body);

  public getQuestions(where: any, limit = 5, skip = 0) {
    const url = `/search-ms/productQuestion/feed?filter=${encodeURIComponent(
      JSON.stringify({
        where,
        limit,
        skip,
      })
    )}`;
    return this.myGlammV2.get(url, { headers: { apikey: true } });
  }

  public uploadImage(body: any) {
    const url = `/image-ms-v2/services/upload?upload_flag=true&flag=1&sizes=200x200,400x400,600x600,1200x1200`;
    return this.myGlammV2.post(url, body, { timeout: 0 });
  }

  public uploadVideo(body: any) {
    const url = `/image-ms-v2/services/upload/video?upload_flag=true&flag=1&sizes=200x200,400x400,600x600,1200x1200`;
    return this.myGlammV2.post(url, body, { timeout: 0 });
  }

  /*
   *Api for getLook on Pdp Page
   * @params productId in where{}
   */
  public getLooks = (country: string, where: any) => {
    const filter = {
      where,
    };
    return this.myGlammV2.get(
      `/search-ms/indices/search/lookbook?productMeta.displaySiteWide=true&filter=${JSON.stringify(filter)}`,
      {
        headers: { apikey: true },
      }
    );
  };

  /**
   * Add Product To Cart
   */
  public addtoCart = (payload: any) => {
    const shippingDetailsForInternationalProduct = getSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS, true);
    return this.myGlammV2.post(`/cart-manager-ms/add?checkForAutoApplyDiscounts=false`, {
      ...payload,
      ...(shippingDetailsForInternationalProduct?.pincode ? { pincode: shippingDetailsForInternationalProduct?.pincode } : {}),
    });
  };

  /**
   * Get Realtie stock of product by SKU
   */
  public getProductStock = (sku: string) => this.myGlammV2.get(`/wms-ms/sku/stock?sku=${sku}`);

  /**
   * Get Aggregrate Shades Based on the productTag
   */
  public getAggregateShades(productTag: any) {
    return this.myGlammV2.get(`/search-ms/aggregate/shades?productTag=${productTag}`, {
      headers: { apikey: true },
    });
  }
  /*Get Good Points Earn on PDP  */
  public getGPOnPDP(data: { unitPrice: number; id: string; isGuestUser: boolean }) {
    return this.myGlammV2.post("/members-ms/members/productsCommissionEarnings", data);
  }

  /*Get Decoy pricing on PDP  */
  public getDecoyPricingOnPDP(productSKU: string, segment: string = "default", dynamicOffers: boolean) {
    let input = `productSKU=${encodeURIComponent(productSKU)}`;
    if (checkUserLoginStatus()?.memberId) {
      input += `&identifier=${checkUserLoginStatus()?.memberId}`;
    }
    // dynamic offers flag based on A/B
    input += `&dynamicOffers=${dynamicOffers}`;
    const url = `/cart-manager-ms/subscriptions/offers?${input}&key=${segment}`;
    return this.myGlammV2.get(url);
  }

  /* Get Shades for Combo Product  */
  public getComboShades(sku: string, productId: string) {
    return this.myGlammV2.get(`/search-ms/childProduct?sku=${sku}&selectedProductId=${productId}`, {
      headers: { apikey: true },
    });
  }

  /* Get Shades for Combo Product  */
  public getViewSimilarOOSProduct(sku: string, discountCode: string) {
    return this.myGlammV2.get(
      `/dump-ms/dump?key=oosProductReco&identifier=${sku}${discountCode && `&discountCode=${discountCode}`}`,
      {
        headers: { apikey: true },
      }
    );
  }

  /* Get Review Questions */
  public getReviewQuestions() {
    return this.myGlammV2.get(
      `/customer-profile-ms/questionnaire?filter=${JSON.stringify({
        tag: "PDPCustomerReviews",
        status: 1,
        vendorCode: getVendorCode(),
      })}`,
      {
        headers: { apikey: true },
      }
    );
  }
}

export default ProductAPI;
