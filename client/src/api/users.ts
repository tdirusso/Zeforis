import request from '../lib/request';
import type { User } from '@shared/types/User';
import type { RegisterRequest } from '@shared/types/api/User';

const getMe = async () => {
  return (await request.get<User>('users/me')).data;
};

const register = async (payload: RegisterRequest) => {
  return (await request.post<void>('/users/register', payload)).data;
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