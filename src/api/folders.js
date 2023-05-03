import request from '../lib/request';

const createFolder = async (payload) => {
  const { data } = await request.post('folders', payload);
  return data;
};

const updateFolder = async (payload) => {
  const { data } = await request.patch(`folders`, payload);
  return data;
};

const removeFoldeer = async (payload) => {
  const { data } = await request.delete(`folders`, { data: payload });

  return data;
};

export {
  createFolder,
  updateFolder,
  removeFoldeer
};