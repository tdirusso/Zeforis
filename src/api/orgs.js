import request from '../lib/request';

const getActiveOrgId = () => {
  return Number(localStorage.getItem('activeOrgId'));
};

const setActiveOrgId = orgId => {
  localStorage.setItem('activeOrgId', orgId);
};

const removeActiveOrgId = () => {
  localStorage.removeItem('activeOrgId');
};

const updateOrg = async (payload) => {
  const { data } = await request.patch(`orgs`, payload);

  return data;
};

const addOrg = async (payload) => {
  const { data } = await request.post(`orgs`, payload);

  return data;
};

export {
  getActiveOrgId,
  setActiveOrgId,
  removeActiveOrgId,
  updateOrg,
  addOrg
};