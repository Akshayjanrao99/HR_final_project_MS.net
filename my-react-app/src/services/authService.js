import axiosInstance from '../config/axios';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'authToken';
    this.REFRESH_TOKEN_KEY = 'refreshToken';
    this.USER_KEY = 'user';
  }

  // Login user
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        this.setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        // Call logout endpoint if token exists
        await axiosInstance.post('/auth/logout');
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      this.clearAuth();
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post('/auth/refresh', {
        refreshToken: refreshToken
      });

      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data.token;
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Validate token
  async validateToken(token = null) {
    try {
      const tokenToValidate = token || this.getToken();
      if (!tokenToValidate) {
        return { valid: false, message: 'No token available' };
      }

      const response = await axiosInstance.post('/auth/validate', {
        token: tokenToValidate
      });

      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, message: error.message };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await axiosInstance.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Token management
  setTokens(token, refreshToken) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeTokens() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // User management
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  // Clear all authentication data
  clearAuth() {
    this.removeTokens();
    this.removeUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get current user's role
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Check if current user has specific role
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if current user is admin
  isAdmin() {
    return this.hasRole('ADMIN');
  }

  // Check if current user is regular user
  isUser() {
    return this.hasRole('USER');
  }

  // Parse JWT token (client-side parsing - for display only, not for security)
  parseToken(token = null) {
    try {
      const tokenToParse = token || this.getToken();
      if (!tokenToParse) return null;

      const base64Url = tokenToParse.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token parsing error:', error);
      return null;
    }
  }

  // Check if token is expired (client-side check)
  isTokenExpired(token = null) {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;
    
    return payload.exp * 1000 < Date.now();
  }

  // Get token expiration time
  getTokenExpiration(token = null) {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return null;
    
    return new Date(payload.exp * 1000);
  }

  // Setup automatic token refresh
  setupTokenRefresh() {
    const token = this.getToken();
    if (!token) return;

    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return;

    // Calculate time until token expires (refresh 5 minutes before expiration)
    const expirationTime = payload.exp * 1000;
    const refreshTime = expirationTime - Date.now() - (5 * 60 * 1000); // 5 minutes before

    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          await this.refreshToken();
          console.log('Token refreshed automatically');
          this.setupTokenRefresh(); // Setup next refresh
        } catch (error) {
          console.error('Automatic token refresh failed:', error);
          // Token refresh failed, user needs to login again
          window.location.href = '/login';
        }
      }, refreshTime);
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
