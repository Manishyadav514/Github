import MyGlammAPI from "@libAPI/MyGlammAPI";

class SkinAnalysisAPI extends MyGlammAPI {
  /* share skin analysis data to backend*/
  public saveSkinAnalysisData(skinAnalyzerData: any) {
    return this.myGlammV2.put(
      `crud-ms/operation/skinAnalyserHistory`,
      { ...skinAnalyzerData },
      {
        headers: { apikey: true, "Content-Type": "application/json" },
      }
    );
  }
}

export default SkinAnalysisAPI;
