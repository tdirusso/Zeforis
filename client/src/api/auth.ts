import request from '../lib/request';

const login = async (payload: unknown) => {
  const { data } = await request.post(`login`, payload);

  return data;
};

const logout = (logoutPageUrl: string) => {
  deleteToken();
  window.location.href = logoutPageUrl;
};

const authenticate = async () => {
  const { data } = await request.post(`authenticate`);

  if (!data.user) {
    deleteToken();
  }

  return data;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token: string) => {
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