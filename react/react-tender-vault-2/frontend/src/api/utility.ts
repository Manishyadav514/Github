import NucleusAPI from "./manement";

class UtilityAPI extends NucleusAPI {
    public fetchTender = () => {
        return this.NucleusAPI.get("/api/tenders",);
    };
    public fetchTenderByID = (id) => {
        return this.NucleusAPI.get(`/api/tenders/${id}`);
    };
    public fetchTenderBids = () => {
        return this.NucleusAPI.get(`/api/bids`);
    };
    public createTender = (tenderInfo) => {
        return this.NucleusAPI.post(`/api/tenders`, tenderInfo);
    };
}



export default UtilityAPI