import {
  SEARCH_GLOBAL,
  RESULT_FILTER_BY_SEARCH_USERS,
  RESULT_FILTER_BY_SEARCH_USERS_NULL,
  RESULT_FILTER_BY_SEARCH_STREAMS,
  RESULT_FILTER_BY_SEARCH_STREAMS_NULL,
  RESULT_FILTER_BY_SEARCH_DOCUMENTS,
  RESULT_FILTER_BY_SEARCH_DOCUMENTS_NULL,
} from './actionTypes.search';

import http from 'http/index';

// import { AppState } from "..";
import { generateSearchItems } from '../../utils/generateSearchItems';

export const filterBySearchDocumentsNull = () => {
  return {
    type: RESULT_FILTER_BY_SEARCH_DOCUMENTS_NULL,
  };
};

export const filterBySearchStreamNull = () => {
  return {
    type: RESULT_FILTER_BY_SEARCH_STREAMS_NULL,
  };
};

export const filterBySearchNull = () => {
  return {
    type: RESULT_FILTER_BY_SEARCH_USERS_NULL,
  };
};

export const filterBySearch = (title) => {
  return async (dispatch, getState) => {
    const { documents } = getState().documents;
    const { streams } = getState().streams;
    const { users } = getState().users;

    const { documents: documentSearch } = getState().search;
    const { streams: streamsSearch } = getState().search;
    const { users: usersSearch } = getState().search;

    const result = [];

    if (title === 'Users') {
      for (let i of users) {
        for (let j of usersSearch) {
          if (i.id === j.id) {
            result.push(i);
          }
        }
      }
    } else if (title === 'Documents') {
      for (let i of documents) {
        for (let j of documentSearch) {
          if (i.id === j.id) {
            result.push(i);
          }
        }
      }
    } else {
      for (let i of streams) {
        for (let j of streamsSearch) {
          if (i.id === j.id) {
            result.push(i);
          }
        }
      }
    }

    if (title === 'Users') {
      //console.log("RESULT USERS : ", result)
      dispatch({ type: RESULT_FILTER_BY_SEARCH_USERS, payload: result });
    } else if (title === 'Streams') {
      dispatch({ type: RESULT_FILTER_BY_SEARCH_STREAMS, payload: result });
    } else {
      dispatch({ type: RESULT_FILTER_BY_SEARCH_DOCUMENTS, payload: result });
    }
  };
};

export const search = (value) => {
  return async (dispatch, getState) => {
    const result = await http.get('/search', {
      params: {
        text: value,
      },
    });
    console.log(result);
    const searchResult = generateSearchItems(result.data);
    dispatch({ type: SEARCH_GLOBAL, payload: searchResult });
  };
};
