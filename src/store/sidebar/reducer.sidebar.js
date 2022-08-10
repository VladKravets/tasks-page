import { TOGGLE__SIDEBAR, CHANGE_OPEN_KEYS } from './actionTypes.sidebar';

const initialState = {
  sidebar: true,
  openKeys: ['streams'],
};

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE__SIDEBAR:
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case CHANGE_OPEN_KEYS:
      return {
        ...state,
        openKeys: action.payload,
      };
    default:
      return state;
  }
};

export { sidebarReducer };
