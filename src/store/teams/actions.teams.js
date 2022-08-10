import http from 'http/index';

import { GET_TEAMS } from './actionTypes.teams';

export const getTeams = () => {
  return async (dispatch) => {
    const result = await http.get('/teams');
    dispatch({ type: GET_TEAMS, payload: result.data });
  };
};
