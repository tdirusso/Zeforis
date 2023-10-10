const mysql = require('mysql2/promise');
const cache = require('../cache');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    console.error('Error establishing database connection:  ', error);
  }
};

const commonQueries = {
  getOrgTaskCount: async (connection, orgId) => {
    let cachedOrgData = cache.get(`org-${orgId}`);
    let orgTaskCount = cachedOrgData?.taskCount;

    if (!orgTaskCount) {
      const [taskCountResult] = await connection.query(
        ` 
          SELECT COUNT(DISTINCT tasks.id) AS taskCount
          FROM tasks
          LEFT JOIN folders ON folders.id = tasks.folder_id
          LEFT JOIN engagements ON engagements.id = folders.engagement_id
          WHERE engagements.org_id = ?
        `,
        [orgId]
      );

      orgTaskCount = taskCountResult[0].taskCount;
      cache.set(`org-${orgId}`, { ...cachedOrgData, taskCount: orgTaskCount });
    }

    return orgTaskCount;
  },
  getOrgOwnerPlan: async (connection, orgId) => {
    let cachedOrgData = cache.get(`org-${orgId}`);
    let orgOwnerPlan = cachedOrgData?.ownerPlan;

    if (orgOwnerPlan === undefined) {
      const [planResult] = await connection.query(
        'SELECT users.plan FROM orgs LEFT JOIN users ON orgs.owner_id = users.id WHERE orgs.id = ?',
        [orgId]
      );

      orgOwnerPlan = planResult[0].plan;

      cache.set(`org-${orgId}`, { ...cachedOrgData, ownerPlan: orgOwnerPlan });
    }

    return orgOwnerPlan;
  },
  getOrgAdminCount: async (connection, orgId) => {
    const [orgAdminCountResult] = await connection.query(
      ` 
      SELECT COUNT(DISTINCT user_id) AS adminCount
      FROM engagement_users
      LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
      LEFT JOIN orgs ON orgs.id = engagements.org_id
      WHERE engagements.org_id = ? AND role = 'admin'
      `,
      [orgId]
    );

    return orgAdminCountResult[0].adminCount;
  }
};

module.exports = {
  pool,
  initializeDatabase,
  commonQueries
};