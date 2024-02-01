import MyGlammAPI from "@libAPI/MyGlammAPI";

class GlammClubAPI extends MyGlammAPI {
  /**
   * Call to get my Glamm Club Membership Details
   * @param identifier {String} - memberId
   */

  public getGlammClubMembershipDetails(identifier: string) {
    return this.myGlammV2.get(`/members-ms/members/${identifier}/reward-level`);
  }
}

export default GlammClubAPI;
