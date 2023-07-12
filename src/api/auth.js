import request from '../lib/request';

const login = async (payload) => {
  const { data } = await request.post(`users/login`, payload);

  if (data.token) {
    setToken(data.token);
  }

  return data;
};

const logout = email => {
  deleteToken();
  
  window.google.accounts.id.revoke(email, () => {
    window.location.href = '/login';
  });

  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

const authenticate = async () => {
  const { data } = await request.post(`users/authenticate`);

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