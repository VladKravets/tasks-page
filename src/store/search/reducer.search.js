import {
  SEARCH_GLOBAL,
  // SearchActionTypes,
  RESULT_FILTER_BY_SEARCH_USERS,
  RESULT_FILTER_BY_SEARCH_USERS_NULL,
  RESULT_FILTER_BY_SEARCH_STREAMS,
  RESULT_FILTER_BY_SEARCH_STREAMS_NULL,
  RESULT_FILTER_BY_SEARCH_DOCUMENTS,
  RESULT_FILTER_BY_SEARCH_DOCUMENTS_NULL,
} from "./actionTypes.search";

const initialState = {
  searchMenu: [],

  streams: [],
  users: [],
  documents: [],

  filterResultUsers: [],
  filterResultStreams: [],
  filterResultDocuments: [],
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_GLOBAL:
      return {
        ...state,
        searchMenu: action.payload.searchMenu,
        streams: action.payload.streams,
        users: action.payload.users,
        documents: action.payload.documents,
      };
    case RESULT_FILTER_BY_SEARCH_USERS:
      return {
        ...state,
        filterResultUsers: action.payload,
      };
    case RESULT_FILTER_BY_SEARCH_USERS_NULL:
      return {
        ...state,
        filterResultUsers: [],
      };
    case RESULT_FILTER_BY_SEARCH_STREAMS:
      return {
        ...state,
        filterResultStreams: action.payload,
      };
    case RESULT_FILTER_BY_SEARCH_STREAMS_NULL:
      return {
        ...state,
        filterResultStreams: [],
      };
    case RESULT_FILTER_BY_SEARCH_DOCUMENTS:
      return {
        ...state,
        filterResultDocuments: action.payload,
      };
    case RESULT_FILTER_BY_SEARCH_DOCUMENTS_NULL:
      return {
        ...state,
        filterResultDocuments: [],
      };
    default:
      return state;
  }
};

export { searchReducer };
