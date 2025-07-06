import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  // Admin login
  async adminLogin(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  }

  // Employee login
  async employeeLogin(empId, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/employee/login`, {
        empId,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  }

  // Store token
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}
const authService = new AuthService();
export default authService;
