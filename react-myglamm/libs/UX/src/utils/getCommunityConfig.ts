import { getVendorCode } from "@libUtils/getAPIParams";

import { BASE_URL, IS_DESKTOP } from "@libConstants/COMMON.constant";

import { commonData } from "@libStore/valtio/REDUX.store";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

export function getConfig() {
  return {
    vendorCode: "g3",
    sourceVendorCode: getVendorCode(),
    languageFilter: "EN",
    countryFilter: "IND",
    apikey: GBC_ENV.NEXT_PUBLIC_COMMUNITY_API_KEY,
    baseUrl: BASE_URL(),
    isMobile: !IS_DESKTOP,
  };
}

export const transformCommunityData = (type: "wall" | "questions" | "live_videos" | "polls" | "events" | "glamm_club", data: any) => {
  const cpyData = { ...commonData };
  if (type === "wall") {
    cpyData.wallPosts = data;
  } else if (type === "questions") {
    cpyData.questionPosts = data;
  } else if (type === "live_videos") {
    cpyData.liveVideoPosts = data;
  } else if (type === "polls") {
    cpyData.polls = data;
  }
  return cpyData;
};
