import { GET_TASK_FOR_BOARD } from "./actionTypes.board";

const initialState = {
  todo: [],
  done: [],
  progress: [],
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASK_FOR_BOARD:
      return {
        ...state,
        todo: action.payload.todo,
        done: action.payload.done,
        progress: action.payload.progress,
      };

    default:
      return state;
  }
};

export { boardReducer };
