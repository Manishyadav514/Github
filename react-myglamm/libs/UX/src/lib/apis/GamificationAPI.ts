import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import MyGlammAPI from "@libAPI/MyGlammAPI";

class GamificationAPI extends MyGlammAPI {
  /**
   * GET CALL - For list of free products currently active in
   * Gamification Contest
   */
  public getGamificationProducts() {
    return this.myGlammV2.get("/order-ms/contests");
  }

  /**
   * Get CALL - To get eligible prizes and points related to
   * a Particular User
   */
  public getGamificationStats(key = "purchaseOrder") {
    return this.myGlammV2.get(`/dump-ms/dump?key=${key}&identifier=${checkUserLoginStatus()?.memberId}`);
  }

  /**
   * Post Call - Claim Reward if applicable to user
   */
  public cliamGamificationReward(payload: any) {
    return this.myGlammV2.post("/dump-ms/dump/claimReward", {
      ...payload,
      country: MyGlammAPI.Filter.CountryFilter,
      language: MyGlammAPI.Filter.LanguageFilter,
    });
  }

  /**
   * Get Call - Returns the child users who have claimed free product
   */
  public getFriendsClaimedGamification() {
    return this.myGlammV2.get(`/order-ms/contests/dashboard/members/${checkUserLoginStatus()?.memberId}`);
  }
}

export default GamificationAPI;
