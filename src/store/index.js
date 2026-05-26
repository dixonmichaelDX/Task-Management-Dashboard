// Redux store configuration
// TODO: Implement store setup with saga middleware

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

// TODO: Import your reducers here
// import tasksReducer from './reducers/tasksReducer';
// import uiReducer from './reducers/uiReducer';
// import usersReducer from './reducers/usersReducer';
// import projectsReducer from './reducers/projectsReducer';

// TODO: Import your root saga
// import rootSaga from './sagas/rootSaga';

// TODO: Implement the store configuration
// Requirements:
// 1. Create saga middleware
// 2. Combine reducers for normalized state structure
// 3. Apply saga and logger middleware
// 4. Run root saga
// 5. Enable Redux DevTools

const rootReducer = combineReducers({
  // TODO: Add your reducers here
  // TODO: Use normalized state structure (entities, ui)
});

const sagaMiddleware = createSagaMiddleware();

// Configure Redux Logger
const logger = createLogger({
  collapsed: true,
  diff: true,
  duration: true,
  timestamp: true,
  level: 'info',
  logErrors: true,
  predicate: (getState, action) => {
    // Only log in development
    return process.env.NODE_ENV === 'development';
  }
});

// Configure Redux DevTools Extension
const composeEnhancers = 
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25
      })
    : compose;

// TODO: Create and configure store
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
      logger // Logger should be last middleware
    )
  )
);

// TODO: Run root saga
// sagaMiddleware.run(rootSaga);

export default store;

// Expected state structure for reference:
/*
{
  entities: {
    tasks: {
      byId: {
        '1': { id: '1', title: 'Task 1', ... },
        '2': { id: '2', title: 'Task 2', ... }
      },
      allIds: ['1', '2']
    },
    users: {
      byId: { '1': { id: '1', name: 'John', ... } },
      allIds: ['1']
    },
    projects: {
      byId: { '1': { id: '1', name: 'Project', ... } },
      allIds: ['1']
    }
  },
  ui: {
    taskForm: {
      isOpen: false,
      mode: 'create', // 'create' | 'edit'
      taskId: null
    },
    filters: {
      projectId: null,
      assigneeId: null,
      status: 'all',
      taskType: 'all',
      search: ''
    },
    loading: {
      tasks: false,
      users: false,
      projects: false
    },
    errors: {
      tasks: null,
      users: null,
      projects: null,
      form: null
    }
  },
  optimistic: {
    pendingCreates: [], // Array of optimistic task objects
    pendingUpdates: {}, // { taskId: updates }
    pendingDeletes: []  // Array of task IDs being deleted
  }
}
*/