import request from '../lib/request';

const getActiveOrgId = () => {
  return Number(localStorage.getItem('activeOrgId'));
};

const setActiveOrgId = orgId => {
  localStorage.setItem('activeOrgId', orgId);
};

const deleteActiveOrgId = () => {
  localStorage.removeItem('activeOrgId');
};

const updateOrg = async (payload) => {
  const { data } = await request.patch(`orgs`, payload);

  return data;
};

const createOrg = async (payload) => {
  const { data } = await request.post(`orgs`, payload);

  return data;
};

export {
  getActiveOrgId,
  setActiveOrgId,
  deleteActiveOrgId,
  updateOrg,
  createOrg
};