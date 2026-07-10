import apiClient from '../apiClient';

const API_URL = '/api/auth/';

const register = async (userData) => {
  const response = await apiClient.post(`${API_URL}register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await apiClient.post(`${API_URL}login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const googleLogin = async (credential) => {
  const response = await apiClient.post(`${API_URL}google`, { credential });
  console.log(`${API_URL}google`,credential)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await apiClient.get(`${API_URL}verify/${encodeURIComponent(token)}`);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  googleLogin,
  verifyEmail,
};

export default authService;
