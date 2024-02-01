import MyGlammAPI from "@libAPI/MyGlammAPI";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

class ServiceDetailsAPI extends MyGlammAPI {
  public getServiceDetailsData = (slug: string) => {
    const where = { where: { slug }, relationalEntity: ["service_category"] };
    const url = `/search-ms/babychakra/services?limit=3&skip=0&getRelationalData=true&filter=${JSON.stringify(where)}`;
    return this.myGlammV2.get(url);
  };

  public getServiceDetailsComments = (entityId: any) => {
    const where = {
      where: { entityType: "bbcservice", entityId },
      order: ["createdAt desc"],
      relationalEntity: ["community_user"],
    };
    const url = `/search-ms/community/comments?limit=5&skip=0&getRelationalData=true&filter=${JSON.stringify(where)}`;
    return this.myGlammV2.get(url, { headers: { apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || "" }, params: { vendorCode: "bbc" } });
  };
}
export default ServiceDetailsAPI;
