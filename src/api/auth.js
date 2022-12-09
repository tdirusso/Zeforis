import request from '../lib/request';

const login = async (payload) => {
  const { data } = await request.post(`login`, payload);

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

const authenticateUser = async () => {
  const { data } = await request.post(`authenticate`);

  if (!data.user) {
    localStorage.removeItem('token');
  }

  return data;
};

const getToken = () => {
  return localStorage.getItem('token');
};

export {
  login,
  logout,
  authenticateUser,
  getToken
};