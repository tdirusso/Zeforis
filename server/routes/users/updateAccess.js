const { pool, commonQueries } = require('../../../database');
const { updateStripeSubscription } = require('../../../lib/utils');

module.exports = async (req, res, next) => {
  const {
    engagements = []
  } = req.body;

  const {
    userId
  } = req.params;

  const updaterUserId = req.userId;
  const orgId = req.ownedOrg.id;

  if (!userId || isNaN(userId)) {
    return res.json({ message: 'Invalid userId parameter - must be an integer.' });
  } else if (!orgId) {
    return res.json({ message: 'Missing orgId parameter.' });
  } else if (engagements.length === 0) {
    return res.json({ message: 'engagements parameter is missing or empty.' });
  }

  const connection = await pool.getConnection();

  try {
    const insertValues = [];
    const deleteValues = [];

    const paramErrors = [];

    const [orgUserExistsResult] = await pool.query(
      `SELECT EXISTS(
        SELECT 1 FROM engagement_users 
        LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
        WHERE engagements.org_id = ? AND engagement_users.user_id = ?) 
        AS orgUserExists`,
      [orgId, userId]
    );

    if (!orgUserExistsResult[0].orgUserExists) {
      connection.release();
      return res.json({ message: `userId ${userId} does not exist in orgId ${orgId}` });
    }

    const [engagementsResult] = await pool.query('SELECT id, org_id FROM engagements WHERE id IN (?)', [engagements.map(({ id }) => id)]);

    const engagementIdsMap = new Map(engagementsResult.map(({ id, org_id }) => [id, org_id]));

    engagements.forEach(({ id, hasAccess }, index) => {
      if (!id) paramErrors.push(`Missing id at index ${index}`);
      if (hasAccess === undefined) paramErrors.push(`Missing hasAccess at index ${index}`);
      if (hasAccess !== true && hasAccess !== false) paramErrors.push(`Invalid hasAccess value at index ${index} - expecting true or false`);

      if (engagementIdsMap.get(id) !== orgId) paramErrors.push(`engagementId ${id} does not belong to orgId ${orgId}`);

      if (hasAccess) {
        insertValues.push([id, userId, 'member']);
      } else {
        deleteValues.push([id]);
      }
    });

    if (paramErrors.length) {
      return res.json({ message: 'engagements array contains errors.', errors: paramErrors });
    }

    await connection.beginTransaction();

    if (insertValues.length) {
      await connection.query('INSERT IGNORE INTO engagement_users (engagement_id, user_id, role) VALUES ?',
        [insertValues]
      );
    }

    if (deleteValues.length) {
      await connection.query(
        `
          UPDATE tasks 
          SET assigned_to_id = NULL
          WHERE assigned_to_id = ? AND folder_id IN 
            (
              SELECT id FROM folders WHERE engagement_id IN 
              (SELECT id FROM engagements WHERE org_id = ?)
            )
        `,
        [userId, orgId]
      );

      await connection.query(
        'DELETE FROM engagement_users WHERE engagement_id IN (?) AND user_id = ?',
        [deleteValues, userId]
      );

      const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

      if (orgOwnerPlan !== 'free') {
        const { success, message } = await updateStripeSubscription(connection, updaterUserId, orgId);

        if (!success) {
          await connection.rollback();

          connection.release();
          return res.json({ message });
        }
      }
    }

    await connection.commit();

    connection.release();
    return res.json({ success: true });
  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};