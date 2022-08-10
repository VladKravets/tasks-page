// import { AppState } from "..";
import { Dispatch } from "redux";
import { GET_TASK_FOR_BOARD } from "./actionTypes.board";

export const getTaskForBoard = () => {
  return async (dispatch, getState) => {
    const { tasks } = getState().tasks;

    const todos = [];
    const inProgress = [];
    const dones = [];

    for (let i of tasks) {
      if (i.status === "DONE") {
        dones.push(i);
      } else if (i.status === "IN_PROGRESS") {
        inProgress.push(i);
      } else if (i.status === "TODO") {
        todos.push(i);
      } else {
        continue;
      }
    }

    dispatch({
      type: GET_TASK_FOR_BOARD,
      payload: {
        done: dones,
        todo: todos,
        progress: inProgress,
      },
    });
  };
};
