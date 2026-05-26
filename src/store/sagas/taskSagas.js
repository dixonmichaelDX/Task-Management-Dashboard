import { call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import { mockApi } from "../../api/mockApi";
import {
  FETCH_TASKS_REQUEST,
  fetchTasksSuccess,
  fetchTasksFailure,
  CREATE_TASK_REQUEST,
  createTaskOptimistic,
  createTaskSuccess,
  createTaskFailure,
  UPDATE_TASK_REQUEST,
  updateTaskOptimistic,
  updateTaskSuccess,
  updateTaskFailure,
  DELETE_TASK_REQUEST,
  deleteTaskOptimistic,
  deleteTaskSuccess,
  deleteTaskFailure,
} from "../actions/taskActions";
import { setLoading, setError, closeTaskForm } from "../actions/uiActions";

// Selectors to retrieve current entity state for backup rollbacks
const selectTaskById = (taskId) => (state) => state.entities.tasks.byId[taskId];

// Fetch Sagas
export function* fetchTasksSaga(action) {
  try {
    yield put(setLoading("tasks", true));
    yield put(setError("tasks", null));
    const response = yield call(mockApi.fetchTasks, action.payload);
    yield put(fetchTasksSuccess(response.data));
  } catch (error) {
    yield put(fetchTasksFailure(error.message));
    yield put(setError("tasks", error.message));
  } finally {
    yield put(setLoading("tasks", false));
  }
}

export function* fetchUsersSaga() {
  try {
    yield put(setLoading("users", true));
    yield put(setError("users", null));
    const response = yield call(mockApi.fetchUsers);
    yield put({ type: "FETCH_USERS_SUCCESS", payload: response.data });
  } catch (error) {
    yield put(setError("users", error.message));
  } finally {
    yield put(setLoading("users", false));
  }
}

export function* fetchProjectsSaga() {
  try {
    yield put(setLoading("projects", true));
    yield put(setError("projects", null));
    const response = yield call(mockApi.fetchProjects);
    yield put({ type: "FETCH_PROJECTS_SUCCESS", payload: response.data });
  } catch (error) {
    yield put(setError("projects", error.message));
  } finally {
    yield put(setLoading("projects", false));
  }
}

// CRUD Sagas
export function* createTaskSaga(action) {
  const taskData = action.payload;
  const tempId = `temp_${Date.now()}`;
  const optimisticTask = {
    ...taskData,
    id: tempId,
    status: "Todo",
    subtasks: taskData.subtasks || [],
  };

  try {
    // 1. Instantly update the UI optimistically
    yield put(createTaskOptimistic(optimisticTask));
    yield put(closeTaskForm()); // Close the modal right away for sleek responsive UX

    // 2. Perform the async API request
    const response = yield call(mockApi.createTask, taskData);

    // 3. Swap the temporary task with verified server data
    yield put(createTaskSuccess({ ...response.data, tempId }));
  } catch (error) {
    // 4. Rollback and notify the user on failure
    yield put(createTaskFailure({ tempId, error: error.message }));
    yield put(setError("form", `Failed to create task: ${error.message}`));
    alert(`Failed to create task: ${error.message}. Form state rolled back.`);
  }
}

export function* updateTaskSaga(action) {
  const { taskId, updates } = action.payload;
  const originalTask = yield select(selectTaskById(taskId));

  try {
    if (!originalTask) return;

    // 1. Optimistic update
    yield put(updateTaskOptimistic(taskId, updates));
    yield put(closeTaskForm());

    // 2. Perform server API call
    const response = yield call(mockApi.updateTask, taskId, updates);

    // 3. Confirm success
    yield put(updateTaskSuccess(response.data));
  } catch (error) {
    // 4. Rollback to backup on failure
    yield put(updateTaskFailure(taskId, error.message));
    // Restore using backup
    yield put({
      type: "UPDATE_TASK_FAILURE",
      payload: { taskId, originalTask, error: error.message },
    });
    alert(`Failed to update task: ${error.message}. Changes rolled back.`);
  }
}

export function* deleteTaskSaga(action) {
  const taskId = action.payload;
  const originalTask = yield select(selectTaskById(taskId));

  try {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // 1. Optimistic delete
      yield put(deleteTaskOptimistic(taskId));

      // 2. Call delete API
      yield call(mockApi.deleteTask, taskId);
      yield put(deleteTaskSuccess(taskId));
    }
  } catch (error) {
    // 3. Restore on failure
    yield put({
      type: "DELETE_TASK_FAILURE",
      payload: { taskId, originalTask, error: error.message },
    });
    alert(`Failed to delete task: ${error.message}. Task restored.`);
  }
}

// Watchers
export function* watchFetchTasks() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
}

export function* watchFetchUsers() {
  yield takeLatest("FETCH_USERS_REQUEST", fetchUsersSaga);
}

export function* watchFetchProjects() {
  yield takeLatest("FETCH_PROJECTS_REQUEST", fetchProjectsSaga);
}

export function* watchCreateTask() {
  yield takeEvery(CREATE_TASK_REQUEST, createTaskSaga);
}

export function* watchUpdateTask() {
  yield takeEvery(UPDATE_TASK_REQUEST, updateTaskSaga);
}

export function* watchDeleteTask() {
  yield takeEvery(DELETE_TASK_REQUEST, deleteTaskSaga);
}
