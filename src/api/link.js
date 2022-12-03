import request from '../lib/request';

const addLink = async (payload) => {
  const { data } = await request.post(`addLink`, payload);
  return data;
};

export {
  addLink
};