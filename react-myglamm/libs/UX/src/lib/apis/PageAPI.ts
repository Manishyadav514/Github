import MyGlammAPI from "@libAPI/MyGlammAPI";

class PageAPI extends MyGlammAPI {
  public getPage(skip: number, where: any) {
    const filter = {
      limit: 10,
      skip,
      where,
    };
    return this.myGlammV2.get(
      `/search-ms/indices/search/pages?getRelationalData=true&getDeepNestedRelations=true&filter=${JSON.stringify(filter)}`,
      { headers: { apikey: true } }
    );
  }
}

export default PageAPI;
