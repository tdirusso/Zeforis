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

const getUserEngagementListForOrg = (user, activeOrgId) => {
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

const inviteEngagementUser = async (payload) => {
  const { data } = await request.post(`users/invite`, payload);

  return data;
};

const removeEngagementUser = async (payload) => {
  const { data } = await request.delete(`users/removeEngagementUser`, { data: payload });

  return data;
};

const removeUser = async (payload) => {
  const { data } = await request.delete(`users`, { data: payload });

  return data;
};

const getEngagementData = async (engagementId, orgId, isOrgOwner) => {
  const { data } = await request.get(`engagements?engagementId=${engagementId}&orgId=${orgId}&isOrgOwner=${isOrgOwner}`);

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


export {
  createEngagement,
  updateEngagement,
  setActiveEngagementId,
  getActiveEngagementId,
  getUserEngagementListForOrg,
  deleteActiveEngagementId,
  inviteEngagementUser,
  removeEngagementUser,
  getEngagementData,
  deleteEngagement,
  removeUser,
  leaveEngagement
};