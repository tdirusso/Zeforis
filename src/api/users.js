import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`users/register`, payload);

  return data;
};

const updateProfile = async (payload) => {
  const { data } = await request.patch(`users`, payload);
  return data;
};

const updatePermission = async (payload) => {
  const { data } = await request.patch(`users/permissions`, payload);
  return data;
};

const updateAccess = async (payload) => {
  const { data } = await request.patch(`users/access`, payload);
  return data;
};

const getInvitationData = async ({ userId, clientId, invitationCode }) => {
  const { data } = await request.get(`users/invitation?userId=${userId}&clientId=${clientId}&invitationCode=${invitationCode}`);
  return data;
};

const updatePassword = async (payload) => {
  const { data } = await request.patch(`users/password`, payload);
  return data;
};

export {
  updateProfile,
  updatePermission,
  updateAccess,
  register,
  getInvitationData,
  updatePassword
};