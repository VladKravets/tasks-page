import {
  CHANGE_CURRENT_MENU,
  GET_TASKS,
  GET_TASKS_GROUPS,
  GET_TASK,
  TASK_NULL,
  DELETE_TASK,
  OPEN_FILE_BY_ID,
  OPEN_FILE_BY_ID_NAME,
  FILE_DEFAULT_NULL,
  CREATE_TASK_GROUP,
  CREATE_TASK_ALERT,
  CREATE_TASK_LOADING,
  DELETE_TASK_ALERT,
  PATCH_TASK_ALERT,
} from './actiosTypes.tasks';

import http from 'http/index';

export const createTaskGroup = (data) => {
  return async (dispatch) => {
    const result = await http.post('/task-groups', data);

    dispatch({ type: CREATE_TASK_GROUP, payload: result.data });
  };
};

export const fileDefaultNull = () => {
  return {
    type: FILE_DEFAULT_NULL,
  };
};

export const openFileByIdName = (name) => {
  return {
    type: OPEN_FILE_BY_ID_NAME,
    payload: name,
  };
};

export const openFileById = (id) => {
  return {
    type: OPEN_FILE_BY_ID,
    payload: id,
  };
};

export const deleteTask = (id) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_TASK_LOADING, payload: true });
    const result = await http.delete(`/tasks/${id}`);

    console.log('reusult delete : ', result);
    dispatch({ type: CREATE_TASK_LOADING, payload: false });
    dispatch({ type: DELETE_TASK_ALERT, payload: true });
    dispatch({ type: DELETE_TASK, payload: id });

    setTimeout(() => {
      dispatch({ type: DELETE_TASK_ALERT, payload: false });
    }, 1000);
  };
};

export const createTask = (data, assigneeList, comments, listFiles) => {
  return async (dispatch) => {
    let createdTaskId;
    dispatch({ type: CREATE_TASK_LOADING, payload: true });
    //* Task POST request
    await http
      .post('/tasks', data)
      //* Task comments POST request
      .then((result) => {
        createdTaskId = result.data.id;
        if (comments.length > 0) {
          for (let i = 0; i < comments.length; i++) {
            const comment = comments[i];
            http
              .post(`/tasks/${result.data.id}/comments`, { text: comment })
              .then((commentResult) => {
                console.log('"Success load comment" :>> ', commentResult);
                // dispatch({ type: CREATE_TASK, payload: result.data });
              })
              .catch((err) => {
                console.log('Error load comment :', err.message);
              });
          }
        }
      })
      //*Add assignee
      .then(async () => {
        if (assigneeList && !data.approvalDocument) {
          await http.put(`/tasks/${createdTaskId}/assignee`, assigneeList);
        }
      })
      .then(() => {
        if (data.approvalDocument) {
          http.put(`/tasks/${createdTaskId}/documents/${data.approvalDocument}`, null);
        }
      })

      //* Task attachments POST request
      .then((res) => {
        // dispatch({ type: CREATE_TASK, payload: result.data });
        if (listFiles.length > 0) {
          for (let file in listFiles) {
            const loadData = new FormData();
            loadData.append('file', listFiles[file]);
            console.log('listFiles[file] :>> ', listFiles[file]);
            http
              .post(
                `/tasks/${createdTaskId}/attachments`,
                loadData
                // 'Content-Type': 'multipart/form-data',
              )
              .then((result) => {
                console.log('Success load file');
              })
              .catch((err) => {
                console.log('Error load files :', err.message);
              });
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        dispatch(getTasks());
        dispatch({ type: CREATE_TASK_LOADING, payload: false });
        dispatch({ type: CREATE_TASK_ALERT, payload: true });
        setTimeout(() => {
          dispatch({ type: CREATE_TASK_ALERT, payload: false });
        }, 1000);
      });
  };
};

export const createApprovalTask = (document, approvers, data) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_LOADING, payload: true });
  await Promise.all(
    approvers.map(async (approver) => {
      let createdTaskId;
      await http
        .put(`/documents/${document}/approvers/${approver.id}`)
        .then(async (res) => {
          console.log('res', res);
          createdTaskId = res.data.taskID;
          await http.patch(`/tasks/${createdTaskId}`, data);
        })
        .then(async () => {
          if (data.comments.length > 0) {
            for (let i = 0; i < data.comments.length; i++) {
              const comment = data.comments[i];
              await http.post(`/tasks/${createdTaskId}/comments`, { text: comment });
            }
          }
        })
        .then(async () => {
          if (data.attachments.length > 0) {
            for (let file in data.attachments) {
              const loadData = new FormData();
              loadData.append('file', data.attachments[file]);
              await http.post(`/tasks/${createdTaskId}/attachments`, loadData);
            }
          }
        });
    })
  )
    .catch((err) => console.error(err))
    .finally(() => {
      dispatch(getTasks());
      dispatch({ type: CREATE_TASK_LOADING, payload: false });
      dispatch({ type: CREATE_TASK_ALERT, payload: true });
      setTimeout(() => {
        dispatch({ type: CREATE_TASK_ALERT, payload: false });
      }, 1000);
    });
};

