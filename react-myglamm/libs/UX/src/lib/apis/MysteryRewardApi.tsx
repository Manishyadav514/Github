import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import MyGlammAPI from "@libAPI/MyGlammAPI";

class MysteryRewards extends MyGlammAPI {
  /**
   * Reward Detail
   * Reward Show and Redeemtion related APIs
   */
  public getReward(slug: string) {
    return this.myGlammV2.get(`/search-ms/burnCouponConfig/rewardDetail/${slug}?getRelationalData=true`);
  }

  /* Mystery Rewards Listing */
  public getMysteryRewards() {
    return this.myGlammV2.get(
      `/search-ms/burnCouponConfig/mysteryRewards/${checkUserLoginStatus()?.memberId}?getRelationalData=true&limit=10&skip=0`
    );
  }

  /* Mystery Rewards Claim  */
  public claimMysteryRewards(mysteryRewardId: any, vendorCode: any) {
    return this.myGlammV2.put(
      `quiz-ms/members/${checkUserLoginStatus()?.memberId}/mysteryReward/${mysteryRewardId}/scratched?socket=1`,
      {},
      { params: { vendorCode } }
    );
  }
}

export default MysteryRewards;
