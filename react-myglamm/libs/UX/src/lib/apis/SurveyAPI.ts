import MyGlammAPI from "@libAPI/MyGlammAPI";

class SurveyAPI extends MyGlammAPI {
  /**
   * Get Widgets
   */
  public getWidgets(where: any) {
    return this.myGlammV2.get(`/search-ms/widget?filter=${encodeURIComponent(JSON.stringify(where))}&limit=3&skip=0`, {
      headers: { apikey: true },
    });
  }

  public postSurveyForm(data: any) {
    return this.myGlammV2.post("/worker-ms/surveyResponse", data);
  }

  public postDump(data: any) {
    const payload = [
      {
        ...(data[0] || {}),
        vendorCode: MyGlammAPI.Filter.APIVendor,
        country: MyGlammAPI.Filter.CountryFilter,
        language: MyGlammAPI.Filter.LanguageFilter,
      },
    ];

    return this.myGlammV2.post(`/dump-ms/dump/survey`, payload);
  }

  /**
   * Give Free MyGlammPOINTS on successful sharing on FaceBook
   * @param payload {*}
   */
  public freeGlammPoint(payload: any) {
    const data = {
      ...payload,
      vendorCode: MyGlammAPI.Filter.APIVendor,
    };
    return this.myGlammV2.post(`/share-and-earn-ms/credit/points`, data);
  }

  /* API call to fetch custom surveys from Nucleus */
  public getCustomSurveyForm(customSurveyId: any) {
    return this.myGlammV2.get(`/worker-ms/surveys/${customSurveyId}`, { headers: { apikey: true } });
  }

  /* API call to post custom survey data */
  public postCustomSurveyData(data: any) {
    return this.myGlammV2.post("/worker-ms/surveyForm/response", [
      {
        ...data,
        country: MyGlammAPI.Filter.CountryFilter,
        language: MyGlammAPI.Filter.LanguageFilter,
      },
    ]);
  }

  /* API call to get custom survey submitted data */
  public getCustomSurveyData(identifier: string, surveyId: string) {
    const filter = { where: { surveyId, identifier }, order: ["createdAt DESC"] };
    return this.myGlammV2.get(`/worker-ms/surveyForm/response?filter=${JSON.stringify(filter)}`);
  }

  /* API call to get custom survey questions using slug */
  public getCustomSurveyFormBySlug(param: string, type: string) {
    return this.myGlammV2.get(`/worker-ms/surveyForm/${param}?type=${type}`);
  }
}

export default SurveyAPI;
