const jwt = require('jsonwebtoken');
const { pool } = require('../../database');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'No authentication token provided.' });
  }

  let { orgId } = req.body;

  if (!orgId) {
    orgId = req.query.orgId;
  }

  if (!orgId) {
    return res.json({ message: 'No orgId provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;
    const userEmail = decoded.user.email;

    const [ownerOfOrgResult] = await pool.query(
      'SELECT id, name FROM orgs WHERE id = ? AND owner_id = ?',
      [orgId, userId]
    );

    if (ownerOfOrgResult.length) {
      req.userId = userId;
      req.userEmail = userEmail;
      req.userObject = decoded.user;
      req.ownedOrg = {
        id: ownerOfOrgResult[0].id,
        name: ownerOfOrgResult[0].name
      };
      return next();
    } else {
      return res.json({ message: 'Only the org owner can perform this operation.' });
    }
  } catch (error) {
    next(error);
  }
};