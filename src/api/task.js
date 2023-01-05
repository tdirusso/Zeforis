import request from '../lib/request';

const addTask = async (payload) => {
  const { data } = await request.post(`addTask`, payload);

  return data;
};

const removeTask = async (payload) => {
  const { data } = await request.delete(`removeTask`, { data: payload });

  return data;
};

const updateTask = async (payload) => {
  const { data } = await request.patch(`updateTask`, payload);
  return data;
};

const bulkUpdateTasks = async (payload) => {
  const { data } = await request.patch(`bulkUpdateTasks`, payload);
  return data;
};

export {
  addTask,
  removeTask,
  updateTask,
  bulkUpdateTasks
};