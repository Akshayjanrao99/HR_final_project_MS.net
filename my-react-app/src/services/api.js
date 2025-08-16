import axiosInstance from '../config/axios';

// Generic API function for making HTTP requests using axios
const apiRequest = async (endpoint, options = {}) => {
  try {
    const { method = 'GET', data, ...config } = options;
    
    const response = await axiosInstance({
      url: endpoint,
      method,
      data,
      ...config,
    });
    
    return response.data;
  } catch (error) {
    console.error('API Request failed:', error);
    // Handle axios error response
    if (error.response) {
      throw new Error(error.response.data?.message || error.response.statusText || 'API request failed');
    } else if (error.request) {
      throw new Error('Network error - backend may be unavailable');
    } else {
      throw error;
    }
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      data: credentials,
    });
  },
  
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      data: passwordData,
    });
  },
};

// Employee API
export const employeeAPI = {
  getAll: async () => {
    return apiRequest('/employees');
  },
  
  getById: async (id) => {
    return apiRequest(`/employees/${id}`);
  },
  
  create: async (employee) => {
    return apiRequest('/employees', {
      method: 'POST',
      data: employee,
    });
  },
  
  update: async (id, employee) => {
    return apiRequest(`/employees/${id}`, {
      method: 'PUT',
      data: employee,
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
  
  resetPassword: async (id, passwordData = {}) => {
    return apiRequest(`/employees/${id}/reset-password`, {
      method: 'POST',
      data: passwordData,
    });
  },
};

// Posts API
export const postsAPI = {
  getAll: async () => {
    return apiRequest('/posts');
  },
  
  create: async (post) => {
    return apiRequest('/posts', {
      method: 'POST',
      data: post,
    });
  },
};

// Leave API (formerly Compose API)
export const leaveAPI = {
  getAll: async () => {
    return apiRequest('/leave/requests');
  },
  
  getByUser: async (userId) => {
    return apiRequest(`/leave/requests/user/${userId}`);
  },
  
  create: async (leaveRequest) => {
    return apiRequest('/leave/requests', {
      method: 'POST',
      data: leaveRequest,
    });
  },
  
  updateStatus: async (id, status) => {
    return apiRequest(`/leave/requests/${id}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  getSummary: async (employeeId) => {
    return apiRequest(`/leave/summary/${employeeId}`);
  },

  getBalance: async (employeeId) => {
    return apiRequest(`/leave/balance/${employeeId}`);
  },

  delete: async (id) => {
    return apiRequest(`/leave/requests/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payroll API
export const payrollAPI = {
  getAll: async () => {
    return apiRequest('/payroll/current-month');
  },
  
  getById: async (id) => {
    return apiRequest(`/payroll/${id}`);
  },
  
  getByEmployeeId: async (employeeId) => {
    return apiRequest(`/payroll/employee/${employeeId}`);
  },
  
  getByEmployeeAndMonth: async (employeeId, month, year = new Date().getFullYear()) => {
    return apiRequest(`/payroll/employee/${employeeId}/monthly?month=${month}&year=${year}`);
  },
  
  generateForEmployee: async (employeeId) => {
    return apiRequest(`/payroll/generate/${employeeId}`, {
      method: 'POST',
    });
  },
  
  generateForAll: async () => {
    return apiRequest('/payroll/generate-all', {
      method: 'POST',
    });
  },
  
  update: async (id, payroll) => {
    return apiRequest(`/payroll/update/${id}`, {
      method: 'PUT',
      data: payroll,
    });
  },
  
  approve: async (id) => {
    return apiRequest(`/payroll/approve/${id}`, {
      method: 'PUT',
    });
  },
  
  markAsPaid: async (id) => {
    return apiRequest(`/payroll/pay/${id}`, {
      method: 'PUT',
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/payroll/${id}`, {
      method: 'DELETE',
    });
  },
  
  getStatistics: async () => {
    return apiRequest('/payroll/statistics');
  },
  
  approveAll: async (month, year) => {
    return apiRequest(`/payroll/approve-all?month=${month}&year=${year}`, {
      method: 'POST',
    });
  },
  
  payAll: async (month, year) => {
    return apiRequest(`/payroll/pay-all?month=${month}&year=${year}`, {
      method: 'POST',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },
  
  getDepartmentSummary: async () => {
    return apiRequest('/dashboard/department-summary');
  },
  
  getRecentActivities: async () => {
    return apiRequest('/dashboard/recent-activities');
  },
  
  getLeaveStatistics: async () => {
    return apiRequest('/dashboard/leave-statistics');
  },
  
  getEmployeePerformance: async () => {
    return apiRequest('/dashboard/employee-performance');
  },
  
  testConnection: async () => {
    return apiRequest('/dashboard/test');
  },
};

// Export all APIs
export default {
  auth: authAPI,
  employee: employeeAPI,
  posts: postsAPI,
  leave: leaveAPI,
  payroll: payrollAPI,
  dashboard: dashboardAPI,
};
