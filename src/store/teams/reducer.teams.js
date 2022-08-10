import { GET_TEAMS } from "./actionTypes.teams";
// import { Team } from "./type.teams";

const initialState = {
  teams: [],
};

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };
    default:
      return state;
  }
};

export { teamsReducer };
