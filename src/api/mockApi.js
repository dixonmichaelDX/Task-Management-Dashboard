// Mock API for interview project
// Simulates realistic API delays and occasional failures

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@company.com', projectIds: ['1', '2'] },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', projectIds: ['1'] },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', projectIds: ['2', '3'] },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com', projectIds: ['1', '3'] },
];

const mockProjects = [
  { id: '1', name: 'E-commerce Platform', userIds: ['1', '2', '4'] },
  { id: '2', name: 'Mobile App', userIds: ['1', '3'] },
  { id: '3', name: 'Analytics Dashboard', userIds: ['3', '4'] },
];

let mockTasks = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Users cannot login with special characters in password',
    taskType: 'Bug',
    priority: 'High',
    status: 'In Progress',
    assigneeId: '1',
    projectId: '1',
    dueDate: '2024-02-15',
    createdAt: '2024-01-10',
    // Bug-specific fields
    severity: 'Medium',
    stepsToReproduce: '1. Enter password with @ symbol\n2. Click login\n3. Error appears',
    subtasks: [
      { id: 'sub1', title: 'Investigate password validation', completed: true },
      { id: 'sub2', title: 'Update validation regex', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Add dark mode',
    description: 'Implement dark theme toggle',
    taskType: 'Feature',
    priority: 'Medium',
    status: 'Todo',
    assigneeId: '2',
    projectId: '1',
    dueDate: null,
    createdAt: '2024-01-12',
    // Feature-specific fields
    businessValue: 'Improve user experience and reduce eye strain',
    acceptanceCriteria: [
      'Toggle switch in settings',
      'Persist theme preference',
      'All components support dark mode'
    ],
    subtasks: []
  }
];

// Simulate API errors occasionally
const shouldFail = () => Math.random() < 0.1; // 10% failure rate

export const mockApi = {
  // Fetch all tasks with optional filtering
  async fetchTasks(filters = {}) {
    await delay(800 + Math.random() * 400); // 800-1200ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to fetch tasks. Please try again.');
    }

    let filteredTasks = [...mockTasks];

    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === filters.projectId);
    }
    
    if (filters.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === filters.assigneeId);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.taskType && filters.taskType !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.taskType === filters.taskType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    return {
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    };
  },

  // Create a new task
  async createTask(taskData) {
    await delay(1000 + Math.random() * 500); // 1000-1500ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to create task. Please try again.');
    }

    const newTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Todo'
    };

    mockTasks.push(newTask);

    return {
      success: true,
      data: newTask
    };
  },

  // Update an existing task
  async updateTask(taskId, updates) {
    await delay(600 + Math.random() * 400); // 600-1000ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to update task. Please try again.');
    }

    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    mockTasks[taskIndex] = updatedTask;

    return {
      success: true,
      data: updatedTask
    };
  },

  // Delete a task
  async deleteTask(taskId) {
    await delay(500 + Math.random() * 300); // 500-800ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to delete task. Please try again.');
    }

    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const deletedTask = mockTasks[taskIndex];
    mockTasks.splice(taskIndex, 1);

    return {
      success: true,
      data: deletedTask
    };
  },

  // Fetch all users
  async fetchUsers() {
    await delay(300 + Math.random() * 200); // 300-500ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to fetch users. Please try again.');
    }

    return {
      success: true,
      data: mockUsers
    };
  },

  // Fetch all projects
  async fetchProjects() {
    await delay(200 + Math.random() * 300); // 200-500ms delay
    
    if (shouldFail()) {
      throw new Error('Failed to fetch projects. Please try again.');
    }

    return {
      success: true,
      data: mockProjects
    };
  },

  // Get users for a specific project
  async getProjectUsers(projectId) {
    await delay(100 + Math.random() * 200); // 100-300ms delay
    
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const projectUsers = mockUsers.filter(user => 
      project.userIds.includes(user.id)
    );

    return {
      success: true,
      data: projectUsers
    };
  }
};

// Export constants for use in components
export const TASK_TYPES = ['Bug', 'Feature', 'Enhancement', 'Research'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const STATUSES = ['Todo', 'In Progress', 'Review', 'Done'];
export const BUG_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];