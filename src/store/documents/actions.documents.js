import {
  GET_DOCUMENTS,
  GET_DATA_POINTS,
  DELETE_DOCUMENT,
  GET_DOCUMENTS_STATUS,
  TOGGLE_MENU,
  CHANGE_STATUS,
  CHANGE_SORTED,
  HANDLE_CHECKBOX_FILTER,
  CHANGE_BY_STREAM_FILTER,
  CHANGE_CURRENT_PAGE,
  CHANGE_CURRENT_MENU,
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
  ADD_NEW_VERSION,
  UPLOADING_NEW_VERSION,
  ADD_ITEM_VERSION,
  ADD_ITEM_VERSION_DEFAULT,
  ADD_DOCUMENT_LIST,
  ADD_DOCUMENT_FILE,
  ADD_DOCUMENT_FILE_SUCCESS,
  ADD_DOCUMENT_FILE_ERROR,
  REMOVE_DOCUMENT_FROM_ADD_MODAL,
} from './actionTypes.documents';

import http from 'http/index';

import { convertDataByVersion } from '../../utils/converDataByVersion';

export const defaultVersionItems = () => {
  return {
    type: ADD_ITEM_VERSION_DEFAULT,
  };
};

export const openVersion = (data) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ITEM_VERSION, payload: data });
  };
};

export const addDocumentList = (list) => {
  return (dispatch) => {
    dispatch({ type: ADD_DOCUMENT_LIST, payload: list });
  };
};

export const uploadNewVersion = (files, id) => {
  return async (dispatch) => {
    dispatch({ type: UPLOADING_NEW_VERSION, payload: true });
    for (let file in files) {
      const loadData = new FormData();
      loadData.append('file', files[file]);

      http
        .post(
          `/documents/${id}/new-version`,
          loadData
          // {headers: {
          //   Authorization: `Basic YWJjOjEyMzQ1`,
          //   'Content-Type': 'multipart/form-data',
          // }},
        )
        .then((result) => {
          dispatch({ type: ADD_NEW_VERSION, payload: result.data });
          dispatch({ type: UPLOADING_NEW_VERSION, payload: false });
        })
        .catch((err) => {
          console.log('Error :', err.message);
        });
    }
  };
};

export const newVersionClose = () => {
  return {
    type: NEW_VERSION_CLOSE,
  };
};

export const newVersionOpen = (data) => {
  return {
    type: NEW_VERSION_OPEN,
    payload: data,
  };
};

export const changeStream = (idDoc, stream) => {
  return (dispatch, getState) => {
    const { documents } = getState().documents;

    http
      .put(`/documents/${idDoc}/stream`, JSON.stringify(stream.id))
      .then((result) => {
        const newArray = documents.map((item) => {
          if (item.id === idDoc) {
            item.stream = stream;
          }
          return item;
        });

        dispatch({ type: CHANGE_STREAM, payload: newArray });
      })
      .catch((err) => {
        console.log('Error : ', err);
      });
  };
};

export const uploadFiles = (files, currentStream) => {
  return async (dispatch, getState) => {
    dispatch({ type: COUNT_FILES_LOAD, payload: files.length });

    console.log('files :>> ', files);

    for (let file in files) {
      const loadData = new FormData();
      loadData.append('file', files[file]);
      console.log('object :>> ', files[file]);

      http
        .post(`/streams/${currentStream.id}/documents`, loadData)
        .then((result) => {
          const { countFilesLoading } = getState().documents;

          if (countFilesLoading > 1) {
            dispatch({ type: CHANGE_COUNT_LOAD_FILE, payload: false });
          } else {
            dispatch({ type: CHANGE_COUNT_LOAD_FILE, payload: true });
          }
          // window.location.reload();
        })
        .catch((err) => {
          console.log('Error : ', err.message);
          dispatch({ type: ERROR_LOAD, payload: true });
        });
    }
  };
};

//* ADD DOCUMENT FILE

