// Dynamic Task Form Component
import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from "../api/mockApi";

const AUTOSAVE_STORAGE_KEY = "task_form_autosave_data";

const TaskForm = ({
  isOpen,
  mode, // 'create' or 'edit'
  initialData = null,
  onSubmit,
  onClose,
  users = [],
  projects = [],
  loading = false,
}) => {
  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      taskType: "Bug",
      priority: "Medium",
      projectId: "",
      assigneeId: "",
      dueDate: "",
      // Bug fields
      severity: "Medium",
      stepsToReproduce: "",
      // Feature fields
      businessValue: "",
      acceptanceCriteria: [],
      // Enhancement fields
      currentBehavior: "",
      proposedBehavior: "",
      // Research fields
      researchQuestions: [],
      expectedOutcomes: "",
      // Subtasks
      subtasks: [],
    },
  });

  // Watch Task Type and Project selection
  const watchedTaskType = watch("taskType");
  const watchedProjectId = watch("projectId");

  // Watch entire form value for auto-save
  const watchedFormState = watch();

  // Setup dynamic field arrays using useFieldArray
  const {
    fields: subtaskFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control,
    name: "acceptanceCriteria",
  });

  const {
    fields: researchFields,
    append: appendResearch,
    remove: removeResearch,
  } = useFieldArray({
    control,
    name: "researchQuestions",
  });

  // 1. Restore form data from localStorage or initialData on mount / open
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        reset({
          ...initialData,
          projectId: initialData.projectId || "",
          assigneeId: initialData.assigneeId || "",
          dueDate: initialData.dueDate || "",
          subtasks: initialData.subtasks || [],
          acceptanceCriteria:
            initialData.acceptanceCriteria?.map((c) =>
              typeof c === "string" ? { text: c } : c,
            ) || [],
          researchQuestions:
            initialData.researchQuestions?.map((q) =>
              typeof q === "string" ? { text: q } : q,
            ) || [],
        });
      } else {
        // Try restoring from autosave in create mode
        const savedData = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            reset({
              ...parsed,
              projectId: parsed.projectId || "",
              assigneeId: parsed.assigneeId || "",
              dueDate: parsed.dueDate || "",
              subtasks: parsed.subtasks || [],
              acceptanceCriteria: parsed.acceptanceCriteria || [],
              researchQuestions: parsed.researchQuestions || [],
            });
          } catch (e) {
            console.error("Error parsing autosave data", e);
          }
        } else {
          // Default clean form
          reset({
            title: "",
            description: "",
            taskType: "Bug",
            priority: "Medium",
            projectId: "",
            assigneeId: "",
            dueDate: "",
            severity: "Medium",
            stepsToReproduce: "",
            businessValue: "",
            acceptanceCriteria: [],
            currentBehavior: "",
            proposedBehavior: "",
            researchQuestions: [],
            expectedOutcomes: "",
            subtasks: [],
          });
        }
      }
    }
  }, [isOpen, mode, initialData, reset]);

  // 2. Auto-save form data to localStorage every 5 seconds (Only in create mode)
  useEffect(() => {
    if (isOpen && mode === "create") {
      const interval = setInterval(() => {
        localStorage.setItem(
          AUTOSAVE_STORAGE_KEY,
          JSON.stringify(watchedFormState),
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, mode, watchedFormState]);

  // Filter available users based on the selected project
  const filteredUsers = useMemo(() => {
    if (!watchedProjectId) return users;
    // Find project
    const project = projects.find((p) => p.id === watchedProjectId);
    if (!project) return users;
    return users.filter((user) => project.userIds?.includes(user.id));
  }, [watchedProjectId, users, projects]);

  // Clean assignee if it gets filtered out when project changes
  useEffect(() => {
    if (watchedProjectId && watchedFormState.assigneeId) {
      const isAssigneeValid = filteredUsers.some(
        (u) => u.id === watchedFormState.assigneeId,
      );
      if (!isAssigneeValid) {
        setValue("assigneeId", ""); // clear assignee
      }
    }
  }, [watchedProjectId, filteredUsers, setValue, watchedFormState.assigneeId]);

  const handleFormSubmit = (data) => {
    // Transform arrays back to strings for mock api consumption
    const formattedData = {
      ...data,
      acceptanceCriteria:
        data.acceptanceCriteria?.map((c) => c.text).filter(Boolean) || [],
      researchQuestions:
        data.researchQuestions?.map((q) => q.text).filter(Boolean) || [],
      subtasks:
        data.subtasks?.map((s) => ({
          id: s.id || `sub_${Date.now()}_${Math.random()}`,
          title: s.title,
          completed: s.completed === true || s.completed === "true",
        })) || [],
    };

    onSubmit(formattedData);
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY); // wipe autosave
  };

  const handleClose = () => {
    if (mode === "create") {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY); // optional, clear on cancel
    }
    onClose();
  };

  // Render dynamic fields based on task type
  const renderDynamicFields = () => {
    switch (watchedTaskType) {
      case "Bug":
        return (
          <>
            <div className="form-group">
              <label>Severity *</label>
              <select
                {...register("severity", {
                  required: "Severity is required for bugs",
                })}
                className="form-input-dark"
                id="bug-severity-select"
              >
                {BUG_SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
              {errors.severity && (
                <span className="form-error">{errors.severity.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Steps to Reproduce *</label>
              <textarea
                {...register("stepsToReproduce", {
                  required: "Steps to reproduce are required",
                })}
                placeholder="1. Navigate to login page&#10;2. Type user credentials with @ symbol&#10;3. Click login&#10;4. Observe error page..."
                className="form-textarea-dark"
                rows={4}
                id="steps-to-reproduce-textarea"
              />
              {errors.stepsToReproduce && (
                <span className="form-error">
                  {errors.stepsToReproduce.message}
                </span>
              )}
            </div>
          </>
        );

      case "Feature":
        return (
          <>
            <div className="form-group">
              <label>Business Value</label>
              <textarea
                {...register("businessValue")}
                placeholder="Describe the business value (e.g., improves conversion by 5% or reduces latency)..."
                className="form-textarea-dark"
                rows={3}
                id="business-value-textarea"
              />
            </div>

            <div className="form-group">
              <label>Acceptance Criteria</label>
              {criteriaFields.map((field, index) => (
                <div key={field.id} className="dynamic-row">
                  <input
                    {...register(`acceptanceCriteria.${index}.text`, {
                      required: true,
                    })}
                    placeholder="Enter criterion (e.g., payment button must be disabled until terms are checked)..."
                    className="form-input-dark flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeCriteria(index)}
                    className="btn-dark-remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendCriteria({ text: "" })}
                className="btn-dark-add"
              >
                + Add Criterion
              </button>
            </div>
          </>
        );

      case "Enhancement":
        return (
          <>
            <div className="form-group">
              <label>Current Behavior</label>
              <textarea
                {...register("currentBehavior")}
                placeholder="Describe the current behavior (e.g., user is redirected to home page without feedback)..."
                className="form-textarea-dark"
                rows={3}
                id="current-behavior-textarea"
              />
            </div>

            <div className="form-group">
              <label>Proposed Behavior</label>
              <textarea
                {...register("proposedBehavior")}
                placeholder="Describe the proposed behavior (e.g., display success notification and redirect)..."
                className="form-textarea-dark"
                rows={3}
                id="proposed-behavior-textarea"
              />
            </div>
          </>
        );

      case "Research":
        return (
          <>
            <div className="form-group">
              <label>Research Questions</label>
              {researchFields.map((field, index) => (
                <div key={field.id} className="dynamic-row">
                  <input
                    {...register(`researchQuestions.${index}.text`, {
                      required: true,
                    })}
                    placeholder="Enter research question (e.g., Which cache eviction strategy minimizes database loads?)..."
                    className="form-input-dark flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeResearch(index)}
                    className="btn-dark-remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendResearch({ text: "" })}
                className="btn-dark-add"
              >
                + Add Question
              </button>
            </div>

            <div className="form-group">
              <label>Expected Outcomes</label>
              <textarea
                {...register("expectedOutcomes")}
                placeholder="Describe expected outcomes (e.g., benchmark comparison report and recommended configs)..."
                className="form-textarea-dark"
                rows={3}
                id="expected-outcomes-textarea"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{mode === "create" ? "Create New Task" : "Edit Task"}</h2>
          <button onClick={handleClose} className="close-modal-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Basic Fields */}
          <div className="form-group">
            <label>Title *</label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              placeholder="Enter task title (e.g., Fix session timeout crash)..."
              className="form-input-dark"
              id="task-title-input"
            />
            {errors.title && (
              <span className="form-error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Task Type *</label>
            <select
              {...register("taskType", { required: "Task type is required" })}
              className="form-input-dark"
              id="task-type-select"
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              {...register("priority", { required: "Priority is required" })}
              className="form-input-dark"
              id="task-priority-select"
            >
              {PRIORITIES.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Project</label>
            <select
              {...register("projectId")}
              className="form-input-dark"
              id="task-project-select"
            >
              <option value="">Select a project...</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assignee</label>
            <select
              {...register("assigneeId")}
              className="form-input-dark"
              id="task-assignee-select"
            >
              <option value="">Unassigned</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              placeholder="Enter details, description, or notes for the task..."
              className="form-textarea-dark"
              rows={3}
              id="task-description-textarea"
            />
            {errors.description && (
              <span className="form-error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              {...register("dueDate")}
              className="form-input-dark date-picker-input"
              id="task-due-date-input"
            />
          </div>

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Subtasks dynamic array */}
          <div className="form-group subtasks-section">
            <label>Subtasks</label>
            {subtaskFields.map((field, index) => (
              <div key={field.id} className="subtask-row">
                <input
                  {...register(`subtasks.${index}.title`, {
                    required: "Subtask title cannot be empty",
                  })}
                  placeholder="Enter subtask title (e.g., Implement backend validation logic)..."
                  className="form-input-dark flex-grow"
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="btn-subtask-remove"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSubtask({ title: "", completed: false })}
              className="btn-subtask-add"
              id="add-subtask-button"
            >
              Add Subtask
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-cancel"
              id="cancel-form-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="btn-submit"
              id="submit-form-button"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Task"
                  : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
