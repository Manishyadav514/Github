import MyGlammAPI from "@libAPI/MyGlammAPI";

class BigBossAPI extends MyGlammAPI {
  public getContestantsList(limit = 100) {
    return this.myGlammV2.get(`/search-ms/contestant/list?limit=${limit}&skip=0`);
  }

  public getContestantsLeaderBoard(limit = 100) {
    return this.myGlammV2.get(`/search-ms/contestant/leaderBoard?limit=${limit}&skip=0`);
  }

  public getContestantDetailBySlug(slug: string) {
    return this.myGlammV2.get(`/search-ms/contestant?contestantSlug=${slug}`);
  }

  public getContestantDetailById(id: string) {
    return this.myGlammV2.get(`/search-ms/contestant?contestantId=${id}`);
  }

  public getRewards() {
    return this.myGlammV2.get(`/order-ms/contests?key=biggBoss2022`);
  }

  public getRewardsDump(memberId: string) {
    return this.myGlammV2.get(`/dump-ms/dump?key=biggBoss2022&identifier=${memberId}`);
  }

  public isYourVote() {
    return this.myGlammV2.get(`/search-ms/contestant/yourVote`);
  }

  public async voteNowWithCaptcha(input: {}) {
    return this.myGlammV2.post(
      "/voter-ms/vote",
      input,
      { params: { rcAction: "submitBigBossVote" } } // reCaptcha Triggered
    );
  }

  public async voteNow(input: {}) {
    return this.myGlammV2.post("/voter-ms/vote", input);
  }
}

export default BigBossAPI;
