import {
  FETCH_TASKS_SUCCESS,
  CREATE_TASK_OPTIMISTIC,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  UPDATE_TASK_OPTIMISTIC,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  DELETE_TASK_OPTIMISTIC,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
} from "../actions/taskActions";

const initialState = {
  byId: {},
  allIds: [],
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_SUCCESS: {
      const tasks = action.payload;
      const byId = {};
      const allIds = [];

      tasks.forEach((task) => {
        byId[task.id] = task;
        allIds.push(task.id);
      });

      return {
        ...state,
        byId,
        allIds,
      };
    }

    case CREATE_TASK_OPTIMISTIC: {
      const task = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [task.id]: task,
        },
        allIds: [task.id, ...state.allIds],
      };
    }

    case CREATE_TASK_SUCCESS: {
      const task = action.payload;
      const tempId = action.payload.tempId || action.payload.id; // In case we passed it

      const newById = { ...state.byId };

      // Delete temporary/optimistic task
      if (tempId && tempId !== task.id) {
        delete newById[tempId];
      }

      // Insert verified task
      newById[task.id] = task;

      // Update allIds to replace the tempId with the real task.id
      const newAllIds = state.allIds.map((id) =>
        id === tempId ? task.id : id,
      );
      if (!newAllIds.includes(task.id)) {
        newAllIds.unshift(task.id);
      }

      return {
        ...state,
        byId: newById,
        allIds: newAllIds,
      };
    }

    case CREATE_TASK_FAILURE: {
      const { tempId } = action.payload || {};
      if (!tempId) return state;

      const newById = { ...state.byId };
      delete newById[tempId];

      return {
        ...state,
        byId: newById,
        allIds: state.allIds.filter((id) => id !== tempId),
      };
    }

    case UPDATE_TASK_OPTIMISTIC: {
      const { taskId, updates } = action.payload;
      const originalTask = state.byId[taskId];
      if (!originalTask) return state;

      return {
        ...state,
        byId: {
          ...state.byId,
          [taskId]: {
            ...originalTask,
            ...updates,
          },
        },
      };
    }

    case UPDATE_TASK_SUCCESS: {
      const task = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [task.id]: task,
        },
      };
    }

    case UPDATE_TASK_FAILURE: {
      const { taskId, originalTask } = action.payload;
      if (!originalTask) return state;

      return {
        ...state,
        byId: {
          ...state.byId,
          [taskId]: originalTask,
        },
      };
    }

    case DELETE_TASK_OPTIMISTIC: {
      const taskId = action.payload;
      const newById = { ...state.byId };
      delete newById[taskId];

      return {
        ...state,
        byId: newById,
        allIds: state.allIds.filter((id) => id !== taskId),
      };
    }

    case DELETE_TASK_SUCCESS: {
      // Nothing needed, already deleted optimistically
      return state;
    }

    case DELETE_TASK_FAILURE: {
      const { taskId, originalTask } = action.payload;
      if (!originalTask) return state;

      return {
        ...state,
        byId: {
          ...state.byId,
          [taskId]: originalTask,
        },
        allIds: [taskId, ...state.allIds],
      };
    }

    default:
      return state;
  }
};

export default tasksReducer;
