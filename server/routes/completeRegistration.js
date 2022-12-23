const bcrypt = require('bcrypt');
const validator = require("email-validator");
const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    email,
    password,
    clientId
  } = req.body;

  if (!clientId) {
    return res.json({ message: 'No clientId.' });
  }

  if (!email || !password) {
    return res.json({
      message: 'Missing email or password parameters.'
    });
  }

  if (!validator.validate(email)) {
    return res.json({ message: 'Email address is not valid.' });
  }

  try {
    const [userResult] = await pool.query('SELECT id, password FROM users WHERE email = ?', [email.toLowerCase()]);

    const user = userResult[0];

    if (!user) {
      return res.json({
        message: 'User does not exist.'
      });
    }

    if (user.password) {
      return res.json({ message: 'Account already fully registered - please sign in instead.' });
    }

    const [isAdminOrMemberResult] = await pool.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM client_admins WHERE user_id = ? AND client_id = ?
          UNION
          SELECT 1 FROM client_members WHERE user_id = ? AND client_id = ?
        ) 
      `,
      [user.id, clientId, user.id, clientId]
    );

    if (Object.keys(isAdminOrMemberResult[0][0])) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        'UPDATE users SET is_verified = 1, password = ? WHERE id = ?',
        [hashedPassword, user.id]
      );

      return res.json({ success: true });
    } else {
      return res.json({ message: 'User is not a member or administrator of this client.' });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    });
  }
};