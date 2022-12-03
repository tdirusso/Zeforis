import request from '../lib/request';

const addUser = async (payload) => {
  const { data } = await request.post(`addUser`, payload);
  return data;
};

export {
  addUser
};