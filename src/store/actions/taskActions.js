// Task action creators

// Action Types
export const FETCH_TASKS_REQUEST = "FETCH_TASKS_REQUEST";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILURE = "FETCH_TASKS_FAILURE";

export const CREATE_TASK_REQUEST = "CREATE_TASK_REQUEST";
export const CREATE_TASK_SUCCESS = "CREATE_TASK_SUCCESS";
export const CREATE_TASK_FAILURE = "CREATE_TASK_FAILURE";
export const CREATE_TASK_OPTIMISTIC = "CREATE_TASK_OPTIMISTIC";

export const UPDATE_TASK_REQUEST = "UPDATE_TASK_REQUEST";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_FAILURE = "UPDATE_TASK_FAILURE";
export const UPDATE_TASK_OPTIMISTIC = "UPDATE_TASK_OPTIMISTIC";

export const DELETE_TASK_REQUEST = "DELETE_TASK_REQUEST";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_FAILURE = "DELETE_TASK_FAILURE";
export const DELETE_TASK_OPTIMISTIC = "DELETE_TASK_OPTIMISTIC";

// Predefined Action Creators from Comments / Required by TaskDashboard
export const fetchTasksRequest = (filters = {}) => ({
  type: FETCH_TASKS_REQUEST,
  payload: filters,
});

export const fetchTasksSuccess = (tasks) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: tasks,
});

export const fetchTasksFailure = (error) => ({
  type: FETCH_TASKS_FAILURE,
  payload: error,
});

export const createTaskRequest = (taskData) => ({
  type: CREATE_TASK_REQUEST,
  payload: taskData,
});

export const createTaskSuccess = (task) => ({
  type: CREATE_TASK_SUCCESS,
  payload: task,
});

export const createTaskFailure = (error) => ({
  type: CREATE_TASK_FAILURE,
  payload: error,
});

export const createTaskOptimistic = (task) => ({
  type: CREATE_TASK_OPTIMISTIC,
  payload: task,
});

export const updateTaskRequest = (taskId, updates) => ({
  type: UPDATE_TASK_REQUEST,
  payload: { taskId, updates },
});

export const updateTaskSuccess = (task) => ({
  type: UPDATE_TASK_SUCCESS,
  payload: task,
});

export const updateTaskFailure = (taskId, error) => ({
  type: UPDATE_TASK_FAILURE,
  payload: { taskId, error },
});

export const updateTaskOptimistic = (taskId, updates) => ({
  type: UPDATE_TASK_OPTIMISTIC,
  payload: { taskId, updates },
});

export const deleteTaskRequest = (taskId) => ({
  type: DELETE_TASK_REQUEST,
  payload: taskId,
});

export const deleteTaskSuccess = (taskId) => ({
  type: DELETE_TASK_SUCCESS,
  payload: taskId,
});

export const deleteTaskFailure = (taskId, error) => ({
  type: DELETE_TASK_FAILURE,
  payload: { taskId, error },
});

export const deleteTaskOptimistic = (taskId) => ({
  type: DELETE_TASK_OPTIMISTIC,
  payload: taskId,
});
