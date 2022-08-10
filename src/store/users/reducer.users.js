import { GET_USERS, INVITED_USERS, DELETE_USER } from "./actionTypes.users";
import { convertToCapital } from 'utils/convertText';

const initialState = {
  users: [],
  invitedUsers: []
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload.map(user => { return {...user, username: convertToCapital(user?.username)}}),
      };
    case INVITED_USERS:
      return {
        ...state,
        invitedUsers: action.payload.reverse(),
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export { usersReducer };
