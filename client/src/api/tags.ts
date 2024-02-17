import request from '../lib/request';

const createTag = async (payload: unknown) => {
  const { data } = await request.post(`tags`, payload);

  return data;
};

const deleteTag = async (payload: unknown) => {
  const { data } = await request.delete(`tags`, { data: payload });

  return data;
};

const updateTag = async (payload: unknown) => {
  const { data } = await request.patch(`tags`, payload);

  return data;
};

export {
  updateTag,
  createTag,
  deleteTag
};