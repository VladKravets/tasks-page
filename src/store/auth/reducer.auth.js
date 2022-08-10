import { getFromStorage } from 'utils/storage';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './actionTypes.auth';
import { convertToCapital } from 'utils/convertText';

const initialState = {
  user: getFromStorage('docstream-user'),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: { ...action.payload, username: convertToCapital(action.payload.username) },
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: initialState.user,
      };

    default:
      return state;
  }
};

export { authReducer };
