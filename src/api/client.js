import request from '../lib/request';

const addClient = async (payload) => {
  const { data } = await request.post(`addClient`, payload);

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

  const sortedResult = result.sort((a, b) => a.name.localeCompare(b.name));

  return sortedResult;
};

const removeActiveClientId = () => {
  localStorage.removeItem('activeClientId');
};

const inviteClientUser = async (payload) => {
  const { data } = await request.post(`inviteClientUser`, payload);

  return data;
};

const removeClientUser = async (payload) => {
  const { data } = await request.delete(`removeClientUser`, { data: payload });

  return data;
};

const removeUser = async (payload) => {
  const { data } = await request.delete(`removeUser`, { data: payload });

  return data;
};

const getClientData = async (clientId, accountId) => {
  const { data } = await request.get(`getClientData?clientId=${clientId}&accountId=${accountId}`);

  return data;
};

const addTags = async (payload) => {
  const { data } = await request.post(`addTags`, payload);

  return data;
};

const removeTag = async (payload) => {
  const { data } = await request.delete(`removeTag`, { data: payload });

  return data;
};

const removeClient = async (payload) => {
  const { data } = await request.delete(`removeClient`, { data: payload });

  return data;
};

export {
  addClient,
  getClientTree,
  updateClient,
  setActiveClientId,
  getActiveClientId,
  getUserClientListForAccount,
  removeActiveClientId,
  inviteClientUser,
  removeClientUser,
  getClientData,
  addTags,
  removeTag,
  removeClient,
  removeUser
};