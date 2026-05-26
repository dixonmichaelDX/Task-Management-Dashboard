import { createSelector } from "reselect";

// Base selectors
export const selectTasksState = (state) =>
  state.entities?.tasks || { byId: {}, allIds: [] };
export const selectUsersState = (state) =>
  state.entities?.users || { byId: {}, allIds: [] };
export const selectProjectsState = (state) =>
  state.entities?.projects || { byId: {}, allIds: [] };
export const selectUiState = (state) => state.ui || {};

// Tasks selectors
export const selectAllTasks = createSelector([selectTasksState], (tasksState) =>
  tasksState.allIds.map((id) => tasksState.byId[id]),
);

// Users selectors
export const selectUsers = createSelector([selectUsersState], (usersState) =>
  usersState.allIds.map((id) => usersState.byId[id]),
);

// Projects selectors
export const selectProjects = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.allIds.map((id) => projectsState.byId[id]),
);

// UI selectors
export const selectTaskFormState = createSelector(
  [selectUiState],
  (uiState) =>
    uiState.taskForm || { isOpen: false, mode: "create", taskId: null },
);

export const selectFilters = createSelector(
  [selectUiState],
  (uiState) =>
    uiState.filters || {
      projectId: null,
      assigneeId: null,
      status: "all",
      taskType: "all",
      search: "",
    },
);

export const selectLoading = createSelector(
  [selectUiState],
  (uiState) =>
    uiState.loading || { tasks: false, users: false, projects: false },
);

export const selectErrors = createSelector(
  [selectUiState],
  (uiState) =>
    uiState.errors || { tasks: null, users: null, projects: null, form: null },
);

// Filtered tasks selector (combining active filters and search term client-side for dynamic rendering and speed)
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (tasks, filters) => {
    let filtered = [...tasks];

    if (filters.projectId) {
      filtered = filtered.filter(
        (task) => task.projectId === filters.projectId,
      );
    }

    if (filters.assigneeId) {
      filtered = filtered.filter(
        (task) => task.assigneeId === filters.assigneeId,
      );
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters.taskType && filters.taskType !== "all") {
      filtered = filtered.filter((task) => task.taskType === filters.taskType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          (task.title && task.title.toLowerCase().includes(searchLower)) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  },
);
