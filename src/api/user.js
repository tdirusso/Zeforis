import request from '../lib/request';

const addUser = async (payload) => {
  const { data } = await request.post(`addUser`, payload);
  return data;
};

const getInitialBatch = async () => {
  const { data } = await request.get(`initialBatch`);
  return data;
};

export {
  addUser,
  getInitialBatch
};