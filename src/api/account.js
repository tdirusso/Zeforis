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

export {
  register,
  getActiveAccountId,
  setActiveAccountId,
  removeActiveAccountId,
  completeRegistration
};