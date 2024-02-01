import { checkUserLoginStatus, getCartIdentifier, getCouponandPoints, getIgnoredCoupon } from "@checkoutLib/Storage/HelperFunc";
import { SHOP } from "@libConstants/SHOP.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { isClient } from "@libUtils/isClient";
import { getSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";
import { v4 as uuid4 } from "uuid";

import MyGlammAPI from "../MyGlammAPI";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import Router from "next/router";

class CartAPI extends MyGlammAPI {
  checkoutParam: string;

  constructor() {
    super();

    this.checkoutParam = "?isGlammPointProgramm=true&missingProductFreeProducts=true&checkForAutoApplyDiscounts=true";
  }

  /* Generating Parmas for cart-ms based on the coupon and glammpoints */
  private generateParams(checkoutPages = true) {
    const { coupon, gp } = getCouponandPoints();

    let params = "";
    if (checkoutPages) {
      params = `${this.checkoutParam}&glammPointsFlag=true&maxGlammPoints=${gp || 0}`;

      if (coupon) params = `${params}&coupon=${coupon}`;
    }

    return params;
  }

  /* Generating Parmas for cart-ms based on the coupon and glammpoints */
  private getCityId() {
    if (
      isClient() &&
      location.pathname.match(/payment|address|Address|order-summary/) &&
      SESSIONSTORAGE.CITY_ID in sessionStorage
    ) {
      return JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.CITY_ID)!);
    }

    return undefined;
  }

  private getUpsellParams(
    lowerCogsVariant?: string,
    giftCardUpsellVariant?: string,
    warehouseVariant?: string,
    upsellComboVariant?: string
  ) {
    let paramsList = [];

    if (Router.pathname === "/payment") paramsList.push("upsellProductPayment=1");
    else paramsList.push("upsellProductPayment=0");

    if (lowerCogsVariant && lowerCogsVariant !== "no-variant") paramsList.push(`lowerCogsVariant=${lowerCogsVariant}`);

    // if (giftCardUpsellVariant && giftCardUpsellVariant !== "no-variant") {
    //   if (giftCardUpsellVariant === "2" && Router.pathname === "/shopping-bag") paramsList.push(`showGiftCard=1`);
    //   else if (giftCardUpsellVariant === "2" && Router.pathname === "/payment") paramsList.push(`showGiftCard=2`);
    //   else paramsList.push(`showGiftCard=${giftCardUpsellVariant}`);
    // }

    if (giftCardUpsellVariant && giftCardUpsellVariant !== "no-variant") {
      if (giftCardUpsellVariant === "1" && Router.pathname === "/payment") paramsList.push(`showGiftCard=2`);
      else paramsList.push(`showGiftCard=${giftCardUpsellVariant}`);
    }

    if (warehouseVariant && warehouseVariant !== "no-variant") {
      setSessionStorageValue(SESSIONSTORAGE.WAREHOUSE_VARIANT, warehouseVariant);
      paramsList.push(`warehouseVariant=${warehouseVariant}`);
    }

    if (upsellComboVariant && upsellComboVariant !== "no-variant") {
      setSessionStorageValue(SESSIONSTORAGE.UPSELL_COMBO_VARIANT, upsellComboVariant);
      paramsList.push(`upsellComboVariant=${upsellComboVariant}`);
    }

    return paramsList.join("&");
  }

  /* ----------------------------------------------------------------------------------------- */

  /**
   * Merge Guest User Cart with LoggedIn user's Cart
   * @param userId - Consumer MemberId
   * @param guestId - Guest CartId
   */
  public mergeCart(userId: string, guestId: any) {
    return this.myGlammV2.post("/cart-manager-ms/merge", { userId, guestId });
  }

  /**
   * Get Call to get the count of proucts(All) in cart based on identifier
   * @returns No Of Product in User Cart
   */
  public getCount() {
    return this.myGlammV2.get(`/cart-v2-ms/member/${getCartIdentifier()}/productCount`);
  }

  /**
   * Post Call to Update Checkout/Cart Based on Coupons/Glammpoints
   * @returns Checkout Data
   */
  public updateCart(coupon?: string, maxGlammPoints = 0, pincode?: string, showAutoApplyInvalidCouponMessage = false) {
    const addressCountryDetail = getSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS, true);
    return this.myGlammV2.post(`/cart-manager-ms/checkout${this.checkoutParam}`, {
      coupon,
      ...(pincode ? { pincode: pincode } : addressCountryDetail?.pincode ? { pincode: addressCountryDetail?.pincode } : {}),
      maxGlammPoints,
      identifier: getCartIdentifier(),
      ignoreDiscountCode: getIgnoredCoupon(),
      showAutoApplyInvalidCouponMessage,
      cityId: this.getCityId(),
    });
  }

  /**
   * Call to get applicable subscription
   * @returns loggedin users applicables subscription data
   */
  public getApplicableSubscriptions(memberId?: string, payableAmt?: number) {
    return this.myGlammV2.get(`/cart-manager-ms/subscriptions/members/${memberId}?netPayable=${payableAmt}`);
  }

  /**
   * Post Call to Add Product in Bag
   * @returns Checkout Data
   */
  public addToBag(payload: any, checkoutPages = false) {
    const { couponList } = getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_DATA, true) || {};
    const isPartnership =
      IS_DESKTOP && !!couponList?.find((x: any) => payload.products.find((y: any) => x.productId === y.productId));
    const shippingDetailsForInternationalProduct = getSessionStorageValue(SESSIONSTORAGE?.ADDRESS_COUNTY_DETAILS, true);

    const params = this.generateParams(isPartnership || checkoutPages);

    let _eventID = "";
    if (typeof window !== "undefined") {
      const fbEventID = uuid4();
      sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, fbEventID);
      if (fbEventID) {
        _eventID = (params ? "&" : "?") + "eventID=" + fbEventID;
      }
    }
    return this.myGlammV2.post(`/cart-manager-ms/add${params}${_eventID}`, {
      ...payload,
      ignoreDiscountCode: getIgnoredCoupon(checkoutPages),
      cityId: this.getCityId(),
      ...(shippingDetailsForInternationalProduct?.pincode ? { pincode: shippingDetailsForInternationalProduct?.pincode } : {}),
    });
  }

  /**
   * Get user commission
   * @param memeberId {String} - Member ID of consumer
   * @param amount {Number} - Payable Amount in Paisa
   */
  public getCommission(memeberId: string, amount: number) {
    return this.myGlammV2.get(`/members-ms/members/${memeberId}/commissionEarnings/${amount}`);
  }

  /**
   * Get Token for websocket when doing Guest checkout
   * @param phoneNumber - String
   */
  public getGuestToken(phoneNumber: string) {
    return this.myGlammV2.post(`/guest-login`, {
      phoneNumber,
    });
  }

  /**
   * Check the Availability of COD on Payment Page
   */
  public getCODAvailabilityV2(
    pincode: string,
    coupon: string,
    glammPoints: number,
    rtoRiskExperimentBucket?: string,
    utmParams?: any
  ) {
    let optionalParams: string = "";
    if (this.getCityId()) {
      optionalParams = `&cityId=${this.getCityId()}`;
    } else if (SHOP.REGION !== "MIDDLE_EAST") {
      optionalParams = `&pincode=${pincode}`;
    }
    if (rtoRiskExperimentBucket && rtoRiskExperimentBucket !== "no-variant") {
      optionalParams += `&rtoRiskExperimentBucket=${rtoRiskExperimentBucket}`;
    }
    if (utmParams?.utmSource) {
      optionalParams += `&utm_source=${utmParams?.utmSource}`;
    }
    if (utmParams?.utmMedium) {
      optionalParams += `&utm_medium=${utmParams?.utmMedium}`;
    }
    return this.myGlammV2.get(
      `/cart-manager-ms/isCoDApplicable?identifier=${getCartIdentifier()}&couponCode=${coupon}&${optionalParams}&glammPoints=${glammPoints}`
    );
  }

  public getRecommendedCoupons(cartId: string) {
    return this.myGlammV2.get(`/cart-manager-ms/recommendCoupon?identifier=${cartId}`);
  }

  public getRecommendedCouponsV2(cartId?: string) {
    const showRewards = Router.pathname !== "/shopping-bag";

    const { memberId } = checkUserLoginStatus() || {};
    return this.myGlammV2.get(
      `/cart-manager-ms/v2/recommendCouponList?identifier=${cartId || memberId}&showRewards=${showRewards}`
    );
  }

  /**
   * Updating Cart Response Api's product data with hasShade key value
   */
  public checkForHasShade(skuList: Array<string>) {
    return this.myGlammV2.post("/cart-manager-ms/checkProductShade", {
      skuList,
      identifier: getCartIdentifier(),
    });
  }

  /**
   * Replace A Prodcut in Cart Based on the new and old SKU
   */
  public replaceProductInCart(data: { [char: string]: string }) {
    const params = this.generateParams();

    return this.myGlammV2.post(`/cart-manager-ms/replaceProductInCart${params}`, {
      ...data,
      identifier: getCartIdentifier(),
      isGuest: !checkUserLoginStatus(),
      ignoreDiscountCode: getIgnoredCoupon(),
      cityId: this.getCityId(),
    });
  }
  /* Replace bundle product */
  public replaceComboProductInCart = (data: { oldSKU: string; newSKU: string; productId: string }) => {
    const params = this.generateParams();

    return this.myGlammV2.post(`cart-manager-ms/replaceBundleProductShadeInCart${params}`, {
      ...data,
      identifier: getCartIdentifier(),
      isGuest: !checkUserLoginStatus(),
      ignoreDiscountCode: getIgnoredCoupon(),
      cityId: this.getCityId(),
    });
  };

  /**
   * Product Call - Returns Data Specifically used in cart FreeProduct
   * @where post payload
   */
  public getCartFreeProductData(where: any) {
    const filter = {
      where,
      skip: 0,
      limit: 50,
      include: [
        "price",
        "offerPrice",
        "sku",
        "productTag",
        "inStock",
        "type",
        "productMeta",
        "cms",
        "assets",
        "categories",
        "urlManager",
      ],
    };
    return this.myGlammV2.get(`/search-ms/indices/search/products?getRelationalData=true&filter=${JSON.stringify(filter)}`, {
      headers: { apikey: true },
    });
  }

  /**
   * Used for Getting Product Data for Custom Response By Sending Include and Relational Data
   * @param productIds Array of ProductIds
   * @returns Array of Products
   */
  public getProductCustom(productIds: Array<string>, include: Array<string>, relationalData = false) {
    const filter = {
      skip: 0,
      limit: 50,
      include,
      where: { id: { inq: productIds } },
    };
    return this.myGlammV2.get(
      `/search-ms/indices/search/products?getRelationalData=${relationalData}&filter=${JSON.stringify(filter)}`,
      {
        headers: { apikey: true },
      }
    );
  }

  public getUpsellData({
    payload,
    lowerCogsVariant,
    giftCardUpsellVariant,
    warehouseVariant,
    upsellComboVariant,
  }: {
    payload: any;
    lowerCogsVariant?: string;
    giftCardUpsellVariant?: string;
    warehouseVariant?: string;
    upsellComboVariant?: string;
  }) {
    return this.myGlammV2.post(
      `/upsell-personalization-ms/cartUpsell?${this.getUpsellParams(
        lowerCogsVariant,
        giftCardUpsellVariant,
        warehouseVariant,
        upsellComboVariant
      )}`,
      payload
    );
  }

  public redeemG3Coupon(burnId: string) {
    return this.myGlammV2.post("/wallet-ms/wallet/buyReward?redeemFrom=cart", {
      identifier: getCartIdentifier(),
      burnId,
    });
  }

  public getPersonalizedUpsellData = (products: any) =>
    this.myGlammV2.post("/upsell-personalization-ms/cartPersonalisedPicks", products);

  public getSuggestedPayments = (payableAmount: number) =>
    this.myGlammV2.post("/utility-ms/suggest/paymentMethod", {
      supported_payment_methods: ["upi", "netbanking", "wallet", "creditcard", "cred"],
      amount: payableAmount,
      payment_channel: "mweb",
      vendorCode: SHOP.SITE_CODE,
    });

  public getUpsellOnProgressBar = (products: any) =>
    this.myGlammV2.post(`/upsell-personalization-ms/cartProgressBar`, products);

  public getUpsellGiftCard = (payload: any) => this.myGlammV2.post(`/upsell-personalization-ms/upsell/giftCard`, payload);
}

export default CartAPI;
