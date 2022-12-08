import request from '../lib/request';

const register = async (payload) => {
  const { data } = await request.post(`register`, payload);

  return data;
};



export {
  register
};