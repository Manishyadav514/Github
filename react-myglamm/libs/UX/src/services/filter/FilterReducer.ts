export const handleFilterActions = (state: any, action: any) => {
  switch (action.type) {
    case "filter_draft": {
      return {
        filterDraft: { ...state.filterDraft, ...action.filterDraft },
        appliedFilter: state.appliedFilter,
      };
    }
    case "filter_applied": {
      return {
        filterDraft: {},
        appliedFilter: { ...state.appliedFilter, ...state.filterDraft },
      };
    }
    default:
      return {
        filterDraft: {},
        appliedFilter: state.appliedFilter,
      };
  }
};
