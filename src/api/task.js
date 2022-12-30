import request from '../lib/request';

const addTask = async (payload) => {
  const { data } = await request.post(`addTask`, payload);

  return data;
};

const removeTask = async (payload) => {
  const { data } = await request.delete(`removeTask`, { data: payload });

  return data;
};

export {
  addTask,
  removeTask
};