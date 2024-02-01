import MyGlammAPI from "@libAPI/MyGlammAPI";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

class RecurringSubscriptionAPI extends MyGlammAPI {
  /**
   * Call to get my recurring subscriptions
   * @param identifier {String} - memberId
   */

  public getRecurringSubscriptions(identifier: string, skip = 0, limit = 10) {
    return this.myGlammV2.get(`/cart-manager-ms/recurringSubscriptions?identifier=${identifier}`);
  }

  /**
   * Call to cancel recurring subscriptions
   * @param subscriptionId {String} - recurring subscription Id
   */
  public cancelRecurringSubscription(subscriptionId: string) {
    return this.myGlammV2.patch(`/cart-manager-ms/recurringSubscriptions/${subscriptionId}`, {
      statusId: 2,
    });
  }

  /**
   * Call to resume recurring subscriptions
   * @param subscriptionId {String} - recurring subscription Id
   */
  public resumeRecurringSubscription(subscriptionId: string) {
    return this.myGlammV2.patch(`/cart-manager-ms/recurringSubscriptions/${subscriptionId}`, {
      statusId: 1,
    });
  }

  /**
   * Call to edit recurring subscriptions
   * @param subscriptionId {String} - recurring subscription Id
   * @param data {Any} - updated subscription plan details
   */
  public editRecurringSubscription(subscriptionId: string, data: any) {
    return this.myGlammV2.patch(`/cart-manager-ms/recurringSubscriptions/${subscriptionId}`, data);
  }

  /**
   * Call to fetch subscription plans for edit plan modal
   * @param productSKU
   */
  public getSubscriptionPlans(productSKU: string) {
    let input = `productSKU=${encodeURIComponent(productSKU)}`;
    if (checkUserLoginStatus()?.memberId) {
      input += `&identifier=${checkUserLoginStatus()?.memberId}`;
    }
    const url = `/cart-manager-ms/subscriptions/offers?${input}`;
    return this.myGlammV2.get(url);
  }
}

export default RecurringSubscriptionAPI;
