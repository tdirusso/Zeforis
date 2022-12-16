import request from '../lib/request';

const updateProfile = async (payload) => {
  const { data } = await request.patch(`updateProfile`, payload);
  return data;
};

export {
  updateProfile
};