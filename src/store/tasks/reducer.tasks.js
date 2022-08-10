// import { AppActions } from "../root.actions";
import {
  GET_TASKS,
  CHANGE_CURRENT_MENU,
  GET_TASKS_GROUPS,
  GET_TASK,
  TASK_NULL,
  DELETE_TASK,
  CREATE_TASK,
  OPEN_FILE_BY_ID,
  OPEN_FILE_BY_ID_NAME,
  FILE_DEFAULT_NULL,
  CREATE_TASK_GROUP,
  CREATE_TASK_ALERT,
  CREATE_TASK_LOADING,
  DELETE_TASK_ALERT,
  PATCH_TASK_ALERT,
} from './actiosTypes.tasks';

const initialState = {
  tasksGroups: [],

  tasks: [],
  currentMenu: 0,
  tasksMenu: [
    { id: 0, title: 'List' },
    { id: 1, title: 'Groups' },
    { id: 2, title: 'Board' },
    { id: 3, title: 'Calendar' },
  ],
  filterTableTasks: {
    Task: true,
    Type: true,
    Assignee: true,
    'Due date': true,
    Status: true,
  },

  openFileById: null,
  openFileByIdName: '',

  currentTask: null,

  alerts: { created: false, deleted: false, changed: false, loading: false },
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case GET_TASKS_GROUPS:
      return {
        ...state,
        tasksGroups: action.payload,
      };
    case CHANGE_CURRENT_MENU:
      return {
        ...state,
        currentMenu: action.payload,
      };
    case GET_TASK:
      return {
        ...state,
        currentTask: action.payload,
      };
    case TASK_NULL:
      return {
        ...state,
        currentTask: action.payload,
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((item) => item.id !== action.payload),
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case CREATE_TASK_ALERT:
      return {
        ...state,
        alerts: { ...state.alerts, created: action.payload },
      };
    case CREATE_TASK_LOADING:
      return {
        ...state,
        alerts: { ...state.alerts, loading: action.payload },
      };
    case DELETE_TASK_ALERT:
      return {
        ...state,
        alerts: { ...state.alerts, deleted: action.payload },
      };
    case PATCH_TASK_ALERT:
      return {
        ...state,
        alerts: { ...state.alerts, changed: action.payload },
      };
    case OPEN_FILE_BY_ID:
      return {
        ...state,
        openFileById: action.payload,
      };
    case OPEN_FILE_BY_ID_NAME:
      return {
        ...state,
        openFileByIdName: action.payload,
      };
    case FILE_DEFAULT_NULL:
      return {
        ...state,
        openFileById: null,
        openFileByIdName: '',
      };
    case CREATE_TASK_GROUP:
      return {
        ...state,
        tasksGroups: [action.payload, ...state.tasksGroups],
      };
    default:
      return state;
  }
};

export { tasksReducer };
