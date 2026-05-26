import { combineReducers } from "redux";
import tasksReducer from "./tasksReducer";
import uiReducer from "./uiReducer";
import usersReducer from "./usersReducer";
import projectsReducer from "./projectsReducer";

const entitiesReducer = combineReducers({
  tasks: tasksReducer,
  users: usersReducer,
  projects: projectsReducer,
});

const optimisticReducer = (
  state = { pendingCreates: [], pendingUpdates: {}, pendingDeletes: [] },
  action,
) => {
  // We can track optimistic events here or handle directly in sub-reducers.
  // To keep it simple, we use tasksReducer to handle rollbacks via backups.
  return state;
};

const rootReducer = combineReducers({
  entities: entitiesReducer,
  ui: uiReducer,
  optimistic: optimisticReducer,
});

export default rootReducer;
