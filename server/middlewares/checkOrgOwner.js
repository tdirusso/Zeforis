const jwt = require('jsonwebtoken');
const { pool } = require('../database');

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.json({ message: 'No authentication token provided.' });
  }

  let orgId = req.params.orgId || req.body.orgId || req.query.orgId;
  let engagementId = req.params.engagementId || req.body.engagementId || req.query.engagementId;

  if (!orgId && !engagementId) {
    return res.json({ message: 'No ID provided for engagement or org.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.user.id;
    const userEmail = decoded.user.email;

    let ownerOfOrgResult;

    if (orgId) {
      [ownerOfOrgResult] = await pool.query(
        'SELECT id, name FROM orgs WHERE id = ? AND owner_id = ?',
        [orgId, userId]
      );
    } else {
      [ownerOfOrgResult] = await pool.query(
        `SELECT orgs.id, orgs.name
         FROM orgs
         JOIN engagements ON orgs.id = engagements.org_id
         WHERE engagements.id = ?
         AND orgs.owner_id = ?`,
        [engagementId, userId]
      );
    }

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