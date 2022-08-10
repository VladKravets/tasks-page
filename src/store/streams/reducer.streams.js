// import { Stream } from "./types.streams";
import {
  GET_STREAMS,
  ADD_STREAM,
  CHANGE_CURRENT_STREAM,
  SEARCH_STREAM,
  DEFAULT_CURRENT_STREAM,
  OPEN_CREATE_STREAM,
} from "./actionTypes.strems";

const initialState = {
  streams: [],
  currentStream: null,
  resultSearch: [],
  isOpenCreate: false,
};

const streamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STREAMS:
      return {
        ...state,
        streams: action.payload,
      };
    case ADD_STREAM:
      return {
        ...state,
        streams: [action.payload, ...state.streams],
      };
    case CHANGE_CURRENT_STREAM:
      return {
        ...state,
        currentStream: action.payload,
      };
    case SEARCH_STREAM:
      return {
        ...state,
        resultSearch: action.payload,
      };
    case DEFAULT_CURRENT_STREAM:
      return {
        ...state,
        currentStream: null,
      };
    case OPEN_CREATE_STREAM:
      return {
        ...state,
        isOpenCreate: action.payload,
      };
    default:
      return state;
  }
};

export { streamsReducer };
