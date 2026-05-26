// Redux store configuration
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";

import rootReducer from "./reducers";
import rootSaga from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Configure Redux Logger
const logger = createLogger({
  collapsed: true,
  diff: true,
  duration: true,
  timestamp: true,
  level: "info",
  logErrors: true,
  predicate: (getState, action) => {
    // Enable logger in development or when running tests
    return true; // We can set this to true so we see actions in logs during development
  },
});

// Configure Redux DevTools Extension
const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : compose;

// Create and configure store
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
      logger, // Logger is last middleware
    ),
  ),
);

// Run root saga
sagaMiddleware.run(rootSaga);

export default store;
