import request from '../lib/request';

const createTask = async (payload) => {
  const { data } = await request.post(`tasks`, payload);

  return data;
};

const deleteTasks = async (payload) => {
  const { data } = await request.delete(`tasks`, { data: payload });

  return data;
};

const updateTask = async (payload) => {
  const { data } = await request.patch(`tasks`, payload);
  return data;
};

const batchUpdateTasks = async (payload) => {
  const { data } = await request.patch(`tasks/batch`, payload);
  return data;
};

const importTasks = async (payload) => {
  const { data } = await request.post(`tasks/import`, payload);
  return data;
};

export {
  createTask,
  deleteTasks,
  updateTask,
  batchUpdateTasks,
  importTasks
};