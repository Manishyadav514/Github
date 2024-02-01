import MyGlammAPI from "@libAPI/MyGlammAPI";
class BBCServiceApi extends MyGlammAPI {
  public getServices = (limit: number, skip: number, filter: any) => {
    return this.myGlammV2.get(
      `/search-ms/babychakra/services?getRelationalData=true&getParentCat=true&skip=${skip}&limit=${limit}&filter=${JSON.stringify(filter)}`
    );
  };

  public getCategoryService = (limit: number, skip: number, filter: any) => {
    return this.myGlammV2.get(
      `/search-ms/babychakra/categories?getRelationalData=true&skip=${skip}&limit=${limit}&getParentCat=true&filter=${JSON.stringify(filter)}`
    );
  };
}

export default BBCServiceApi;
