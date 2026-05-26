# Task Management Dashboard - Interview Challenge

**Time Limit: 30 minutes**

## Overview
Build a sophisticated task management dashboard that demonstrates advanced React, Redux, and Redux Saga skills.

## Project Requirements

### 1. Complex Task Form (React Hook Form)
Create a dynamic task creation/editing form with:

- **Basic Fields:**
  - Title (required, min 3 chars)
  - Description (optional, max 500 chars)
  - Task Type (Bug, Feature, Enhancement, Research)
  - Priority (Low, Medium, High, Critical)
  - Due Date (optional)

- **Dynamic Fields Based on Task Type:**
  - Bug: Severity dropdown, Steps to Reproduce textarea
  - Feature: Business Value textarea, Acceptance Criteria (array of strings)
  - Enhancement: Current Behavior, Proposed Behavior textareas
  - Research: Research Questions (array), Expected Outcomes textarea

- **Advanced Features:**
  - Assignee selection (dropdown from users list)
  - Project selection (affects available assignees)
  - File attachments (simulated - just file names)
  - Subtasks (dynamic array of simple tasks)

### 2. Redux Architecture with Normalized State
Implement a normalized state structure:

```javascript
{
  entities: {
    tasks: { byId: {}, allIds: [] },
    users: { byId: {}, allIds: [] },
    projects: { byId: {}, allIds: [] }
  },
  ui: {
    taskForm: { isOpen: false, mode: 'create', taskId: null },
    filters: { project: null, assignee: null, status: 'all', taskType: 'all' },
    loading: { tasks: false, users: false, projects: false },
    errors: { tasks: null, form: null }
  },
  optimistic: {
    pendingCreates: [],
    pendingUpdates: {},
    pendingDeletes: []
  }
}
```

### 3. Redux Saga Implementation
Create sagas for:

- **Data Fetching:**
  - `fetchTasksSaga()` - Load tasks with filtering
  - `fetchUsersSaga()` - Load available users
  - `fetchProjectsSaga()` - Load projects

- **CRUD Operations:**
  - `createTaskSaga()` - Create new task with optimistic updates
  - `updateTaskSaga()` - Update existing task
  - `deleteTaskSaga()` - Delete task with confirmation

- **Advanced Patterns:**
  - Error handling with retry logic
  - Optimistic updates with rollback on failure
  - Race conditions handling (cancel in-flight requests)

### 4. UI Components
Build these components:

- `TaskDashboard` - Main container component
- `TaskForm` - Dynamic form component
- `TaskList` - Displays filtered tasks
- `TaskCard` - Individual task display
- `FilterBar` - Task filtering controls

### 5. Advanced Features to Implement

#### Optimistic Updates
- When creating/updating tasks, immediately update UI
- Show loading indicators for pending operations
- Rollback changes if API call fails

#### Smart Filtering & Search
- Filter by project, assignee, status, task type
- Combine multiple filters
- Debounced search in task titles/descriptions

#### Form Auto-save
- Auto-save form data to localStorage every 5 seconds
- Restore form data on page reload
- Clear saved data after successful submission

## Technical Requirements

### Code Quality
- Use proper Redux patterns (action creators, reducers, selectors)
- Implement error boundaries
- Add proper TypeScript types (if time permits)
- Follow React best practices (useCallback, useMemo where appropriate)

### Performance Considerations
- Use reselect for memoized selectors
- Implement proper component re-render optimization
- Handle large lists efficiently

### Error Handling
- Graceful API error handling
- Form validation with clear error messages
- User-friendly error states

## Evaluation Criteria

### Redux Architecture (30 points)
- [ ] Proper normalized state structure
- [ ] Well-organized actions and reducers
- [ ] Effective use of selectors
- [ ] Proper store configuration

### Saga Implementation (25 points)
- [ ] Correct generator function usage
- [ ] Proper effect handling (call, put, take, race)
- [ ] Error handling and retry logic
- [ ] Optimistic updates implementation

### Form Engineering (20 points)
- [ ] Dynamic field rendering based on task type
- [ ] Complex validation rules
- [ ] Field arrays handling (subtasks)
- [ ] Performance optimization

### System Design (15 points)
- [ ] Component architecture
- [ ] Code organization and modularity
- [ ] Scalability considerations
- [ ] Clean, readable code

### User Experience (10 points)
- [ ] Intuitive interface
- [ ] Loading states and feedback
- [ ] Error handling UX
- [ ] Form usability

## Time Allocation Suggestion
- **0-10 minutes:** Basic Redux setup + simple form
- **10-20 minutes:** Dynamic fields + basic CRUD operations
- **20-30 minutes:** Optimistic updates + advanced features

## Getting Started
1. `npm install` - Install dependencies
2. `npm run dev` - Start development server
3. Check `/src/api/mockApi.js` for available API methods
4. Start with `/src/store/index.js` for Redux setup

Good luck! 🚀
