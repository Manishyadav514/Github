import { API_CONFIG, API_ENDPOINT } from "@constants/api.constant";
import NucleusAPI from "./nucleusAPI";

class MemberAPI extends NucleusAPI {

    public fetchAllMembersCount(
        limit: number = API_CONFIG.pageSize,
        page: number = 1,
        order?: string[],
        where?: object,
        include?: string[],

    ) {
        const skip = (page - 1) * limit;
        const filter = {
            limit,
            skip,
            order,
            where,
            include
        };
        const params = new URLSearchParams({ filter: JSON.stringify(filter) });

        return this.NucleusAPI.get<any[]>(`members-ms/v2/members/count`, { params });
    }

    public fetchAllMembers(
        limit: number = API_CONFIG.pageSize,
        page: number = 1,
        order?: string[],
        where?: object,
        include?: string[],

    ) {
        const skip = (page - 1) * limit;
        const filter = {
            limit,
            skip,
            order,
            where,
            include
        };
        let httpParams =  new URLSearchParams({ filter: JSON.stringify(filter) });

        return this.NucleusAPI.get<any[]>(API_ENDPOINT.member.fetchAll, {
            params: httpParams
        });
    }

     /**
   *@description it is called for fetching GlammPoints
   * @param {where}
   */
  fetchGlammPoints(where: object){
    const filter = {
      where
    };
    let httpParams = new URLSearchParams({ filter: JSON.stringify(filter) })
    return this.NucleusAPI
      .get(API_ENDPOINT.member.fetchGlamPoints, {
        params: httpParams
      })
  }

}

export default MemberAPI;