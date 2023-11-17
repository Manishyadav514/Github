import { API_CONFIG,API_ENDPOINT } from "@/constants/api.constant";
import NucleusAPI from "../../../services/nucleusAPI";

class MailTemplatesHttpService extends NucleusAPI {
    /**
    * @description fetches all active and inactive tags as per filter
    * @param {number} [limit=API_CONFIG.pageSize]
    * @param {number} [page=1]
    * @param {string} [search]
     * @returns {Observable<any[]>}
    * @memberof MailTemplatesHttpService
   */
    public fetchAllMailTemplates(
        limit: number = API_CONFIG.pageSize,
        page: number = 1,
        where?: object,
        sort?: object ,
        search?: string,
    ){
        const skip = (page - 1) * limit;
        const filter ={
            where,
            sort
        }
        let queryParams:any = {
            limit:JSON.stringify(limit),
            page:JSON.stringify(page),
            skip:JSON.stringify(skip),
            filter: JSON.stringify(filter),
        } 
        if (search && search !== '') {
            queryParams['search'] = search;
        }
        let httpParams = new URLSearchParams(
            queryParams
        );
        
        return this.NucleusAPI.get<any[]>(API_ENDPOINT.mailTemplate.fetchAll, {
            params: httpParams
        })
    }

    /**
   * @description For create mail template
   * @param {MailTemplateI} reqBody
   * @memberof MailTemplatesHttpService
   */
    public createMailTemplate(reqBody:any){
        return this.NucleusAPI.post<any[]>(
            API_ENDPOINT.mailTemplate.create,reqBody
        )
    }
    /**
   * @description it fetches existing mail template by its Id
   * @param {string} id
   * @memberof MailTemplatesHttpService
   */
    public getMailTemplateById(id:string){
        return this.NucleusAPI.get<any>(
            `${API_ENDPOINT.mailTemplate.fetchById}/${id}`
        )
    }
}

export default MailTemplatesHttpService