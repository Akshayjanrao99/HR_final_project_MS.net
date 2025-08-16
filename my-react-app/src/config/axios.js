import axios from 'axios';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:8080/api by Vite
  timeout: 15000, // 15 seconds timeout for backend startup
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    const originalRequest = error.config;
    
    // Handle different error scenarios
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection.';
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || !error.response) {
      error.message = 'Cannot connect to backend server. Please ensure the Spring Boot application is running on http://localhost:8080';
    } else if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle token expiration
          if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            originalRequest._retry = true;
            
            try {
              // Try to refresh token
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const refreshResponse = await axiosInstance.post('/auth/refresh', {
                  refreshToken: refreshToken
                });
                
                if (refreshResponse.data.success) {
                  // Update tokens
                  localStorage.setItem('authToken', refreshResponse.data.token);
                  localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                  
                  // Retry original request with new token
                  originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
                  return axiosInstance(originalRequest);
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
          
          // If refresh failed or not applicable, clear auth and show error
          error.message = 'Authentication failed. Please login again.';
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Only redirect if not already on auth pages
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          break;
        case 403:
          error.message = 'You do not have permission to perform this action.';
          break;
        case 404:
          error.message = 'The requested resource was not found.';
          break;
        case 500:
          error.message = 'Internal server error. Please try again later.';
          break;
        default:
          error.message = data?.message || `Request failed with status ${status}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
