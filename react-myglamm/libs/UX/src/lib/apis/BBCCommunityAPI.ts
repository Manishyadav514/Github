import MyGlammAPI from "@libAPI/MyGlammAPI";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { SLUG } from "@libConstants/Slug.constant";

const params = { vendorCode: "g3" };

class BBCCommunity extends MyGlammAPI {
  static config = {
    params,
    headers: {apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY || ""},
  };
  public getCommunityWidgets = () => {
    const where = { where: { slugOrId: SLUG().BBC_COMMUNITY } };
    const url = `/search-ms/widget?filter=${JSON.stringify(where)}`;
    return this.myGlammV2.get(url);
  };
  public getCurrentLiveVideos = () => {
    const filter = {
      where: {
        postType: "liveVideo",
        "liveVideo.startTime": {
          lte: new Date().toISOString(),
        },
        "liveVideo.endTime": {
          gte: new Date().toISOString(),
        },
      },
      order: ["createdAt DESC"],
    };
    const url = `/search-ms/community/post?getRelationalData=true&filter=${JSON.stringify(
      filter
    )}&sourceVendorCode=bbc&limit=12`;
    return this.myGlammV2.get(url, BBCCommunity.config);
  };

  public getPastLiveVideos = (selectedTopicId = "") => {
    const filter = {
      where: {
        postType: "liveVideo",
        "liveVideo.endTime": {
          lte: new Date().toISOString(),
        },
        topicId: selectedTopicId,
      },
      order: ["createdAt DESC"],
    };
    const url = `/search-ms/community/post?getRelationalData=true&filter=${JSON.stringify(
      filter
    )}&sourceVendorCode=bbc&limit=12`;
    return this.myGlammV2.get(url, BBCCommunity.config);
  };
  public getUpcomingLiveVideos = () => {
    const filter = {
      where: {
        postType: "liveVideo",
        "liveVideo.startTime": {
          gte: new Date().toISOString(),
        },
      },
      order: ["createdAt DESC"],
    };

    const url = `/search-ms/community/post?getRelationalData=true&filter=${JSON.stringify(
      filter
    )}&sourceVendorCode=bbc&limit=12`;
    return this.myGlammV2.get(url, BBCCommunity.config);
  };
  public fetchTopics = (limit: number, skip = 0) => {
    const filter = {
      where: { topicSubscriber: "bbc" },
    };
    const url = `/search-ms/community/topics?filter=${JSON.stringify(filter)}&limit=${limit}&skip=${skip}`;
    return this.myGlammV2.get(url, BBCCommunity.config);
  };
}

export default BBCCommunity;
