import { Engagement } from '@shared/types/Engagement';
import request from '../lib/request';

const getEngagementsForOrg = async (orgId: number) => {
  return (await request.get<Engagement[]>(`orgs/${orgId}/engagements`)).data;
};

const createEngagement = async (payload: unknown) => {
  const { data } = await request.post(`engagements`, payload);

  return data;
};

const updateEngagement = async (payload: unknown) => {
  const { data } = await request.patch(`engagements`, payload);

  return data;
};

const setActiveEngagementId = (engagementId: number) => {
  localStorage.setItem('activeEngagementId', String(engagementId));
};

const getActiveEngagementId = () => {
  return Number(localStorage.getItem('activeEngagementId'));
};

const deleteActiveEngagementId = () => {
  localStorage.removeItem('activeEngagementId');
};

const getEngagement = async (engagementId: number) => {
  return (await request.get<Engagement>(`engagements/${engagementId}`)).data;
};

const deleteEngagement = async (payload: unknown) => {
  const { data } = await request.delete(`engagements`, { data: payload });

  return data;
};

const leaveEngagement = async (payload: unknown) => {
  const { data } = await request.delete(`engagements/leave`, { data: payload });

  return data;
};

const removeEngagementUser = async (engagementId: number, userId: number) => {
  const { data } = await request.delete(`engagements/${engagementId}/users/${userId}`);

  return data;
};

const updateUserPermissions = async (engagementId: number, userId: number, payload: unknown) => {
  const { data } = await request.patch(`engagements/${engagementId}/users/${userId}/permissions`, payload);
  return data;
};

export {
  createEngagement,
  updateEngagement,
  setActiveEngagementId,
  getActiveEngagementId,
  deleteActiveEngagementId,
  getEngagement,
  deleteEngagement,
  leaveEngagement,
  removeEngagementUser,
  updateUserPermissions,
  getEngagementsForOrg
};