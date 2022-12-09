import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`register`, payload);

  return data;
};

const getActiveAccount = () => {
  return JSON.parse(localStorage.getItem('account') || null);
};

const setActiveAccount = (accountObject) => {
  localStorage.setItem('account', JSON.stringify(accountObject));
};

export {
  register,
  getActiveAccount,
  setActiveAccount
};