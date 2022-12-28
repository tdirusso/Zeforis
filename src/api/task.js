import request from '../lib/request';

const addTask = async (payload) => {
  const { data } = await request.post(`addTask`, payload);

  return data;
};
export {
  addTask
};