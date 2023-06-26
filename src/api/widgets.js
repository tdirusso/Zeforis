import request from '../lib/request';

const createWidget = async (payload) => {
  const { data } = await request.post(`widgets`, payload);

  return data;
};

const updateWidget = async (payload) => {
  const { data } = await request.patch('widgets', payload);

  return data;
};

const deleteWidget = async (payload) => {
  const { data } = await request.delete(`widgets`, payload);
  return data;
};

export {
  createWidget,
  updateWidget,
  deleteWidget
};