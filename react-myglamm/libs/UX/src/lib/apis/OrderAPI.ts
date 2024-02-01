import MyGlammAPI from "../MyGlammAPI";

import { orderPayload } from "@typesLib/MyGlammAPI";

import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import { isClient } from "@libUtils/isClient";
import { getLocalStorageValue } from "@libUtils/localStorage";

class OrderAPI extends MyGlammAPI {
  /**
   * get My Order Data
   */
  public getMyOrders(identifier: string, offset = 0, tab = 4) {
    const data = {
      where: {
        "userInfo.identifier": identifier,
      },
      limit: 10,
      offset,
      order: "orderPlaced DESC",
    };
    return this.myGlammV2.get(`/order-ms/order?filter=${JSON.stringify(data)}&myOrderTab=${tab}`);
  }

  /**
   * Get Order Detail using order Id
   * @param orderId String - Order Id
   */
  public getOrderDetail(memberId: string, orderId: string) {
    return this.myGlammV2.get(`/order-ms/member/${memberId}/order/${orderId}`);
  }

  /**
   *  Get Tracking Data for single Order
   * @param userId {String} - Member ID
   * @param orderId {String} - Order ID
   */
  public getOrderTrackingDetails(userId: string, orderId: string, showNewTracking?: boolean) {
    return this.myGlammV2.get(
      `/order-ms/orders-trackings/${userId}/${orderId}${showNewTracking && `?showNewTracking=${showNewTracking}`}`
    );
  }

  /**
   * Get Order Invoice
   * @param orderId -{String} Order ID
   */
  public getOrderInvoice(orderId: string, memberId: string) {
    return this.myGlammV2.get(`/order-ms/getOrderInvoice/${orderId}?memberId=${memberId}`);
  }

  /**
   * Get Glammpoints earned agter placing order for Guest/Registered
   * @param id - MemberId
   * @param unit - Order Amount Without Tax
   */
  public getEarnedPoints(id: string | null, unit: number) {
    const payload = {
      id: id || "",
      unitPrice: unit,
      isGuestUser: !id,
    };
    return this.myGlammV2.post(`/members-ms/members/productsCommissionEarnings`, payload);
  }

  /**
   * Create Order
   * @param orderPayload -Order payload
   */
  public createOrder(orderPayload: orderPayload) {
    const payload = {
      ...orderPayload,
      meta: {
        ...orderPayload.meta,
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        clientOffset: new Date().getTimezoneOffset(),
      },
    };

    if (LOCALSTORAGE.GUEST_TOKEN in localStorage) {
      this.HEADERS = {
        ...this.HEADERS,
        "x-access-token": getLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN) || "",
      };
    }
    let _eventID = "";
    if (isClient()) {
      const fbEventID = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
      if (fbEventID) {
        _eventID = "?eventID=" + fbEventID;
      }
    }
    return this.myGlammV2.put(`/order-ms/order${_eventID}`, payload, {
      headers: this.HEADERS,
    });
  }

  public replaceProduct(replaceOrderPayload: any) {
    const payload = {
      ...replaceOrderPayload,
    };
    return this.myGlammV2.post(`/order-ms/order/replace`, payload);
  }

  public getLastDeliveredOrders(memberId: string) {
    return this.myGlammV2.get(`/order-ms/orders/${memberId}/lastDeliveredOrders`);
  }

  /**
   * Cancel Existing Order if order is in pending in case of flash-checkout.
   * @param orderId -{String} Order Id
   */

  public cancelPendingOrder(orderId: string, memberId: string) {
    return this.myGlammV2.patch(`/order-ms/member/${memberId}/order/${orderId}/updateStatus/16`, {
      meta: {
        expiryReason: "User clicked back button on the payment page.",
      },
    });
  }

  /**
   * Cancel Existing Order if order is not delivered.
   * @param orderId -{String} Order Id
   */
  public orderCancel(memberId: string, orderId: any, cancellationReason?: any) {
    if (cancellationReason) {
      return this.myGlammV2.patch(`/order-ms/member/${memberId}/order/${orderId}/updateStatus/13`, cancellationReason);
    } else {
      return this.myGlammV2.patch(`/order-ms/member/${memberId}/order/${orderId}/updateStatus/13`);
    }
  }

  public getCancelOrderReason(variant?: string) {
    let newCancellationVariant = variant?.length ? `?experimentValue=${variant}` : "";
    return this.myGlammV2.get(`/search-ms/order/cancelReasons${newCancellationVariant}`);
  }

  public getOrderStatus = (id: string) => {
    const controller = new AbortController();
    return this.myGlammV2.get(`/payment-v2-ms/v1/juspay/getOrderStatus/${id}`, {
      signal: controller.signal,
    });
  };

  /**
   * Generate retry payment link for pending orders
   * @param orderId -{String} Order ID
   */
  public generateRetryPaymentLink(orderId: any) {
    const data = {
      orderId: orderId,
    };
    return this.myGlammV2.post(`/order-ms/myOrdersPayment/retry`, data);
  }

  /**
   * Get GoKwik details using orderId
   * @param orderId -{String} Order Id
   */
  public getGoKwikDetails(orderId: any) {
    return this.myGlammV2.get(`/order-ms/rtoPredict/goQwikOrder?orderNumber=${orderId}`);
  }

  /* Post order - update shipping address */
  public updateOrderShippingAddress(orderId: any, memberId: string, addressDataPayLoad: any) {
    return this.myGlammV2.post(`/order-ms/changeAddress/member/${memberId}/order/${orderId}`, addressDataPayLoad);
  }

  /* Post order - get order details for changing shade from available options */
  public getOrderDetailForShadeChange(orderId: any, memberId: any) {
    return this.myGlammV2.get(`/order-ms/shadeChange/member/${memberId}/order/${orderId}`);
  }

  /* split order api for type 2*/
  public splitOrder(memberId: any, orderId: any) {
    return this.myGlammV2.get(`order-ms/member/${memberId}/splitOrder/${orderId}`);
  }

  /* Post order - update order shade and address */
  public updateOrderShadeAndAddress(orderId: any, memberId: any, updateOrderPayLoad: any) {
    return this.myGlammV2.post(`order-ms/updateOrderAddressAndShade/member/${memberId}/order/${orderId}`, updateOrderPayLoad);
  }
}

export default OrderAPI;
