const isDev = process.env.NODE_ENV !== 'production';

const appConstants = {
  limits: {
    invites: 20
  }
};

module.exports = {
  isDev,
  appConstants
};