const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    firstName,
    lastName
  } = req.body;

  const updaterUserId = req.userId;

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
      return res.json({ success: true });
    }

    return res.json({ message: 'Invalid user.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};