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
  
  if (data.client) {
    localStorage.setItem('client', JSON.stringify(data.client));
  }

  return data;
};

export {
  addClient,
  getAllClients,
  getClientTree,
  updateClient
};