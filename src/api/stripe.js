import request from '../lib/request';

const createSubscription = async (payload) => {
  const { data } = await request.post(`stripe/subscriptions`, payload);

  return data;
};

export {
  createSubscription
};