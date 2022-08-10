import http from 'http/index';
import {
  GET_STREAMS,
  ADD_STREAM,
  CHANGE_CURRENT_STREAM,
  SEARCH_STREAM,
  DEFAULT_CURRENT_STREAM,
  OPEN_CREATE_STREAM,
} from './actionTypes.strems';

export const searchStream = (value) => {
  return async (dispatch, getState) => {
    const { streams } = getState().streams;

    const resultSearch = [];
    streams.forEach((item) => {
      if (item.title.includes(value)) {
        resultSearch.push(item);
      }
    });

    dispatch({ type: SEARCH_STREAM, payload: resultSearch });
  };
};

export const getStreamsAll = () => {
  return async (dispatch, getState) => {
    const result = await http.get('/streams');
    dispatch({ type: GET_STREAMS, payload: result.data });
  };
};

export const createStream = (data) => {
  return async (dispatch, getState) => {
    const result = await http.post('/streams', data);

    console.log('RESULT ADD CTREAM :', result.data);
    dispatch({ type: ADD_STREAM, payload: result.data });
  };
};

export const changeCurrentStream = (value) => {
  return (dispatch, getState) => {
    const { streams } = getState().streams;
    const streamCurrent = streams.find((item) => item.id === value);

    console.log('Stream Current', streamCurrent);
    dispatch({ type: CHANGE_CURRENT_STREAM, payload: streamCurrent });
  };
};

export const defaultAllStreamsChange = () => {
  return {
    type: DEFAULT_CURRENT_STREAM,
  };
};

export const setOpenCreateStream = (flag) => {
  return {
    type: OPEN_CREATE_STREAM,
    payload: flag,
  };
};
