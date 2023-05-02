import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`register`, payload);

  return data;
};

const getActiveOrgId = () => {
  return Number(localStorage.getItem('activeOrgId'));
};

const setActiveOrgId = orgId => {
  localStorage.setItem('activeOrgId', orgId);
};

const removeActiveOrgId = () => {
  localStorage.removeItem('activeOrgId');
};

const completeRegistration = async (payload) => {
  const { data } = await request.post('completeRegistration', payload);

  return data;
};

const updateOrg = async (payload) => {
  const { data } = await request.patch(`updateOrg`, payload);

  return data;
};

const addOrg = async (payload) => {
  const { data } = await request.post(`addOrg`, payload);

  return data;
};

export {
  register,
  getActiveOrgId,
  setActiveOrgId,
  removeActiveOrgId,
  completeRegistration,
  updateOrg,
  addOrg
};