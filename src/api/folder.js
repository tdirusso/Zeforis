import request from '../lib/request';

const addFolder = async (payload) => {
  const { data } = await request.post('addFolder', payload);
  return data;
};

export {
  addFolder
};