export const uploadFile = (file, currentStream) => {
  return async (dispatch, state) => {
    // console.log("file :>> ", file);

    const newFile = { fileName: file.name, loading: true, error: null };
    dispatch({
      type: ADD_DOCUMENT_FILE,
      payload: newFile,
    });

    const loadData = new FormData();
    loadData.append('file', file);

    console.log('loadData :>> ', loadData);

    http
      .post(`/streams/${currentStream}/documents`, loadData)
      .then((res) => {
        console.log(res);
        // dispatch(getDocumentsAll());
        dispatch({
          type: ADD_DOCUMENT_FILE_SUCCESS,
          payload: { name: file.name, id: res.data.id },
        });
      })
      .catch((err) => {
        console.log('Error : ', err.message);

        dispatch({
          type: ADD_DOCUMENT_FILE_ERROR,
          payload: { name: file.name, err },
        });
      });
  };
};

export const changeStatusFilter = (id) => {
  return (dispatch, getState) => {
    const { filterTable } = getState().documents;
    filterTable.forEach((item) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
    });
    dispatch({ type: HANDLE_CHECKBOX_FILTER, payload: filterTable });
  };
};

export const changeStreamFilter = (value) => {
  return {
    type: CHANGE_BY_STREAM_FILTER,
    payload: value,
  };
};

export const getFiltersDocuments = () => {
  return (dispatch, getState) => {
    let finalQuery = `/documents?`;
    const { filterTable, filterByStream } = getState().documents;
    const currentItems = filterTable.filter((item) => item.label !== 'ALL');
    currentItems.forEach((item) => {
      if (item.checked) {
        finalQuery += `status=${item.label}&`;
      }
    });
    http
      .get(finalQuery, {
        params: {
          limit: 1000,
          stream: filterByStream,
        },
      })
      .then((result) => {
        console.log('success :', result);
      })
      .catch((err) => {
        console.log('Error : ', err);
      });
  };
};

export const ChangeSorted = (newValueSorted) => {
  return (dispatch, getState) => {
    const { sorted } = getState().documents;
    let currentSorted;
    if (newValueSorted === sorted) {
      currentSorted = '';
    } else {
      currentSorted = newValueSorted;
    }
    dispatch({ type: CHANGE_SORTED, payload: currentSorted });
  };
};

export const ChangeStatus = (newStatus) => {
  let currunetStatus = newStatus === 'All' ? '' : newStatus;
  return (dispatch) => {
    dispatch({
      type: CHANGE_STATUS,
      payload: currunetStatus,
    });
  };
};

export const addInSelectedItems = (id) => {
  return (dispatch, getState) => {
    const { selectedItems } = getState().documents;

    const newSelected = [...selectedItems, id];

    dispatch({ type: ADD_IN_SELECTED_ITEMS, payload: newSelected });
  };
};

export const removeInSelectedItems = (id) => {
  return {
    type: REMOVE_CHECKED,
    payload: id,
  };
};

export const defaultSelected = () => {
  return {
    type: DEFAULT_SELECTED,
  };
};

export const deleteDocument = (id) => {
  return (dispatch, getState) => {
    http
      .delete(`/documents/${id}`)
      .then((result) => {
        dispatch({ type: DELETE_DOCUMENT, payload: id });
      })
      .catch((err) => console.log('ERROR :', err));
  };
};

export const deleteDocumentFromAddModal = (id) => {
  return (dispatch, getState) => {
    http
      .delete(`/documents/${id}`)
      .then((result) => {
        dispatch({ type: REMOVE_DOCUMENT_FROM_ADD_MODAL, payload: id });
        dispatch(getDocumentsAll());
      })
      .catch((err) => console.log('ERROR :', err));
  };
};

export const getDocumentsAll = () => {
  return async (dispatch, getState) => {
    const { status, sorted } = getState().documents;

    await http
      .get('/documents/', {
        params: {
          limit: 1000,
          status: status ? status : null,
          sort: sorted,
        },
      })
      .then((result) => {
        //console.log("DOCUMENTS : ", result.data);
        const dataByVersion = convertDataByVersion(result.data);
        dispatch({ type: GET_DOCUMENTS, payload: dataByVersion });
      })
      .catch((err) => {
        console.log('Erorr Actions :', err);
      });
  };
};

export const getDataPoints = () => async (dispatch) => {
  try {
    const { data } = await http.get('/data-points/');
    console.log(data);
    dispatch({ type: GET_DATA_POINTS, payload: data });
  } catch (error) {
    console.error('Error get data points: ', error);
  }
};

