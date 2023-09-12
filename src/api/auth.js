import request from '../lib/request';

const login = async (payload) => {
  const { data } = await request.post(`users/login`, payload);

  return data;
};

const logout = (logoutPageUrl) => {
  deleteToken();
  window.location.href = logoutPageUrl;
};

const authenticate = async () => {
  const updateStaleUser = Boolean(localStorage.getItem('updateStaleUser')) || false;

  if (updateStaleUser) {
    localStorage.removeItem('updateStaleUser');
  }

  const { data } = await request.post(`users/authenticate`, {
    updateStaleUser
  });

  if (!data.user) {
    deleteToken();
  }

  return data;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const deleteToken = () => {
  localStorage.removeItem('token');
};

export {
  login,
  logout,
  authenticate,
  getToken,
  setToken,
  deleteToken
};