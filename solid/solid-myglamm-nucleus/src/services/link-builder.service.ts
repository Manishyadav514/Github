import { API_CONFIG, API_ENDPOINT } from "@constants/api.constant";
import NucleusAPI from "./nucleusAPI";

class LinkBuilderAPI extends NucleusAPI {
  public fetchAllLinks(
    vendorCode: string,
    page: number = 1,
    limit: number = API_CONFIG.pageSize,
    SortOrder: string = "desc",
    where?: object,
    include?: string[]
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      vendorCode,
      page,
      limit,
      skip,
      SortOrder,
      where,
      include
    };
    let httpParams = new URLSearchParams({ filter: JSON.stringify(filter) });
    return this.NucleusAPI.get<any[]>(API_ENDPOINT.linkBuilder.fetchAll, {
      params: httpParams
    });
  }
}

export default LinkBuilderAPI;