const sortByStreamStatusCount = (data) => {
  const IN_PROGRESS = {
    id: 1,
    label: 'IN_PROGRESS',
    count: 0,
  };

  const REVIEWED = {
    id: 2,
    label: 'REVIEWED',
    count: 0,
  };

  const ASSIGNED = {
    id: 3,
    label: 'ASSIGNED',
    count: 0,
  };

  const APPROVED = {
    id: 4,
    label: 'APPROVED',
    count: 0,
  };

  const REJECTED = {
    id: 5,
    label: 'REJECTED',
    count: 0,
  };

  for (let i of data) {
    if (i.status === 'IN_PROGRESS') {
      IN_PROGRESS['count'] = IN_PROGRESS['count'] + 1;
    } else if (i.status === 'REVIEWED') {
      REVIEWED['count'] = REVIEWED['count'] + 1;
    } else if (i.status === 'ASSIGNED') {
      ASSIGNED['count'] = ASSIGNED['count'] + 1;
    } else if (i.status === 'APPROVED') {
      APPROVED['count'] = APPROVED['count'] + 1;
    } else if (i.status === 'REJECTED') {
      REJECTED['count'] = REJECTED['count'] + 1;
    } else {
    }
  }

  let myarray = [{ id: 0, label: 'All' }, IN_PROGRESS, REVIEWED, ASSIGNED, APPROVED, REJECTED];

  return myarray;
};

function conversion(data) {
  let myarray = [{ id: 0, label: 'All' }];

  // eslint-disable-next-line
  Object.keys(data).map((key, index) => {
    myarray.push({ id: index + 1, label: key, count: data[key] });
  });

  return myarray;
}

export const getDocumentsStatus = (currentData) => {
  return async (dispatch, getState) => {
    const { currentStream } = getState().streams;
    const { filterResultDocuments } = getState().search;
    //console.log("CURRENT STREAM : ", currentStream)

    const result = await http.get('/documents/count-by-status');

    const dataByVersion = convertDataByVersion(currentData);
    const dataByVersionFilter = convertDataByVersion(filterResultDocuments);

    if (filterResultDocuments.length > 0) {
      dispatch({
        type: GET_DOCUMENTS_STATUS,
        payload: sortByStreamStatusCount(dataByVersionFilter),
      });
    }

    if (!currentStream) {
      dispatch({
        type: GET_DOCUMENTS_STATUS,
        payload: conversion(result.data),
      });
    } else {
      dispatch({
        type: GET_DOCUMENTS_STATUS,
        payload: sortByStreamStatusCount(dataByVersion),
      });
    }

    // if(currentData.length > 0) {
    //   dispatch({type: GET_DOCUMENTS_STATUS, payload: sortByStreamStatusCount(currentData)})
    // }else {
    //   dispatch({type:GET_DOCUMENTS_STATUS, payload: conversion(result.data)})
    // }d
  };
};

export const handleShowHideColumns = (value) => {
  return (dispatch, getState) => {
    const { documents } = getState();
    const { filterColumns } = documents;
    filterColumns[value] = !filterColumns[value];
    dispatch({ type: TOGGLE_MENU, payload: filterColumns });
  };
};

export const checkedAll = () => {
  return async (dispatch, getState) => {
    const { filterTable } = getState().documents;
    const all = filterTable[0];
    all.checked = !all.checked;
    if (all.checked) {
      filterTable.forEach((item) => {
        item.checked = true;
      });
      dispatch({ type: HANDLE_CHECKBOX_FILTER, payload: filterTable });
      const result = await http.get('/documents/');
      dispatch({ type: GET_DOCUMENTS, payload: result.data });
    } else {
      filterTable.forEach((item) => {
        item.checked = false;
      });
      dispatch({ type: HANDLE_CHECKBOX_FILTER, payload: filterTable });
      dispatch({ type: GET_DOCUMENTS, payload: [] });
    }
  };
};

export const changeCurrentPage = (num) => {
  return {
    type: CHANGE_CURRENT_PAGE,
    payload: num,
  };
};

export const changeCurrentMenu = (num) => {
  return {
    type: CHANGE_CURRENT_MENU,
    payload: num,
  };
};

export const changeErrorNull = () => {
  return {
    type: ERROR_LOAD_DEFAULT,
    payload: false,
  };
};
