import request from '../lib/request';

const addFolder = async (payload) => {
  const { data } = await request.post('addFolder', payload);
  return data;
};

const updateFolder = async (payload) => {
  const { data } = await request.patch(`updateFolder`, payload);
  return data;
};

const removeFoldeer = async (payload) => {
  const { data } = await request.delete(`removeFolder`, { data: payload });

  return data;
};

export {
  addFolder,
  updateFolder,
  removeFoldeer
};