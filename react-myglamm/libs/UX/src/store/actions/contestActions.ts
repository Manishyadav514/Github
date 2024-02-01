import { CONTEST_REDUCER } from "@libStore/valtio/REDUX.store";
import { IContestData } from "@typesLib/Contest";

export const setContestFeed = (payload: any) => {
  CONTEST_REDUCER.data = payload?.data?.length ? [...CONTEST_REDUCER.data, ...payload.data] : CONTEST_REDUCER.data;
  CONTEST_REDUCER.hasMore = payload.hasMore;
  CONTEST_REDUCER.count = payload.count;
  CONTEST_REDUCER.relationalData = {
    ...payload.relationalData,
    userVotedContestEntries: payload.relationalData?.userVotedContestEntries?.length
      ? [...CONTEST_REDUCER.relationalData.userVotedContestEntries, ...payload.relationalData.userVotedContestEntries]
      : CONTEST_REDUCER.relationalData.userVotedContestEntries,
  };
};

export const setContestVote = (payload: any) => {
  const newData = CONTEST_REDUCER.data.map((item: IContestData) => {
    if (item.id === payload) {
      return {
        ...item,
        voteCount: (item.voteCount || 0) + 1,
      };
    }
    return item;
  });

  CONTEST_REDUCER.data = newData;
  CONTEST_REDUCER.relationalData = {
    ...CONTEST_REDUCER.relationalData,
    userVotedContestEntries: [...CONTEST_REDUCER.relationalData.userVotedContestEntries, payload],
  };
};

export const resetContestFeed = (payload: any) => {
  CONTEST_REDUCER.data = payload.data;
  CONTEST_REDUCER.hasMore = payload.hasMore;
  CONTEST_REDUCER.count = payload.count;
  CONTEST_REDUCER.relationalData = payload.relationalData;
  CONTEST_REDUCER.filter = payload.filter;
};
