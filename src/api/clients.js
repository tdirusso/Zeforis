import request from '../lib/request';

const addClient = async (payload) => {
  const { data } = await request.post(`clients`, payload);

  return data;
};

const updateClient = async (payload) => {
  const { data } = await request.patch(`clients`, payload);

  return data;
};

const setActiveClientId = (clientId) => {
  localStorage.setItem('activeClientId', clientId);
};

const getActiveClientId = () => {
  return Number(localStorage.getItem('activeClientId'));
};

const getUserClientListForOrg = (user, activeOrgId) => {
  const result = [];

  user.adminOfClients.forEach(client => {
    if (client.orgId === activeOrgId) {
      result.push({ ...client, access: 'admin' });
    }
  });

  user.memberOfClients.forEach(client => {
    if (client.orgId === activeOrgId) {
      result.push({ ...client, access: 'member' });
    }
  });

  const sortedResult = result.sort((a, b) => a.name.localeCompare(b.name));

  return sortedResult;
};

const removeActiveClientId = () => {
  localStorage.removeItem('activeClientId');
};

const inviteClientUser = async (payload) => {
  const { data } = await request.post(`users/invite`, payload);

  return data;
};

const removeClientUser = async (payload) => {
  const { data } = await request.delete(`users/uninvite`, { data: payload });

  return data;
};

const removeUser = async (payload) => {
  const { data } = await request.delete(`users`, { data: payload });

  return data;
};

const getClientData = async (clientId, orgId) => {
  const { data } = await request.get(`clients?clientId=${clientId}&orgId=${orgId}`);

  return data;
};

const removeClient = async (payload) => {
  const { data } = await request.delete(`clients`, { data: payload });

  return data;
};

export {
  addClient,
  updateClient,
  setActiveClientId,
  getActiveClientId,
  getUserClientListForOrg,
  removeActiveClientId,
  inviteClientUser,
  removeClientUser,
  getClientData,
  removeClient,
  removeUser
};