import api from '../utils/api';

export const login = async (email, password) => {
  const emailClean = String(email || '').trim().toLowerCase();
  const response = await api.post('/auth/login', { email: emailClean, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const emailClean = String(email || '').trim().toLowerCase();
  const response = await api.post('/auth/register', { username, email: emailClean, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

