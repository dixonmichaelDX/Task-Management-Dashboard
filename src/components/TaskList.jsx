// Task List Component
// TODO: Implement task list with filtering and sorting

import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onEditTask, 
  onDeleteTask 
}) => {

  // TODO: Implement task list functionality
  // Requirements:
  // 1. Display tasks in a grid or list layout
  // 2. Show loading state
  // 3. Handle empty state
  // 4. Implement sorting options

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks ({tasks.length})</h2>
        {/* TODO: Add sorting options */}
        <div className="sort-options">
          {/* <select>
            <option value="createdAt">Sort by Created Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select> */}
        </div>
      </div>

      <div className="task-grid">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;