const cache = require('../cache');
const jwt = require('jsonwebtoken');

function createJWT(userObject) {
  cache.set(`user-${userObject.id}`, userObject);

  return jwt.sign(
    {
      user: userObject
    },
    process.env.SECRET_KEY,
    { expiresIn: 36000 }
  );
}

module.exports = {
  createJWT
};