export const patchTask = (data, taskId) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_TASK_LOADING, payload: true });
    http
      .patch(`/tasks/${taskId}`, data)
      .then(() => {
        if (data.assignee) {
          http
            .put(`/tasks/${taskId}/assignee`, data.assignee)
            .then(() => dispatch(getTasks()))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        !data.assignee && dispatch(getTasks());
        dispatch({ type: CREATE_TASK_LOADING, payload: false });
        dispatch({ type: PATCH_TASK_ALERT, payload: true });
        setTimeout(() => {
          dispatch({ type: PATCH_TASK_ALERT, payload: false });
        }, 1000);
      });
  };
};

export const addComment = (comment, taskId) => (dispatch) => {
  http
    .post(`/tasks/${taskId}/comments`, {
      text: comment,
    })
    .then((res) => dispatch(getTasks()))
    .catch((err) => console.log(err));
};

export const addAttachments = (attachments, taskId) => async (dispatch) => {
  for (let i = 0; i < attachments.length; i++) {
    const loadData = new FormData();
    loadData.append('file', attachments[i]);
    console.log('loadData', loadData);

    http
      .post(`/tasks/${taskId}/attachments`, loadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (i + 1 === attachments.length) dispatch(getTasks());
      })
      .catch((err) => console.log(err));
  }
};

export const getTasksGroups = () => {
  return async (dispatch) => {
    const result = await http.get('/task-groups', {
      params: {
        limit: 1000,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: GET_TASKS_GROUPS, payload: result.data });
  };
};

export const taksNull = () => {
  return {
    type: TASK_NULL,
    payload: null,
  };
};

export const getTask = (id) => {
  return async (dispatch) => {
    const result = await http.get(`/tasks/${id}`);
    dispatch({ type: GET_TASK, payload: result.data });
  };
};

export const getTasks = () => {
  return async (dispatch) => {
    const result = await http
      .get('/tasks', {
        params: {
          limit: 1000,
        },
      })
      .then(async (res) => {
        res.data.forEach(async (task) => {
          if (task.type === 'APPROVAL_REQUEST') {
            const approvalDocuments = await http.get(`/tasks/${task.id}/documents`);
            // console.log("approvalDocuments :>> ", approvalDocuments);
            task.approvalDocuments = approvalDocuments.data;
          }
          // console.log("res.data :>> ", res.data);
        });
        return res;
      })
      .catch((err) => console.error(err));

    // console.log("result.data :>> ", result);
    dispatch({ type: GET_TASKS, payload: result?.data?.reverse() });
  };
};

export const changeCurrentMenuTasks = (num) => {
  return {
    type: CHANGE_CURRENT_MENU,
    payload: num,
  };
};
