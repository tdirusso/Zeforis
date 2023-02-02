import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`register`, payload);

  return data;
};

const getActiveAccountId = () => {
  return Number(localStorage.getItem('activeAccountId'));
};

const setActiveAccountId = (accountId) => {
  localStorage.setItem('activeAccountId', accountId);
};

const removeActiveAccountId = () => {
  localStorage.removeItem('activeAccountId');
};

const completeRegistration = async (payload) => {
  const { data } = await request.post('completeRegistration', payload);

  return data;
};

const updateAccount = async (payload) => {
  const { data } = await request.patch(`updateAccount`, payload);

  return data;
};

const addAccount = async (payload) => {
  const { data } = await request.post(`addAccount`, payload);

  return data;
};

export {
  register,
  getActiveAccountId,
  setActiveAccountId,
  removeActiveAccountId,
  completeRegistration,
  updateAccount,
  addAccount
};