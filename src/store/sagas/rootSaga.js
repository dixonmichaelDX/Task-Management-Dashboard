import { all, fork } from "redux-saga/effects";
import {
  watchFetchTasks,
  watchFetchUsers,
  watchFetchProjects,
  watchCreateTask,
  watchUpdateTask,
  watchDeleteTask,
} from "./taskSagas";

export default function* rootSaga() {
  yield all([
    fork(watchFetchTasks),
    fork(watchFetchUsers),
    fork(watchFetchProjects),
    fork(watchCreateTask),
    fork(watchUpdateTask),
    fork(watchDeleteTask),
  ]);
}
