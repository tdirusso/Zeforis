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

const getOrg = async orgId => {
  const { data } = await request.get(`orgs?orgId=${orgId}`);

  return data;
};

const deleteOrg = async (payload) => {
  const { data } = await request.delete(`orgs`, { data: payload });

  return data;
};


const leaveOrg = async (payload) => {
  const { data } = await request.delete(`orgs/leave`, { data: payload });

  return data;
};

const removeOrgUser = async (orgId, userId) => {
  const { data } = await request.delete(`orgs/${orgId}/users/${userId}`);

  return data;
};

const inviteOrgUsers = async (orgId, payload) => {
  const { data } = await request.post(`orgs/${orgId}/invite`, payload);

  return data;
};

const updateAccess = async (orgId, userId, payload) => {
  const { data } = await request.patch(`orgs/${orgId}/users/${userId}/access`, payload);
  return data;
};

export {
  getActiveOrgId,
  setActiveOrgId,
  deleteActiveOrgId,
  updateOrg,
  createOrg,
  getOrg,
  deleteOrg,
  leaveOrg,
  removeOrgUser,
  inviteOrgUsers,
  updateAccess
};