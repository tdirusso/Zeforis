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

const batchUpdatePermission = async (payload) => {
  const { data } = await request.patch(`users/permissions/batch`, payload);
  return data;
};

const updateAccess = async (payload) => {
  const { data } = await request.patch(`users/access`, payload);
  return data;
};

const batchUpdateAccess = async (payload) => {
  const { data } = await request.patch(`users/access/batch`, payload);
  return data;
};

const getInvitationData = async ({ userId, engagementId, invitationCode }) => {
  const { data } = await request.get(`users/invitation?userId=${userId}&engagementId=${engagementId}&invitationCode=${invitationCode}`);
  return data;
};

const updatePassword = async (payload) => {
  const { data } = await request.patch(`users/password`, payload);
  return data;
};

const sendPasswordResetLink = async (payload) => {
  const { data } = await request.post(`users/sendPasswordResetLink`, payload);
  return data;
};

const resendVerificationLink = async (payload) => {
  const { data } = await request.post(`users/resendVerificationLink`, payload);
  return data;
};

const removeEngagementUser = async (payload) => {
  const { data } = await request.delete(`users/removeEngagementUser`, { data: payload });

  return data;
};

const removeOrgUser = async (payload) => {
  const { data } = await request.delete(`users/removeOrgUser`, { data: payload });

  return data;
};

const closeAccount = async () => {
  const { data } = await request.delete(`users`);

  return data;
};

export {
  updateProfile,
  updatePermission,
  updateAccess,
  register,
  getInvitationData,
  updatePassword,
  sendPasswordResetLink,
  resendVerificationLink,
  batchUpdateAccess,
  batchUpdatePermission,
  removeOrgUser,
  removeEngagementUser,
  closeAccount
};