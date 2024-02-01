import MyGlammAPI from "@libAPI/MyGlammAPI";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

class BBCServiceDetail extends MyGlammAPI {
  public getServiceDetails = (query: any) => {
    let filter: any = { relationalEntity: ["service_category"] };
    if (query.slug) {
      filter = { ...filter, where: { slug: query.slug } };
    }
    if (query.id) {
      filter = { ...filter, where: { id: query.id } };
    }
    const url = `/search-ms/babychakra/services?limit=1&getRelationalData=true&&skip=0&filter=${JSON.stringify(filter)}`;
    return this.myGlammV2.get(url);
  };

  public getSimilarServices = (subCatId: string) => {
    const filter = { where: { subCatId }, relationalEntity: ["service_category"] };
    const url = `/search-ms/babychakra/services?limit=10&getRelationalData=true&skip=0&filter=${JSON.stringify(filter)}`;
    return this.myGlammV2.get(url);
  };

  public getReviews = (entityId: string, limit = 3) => {
   
    // entityId
    const filter = {
      where: { entityType: "bbcservice", entityId },
      order: ["createdAt%20desc"],
      relationalEntity: ["community_user"],
    };
    const url = `/search-ms/community/comments?limit=${limit}&skip=0&getRelationalData=true&filter=${JSON.stringify(filter)}`;
    return this.myGlammV2.get(url, { headers : { apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || "" } });
  };

  public likeReview = (payload: any) => {
    const url = `/community-user-actions-ms/v1/reactions`;
    return this.myGlammV2.put(url, payload);
  };

  public createCommentForReview = (payload: any) => {
    const url = `/community-user-actions-ms/v1/comments`;
    return this.myGlammV2.put(url, payload);
  };

  public onFetchComments = (entityId: string, limit = 3, skip = 0) => {
    
    const filter = {
      where: { entityId },
      relationalEntity: ["community_user"],
    };
    const url = `/search-ms/community/comments?filter=${JSON.stringify(
      filter
    )}&limit=${limit}&skip=${skip}&getRelationalData=true`;
    return this.myGlammV2.get(url, { headers : { apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || "" } });
  };

  public getReviewDetail = (id: any) => {
    const filter = {
      where: { id },
      relationalEntity: ["community_user"],
    };
    const url = `/search-ms/community/comments?limit=1&skip=0&filter=${JSON.stringify(filter)}&getRelationalData=true`;
    return this.myGlammV2.get(url, { headers : { apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || "" } });
  };

  public createReview = (body: any) => {
    const url = `/community-user-actions-ms/v1/comments`;
    return this.myGlammV2.put(url, body);
  };

  public getCategoryService = (limit: number, skip: number, filter: any) => {
    return this.myGlammV2.get(
      `/search-ms/babychakra/categories?getRelationalData=true&getParentCat=true&skip=${skip}&limit=${limit}&filter=${JSON.stringify(filter)}`
    );
  };

  public getServices = (limit: number, skip: number, filter: any) => {
    return this.myGlammV2.get(
      `/search-ms/babychakra/services?getRelationalData=true&getParentCat=true&skip=${skip}&limit=${limit}&filter=${JSON.stringify(filter)}`
    );
  };
}

export default BBCServiceDetail;
