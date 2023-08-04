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

export {
  updateProfile,
  updatePermission,
  updateAccess,
  register,
  getInvitationData,
  updatePassword,
  sendPasswordResetLink,
  resendVerificationLink
};