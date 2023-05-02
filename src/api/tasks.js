import request from '../lib/request';

const createTask = async (payload) => {
  const { data } = await request.post(`tasks`, payload);

  return data;
};

const removeTasks = async (payload) => {
  const { data } = await request.delete(`tasks`, { data: payload });

  return data;
};

const updateTask = async (payload) => {
  const { data } = await request.patch(`tasks`, payload);
  return data;
};

const bulkUpdateTasks = async (payload) => {
  const { data } = await request.patch(`tasks/batch`, payload);
  return data;
};

export {
  createTask,
  removeTasks,
  updateTask,
  bulkUpdateTasks
};