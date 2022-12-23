import request from '../lib/request';

const addClient = async (payload) => {
  const { data } = await request.post(`addClient`, payload);

  return data;
};

const getAllClients = async () => {
  const { data } = await request.get(`getAllClients`);
  return data;
};

const getClientTree = async (clientId) => {
  const { data } = await request.get(`getClientTree?clientId=${clientId}`);
  return data;
};

const updateClient = async (payload) => {
  const { data } = await request.patch(`updateClient`, payload);

  return data;
};

const setActiveClientId = (clientId) => {
  localStorage.setItem('activeClientId', clientId);
};

const getActiveClientId = () => {
  return Number(localStorage.getItem('activeClientId'));
};

const getUserClientListForAccount = (user, activeAccountId) => {
  const result = [];

  user.adminOfClients.forEach(client => {
    if (client.accountId === activeAccountId) {
      result.push({ ...client, access: 'admin' });
    }
  });

  user.memberOfClients.forEach(client => {
    if (client.accountId === activeAccountId) {
      result.push({ ...client, access: 'member' });
    }
  });

  console.log(result);

  return result;
};

const getSettingsData = async (accountId, clientId) => {
  const { data } = await request.get(`getSettings?accountId=${accountId}&clientId=${clientId}`);

  return data;
};

const removeActiveClientId = () => {
  localStorage.removeItem('activeClientId');
};

const inviteClientMember = async (payload) => {
  const { data } = await request.post(`inviteClientMember`, payload);

  return data;
};

const removeClientMember = async (payload) => {
  const { data } = await request.delete(`removeClientMember`, { data: payload });

  return data;
};

const getTasks = async (clientId) => {
  const { data } = await request.get(`getTasks?clientId=${clientId}`);

  return data;
};

export {
  addClient,
  getAllClients,
  getClientTree,
  updateClient,
  setActiveClientId,
  getActiveClientId,
  getUserClientListForAccount,
  getSettingsData,
  removeActiveClientId,
  inviteClientMember,
  removeClientMember,
  getTasks
};