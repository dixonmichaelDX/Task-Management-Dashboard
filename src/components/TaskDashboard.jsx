// Main Dashboard Component
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";

import {
  selectAllTasks,
  selectFilteredTasks,
  selectTaskFormState,
  selectUsers,
  selectProjects,
  selectFilters,
  selectLoading,
  selectErrors,
} from "../store/selectors";

import {
  fetchTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  openTaskForm,
  closeTaskForm,
  setFilters,
} from "../store/actions";

const TaskDashboard = () => {
  const dispatch = useDispatch();

  // Connect to Redux state using selectors
  const tasks = useSelector(selectFilteredTasks);
  const taskForm = useSelector(selectTaskFormState);
  const users = useSelector(selectUsers);
  const projects = useSelector(selectProjects);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);

  // Fetch initial data on component mount
  useEffect(() => {
    dispatch({ type: "FETCH_USERS_REQUEST" });
    dispatch({ type: "FETCH_PROJECTS_REQUEST" });
  }, [dispatch]);

  // Refetch tasks when filters change
  useEffect(() => {
    dispatch(fetchTasksRequest(filters));
  }, [dispatch, filters]);

  // Event handlers
  const handleCreateTask = () => {
    dispatch(openTaskForm("create", null));
  };

  const handleEditTask = (taskId) => {
    dispatch(openTaskForm("edit", taskId));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTaskRequest(taskId));
  };

  const handleFormSubmit = (formData) => {
    if (taskForm.mode === "create") {
      dispatch(createTaskRequest(formData));
    } else {
      dispatch(updateTaskRequest(taskForm.taskId, formData));
    }
  };

  const handleFormClose = () => {
    dispatch(closeTaskForm());
  };

  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="task-dashboard">
      <header className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <button
          className="create-task-btn"
          onClick={handleCreateTask}
          id="create-task-button"
        >
          + Create Task
        </button>
      </header>

      {errors.tasks && (
        <div className="error-banner">Error: {errors.tasks}</div>
      )}

      {errors.form && (
        <div className="error-banner" style={{ background: "#f59e0b" }}>
          {errors.form}
        </div>
      )}

      <FilterBar
        filters={filters}
        projects={projects}
        users={users}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        tasks={tasks}
        loading={loading.tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        isOpen={taskForm.isOpen}
        mode={taskForm.mode}
        initialData={
          taskForm.taskId ? tasks.find((t) => t.id === taskForm.taskId) : null
        }
        users={users}
        projects={projects}
        loading={loading.tasks}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
};

export default TaskDashboard;
