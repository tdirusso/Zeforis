import axios from 'axios';

const domain = process.env.REACT_APP_DOMAIN;

const addClient = async (payload) => {
  const { data } = await axios.post(`${domain}/api/addClient`, {
    token: localStorage.getItem('token'),
    ...payload
  });

  return data;
};

const getAllClients = async () => {
  const { data } = await axios.get(`${domain}/api/getAllClients`, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  });

  return data;
};

const getClient = async (clientId) => {
  const { data } = await axios.get(`${domain}/api/getClient?clientId=${clientId}`, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  });

  return data;
};

export {
  addClient,
  getAllClients,
  getClient
};