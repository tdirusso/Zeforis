import request from '../lib/request';

const updateProfile = async (payload) => {
  const { data } = await request.patch(`updateProfile`, payload);
  return data;
};

const updatePermission = async (payload) => {
  const { data } = await request.patch(`updatePermission`, payload);
  return data;
};

const updateAccess = async (payload) => {
  const { data } = await request.patch(`updateAccess`, payload);
  return data;
};

export {
  updateProfile,
  updatePermission,
  updateAccess
};