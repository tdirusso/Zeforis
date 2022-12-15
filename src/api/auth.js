import request from '../lib/request';
import { removeActiveAccountId } from './account';
import { removeActiveClientId } from './client';

const login = async (payload) => {
  const { data } = await request.post(`login`, payload);

  if (data.token) {
    setToken(data.token);
  }

  return data;
};

const logout = () => {
  removeToken();
  removeActiveAccountId();
  removeActiveClientId();
  window.location = '/login';
};

const authenticateUser = async () => {
  const { data } = await request.post(`authenticate`);

  if (!data.user) {
    removeToken();
  }

  return data;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const removeToken = () => {
  localStorage.removeItem('token');
};

export {
  login,
  logout,
  authenticateUser,
  getToken,
  setToken,
  removeToken
};