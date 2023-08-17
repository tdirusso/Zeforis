import request from '../lib/request';

const logFrontendError = async (payload) => {
  const { data } = await request.post(`logs/logFrontendError`, payload);

  return data;
};

export {
  logFrontendError
};