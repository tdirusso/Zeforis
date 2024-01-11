import request from '../lib/request';

const createEngagement = async (payload) => {
  const { data } = await request.post(`engagements`, payload);

  return data;
};

const updateEngagement = async (payload) => {
  const { data } = await request.patch(`engagements`, payload);

  return data;
};

const setActiveEngagementId = (engagementId) => {
  localStorage.setItem('activeEngagementId', engagementId);
};

const getActiveEngagementId = () => {
  return Number(localStorage.getItem('activeEngagementId'));
};

const getUserEngagementsForOrg = (user, activeOrgId) => {
  const result = [];

  user.adminOfEngagements.forEach(engagement => {
    if (engagement.orgId === activeOrgId) {
      result.push({ ...engagement, access: 'admin' });
    }
  });

  user.memberOfEngagements.forEach(engagement => {
    if (engagement.orgId === activeOrgId) {
      result.push({ ...engagement, access: 'member' });
    }
  });

  return result;
};

const deleteActiveEngagementId = () => {
  localStorage.removeItem('activeEngagementId');
};

const getEngagementData = async (engagementId, orgId) => {
  const { data } = await request.get(`engagements?engagementId=${engagementId}&orgId=${orgId}`);

  return data;
};

const deleteEngagement = async (payload) => {
  const { data } = await request.delete(`engagements`, { data: payload });

  return data;
};

const leaveEngagement = async (payload) => {
  const { data } = await request.delete(`engagements/leave`, { data: payload });

  return data;
};

const removeEngagementUser = async (engagementId, userId) => {
  const { data } = await request.delete(`engagements/${engagementId}/users/${userId}`);

  return data;
};

export {
  createEngagement,
  updateEngagement,
  setActiveEngagementId,
  getActiveEngagementId,
  getUserEngagementsForOrg,
  deleteActiveEngagementId,
  getEngagementData,
  deleteEngagement,
  leaveEngagement,
  removeEngagementUser
};