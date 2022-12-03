import request from '../lib/request';

const addFolder = async (payload) => {
  const { data } = await request.post('addUser', payload);
  return data;
};

export {
  addFolder
};