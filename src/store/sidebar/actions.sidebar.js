import { TOGGLE__SIDEBAR, CHANGE_OPEN_KEYS } from "./actionTypes.sidebar";

export const toggleSideBar = () => {
  return (dispatch) => {
    dispatch({ type: TOGGLE__SIDEBAR });
  };
};

export const changeOpenKeys = (payload) => {
  return {
    type: CHANGE_OPEN_KEYS,
    payload
  };
};
