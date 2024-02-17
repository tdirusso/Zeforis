import request from '../lib/request';

const createSubscription = async (payload: unknown) => {
  const { data } = await request.post(`stripe/subscriptions`, payload);

  return data;
};

export {
  createSubscription
};