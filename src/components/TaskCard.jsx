// Individual Task Card Component
import React from "react";
import { useSelector } from "react-redux";
import { selectUsers } from "../store/selectors";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const users = useSelector(selectUsers);

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "#22c55e",
      Medium: "#f59e0b",
      High: "#ef4444",
      Critical: "#dc2626",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusColor = (status) => {
    const colors = {
      Todo: "#6b7280",
      "In Progress": "#3b82f6",
      Review: "#f59e0b",
      Done: "#22c55e",
    };
    return colors[status] || "#6b7280";
  };

  // Find assignee name from user entities
  const assignee = users.find((u) => u.id === task.assigneeId);
  const assigneeName = assignee ? assignee.name : "Unassigned";

  // Check if this is an optimistic update (temporary ID)
  const isOptimistic = String(task.id).startsWith("temp_");

  return (
    <div
      className={`task-card ${task.taskType?.toLowerCase()} ${isOptimistic ? "optimistic-pending" : ""}`}
    >
      {isOptimistic && (
        <span className="optimistic-indicator">⏳ Saving...</span>
      )}

      <div className="task-card-header">
        <div className="task-meta">
          <span
            className="task-type"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.taskType}
          </span>
          <span
            className="task-status"
            style={{ color: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
        </div>

        <div className="task-actions">
          <button
            onClick={onEdit}
            className="btn-edit"
            title="Edit Task"
            disabled={isOptimistic}
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="btn-delete"
            title="Delete Task"
            disabled={isOptimistic}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>

        {task.description && (
          <p className="task-description">
            {task.description.length > 100
              ? `${task.description.substring(0, 100)}...`
              : task.description}
          </p>
        )}

        {/* Dynamic Fields - Task-Type Specific details */}
        {task.taskType === "Bug" && (
          <div className="dynamic-details">
            {task.severity && (
              <div className="task-severity">
                Severity:{" "}
                <span className={`severity-${task.severity?.toLowerCase()}`}>
                  {task.severity}
                </span>
              </div>
            )}
            {task.stepsToReproduce && (
              <div className="task-preview-section">
                <span className="preview-text">{task.stepsToReproduce}</span>
              </div>
            )}
          </div>
        )}

        {task.taskType === "Feature" && (
          <div className="dynamic-details">
            {task.businessValue && (
              <div className="task-preview-section">
                <span className="preview-text">{task.businessValue}</span>
              </div>
            )}
            {task.acceptanceCriteria?.length > 0 && (
              <div className="task-criteria">
                {task.acceptanceCriteria.length} acceptance criteria
              </div>
            )}
          </div>
        )}

        {task.taskType === "Enhancement" && (
          <div className="dynamic-details">
            {task.currentBehavior && (
              <div className="task-preview-section">
                <span className="preview-text">{task.currentBehavior}</span>
              </div>
            )}
          </div>
        )}

        {task.taskType === "Research" && (
          <div className="dynamic-details">
            {task.researchQuestions?.length > 0 && (
              <div className="task-criteria">
                {task.researchQuestions.length} research questions
              </div>
            )}
          </div>
        )}

        {/* Subtasks count */}
        {task.subtasks?.length > 0 && (
          <div className="task-subtasks">
            Subtasks:{" "}
            {
              task.subtasks.filter(
                (st) => st.completed || st.completed === "true",
              ).length
            }
            /{task.subtasks.length}
          </div>
        )}
      </div>

      <div className="task-footer">
        <div className="task-assignee">Assigned to: {assigneeName}</div>

        {task.dueDate && (
          <div
            className={`task-due-date ${new Date(task.dueDate) < new Date() ? "overdue" : ""}`}
            style={{
              color:
                new Date(task.dueDate) < new Date()
                  ? "#e74c3c"
                  : getPriorityColor(task.priority),
              fontWeight: "bold",
            }}
          >
            Due: {new Date(task.dueDate).toLocaleDateString("en-US")}
          </div>
        )}

        <div className="task-priority">
          Priority:{" "}
          <span
            style={{
              color: getPriorityColor(task.priority),
              fontWeight: "bold",
            }}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
