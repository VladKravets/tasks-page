import {
  GET_DOCUMENTS,
  // DocumentsActionTypes,
  DELETE_DOCUMENT,
  GET_DOCUMENTS_STATUS,
  TOGGLE_MENU,
  CHANGE_STATUS,
  CHANGE_SORTED,
  HANDLE_CHECKBOX_FILTER,
  CHANGE_BY_STREAM_FILTER,
  CHANGE_CURRENT_PAGE,
  CHANGE_CURRENT_MENU,
  START_LOAD_FILES,
  ERROR_LOAD,
  ERROR_LOAD_DEFAULT,
  COUNT_FILES_LOAD,
  CHANGE_COUNT_LOAD_FILE,
  CHANGE_STREAM,
  ADD_IN_SELECTED_ITEMS,
  REMOVE_CHECKED,
  DEFAULT_SELECTED,
  NEW_VERSION_OPEN,
  NEW_VERSION_CLOSE,
  UPLOADING_NEW_VERSION,
  ADD_VERSION_OPEN,
  ADD_ITEM_VERSION,
  ADD_ITEM_VERSION_DEFAULT,
  GET_DATA_POINTS,
  CLEAR_ADD_DOCUMENT_LIST,
  ADD_DOCUMENT_FILE,
  ADD_DOCUMENT_FILE_SUCCESS,
  ADD_DOCUMENT_FILE_ERROR,
  REMOVE_DOCUMENT_FROM_ADD_MODAL,
} from "./actionTypes.documents";

const initialState = {
  addDocumentList: [],
  dataPoints: [],
  documentsMenu: [],
  documents: [],
  status: "",
  sorted: "",
  currentPage: 1,
  currentMenu: 0,
  filterColumns: {
    "Name & type": true,
    Stream: true,
    Uploaded: true,
    Owner: true,
    Team: true,
    Assignee: true,
  },

  filterTable: [
    { id: 1, label: "ALL", checked: true },
    { id: 2, label: "ASSIGNED", checked: true },
    { id: 3, label: "REVIEWED", checked: true },
    { id: 4, label: "IN_PROGRESS", checked: true },
    { id: 5, label: "APPROVED", checked: true },
  ],

  filterByStream: "",
  listLoading: [],
  isError: false,
  countFilesLoading: 0,
  compliteFile: {},

  modelClose: false,

  selectedItems: [],

  isOpenCompare: false,

  newVersion: {
    open: false,
    id: null,
    title: null,
  },

  loadingNewVersion: false,
  listVersionItems: [],
};

const documentsReducer = (state = initialState, action) => {
  switch (action.type) {
    // case ADD_DOCUMENT_LIST:
    //   return {
    //     ...state,
    //     addDocumentList: action.payload,
    //   };
    case ADD_DOCUMENT_FILE:
      return {
        ...state,
        addDocumentList: [...state.addDocumentList, action.payload],
      };

    case CLEAR_ADD_DOCUMENT_LIST:
      return {
        ...state,
        addDocumentList: [],
      };

    case REMOVE_DOCUMENT_FROM_ADD_MODAL:
      return {
        ...state,
        addDocumentList: state.addDocumentList.filter((document) => document.id !== action.payload),
      };

    case ADD_DOCUMENT_FILE_SUCCESS:
      const withSuccess = state.addDocumentList.map((item) => {
        if (item.fileName === action.payload.name) {
          item.loading = false;
          item.id = action.payload.id;
        }
        return item;
      });

      console.log("withSuccess :>> ", withSuccess);
      return {
        ...state,
        addDocumentList: withSuccess,
      };

    case ADD_DOCUMENT_FILE_ERROR:
      const withError = state.addDocumentList.map((item) => {
        if (item.fileName === action.payload.name) {
          item.loading = false;
          item.error = action.payload.err;
        }
        return item;
      });

      console.log("withError :>> ", withError);
      return {
        ...state,
        addDocumentList: withError,
      };
    // case ADD_DOCUMENT_FILE:
    //   return {
    //     ...state,
    //     addDocumentList: [...state.addDocumentList, action.payload],
    //   };

    case GET_DATA_POINTS:
      return {
        ...state,
        dataPoints: action.payload,
      };
    case GET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload,
      };
    case DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((item) => item.id !== action.payload),
      };
    case GET_DOCUMENTS_STATUS:
      return {
        ...state,
        documentsMenu: action.payload,
      };
    case TOGGLE_MENU:
      return {
        ...state,
        filterColumns: action.payload,
      };
    case CHANGE_STATUS:
      return {
        ...state,
        status: action.payload,
        currentPage: 1,
      };
    case CHANGE_SORTED:
      return {
        ...state,
        sorted: action.payload,
      };
    case HANDLE_CHECKBOX_FILTER:
      return {
        ...state,
        filterTable: action.payload,
      };
    case CHANGE_BY_STREAM_FILTER:
      return {
        ...state,
        filterByStream: action.payload,
      };
    case CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case CHANGE_CURRENT_MENU:
      return {
        ...state,
        currentMenu: action.payload,
      };
    case START_LOAD_FILES:
      return {
        ...state,
        listLoading: [action.payload, ...state.listLoading],
      };
    case ERROR_LOAD:
      return {
        ...state,
        isLoading: false,
        isError: action.payload,
        countFilesLoading: 0,
      };
    case COUNT_FILES_LOAD:
      return {
        ...state,
        countFilesLoading: action.payload,
      };
    case CHANGE_COUNT_LOAD_FILE:
      return {
        ...state,
        countFilesLoading: state.countFilesLoading - 1,
        modelClose: action.payload,
      };
    case ERROR_LOAD_DEFAULT:
      return {
        ...state,
        isError: action.payload,
      };
    case CHANGE_STREAM:
      return {
        ...state,
        documents: action.payload,
      };
    case ADD_IN_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: action.payload,
      };
    case REMOVE_CHECKED:
      return {
        ...state,
        selectedItems: state.selectedItems.filter((item) => item !== action.payload),
      };
    case DEFAULT_SELECTED:
      return {
        ...state,
        selectedItems: [],
      };
    case NEW_VERSION_OPEN:
      return {
        ...state,
        newVersion: {
          open: true,
          id: action.payload.id,
          title: action.payload.title,
        },
      };
    case NEW_VERSION_CLOSE:
      return {
        ...state,
        newVersion: {
          open: false,
          id: null,
          title: null,
        },
      };
    case UPLOADING_NEW_VERSION:
      return {
        ...state,
        loadingNewVersion: action.payload,
      };
    case ADD_VERSION_OPEN:
      return {
        ...state,
        documents: [action.payload, ...state.documents],
      };
    case ADD_ITEM_VERSION:
      return {
        ...state,
        listVersionItems: [...state.listVersionItems, action.payload],
      };
    case ADD_ITEM_VERSION_DEFAULT:
      return {
        ...state,
        listVersionItems: [],
      };
    default:
      return state;
  }
};

export { documentsReducer };
