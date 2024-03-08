import request from '../lib/request';

const getMe = async () => {
  const { data } = await request.get('users/me');
  return data;
};

const register = async (payload: unknown) => {
  const { data } = await request.post(`register`, payload);

  return data;
};

const updateUser = async (userId: number, payload: unknown) => {
  const { data } = await request.patch(`users/${userId}`, payload);
  return data;
};

const batchUpdatePermission = async (payload: unknown) => {
  const { data } = await request.patch(`users/permissions/batch`, payload);
  return data;
};

const getInvitationData = async ({ userId, engagementId, invitationCode }: { userId: number, engagementId: number, invitationCode: string; }) => {
  const { data } = await request.get(`users/invitation?userId=${userId}&engagementId=${engagementId}&invitationCode=${invitationCode}`);
  return data;
};

const closeAccount = async () => {
  const { data } = await request.delete(`users`);

  return data;
};

export {
  updateUser,
  register,
  getInvitationData,
  batchUpdatePermission,
  closeAccount,
  getMe
};