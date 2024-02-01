import { COMMUNITY_REDUCER } from "@libStore/valtio/REDUX.store";

export const setFeedByTagsData = (data: any) => (COMMUNITY_REDUCER.feedByTags = data);

export const setCommunityWallPosts = (data: any,widgetsData?:any) => {
  if (data.isFreshReload) {
    return (
      COMMUNITY_REDUCER.feedData = { 
        ...COMMUNITY_REDUCER.feedData, 
        wallPosts: data
      },
      COMMUNITY_REDUCER.widgetWallData =  widgetsData || []
    );
  }
  return (
    COMMUNITY_REDUCER.feedData = {
      ...COMMUNITY_REDUCER.feedData,
      wallPosts: {
        isFreshReload: data.isFreshReload,
        // @ts-ignore
        posts: [...COMMUNITY_REDUCER.feedData.wallPosts.posts, ...data.posts],
        skip: data.skip,
        isDataScienceAPI: data.isDataScienceAPI,
      },
    }, 
    COMMUNITY_REDUCER.widgetWallData =  widgetsData || []
  );
};

export const setCommunityQuestionPosts = (data: any) =>
  (COMMUNITY_REDUCER.feedData = { ...COMMUNITY_REDUCER.feedData, questionPosts: data });

export const setCommunityPolls = (data: any) => (COMMUNITY_REDUCER.feedData = { ...COMMUNITY_REDUCER.feedData, polls: data });

export const setCommunityLiveVideoPosts = (data: any) =>
  (COMMUNITY_REDUCER.feedData = { ...COMMUNITY_REDUCER.feedData, liveVideoPosts: data });

export const setTopicsWallPosts = (data: any) => {
  if (data.isFreshReload) {
    return (COMMUNITY_REDUCER.feedByTopics = {
      ...COMMUNITY_REDUCER.feedByTopics,
      wallPosts: data,
      topic: data.topic || COMMUNITY_REDUCER.feedByTopics.topic,
    });
  }

  return (COMMUNITY_REDUCER.feedByTopics = {
    ...COMMUNITY_REDUCER.feedByTopics,
    wallPosts: {
      isFreshReload: data.isFreshReload,
      // @ts-ignore
      posts: [...COMMUNITY_REDUCER.feedByTopics.wallPosts.posts, ...data.posts],
      skip: data.skip,
      isDataScienceAPI: data.isDataScienceAPI,
    },
  });
};

export const setTopicsQuestionPosts = (data: any) =>
  (COMMUNITY_REDUCER.feedByTopics = {
    ...COMMUNITY_REDUCER.feedData,
    questionPosts: data,
    topic: data.topic || COMMUNITY_REDUCER.feedByTopics.topic,
  });

export const setTopicsPolls = (data: any) =>
  (COMMUNITY_REDUCER.feedByTopics = {
    ...COMMUNITY_REDUCER.feedData,
    polls: data,
    topic: data.topic || COMMUNITY_REDUCER.feedByTopics.topic,
  });

export const setTopicsLiveVideoPosts = (data: any) =>
  (COMMUNITY_REDUCER.feedByTopics = {
    ...COMMUNITY_REDUCER.feedData,
    liveVideoPosts: data,
    topic: data.topic || COMMUNITY_REDUCER.feedByTopics.topic,
  });

// @ts-ignore
export const resetTopics = (data: any) => (COMMUNITY_REDUCER.feedByTopics = {});
