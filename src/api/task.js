import request from '../lib/request';

const addTask = async (payload) => {
  const { data } = await request.post(`addTask`, payload);

  return data;
};

const removeTasks = async (payload) => {
  const { data } = await request.delete(`removeTasks`, { data: payload });

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
  removeTasks,
  updateTask,
  bulkUpdateTasks
};