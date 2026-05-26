// Filter Bar Component
import React, { useEffect, useState } from "react";
import { TASK_TYPES, PRIORITIES, STATUSES } from "../api/mockApi";

const FilterBar = ({
  filters = {},
  projects = [],
  users = [],
  onFiltersChange,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  // Debounced search with useEffect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.search !== searchInput) {
        onFiltersChange({
          ...filters,
          search: searchInput,
        });
      }
    }, 400); // 400ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Sync search input if filters are reset from outside
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  const handleFilterChange = (filterKey, value) => {
    onFiltersChange({
      ...filters,
      [filterKey]: value,
    });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    onFiltersChange({
      projectId: null,
      assigneeId: null,
      status: "all",
      taskType: "all",
      search: "",
    });
  };

  // Count active filters for display
  const activeFiltersCount = Object.keys(filters).reduce((count, key) => {
    if (key === "search" && filters[key]) return count + 1;
    if ((key === "projectId" || key === "assigneeId") && filters[key])
      return count + 1;
    if ((key === "status" || key === "taskType") && filters[key] !== "all")
      return count + 1;
    return count;
  }, 0);

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Search Input */}
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            id="search-tasks-input"
          />
        </div>

        {/* Project Filter */}
        <div className="filter-group">
          <select
            value={filters.projectId || ""}
            onChange={(e) =>
              handleFilterChange("projectId", e.target.value || null)
            }
            className="filter-select"
            id="project-filter-select"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="filter-group">
          <select
            value={filters.assigneeId || ""}
            onChange={(e) =>
              handleFilterChange("assigneeId", e.target.value || null)
            }
            className="filter-select"
            id="assignee-filter-select"
          >
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <select
            value={filters.status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
            id="status-filter-select"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Task Type Filter */}
        <div className="filter-group">
          <select
            value={filters.taskType || "all"}
            onChange={(e) => handleFilterChange("taskType", e.target.value)}
            className="filter-select"
            id="task-type-filter-select"
          >
            <option value="all">All Types</option>
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="filter-group">
          <button
            onClick={clearAllFilters}
            className="clear-filters-btn"
            disabled={activeFiltersCount === 0}
            id="clear-filters-button"
          >
            Clear Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
