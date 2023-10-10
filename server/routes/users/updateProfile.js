const { pool } = require('../../../database');
const { createJWT } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    firstName,
    lastName
  } = req.body;

  const updaterUserId = req.userId;
  const { userObject } = req;

  if (!firstName || !lastName) {
    return res.json({
      message: 'Missing first and last name.'
    });
  }

  if (!updaterUserId) {
    return res.json({ message: 'Missing user.' });
  }

  try {
    const [updateResult] = await pool.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [firstName, lastName, updaterUserId]
    );

    if (updateResult.affectedRows) {
      return res.json({
        success: true,
        token: createJWT({ ...userObject })
      });
    }

    return res.json({ message: 'Invalid user.' });
  } catch (error) {
    next(error);
  }
};