import http from 'http/index';

import { GET_USERS, DELETE_USER, INVITED_USERS } from './actionTypes.users';

export const deleteUser = (id) => {
  return async (dispatch) => {
    await http.delete(`/users/${id}`);
    dispatch({ type: DELETE_USER, payload: id });
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    const result = await http.get('/users');
    dispatch({ type: GET_USERS, payload: result.data });
  };
};

export const getInvitedUsers = () => {
  return async (dispatch) => {
    const result = await http.get('/users/invited');
    dispatch({ type: INVITED_USERS, payload: result.data });
  };
}