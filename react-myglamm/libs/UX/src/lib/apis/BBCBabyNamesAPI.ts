import MyGlammAPI from "@libAPI/MyGlammAPI";

class BabyChakraBabyNamesApi extends MyGlammAPI {
  public getBabyNamesData = (data: object) => this.myGlammV2.get(`/crud-ms/operation/babynames?filter=${JSON.stringify(data)}`);
  public getTrendingQuestion = (lifestageNumber?: number) =>
    this.myGlammV2.get(
      `/absurdity-ms/community/trending?type=question&limit=5&${lifestageNumber ? `&lifeStage=${lifestageNumber}` : ""}`
    );
}

export default BabyChakraBabyNamesApi;
