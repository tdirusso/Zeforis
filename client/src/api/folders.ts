import request from '../lib/request';

const createFolder = async (payload: unknown) => {
  const { data } = await request.post('folders', payload);
  return data;
};

const updateFolder = async (payload: unknown) => {
  const { data } = await request.patch(`folders`, payload);
  return data;
};

const deleteFolder = async (payload: unknown) => {
  const { data } = await request.delete(`folders`, { data: payload });

  return data;
};

export {
  createFolder,
  updateFolder,
  deleteFolder
};