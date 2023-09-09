const isDev = process.env.NODE_ENV !== 'production';

const appLimits = {
    invites: 20
};

module.exports = {
  isDev,
  appLimits
};