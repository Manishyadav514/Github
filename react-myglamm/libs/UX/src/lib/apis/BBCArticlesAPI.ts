import MyGlammAPI from "@libAPI/MyGlammAPI";

import { SLUG } from "@libConstants/Slug.constant";

class BBCArticlesAPI extends MyGlammAPI {
  public getArticleWidgets = () => {
    const where = { where: { slugOrId: SLUG().BBC_ARTICLE_DETAILS } };
    const url = `/search-ms/widget?filter=${JSON.stringify(where)}`;
    return this.myGlammV2.get(url);
  };

  public getMgArticleComments = (articleId: string, limit: number, skip: number) => {
    let headers = {};
    const mgAt = localStorage.getItem("mgt-at");
    if (mgAt) {
      headers = {
        "x-access-token": mgAt,
      };
    }
    return this.myGlammV2.get(
      `/search-ms/answers/feed?filter={"where":{"entityType": "article", "entityId": ${articleId}},"limit":${limit},"skip":${skip}}`,
      { headers }
    );
  };

  public postArticleComments = (body: any) => {
    return this.myGlammV2.post(`/post-ms/answers`, body);
  };

  public mgLikeDislikeArticleComments = (body: any) => {
    return this.myGlammV2.patch(`/post-ms/like`, body);
  };

  public checkAuthorFollowStatus = (user_slug: any, userId: string) => {
    const filter = {
      where: {
        actions: "follow",
        entityId: user_slug,
        entityType: "user",
        userId: userId,
      },
    };
    const params = { vendorCode: "g3", sourceVendorCode: "bbc" };

    return this.myGlammV2.get(`/search-ms/community/userActionsCount?filter=${JSON.stringify(filter)}`, { params });
  };

  public followUser = (body: any) => {
    return this.myGlammV2.put(`/community-user-actions-ms/v1/follow/`, body);
  };

  public unfollowUser = (body: any) => {
    const params = { vendorCode: "g3", sourceVendorCode: "bbc" };
    return this.myGlammV2.put(`/community-user-actions-ms/v1/follow?`, body, { params });
  };
}

export default BBCArticlesAPI;
