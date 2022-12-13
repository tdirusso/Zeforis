import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`register`, payload);

  return data;
};

const getActiveAccountId = () => {
  return localStorage.getItem('activeAccountId');
};

const setActiveAccountId = (accountId) => {
  localStorage.setItem('activeAccountId', accountId);
};

export {
  register,
  getActiveAccountId,
  setActiveAccountId
};