import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.data && response.data.data.token) {
    localStorage.setItem('skillgap_token', response.data.data.token);
    localStorage.setItem('skillgap_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.data && response.data.data.token) {
    localStorage.setItem('skillgap_token', response.data.data.token);
    localStorage.setItem('skillgap_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('skillgap_token');
  localStorage.removeItem('skillgap_user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('skillgap_user');
  return userStr ? JSON.parse(userStr) : null;
};
