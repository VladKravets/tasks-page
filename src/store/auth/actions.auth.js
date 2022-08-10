import { clearStorage } from 'utils/storage';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './actionTypes.auth';

export const login = (payload) => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload,
  });
};

export const logout = (payload) => (dispatch) => {
  clearStorage();
  dispatch({
    type: LOGOUT_SUCCESS,
    payload,
  });
  window.location = 'login';
};
