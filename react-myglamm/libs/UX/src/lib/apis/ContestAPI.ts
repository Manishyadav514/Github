import MyGlammAPI from "@libAPI/MyGlammAPI";
import { getVendorCode } from "@libUtils/getAPIParams";

class ContestApi extends MyGlammAPI {
  public getLastestContest = () =>  {
    const filter = {
      where: { statusId: 1 },
      order: ["startTime desc"],
    };
    return this.myGlammV2.get(`/search-ms/contest?filter=${JSON.stringify(filter)}&limit=1`);
  }

  public getContestBySlug = (slug:string) =>{
    const filter = {
      where: { contestUrl: slug },
    };
    return this.myGlammV2.get(`/search-ms/contest?filter=${JSON.stringify(filter)}&limit=1`);
  }

  public getContestEntries =(limit =10, skip = 0, order = "createdAt desc",contestSlug:string) =>{
    const filter = {
      where:{
        contestSlug,
      },
      order:[order],
      "relationalEntity":["contest","entries_votes","user_voted_entries"]
    }
    return this.myGlammV2.get(`/search-ms/contest-entry?limit=${limit}&skip=${skip}&filter=${JSON.stringify(filter)}&getRelationalData=true`)
  }

  public getContestEntryById = (id:string) => {
    const filter = {
      where:{
        id,
      },
      "relationalEntity":["contest","entries_votes","user_voted_entries"]
    }
    return this.myGlammV2.get(`/search-ms/contest-entry?limit=1&skip=0&filter=${JSON.stringify(filter)}&getRelationalData=true`)
  }

  public voteContest = (contestEntryId:string) => {
    return this.myGlammV2.put(`/crud-ms/operation/bbcContestUserVote`,{
      "vendorCode":getVendorCode(),
      contestEntryId,
    })
  }

  public submitContestEntry = (data:any)=>{
    return this.myGlammV2.put(`/crud-ms/operation/bbcContestEntries`,data)
  }
} 

export default ContestApi;